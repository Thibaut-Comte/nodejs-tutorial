const { login } = require('../services/authentication');

module.exports.basicAuth = (request, response, next) => {
    const authorization = request.headers.authorization;
    if (authorization) {
        // decode base 64
        const decoded = Buffer.from(authorization.replace('Basic ', ''), 'base64');
        const [username, password] = decoded.toString('utf8').split(':');

        // try to authenticate
        if (login(username, password)) return next();
    }
    response.sendStatus(401)
        .end('Access denied');
}
