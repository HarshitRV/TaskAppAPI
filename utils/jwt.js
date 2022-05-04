const jwt = require("jsonwebtoken");

const SECRETS = require("../configs/config");

/**
 * @decription - This function is used to create a jwt token.
 * 
 * @param {String} id - The id of the user 
 * @returns {String} - JWT Token
 */
const newToken = id => {
    return jwt.sign({ id }, SECRETS.JWT_SECRET, { expiresIn: SECRETS.JWT_EXP });
}

/**
 * @decription - This function is used to verify a jwt token.
 *  
 * @param {String} token - The jwt token of the user. 
 * @returns {Object} - Payload of the token.
 */
const verifyToken = token => new Promise((resolve, reject)=>{
    jwt.verify(token, SECRETS.JWT_SECRET, (err, decoded) => {
        if(err) reject(err);
        resolve(decoded);
    });
});

module.exports = { newToken, verifyToken };