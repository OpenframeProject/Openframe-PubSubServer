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
            // // Find the right token for the channel
            // this._fileContent = this._fileContent || fs.readFileSync('./tokens.json');

            // var registry = JSON.parse(this._fileContent.toString()),
            //     token = registry[subscription];

            // // Add an error if the tokens don't match
            // if (token !== msgToken) {
            //     message.error = 'Invalid subscription auth token';
            // }

            // // Call the server back now we're done
            // callback(message);
        }
    };
};
