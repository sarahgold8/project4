const mongoose = require("mongoose");
const CategoryModel = require('./category-model');
const { ObjectId } = mongoose.Schema;

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "name is required"],
        min: [2, "Name to short"],
        max: [40, "Name to long"]
    },
    // categoryId: {
    //     type: ObjectId,
    //     required: [true, "category is required"],
    //     ref: "Category",
    // },
    categoryId: {
        type: ObjectId,
        ref: "CategoryModel",
        required: [true, "category is required"],
    },
    price: {
        type: Number,
        trim: true,
        required: [true, "Price is required."],
        min: [0, "Price must be a positive number"],
        max: [5000, "Price can't exceed 5000"]
    },
    imageName: {
        type: String,
        required: true
    }
}, {versionKey: false, toJSON: {virtuals: true}});

// Virtual Field
ProductSchema.virtual("category", {
    localField: "categoryId", // Which local field connects to that relation.
    ref: "CategoryModel", // Which model to create relation to?
    foreignField: "_id", // Which foreign field connects to that relation.
    justOne: true // category field should be one object and not array.
});

const ProductModel = mongoose.model("ProductModel", ProductSchema, "products");

module.exports = ProductModel;




