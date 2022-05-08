// Node modules;
const sharp = require('sharp');

// Utils.
const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");
const sendMail = require("../../utils/nodemailer");
const { welcomeEmail, byeEmail } = require("../../utils/emailTemplates");

// Models
const User = require("../../models/user.model");

/**
 * @description - This function is used to get all users
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 * 
 */
module.exports.getUserProfile = catchAsync(async (req, res) => {
    return res.status(200).send(req.user);
})

/**
 * @description - This function is used to update a user by id.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 * 
 */
module.exports.updateUser = catchAsync(async (req, res)=>{

    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation) return res.status(400).json({
        status: "fail",
        message: "Invalid updates",
        allowedUpdates
    });

    const { user } = req;

    if(!user) res.status(404).json({
        status: "fail",
        message: "No user found"
    });

    updates.forEach((update) => user[update] = req.body[update]);

    console.log(user);

    await user.save();

    return res.status(200).json({
        status: "success",
        data: {
            user
        }
    })
});

/**
 * @description - This function is used to delete a user by id.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 * 
 */
module.exports.deleteUser = catchAsync(async (req, res)=>{
    
    const { user } = req;

    const [deletedUser, mailInfo] = await Promise.all([
        user.remove(),
        sendMail(user.email, "Bye", byeEmail(user.name))
    ]);

    return res.status(200).json({
        status: "success",
        data: {
            deletedUser,
            mailInfo
        }
    });
});

/**
 * @description - This function is used to upload a user profile picture.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 */
module.exports.uploadAvatar = catchAsync(async (req, res)=>{
    const { user, file } = req;
    const buffer = await sharp(file.buffer)
                        .resize({ width: 250, height: 250 })
                        .png()
                        .toBuffer();

    user.avatar = buffer;

    await user.save();

    return res.status(200).json({
        status: "success",
        data: user
    });
});

/**
 * @description - This function is used to delete user profile picture.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 */
module.exports.deleteAvatar = catchAsync(async (req, res)=>{
    const { user } = req;
    user.avatar = undefined;
    await user.save();
    return res.status(200).json({
        status: "success",
        data: user
    });
});

/**
 * @description - This function is used to get user profile picture.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 */
module.exports.getAvatar = catchAsync(async (req, res)=>{
    const { id } = req.params;

    const user = await User.findById(id);

    if(!user || !user.avatar) return res.status(404).json({
        status: "fail",
        message: "No avatar found"
    });
 
    return res.status(200).set('Content-Type', 'image/png').send(user.avatar);
});