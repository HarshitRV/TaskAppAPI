// Node modules.
const { Router } = require('express');
const multer = require("multer");

// Middleware.
const auth = require("../middlewares/auth");

// Utils.
const AppError = require("../utils/AppError");
/**
 * fjkasdkfaskdfka
 */
const storage = multer.memoryStorage();
const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            return cb(new AppError(400, "Please upload an image file"));
        }   
        cb(undefined, true);
    },
    storage
});

// User Auth controller imports.
const {
    registerUser,
    loginUser,
    logoutUser,
    logoutAll
} = require("../controllers/user/user.auth.controller");

// User controller imports.
const { 
    getUserProfile, 
    updateUser,
    deleteUser,
    uploadAvatar,
    deleteAvatar, 
    getAvatar
} = require('../controllers/user/user.controller');

// Declarations.
const UserRouter = Router();

// Routes
UserRouter.route("/users")
    .post(registerUser);

UserRouter.route('/users/me')
    .get(auth, getUserProfile)
    .delete(auth, deleteUser)
    .patch(auth, updateUser)

UserRouter.route("/users/me/avatar")
    .post(auth, upload.single('avatar'), uploadAvatar)
    .delete(auth, deleteAvatar)

UserRouter.route('/users/login')
    .post(loginUser)

UserRouter.route('/users/logout')
    .post(auth, logoutUser)

UserRouter.route('/users/logoutAll')
    .post(auth, logoutAll)
 
UserRouter.route('/users/:id/avatar')
    .get(getAvatar)

module.exports = UserRouter;