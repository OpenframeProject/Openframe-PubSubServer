/**
 * The pubsub server is very basic at present... it just spins up
 * an instance of a Faye server, allowing clients to communicate via bayeux
 */

var http = require('http'),
    faye = require('faye'),
    debug = require('debug')('pubsub');

    // Exported object
    pubsub = module.exports = {};

pubsub.connectedFrames = {};

pubsub.start = function(port) {
    port = port || '8889';

    var server = http.createServer(),
        bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 5});

    /**
     * Handle new client connection
     * @param  {[type]} clientId) {}          [description]
     * @return {[type]}           [description]
     */
    bayeux.on('handshake', function(clientId) {
        debug('new bayeux connection: ', clientId);
    });

    // When a client disconnects, see if it's in the hash of connected frames.
    // If so, publish a disconnect event to any subscribed pubsub clients (e.g. the API server)
    bayeux.on('disconnect', function(clientId) {
        debug('bayeux connection closed: ', clientId);
        if (pubsub.connectedFrames[clientId]) {
            bayeux.getClient().publish('/frame/disconnected', pubsub.connectedFrames[clientId]);
        }
    });

    // monitor all publish events. if we get an event on /frame/connected,
    // add it to the list of connected frames
    bayeux.on('publish', function(clientId, channel, data) {
        debug('publish event:', clientId, channel, data);
        if (channel === '/frame/connected') {
            debug('heard /frame/connected event');
            pubsub.connectedFrames[clientId] = data;
        }
    });

    bayeux.attach(server);
    server.listen(port);

    // Just some logging...
    // TODO: log to file.
    bayeux.getClient().subscribe('/frame/connected', function(data) {
        debug('/frame/connected', data);
    });

    bayeux.getClient().subscribe('/frame/disconnected', function(data) {
        debug('/frame/disconnected', data);
    });

}