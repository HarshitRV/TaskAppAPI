// Node Modules
const nodemailer = require("nodemailer");

/**
 * 
 * @param {string} email | email of the user
 * @param {string} subject | subject of the email 
 * @param {string} html | html of the email
 * 
 * @returns {Promise} | info
 */
const sendMail = async (email, subject, html) => {

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASSWORD,
        }
    });

    const options = {
        from: process.env.MAIL_ACCOUNT,
        to: email,
        subject,
        html
    }

    const info = await transporter.sendMail(options);

    console.log("Message sent: %s", info.messageId);

    return info
}

