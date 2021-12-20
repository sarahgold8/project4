const express = require("express");
const userLogic = require('../business-logic/user-logic');
// const jwt = require('jsonwebtoken');
const router = express.Router();
const errorHandler = require("../helpers/error-handler");
const Order = require("../models/order-model");
const ShoppingCart = require("../models/cart_item_order");
const ShoppingCartItem = require("../models/cart_item_order");
const verifiedLoggedIn = require("../middleware/verify-logged-in");
const { request, response } = require("express");



router.get("/search/:text", async(request, response) => {
    try {
        const items = await userLogic.searchProducts(request.params.text);
        response.json(items);
    } catch (err) {
        response.status(500).send(err.message);
    }
});


router.post("/getProductsByCategory", async(request, response) => {
    try {
        const categories = request.body;
        const items = await userLogic.getProductsByCategory(categories);
        response.json(items);
        console.log(items);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.get("/categories/:category_name", async(request, response) => {
    try {
        const category_name = request.params.category_name;
        const category = await userLogic.getProductsByCategory(category_name);
        response.json(category);
    
    } catch (err) {
        response.status(500).send(err.message);
    }
});
router.post("/searchFilteredProduct/:text", async(request, response) => {
    try {
        const categories = request.body;
        const text = request.params.text;
        const items = await userLogic.searchFilteredProduct(text, categories);
        response.json(items);
    } catch (err) {
        response.status(500).send(err.message);
    }
});


router.get("/getCart", async(request, response) => {
    try {
        const user_Id = response.locals.user._id;
        const cart = await userLogic.getCart(user_Id);
        response.json({ cart });
    } catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
})

router.get("/getOrders", verifiedLoggedIn, async(request, response) => {
    try {
        const user_Id = response.locals.user._id;
        const orders = await userLogic.getOrdersOfUser(user_Id);
        response.json(orders);
    } catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
})




router.get("/itemsInCart/:cart_id", async(request, response) => {
    try {
        const cart = request.params.cart_id;
        const items = await userLogic.getAllItemsInCart(cart);
        response.json(items);
    } catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
})


router.get("/getProducts", verifiedLoggedIn, async(request, response) => {
    try {
        const products = await userLogic.getAllProducts();
        response.json({ products });
    } catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
})


router.delete("/removeCart/:_id", async(request, response) => {
    try {
        const cart = request.params._id;
        await userLogic.clearCart(cart);
        response.sendStatus(204);
    } catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
})



router.delete("/removeItemFromCart/:item_id", async(request, response) => {
    try {
        const item = request.params.item_id;
        await userLogic.removeItemFromCart(item);
        response.sendStatus(204);
    } catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
})

router.post("/addItemToCart/:cart_id/:product_id", async(request, response) => {
    try {
        const item = new ShoppingCartItem(request.body);
        item.productId = request.params.product_id;
        item.shoppingCartId = request.params.cart_id;
        const error = await item.validate();
        if (error) {
            response.status(400).send(error.message)
        }
        const updatedCart = await userLogic.addItemToCart(item);
        response.json({ updatedCart })
    } catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
})


router.post("/createCart", async(request, response) => {
    // , verifiedLoggedIn
    try {
        const newCart = new ShoppingCart();
        newCart.payedAndCompleted = false;
        newCart.creationDate = new Date();
        newCart.userId = response.locals.user._id;
        const error = await newCart.validate();
        if (error) {
            response.status(400).send(error.message)
        }
        const cart = await userLogic.startShoppingCart(newCart);
        response.status(201).json({ cart });
    } catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
})

router.patch("/completeCart", verifiedLoggedIn, async(request, response) => {
    try {
        const cart = new ShoppingCart(request.body);
        cart.payedAndCompleted = true;
        const error = await cart.validate();
        if (error) {
            response.status(400).send(error.message)
        }
        await userLogic.completeShoppingCart(cart);
        response.json(true);
    } catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
})


router.post("/createOrder", verifiedLoggedIn, async(request, response) => {
    try {
        const order = new Order(request.body);
        order.userId = response.locals.user._id;
        order.orderCreationDate = new Date();
        const error = await order.validate();
        if (error) {
            response.status(400).send(error.message)
        }
        const addedOrder = await userLogic.createOrder(order);
        response.status(201).json({ addedOrder })

    } catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
})


module.exports = router;