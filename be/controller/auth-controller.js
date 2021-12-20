const express = require("express");
const User = require("../models/user-model");
const checkAdmin = require('../middleware/admin-middleware');
const verifyLogged = require('../middleware/verify-logged-in');
const errorHandler = require("../helpers/error-handler");
const authLogic = require("../business-logic/auth-logic");
// const auth_dal = require("../data-access-layer/auth-dal");

const router = express.Router();

// LOGIN
router.post("/login", (request, response) => {
    // 1. Create 'UserModel' that contains username, password
    const user = new User(request.body);

    // 2. Validate form (JOI)
    // ... [Homework]
    
    // 3. Call DAL and send UserModel
    // const loggedInUser = auth_dal.login(user);
    // if (!loggedInUser) {
    //     response.status(401).send("Credentials incorrect!");
    // }

    // 8. Return to client
});

router.post("/register", async (request, response) => {
    try {

        // 1. Create 'UserModel' that contains first_name, last_name, username, password
        const user = new User(request.body);

        // 2. Validate form (JOI)
        // ... [Homework]

        // X. Check that username doesn't exist in DB

        // 3. Call DAL and send UserModel
        const registeredUser = await authLogic.register(user);

        // 8. Return to client
        response.json(registeredUser);
    } catch(err) {
        response.status(500).send(err.message);
    }
});

// router.post("/register", async (request, response) => {
//     try {

//         // 1. Create 'UserModel' that contains first_name, last_name, username, password
//         const user = new UserModel(request.body);

//         // 2. Validate form (JOI)
//         // ... [Homework]

//         // X. Check that username doesn't exist in DB

//         // 3. Call DAL and send UserModel
//         const registeredUser = await auth_dal.register(user);

//         // 8. Return to client
//         response.json(registeredUser);
//     } catch(err) {
//         response.status(500).send(err.message);
//     }
// });

router.get('/is-admin', checkAdmin, async(request, response) => {
    try {
        response.json(true)
    } catch (err) {
        response.status(500).send(errorHandler.getError(err));

    }
})

router.get("/validateInfo/:userName", async(request, response) => {
    try {
        userName = request.params.userName;
        const validation = await authLogic.validateRegister(userName);
        if (validation) {
            response.status(403).send('User Already exists in system!')
            return;
        }
        response.json(true);
    } catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
})

router.get('/is-loggedIn', verifyLogged, async(request, response) => {
    try {
        response.json(true)
    } catch (err) {
        response.status(500).send(errorHandler.getError(err));

    }
})


module.exports = router;