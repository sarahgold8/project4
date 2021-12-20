const express = require("express");
const ProductModel = require("../models/product-model");
const product_dal = require("../dal/product-dal");
const log = require("../middleware/logger");
const verifyLoggedIn = require("../middleware/verify-logged-in.js");
const fs = require("fs");

const router = express.Router();

router.post("", async (request, response) => {
    try {
        // 1. Create 'ProductModel' object based on the request.body attributes
        const product = new ProductModel(request.body);

        // const product = new ProductModel({

        //     name: "Computer Mouse",
        //     price: 45,
        //     stock: 22
        // });

        // 2. Validate the model
        const errors = product.validateSync();

        // 3. {Validated} Save the model to the DB
        if (errors) {
            return response.status(400).json(errors.errors);
        }

        // 3a  Handle files (request.files)
        const image = request.files && request.files.image ? request.files.image : null;
        if (!image) return response.status(400).send("Missing image.");

        // 4. [Not Validated] response.status(400).json(err)

        const createdProduct = await product_dal.addNewProduct(product, image);

        //5. Return the newly saved 
        response.status(201).json(createdProduct);

    } catch (err) {
        response.status(500).send(`Server error: ${err}`);
    }

})

router.get("", async (request, response) => {
    // response.status(200).send("Hi how are you");
    try {
        const products = await product_dal.getAllProducts();

        response.json(products);
    } catch (err) {
        response.status(500).send(err.message);
    }
    // const product = new ProductModel({
    //     name: "Computer mouse",
    //     price: 56,
    //     stock: 67
});

// sauvegarde dans database
//  product.save();
// response.status(200).json(product);

// GET ONE
router.get("/:id", [log], async (request, response) => {
    try {
        const _id = request.params.id;
        const product = await product_dal.getOneProduct(_id);

        if (!product) {
            response.status(404).send(`ID '${_id}' doesn't exist`);
            return;
        }

        response.json(product);
    } catch (err) {
        response.status(500).send(err.message);
    }

});

// PUT
router.put("/:id", (request, response) => {

    // Statuses that appear BEFORE reaching this controller (middleware)
    // - 401 - Authentication (אימות)
    // - 403 - Authorization (הרשאה)

    // Statuses:
    // - 200 (Success)
    // - 404 (doesn't exist)
    // - 400 (validation)
    // - 500 (internal server error - catch area)

    try {
        // Implmentation + Validation
        // 1. Create ProductModel
        const productId = request.params.id;
        const updatedProduct = new ProductModel(request.body); // Call 'constructor'
        updatedProduct._id = productId; // Add property to JS object

        // 2. Run validations
        const errorMessages = updatedProduct.validateSync(); // Exepcted validation errors

        // 3. Send status 400 if validations fail including the messages created by JOI
        if (errorMessages) {
            response.status(400).send(errorMessages);
            return;
        }

        // Handle image
        const image = request.files && request.files.image ? request.files.image : null;
        if (!image) return response.status(400).send("Missing image.");

        // 4. If success, try update the database
        const result = product_dal.updateProduct(updatedProduct, image);
        if (result === null) {
            response.status(404).send(`Product with ID ${productId} doesn't exist.`);
            return;
        }

        // 5. Return the updated product created
        response.json(result); // Status = 200

    } catch (err) {
        response.status(500).send(err.message);
    }
});

// PATCH
router.patch("/:id", (request, response) => {

    try {

        // 1. Capture productID and product details from URL and FORM
        const productId = request.params.id;
        const newProduct = request.body;
        newProduct.id = productId;

        console.log(newProduct, productId);

        // 2. Find element in database => Find index of element with ID in the 'database' array
        const index = database.findIndex(p => p.id === productId);

        // 3. Replace product details with 'newProduct' at the 'index' found in no. 2
        for (let prop in newProduct) {
            database[index][prop] = newProduct[prop];
        }

        // 4. Return the updated product created
        response.json(newProduct);
    } catch (err) {
        response.statut(500).send(err.message);
    }
});

// DELETE
router.delete("/:id", (request, response) => {
    try {
    const id = request.params.id; // Get book id.
    const index = database.findIndex(p => p.id === id); // Find the index of the book to update.
    database.splice(index, 1); // Delete that book from the database.
    response.sendStatus(204); // Response status 204 with empty body.
    } catch(err) {
        response.statut(500).send(err.message);
    }
});

// GET http://localhost:3001/api/products/images/7.jpg
router.get("/images/:name", (request, response) => {
    try {
        const fileName = request.params.name;
        const filePath = product_dal.getProductImage(fileName);

        response.sendFile(filePath);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// FILTER PRICE BY RANGE
router.get("/price-range/:min/:max", (request, response) => {
    const arr = product_dal.getProductsByRange(+request.params.min, +request.params.max);
    if (arr.length === 0) {
        response.sendStatus(204);
        return;
    }

    response.json(arr);

});

// GET all categories http://localhost:3001/api/products/categories
router.get("/categories/all", async (request, response) => {
    try {
        const categories = await user-logic.getAllCategories();
        response.json(categories);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

module.exports = router;
