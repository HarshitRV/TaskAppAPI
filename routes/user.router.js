const { Router } = require('express');
const UserRouter = Router();

const auth = require("../middlewares/auth");

const {
    registerUser,
    loginUser
} = require("../controllers/user/user.auth.controller");

const { 
    getUserProfile, 
    getUserById, 
    updateUserById,
    deleteUserById, 
} = require('../controllers/user/user.controller');

// Routes

UserRouter.route("/users")
    .post(registerUser);

UserRouter.route('/users/me')
    .get(auth, getUserProfile)

UserRouter.route('/users/login')
    .post(loginUser)

UserRouter.route('/users/:id')
    .get(getUserById)
    .patch(updateUserById)
    .delete(deleteUserById);

module.exports = UserRouter;