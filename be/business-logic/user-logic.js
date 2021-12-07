const Product = require("../models/product-model");
const ShoppingCart = require("../models/cart_item_order");
const Order = require("../models/order-model");
const ShoppingCartItem = require("../models/cart_item_order");
const category = require("../models/category-model");
const CategoryModel = require("../models/category-model");
const { isValidObjectId } = require("mongoose");


function getAllProducts() {
    return Product.find().populate("categoryId").exec();
}

function startShoppingCart(shoppingCart) {
    return shoppingCart.save();
}

//make an array on client side. the user adds products to array and with each addition a request is send with the new array to replace the old one in the database 
async function addItemToCart(item) {
    return item.save().then(item => item.populate("productId").execPopulate());
    // return ShoppingCartItem.find({ shoppingCartId: { $eq: item.shoppingCartId } }).populate("productId").exec()
}

async function removeItemFromCart(item_id) {
    return ShoppingCartItem.deleteOne({ _id: { $eq: item_id } }).exec()
}

function clearCart(_id) {
    return ShoppingCart.deleteOne({ _id }).exec().then(() => {
        ShoppingCartItem.deleteMany({ shoppingCartId: { $eq: _id } }).exec()
    });
}

async function completeShoppingCart(cart) {
    const info = await ShoppingCart.updateOne({ _id: cart._id }, cart).exec();
    return info.n ? cart : null;
}

function createOrder(order) {
    return order.save();
}

function getOrdersOfUser(user_id) {
    return Order.find({ userId: { $eq: user_id } }).exec();
}

function getAllItemsInCart(cart_id) {
    return ShoppingCartItem.find({ shoppingCartId: { $eq: cart_id } }).populate("productId").exec()
}

function getCart(user_id) {
    return ShoppingCart.findOne({ userId: { $eq: user_id }, payedAndCompleted: { $eq: false } })
}

function searchProducts(text) {
    return Product.find({ productName: { $regex: text, $options: "i" } }).exec();
}

async function searchFilteredProduct(text, categoryArray) {
    let products = []
    for (let category of categoryArray) {
        let product = await Product.find({
            productName: { $regex: text, $options: "i" },
            categoryId: { $eq: category }
        }).exec();
        for (let item of product) {
            products.push(item);
        }
    }
    return products
}

// Get all categories
function getAllCategories() {

    // Get all categories without virtual fields: 
    // return CategoryModel.find().exec();

    // Get all categories with virtual fields: 
    return CategoryModel.find().populate("products").exec();
}

async function getProductsByCategory(category_name) {
    
    
    // for (let category of categoryArray) {
    // let product = await Product.find( { category: categoryId }).exec();
    // const products = await Product.find({ category_id: category_id });
    // console.log(product);

    // for (let item of product) {
    //                 products.push(item);
    // }
    
    let all_categories = await CategoryModel.find().populate("products").exec();
    console.log(all_categories);
    
    const searched_category = all_categories.filter(c => c.name === category_name)
    return searched_category[0].products;


}

// async function getProductsByCategory(categoryId) {
//     console.log(categoryId);
//     let products = []
//     // for (let category of categoryArray) {
//     // let product = await Product.find( { category: categoryId }).exec();
//     // const products = await Product.find({ category_id: category_id });
//     // console.log(product);

//     // for (let item of product) {
//     //                 products.push(item);
//     // }
//     console.log(category._id);
//     let product = await Product.findById({ categoryId:  categoryId  }).exec();
//     console.log("product" + product);
//     for (let item of product) {
//         products.push(item);
//     }
//     console.log(products);
//     return products


// }

module.exports = {
    getAllProducts,
    startShoppingCart,
    addItemToCart,
    removeItemFromCart,
    clearCart,
    createOrder,
    getAllItemsInCart,
    getCart,
    searchProducts,
    getAllCategories,
    getProductsByCategory,
    searchFilteredProduct,
    completeShoppingCart,
    getOrdersOfUser
}