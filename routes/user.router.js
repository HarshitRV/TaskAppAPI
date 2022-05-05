const { Router } = require('express');
const UserRouter = Router();

const auth = require("../middlewares/auth");

const {
    registerUser,
    loginUser,
    logoutUser,
    logoutAll
} = require("../controllers/user/user.auth.controller");

const { 
    getUserProfile, 
    updateUser,
    deleteUser, 
} = require('../controllers/user/user.controller');
const User = require('../models/user.model');

// Routes

UserRouter.route("/users")
    .post(registerUser);

UserRouter.route('/users/me')
    .get(auth, getUserProfile)
    .delete(auth, deleteUser)
    .patch(auth, updateUser)


UserRouter.route('/users/login')
    .post(loginUser)

UserRouter.route('/users/logout')
    .post(auth, logoutUser)

UserRouter.route('/users/logoutAll')
    .post(auth, logoutAll)
 
module.exports = UserRouter;