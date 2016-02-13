var http = require('http'),
    faye = require('faye');

var server = http.createServer(),
    bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 5}),

    // hash of connected frames
    frames = {};

/**
 * Handle new client connection
 * @param  {[type]} clientId) {}          [description]
 * @return {[type]}           [description]
 */
bayeux.on('handshake', function(clientId) {
    console.log('new bayeux connection: ', clientId);
});

// When a client disconnects, see if it's in the hash of connected frames.
// If so, publish a disconnect event to any subscribed clients (e.g. the API server)
bayeux.on('disconnect', function(clientId) {
    console.log('bayeux connection closed: ', clientId);
    if (frames[clientId]) {
        bayeux.getClient().publish('/frame/disconnected', frame_id);
    }
});

// monitor all publish events. if we get an event on /frame/connected,
// add it to the list of connected frames
bayeux.on('publish', function(clientId, channel, data) {
    console.log('publish event:', clientId, channel, data);
    if (channel === '/frame/connected') {
        console.log('heard /frame/connected event');
        frames[clientId] = data;
    }
});

bayeux.attach(server);
server.listen(8889);

// Just some logging...
// TODO: log to file.
bayeux.getClient().subscribe('/frame/connected', function(data) {
    console.log('/frame/connected', data);
});

bayeux.getClient().subscribe('/frame/disconnected', function(data) {
    console.log('/frame/disconnected', data);
});