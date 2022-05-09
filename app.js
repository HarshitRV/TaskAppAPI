// Connect DB
const connectDB = require("./db/db")
const connect = async () => {
    await connectDB();
}
connect();

// Modules.
const express = require('express');
const morgan = require("morgan");

// Declarations.
const app = express();

// Routers
const UserRouter = require("./routes/user.router");
const TaskRouter = require('./routes/task.router');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))

// Home route.
app.get('/', (req, res) => {
    return res.status(200).send('Server is running!');
});

// Router middlewares.
app.use('/', UserRouter);
app.use('/', TaskRouter)

// Error handling middleware.
app.use((err, req, res, next) => {
    const { status = 400, message = "Something went wrong", stack } = err;
    res.status(status).send({ err, message, stack });
});

module.exports = app;