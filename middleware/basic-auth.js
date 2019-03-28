module.exports.basicAuth = (request, response, next) => {
    const authorization = request.headers.authorization;
    // decode base 64

    // try to authenticate

    // return 401 if denied
    response.sendStatus(401)
        .end('Access denied');
    // otherwise
    // next();
}
