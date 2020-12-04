const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const { SELECT } = require('sequelize/types/lib/query-types');

const sequelize = require('../database/connection');


// header payload signature

const signature = "acamica";
const payload = {
    name: "Acamica",
    year: 2020
}


/*
router.get('/all', async (req, res) => {
    
    let statement = "SELECT * FROM users";
    let options = {type: sequelize.QueryTypes.SELECT};
    let usersData = await sequelize.query(statement, options);

    res.status(200).json({
        message: 'Handling GET requests to /user/all'
        response: usersData
    });
});
*/

//Sign Up a USER with all data
router.post('/signup', async (req, res) => {
    let statement = `SELECT * FROM users WHERE email = '${user.email}'`;
    let options = {type: sequelize.QueryTypes.SELECT};
    let validUser = await sequelize.query(statement, options);

    if(validUser[0].email >= 1) {
        return res.status(409).json({
            message: 'Mail exists'
        });
    } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if(err) {
                return res.status(500).json({
                    error: err
                });
            } else {
                const user = {
                    username: req.body.username,
                    fullname: req.body.fullname,
                    email: req.body.email,
                    phone: req.body.phone,
                    address: req.body.address,
                    password: hash,
                    role: 0
                };

                
            }
        })
    }

    
    
   

    res.status(201).json({
        message: 'Handling POST requests to /signup',
        createdProduct: product
    });
});

//login a USER to the app
router.post('/login', async (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };


    
    try {
        let statement = `SELECT * FROM users WHERE email = '${user.email}'`;
        let options = {type: sequelize.QueryTypes.SELECT};
        let validUser = await sequelize.query(statement, options);
        if(validUser.length < 1) {
            return res.status(401).json({
                message: 'Auth Failed'
            })
        }
    
        res.status(201).json({
            message: 'Handling POST requests to /login',
            validUser: validUser[0].email
        });
        
    } catch(err ) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
});


module.exports = router;