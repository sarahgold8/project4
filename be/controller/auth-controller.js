const express = require("express");
const UserModel = require("../models/user-model");
// const auth_dal = require("../data-access-layer/auth-dal");

const router = express.Router();

// LOGIN
router.post("/login", (request, response) => {
    // 1. Create 'UserModel' that contains username, password
    const user = new UserModel(request.body);

    // 2. Validate form (JOI)
    // ... [Homework]
    
    // 3. Call DAL and send UserModel
    // const loggedInUser = auth_dal.login(user);
    // if (!loggedInUser) {
    //     response.status(401).send("Credentials incorrect!");
    // }

    // 8. Return to client
});

module.exports = router;