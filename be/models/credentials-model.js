const mongoose = require("mongoose");

class Credentials {
    constructor(credentials) {
        this.userName = credentials.username;;
        this.password = credentials.password;
    }
}

module.exports = Credentials;