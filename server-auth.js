var request = require('request'),
    debug = require('debug')('openframe:pubsub:server_auth');

module.exports = function(api_url) {
    var api_token = process.env.PS_API_TOKEN;

    function authenticate(token) {
        return new Promise(function(resolve, reject) {
            if (token === api_token) {
                debug('API Server Token -- Valid');
                return resolve();
            }
            request(api_url + '/users/config?access_token='+token, function(error, response, body) {
                if (error) {
                    debug(error);
                    reject();
                } else {
                    debug(body);
                    resolve();
                }
            });
        });
    }

    return {
        incoming: function(message, callback) {
            // Let non-subscribe messages through
            if (message.channel !== '/meta/subscribe') {
                return callback(message);
            }

            // Get subscribed channel and auth token
            var subscription = message.subscription,
                msgToken = message.ext && message.ext.accessToken;

            authenticate(msgToken).then(function() {
                callback(message);
            }).catch(function() {
                message.error = 'Invalid access token';
                callback(message);
            });
        }
    };
};
