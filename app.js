const { config } = require('dotenv');
process.env.NODE_ENV !== 'production' && config();

// Modules.
const express = require('express');
const morgan = require("morgan");

// Configs.
const SECRETS = require("./configs/config");

// Utils.
const connectDB = require("./db/db");

const app = express();
const PORT = process.env.PORT || 3000;

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


app.listen(PORT, async () => {
    if (SECRETS.NODE_ENV === 'production') {
        await connectDB(SECRETS.MONGODB_ONLINE_URI);
        console.log(`Server running on port ${PORT}`);
    } else {
        await connectDB(SECRETS.MONGODB_LOCAL_URI);
        console.log(`Development server live on http://localhost:${PORT}`);
    }
});