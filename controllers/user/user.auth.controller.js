const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");

const User = require("../../models/user.model");

const { newToken, verifyToken } = require("../../utils/jwt");

/**
 * @description - This function is used to create a new user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 * 
 */
 module.exports.registerUser = catchAsync(async (req, res) => {
    const { name, email, password, age } = req.body;

    const user = new User({
        name,
        email,
        password,
        age
    });

    const token = newToken(user._id);
    user.tokens.push({ token });

    await user.save();

    return res.status(201).json({
        status: "success",
        data: {
            user,
            token
        }
    });
});

/**
 * @description - This function is used to login a user.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 */
 module.exports.loginUser = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if(!user) return res.status(400).json({
        status: "fail",
        message: "Login failed"
    });

    const isMatch = await user.checkPassword(password);

    if(!isMatch) return res.status(400).json({
        status: "fail",
        message: "Login failed"
    });

    const token = newToken(user._id);
    user.tokens.push({ token });
    await user.save();

    return res.status(200).json({
        status: "success",
        data: {
            user,
            token,
        }
    });
});