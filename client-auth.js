var debug = require('debug')('openframe:pubsub:client_auth');

module.exports = function() {
    var api_token = process.env.PS_API_TOKEN;

    return {
        outgoing: function(message, callback) {
            if (message.channel !== '/meta/subscribe' && message.channel !== '/meta/publish') {
                return callback(message);
            }

            // Add ext field if it's not present
            if (!message.ext) {
                message.ext = {};
            }

            // Set the auth token
            debug(api_token);
            message.ext.accessToken = api_token;

            // Carry on and send the message to the server
            callback(message);
        }
    };
};
