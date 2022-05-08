// Node modules imports.
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// Model imports.
const Task = require("./task.model");

// Declarations.
const Schema = mongoose.Schema;

const userSchema = Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({ error: "Invalid Email address" });
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        validate: value => {
            if (value.toLowerCase().includes("password")) {
                throw new Error({ error: "Invalid Password" });
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate: value => {
            if (value < 0) {
                throw new Error({ error: "Invalid Age" });
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

/**
 * @description - This function is used to hash the password before save.
 * @param {Object} next - The next object
 * @returns {undefined} - undefined
 */
userSchema.pre("save", async function(next) {
    try {
        if(this.isModified("password")){
            const hash = await bcrypt.hash(this.password, 8);
            this.password = hash;
        }
        next();
    } catch (err) {
        next(err);
    }
});

/**
 * @description - This function is used to delete all the task associate with
 *                the given user before removing that user fromt the db.
 * 
 * @param {Object} next - The next object
 * @returns {undefined} - undefined
 */
userSchema.pre("remove", async function(next){
    try {

        const user = this;
        await Task.deleteMany({ owner: user._id });

    } catch (err) {
        next(err);
    }
});

/**
* @description - This function is attached to UserSchema, i.e. Every document would have access to this funciton, where
* it can validate the password hash using becryptjs.
* 
* @param {string} - password
* @returns {Promise} - If does not match, returns rejecton and if matched, resolves the value
*/
userSchema.methods.checkPassword = async function(password){
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, this.password, (err, result) => {
            if(err) reject(err);
            resolve(result);
        })
    });
}

/**
 * @description - Virtuals are a way to create properties that are not stored 
 *                in the database, but are computed from other properties.
 *                 
 *              - This virtual property returns all the tasks that are associated with
 *                the current user.
 */
userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "owner"
});

/**
 * @description - This function returns the public profile of the user.
 *                without the password and tokens.
 * 
 * @returns {Object} - Returns the public profile of the user.
 */
userSchema.methods.toJSON = function(){
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    
    return userObject;
}

const User = mongoose.model("User", userSchema);

module.exports = User;