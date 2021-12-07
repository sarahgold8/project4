// const jwt = require("jsonwebtoken");
const hash = require("../helpers/hashing")

function verifiedLoggedIn(request, response, next) {
    if (!request.headers.authorization) {
        response.status(401).send("You are not logged in")
    }


    const token = request.headers.authorization.split(" ")[1];
    const stringlessToken = token.replace("\"", "").replace("\"", "");
    if (!stringlessToken) {
        response.status(401).send("You are not logged in")
    }
    jwt.verify(stringlessToken, config.jwt.secretKey, (err, payload) => {
        if (err) {
            if (err.message === 'jwt expired') {
                response.status(403).send("Your Logging session has expired")
                return;
            }
            response.status(401).send("You are not logged in")
            return;
        }
        if (!payload.user.isAdmin === hash("isAdmin")) {
            response.status(401).send("You are not logged in")
        }
        response.locals = payload
        next();
    })

}

module.exports = verifiedLoggedIn;