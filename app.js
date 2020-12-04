const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

const userRoutes = require('./api/routes/user');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');


// Connection to DATABASE
const sequelize = require("./api/database/connection");

//Middleware

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
dotenv.config();

console.log(process.env.SECRET_MESSAGE);

// Routes which should handle requests
app.use('/user', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

//ERROR Handling

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;