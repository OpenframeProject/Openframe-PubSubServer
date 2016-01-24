var http = require('http'),
    faye = require('faye');

var server = http.createServer(),
    bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 5});

/**
 * Handle new client connection
 * @param  {[type]} clientId) {}          [description]
 * @return {[type]}           [description]
 */
bayeux.on('handshake', function(clientId) {
    console.log('new bayeux connection: ', clientId);
});

bayeux.on('disconnect', function(clientId) {
    console.log('bayeux connection closed: ', clientId);
});

bayeux.attach(server);
server.listen(8889);

// bayeux.getClient().subscribe('/frame/updated/*', function(data) {
//     console.log(data);
// });