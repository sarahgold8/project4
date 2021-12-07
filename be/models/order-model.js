const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({

    totalPrice: {
        type: Number,
        required: [true, "Total price is required"],
        validate: {
            validator: value => value >= 0,
            message: "amount cannot be negative"
        }
    },

    addressCity: {
        type: String,
        required: [true, "city address is required"],
    },

    addressStreet: {
        type: String,
        required: [true, "street address is required"],
    },

    shippingDate: {
        type: Date,
        required: [true, "Shipping date is required"],
    },

    orderCreationDate: {
        type: Date,
        required: [true, "Order creation date is required"],

    },

    lastFourDigitsOfCard: {
        type: Number,
        required: [true, "lastFourDigitsOfCard is required"],

    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "userId is required"],

    },


    shoppingCartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShoppingCart",
        required: [true, "shoppingCartId is required"],
    },


}, {
    versionKey: false,
    toJSON: { virtuals: true },
    id: false
})

orderSchema.virtual("shoppingCarts", {
    ref: "ShoppingCart",
    localField: "shoppingCartId",
    foreignField: "_id",
    justOne: true
})

orderSchema.virtual("users", {
    ref: "UserModel",
    localField: "userId",
    foreignField: "_id",
    justOne: true
})



const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order