var fs = require('fs');

exports.getPrivateKey = () => {
    return fs.readFileSync(process.env.PATH_TO_PRIVATE_KEY).toString()
}
exports.getCertificate = () => {
    return fs.readFileSync(process.env.PATH_TO_CERT).toString()
}