const mongoose = require("mongoose");

// class Credentials {
//     constructor(credentials) {
//         this.userName = credentials.username;;
//         this.password = credentials.password;
//     }
// }

const CredentialsSchema = mongoose.Schema({
    username: String,
    password: String
}, { versionKey: false });

const Credentials = mongoose.model("CredentialsModel", CredentialsSchema, "users");

module.exports = Credentials;