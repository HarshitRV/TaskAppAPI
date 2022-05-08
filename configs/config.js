const SECRETS = {
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_LOCAL_URI: process.env.MONGODB_LOCAL_URI,
    MONGODB_ONLINE_URI: process.env.MONGODB_ONLINE_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXP: process.env.JWT_EXP,
    MAIL_ACCOUNT: process.env.MAIL_ACCOUNT,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD
}

module.exports = SECRETS;