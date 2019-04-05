module.exports.basicAuth = (request, response, next) => {
    const authorization = request.headers.authorization;
    //On récupère la partie 1 donc la 2nde ici le mdp en base64
    const decoded = Buffer.from(authorization.split(" ")[1], 'base64').toString('utf8');

    const login = decoded.split(":")[0];
    const pwd = decoded.split(":")[1];

    if (login == "test" && pwd == "password") {
        return next();
    } else {
        response.sendStatus(401).end();

    }
};