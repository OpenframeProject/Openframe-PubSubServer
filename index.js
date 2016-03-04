/**
 * The pubsub server is very basic at present... it just spins up
 * an instance of a Faye server, allowing clients to communicate via bayeux
 */

var http = require('http'),
    faye = require('faye'),
    server_auth = require('./server-auth'),
    client_auth = require('./client-auth'),
    debug = require('debug')('openframe:pubsub'),

    // Exported object
    pubsub = module.exports = {};

pubsub.connectedFrames = {};

pubsub.start = function() {
    var port = process.env.PS_PORT || '8889',
        host = process.env.PS_HOST || '0.0.0.0',
        path = process.env.PS_PATH || '/faye',
        api_protocol = process.env.PROTOCOL || 'http',
        api_port = process.env.PORT || '8888',
        api_host = process.env.HOST || '0.0.0.0',
        api_url = api_protocol + '://' + api_host + ':' + api_port + '/api',

        server = http.createServer(),
        bayeux = new faye.NodeAdapter({mount: path, timeout: 5}),
        client = bayeux.getClient();


    // add server_auth extension
    bayeux.addExtension(server_auth(api_url));

    // add client_auth extenstion
    client.addExtension(client_auth());

    /**
     * Handle new client connection
     */
    bayeux.on('handshake', function(clientId) {
        debug('new bayeux connection: ', clientId);
    });

    // When a client disconnects, see if it's in the hash of connected frames.
    // If so, publish a disconnect event to any subscribed pubsub clients (e.g. the API server)
    bayeux.on('disconnect', function(clientId) {
        debug('bayeux connection closed: ', clientId);
        if (pubsub.connectedFrames[clientId]) {
            var frame_id = pubsub.connectedFrames[clientId];
            client.publish('/frame/disconnected', frame_id);

            // publish to frame-specific channel
            client.publish('/frame/' + frame_id + '/disconnected', frame_id);
        }
    });

    // monitor all publish events. if we get an event on /frame/connected,
    // add it to the list of connected frames
    //
    // also re-publish frame_id-namespaced  connect event
    bayeux.on('publish', function(clientId, channel, data) {
        debug('published', channel, data);
        if (channel === '/frame/connected') {
            pubsub.connectedFrames[clientId] = data;

            // publish to frame-specific channel
            client.publish('/frame/' + data + '/connected', data);
        }
    });

    bayeux.attach(server);
    server.listen(port, host);

    // Just some logging...
    // TODO: log to file.

    client.subscribe('/frame/connected', function(data) {
        debug('/frame/connected', data);
    });

    client.subscribe('/frame/disconnected', function(data) {
        debug('/frame/disconnected', data);
    });

};
