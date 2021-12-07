const User = require("./user-model");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const CartItemSchema = new mongoose.Schema(
    {
        product: {
            type: ObjectId,
            ref: "ProductModel",
            required: true
        },
        amount: Number,
        totalPrice: Number,
    }, { versionKey: false }
);

const CartItemModel = mongoose.model("CartItemModel", CartItemSchema, "cartItems");

const CartSchema = new mongoose.Schema(
    {
        cartItem: [CartItemSchema],
        client: { type: ObjectId, ref: "UserModel" },
        isActive: { type: Boolean, default: true },
    }, { versionKey: false, timestamps: true } // changes like created or updated will be marked in time
);

const CartModel = mongoose.model("CartModel", CartSchema, "cart");

const OrderSchema = new mongoose.Schema(
    {
        client: {
            type: ObjectId,
            ref: "UserModel"
        },
        cart: {
            type: ObjectId,
            ref: "CartModel"
        },
        totalPrice: { type: Number },
        city: String,
        street: String,
        dateOfDelivery: {
            type: String,
        },
        creditCardLastDigits: {
            type: Number,
        }
    }, { versionKey: false, timestamps: true }
);

const OrderModel = mongoose.model("OrderModel", OrderSchema, "orders");

module.exports = { CartModel, CartItemModel, OrderModel };