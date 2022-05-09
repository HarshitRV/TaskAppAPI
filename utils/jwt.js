const jwt = require("jsonwebtoken");


/**
 * @decription - This function is used to create a jwt token.
 * 
 * @param {String} id - The id of the user 
 * @returns {String} - JWT Token
 */
const newToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXP });
}

/**
 * @decription - This function is used to verify a jwt token.
 *  
 * @param {String} token - The jwt token of the user. 
 * @returns {Object} - Payload of the token.
 */
const verifyToken = token => new Promise((resolve, reject)=>{
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) reject(err);
        resolve(decoded);
    });
});

module.exports = { newToken, verifyToken };