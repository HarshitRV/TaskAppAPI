const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
    }]
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

const User = mongoose.model("User", userSchema);

module.exports = User;