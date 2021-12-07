const mongoose = require("mongoose");
const bcrypt = require('bcrypt');


const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        min: 2,
        max: 15
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    identityNumber: {
        type: String,  // will be saved hashed
    },
    firstname: {
        type: String,
        required: true,
        trim: true,
        min: 2,
        max: 20
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        min: 2,
        max: 20
    },
    street: {
        type: String
    },
    city: {
        type: String
    },
    role: {
        type: String,
        default: "User",
    },
    // role: {
    //     type: String,
    //     required: true,
    //     default: 'user',
    //     enum: ['admin', 'user'] 
    // }
},  { versionKey: false, toJSON: { virtuals: true } });


UserSchema.methods.comparePasswords = function (enteredPassword, callback) {
    let hashedPassword = this.password;
    bcrypt.compare(enteredPassword, hashedPassword, function (err, match) {
        callback(err, match);
    })
};

UserSchema.pre('save', function (next) {
    let user = this;

    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return next(err);
        }

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            user.salt = salt;
            next();
        });
    });
});

module.exports = mongoose.model("UserModel", UserSchema, "users");