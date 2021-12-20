const User = require('../models/user-model');
const Credentials = require("../models/credentials-model");
const hash = require("../helpers/hashing");
const uuid = require('uuid');


function validateRegister(userName) {
    return User.findOne({ usernameEmail: { $eq: userName } });
}

function register(user) {
    console.log(user);
    // user.uuid = uuid.v4();
    // user.password = hash(user.password)
    // user.isAdmin = hash('notAdmin');
    return user.save();
}

async function login(credentials) {
    credentials.password = hash(credentials.password);
    // const user = User.findOne({ usernameEmail: { $eq: credentials.usernameEmail }, password: { $eq: credentials.password } });
    const users = await Credentials.find({username: credentials.username, password: credentials.password}).exec();
    return users[0];
}

async function changeUserInfo(userToUpdate) {
    if (userToUpdate.password) {
        userToUpdate.password = hash(userToUpdate.password);
    }
    const info = await User.updateOne({ _id: userToUpdate._id }, userToUpdate).exec();
    return info ? userToUpdate : null;
}

module.exports = {
    validateRegister,
    register,
    login,
    changeUserInfo
}