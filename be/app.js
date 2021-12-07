global.config = require(process.env.NODE_ENV === "production" ? "./config-prod.json" : "./config-dev.json");

require("./dal/mongodb-access");

const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");

// models
const productModel = require("./models/product-model");
const userModel = require("./models/user-model");
const credentials = require("./models/credentials-model");

// controllers
const product_controller = require("./controller/product-controller");
const user_controller = require("./controller/user-controller");
const admin_controller = require("./controller/admin-controller");
const auth_controller = require("./controller/auth-controller");

const server = express();
server.use(cors());
server.use(fileUpload());
server.use(express.json()); // REST API works with JSON

server.use("/api/products", product_controller);
// server.use("/api/admin", admin_controller);
server.use("/api/user", user_controller);
server.use("/api/auth", auth_controller);

server.use("*", (request, response) => {
    response.status(404).send(`Route not found ${request.originalUrl}`);
})

server.listen(3030, () => console.log("Server is listening..."));


// config-dev.json



// {
//     "jwtKey": "SuchAPerfectDay",
//     "database": {
//         "connectionString": "mongodb://localhost:27017/ShoppingCart"
//     }

// const mongoose = require("mongoose");

// function connectAsync() {
//     return new Promise((resolve, reject) => {

//         // Connect options - prevent console warnings:
//         const options = { useNewUrlParser: true, useUnifiedTopology: true };

//         // Connect to MongoDB:
//         mongoose.connect(config.database.connectionString, options, (err, db) => {
//             if(err) {
//                 reject(err);
//                 return;
//             }
//             resolve(db);
//         });
//     });
// }

// connectAsync()
//     .then(db => console.log("We're connected to MongoDB."))
//     .catch(err => console.log(err));

// const mongoose = require("mongoose");

// const ProductSchema = mongoose.Schema({
//     name: String,
//     price: Number,
//     stock: Number
// }, { versionKey: false, toJSON: {virtuals: true}});




// mongodb-access
