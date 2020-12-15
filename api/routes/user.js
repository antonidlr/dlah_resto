const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
//const middleware = require('./../utilities/middleware');

dotenv.config();

const sequelize = require('../database/connection');
const app = require('../../app');

// signature from env.

const signature = process.env.JWT_KEY;

//User with Admin role
function is_authenticated (req, res, next) {
    try {
        let token = req.headers.authorization.split(" ")[1];
        let decoded = jwt.verify(token, signature);
        console.log("Token codificado: ",decoded);
        
        if(decoded.role) {
            req.user = decoded;
            next();
        } else {
            res.status(400).json("User is not authenticated")
        }

    } catch (error) {
        res.status(400).json("Error authenticating user.",error);
    }
};

//Valid User in Database
function is_validUser (req, res, next) {
    try {
        let token = req.headers.authorization.split(" ")[1];
        let decoded = jwt.verify(token, signature);
        console.log("Token codificado: ",decoded);
        
        if(decoded) {
            req.user = decoded;
            next();
        } else {
            res.status(400).json("User is not authenticated")
        }

    } catch (error) {
        res.status(400).json("Error authenticating user.",error);
    }
}

//Validation email and password in Database
async function validateUser (req, res, next) {
    
    const email = req.body.email;
    const pass = req.body.password;

    let statement = `SELECT * FROM users WHERE email = '${email}'`;
    let options = {type: sequelize.QueryTypes.SELECT};
    let usersData = await sequelize.query(statement, options);

    if(usersData[0]) {
        let result = await bcrypt.compare(pass, usersData[0].password);
        if(result) {
            req.userdata = usersData[0];
            next();
        } else {
            res.status(401).json({
                message: 'Unauthorized - Error al loguear'
            })
        }
    } else {
        res.status(401).json({
            message: 'Unauthorized - Error al loguear'
        })
    }
}

//Encrypt password for created user
const hashPassword = async (password, saltRounds = 10) => {
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(saltRounds);

        // Hash password
        return await bcrypt.hash(password, 10);

    } catch (error) {
        console.log(error);
    }

    // Return null if error
    return null;
};


//Sign Up a USER with all data
router.post('/signup', async (req, res) => {

    try {
        const email = req.body.email;
        let statement = `SELECT * FROM users WHERE email = '${email}'`;
        let options = {type: sequelize.QueryTypes.SELECT};
        let validUser = await sequelize.query(statement, options);
    
        if(validUser[0]) {
            return res.status(409).json({
                message: 'Conflict - email exists'
            });
        } else {
            const password = await hashPassword(req.body.password);
            const values = [
                req.body.username,
                req.body.fullname,
                email,
                req.body.phone,
                req.body.address,
                password,
                0
            ]
            const statement2 = "INSERT INTO users (username, fullname, email, phone, address, password, role) VALUES (?)";
            const options2 = {replacements: [values]};
            const newUser = await sequelize.query(statement2, options2);
            /*
            const tokenData = {
                id: usuario.id,
                email: usuario.email,
                role: usuario.role
            }

            const token = jwt.sign(userfinal, signature);
            */
            res.status(201).json({
                message: 'Created - Handling POST requests to /signup - new user created'
            });
        }
    } catch(error) {
        console.log(error);
        res.status(404).json({
            message: 'Not found',
            error: error
        });
    }
    
    
});


// Login User to app
router.post('/login', validateUser, (req, res) => {

    const usuario = req.userdata;

    if (usuario) {
        const userfinal = {
            id: usuario.id,
            email: usuario.email,
            role: usuario.role
        }
        const token = jwt.sign(userfinal, signature);
        res.status(200).json({ 
            message: 'Login Succesful',
            token });
        
    } else {
        res.status(404).json({
            message: 'Not found'
        });
    }
})

// List all users from Database

router.get('/all', is_authenticated, async (req, res) => {
    
    try {
        let statement = "SELECT id,username,fullname,email,phone,address,role FROM users";
        let options = {type: sequelize.QueryTypes.SELECT};
        let usersData = await sequelize.query(statement, options);
    
        res.status(200).json({
            message: 'Handling GET requests to /user/all',
            response: usersData
        });
    } catch(error) {
        console.log(error);
        res.status(404).json({
            message: 'Not found',
            error: error
        });
    }
    
});

/*
router.get('/verpaquetes', is_authenticated, (req, res) => {
    
    res.status(200).json({resp: `Endpoint securizado. Hola ${req.user.user}`})
    
});
*/

module.exports = {
    router, 
    validateUser,
    is_authenticated,
    is_validUser
};
