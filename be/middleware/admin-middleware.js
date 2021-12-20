const adminLogic = require('../business-logic/auth-logic')
const jwt = require('jsonwebtoken');
const config = require('../config-dev.json');
const hash = require('../helpers/hashing');

async function checkIfAdmin(request, response, next) {
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
        if (payload.user.isAdmin !== hash("Admin")) {
            response.status(403).send("Not An Admin!")
            return;
        }
        next();
    })

}

module.exports = checkIfAdmin;