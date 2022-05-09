const mongoose = require("mongoose");

/**
 * @description: Connect to the database by providing the connection string.
 * @param {String} uri | MongoDB URI
 * @default: mongodb://localhost:27017/taskDB
 *
 * @returns {undefined}
 */
const connectDB = async (uri = process.env.MONGODB_URI) => {
    try {
        const con = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        if (con) console.log("MongoDB connected...")

    } catch (err) {
        console.log(`Error: ${err}`);
    }
};

module.exports = connectDB;