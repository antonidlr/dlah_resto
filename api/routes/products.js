const express = require('express');
const router = express.Router();
const user = require('./../routes/user');

/* /Users/antoniodelosrios/Desktop/Fullstack/2.CLASES/BLOQUE_3/clases/delilah_resto/connection */
const sequelize = require('../database/connection');

router.get('/', user.is_validUser, async (req, res) => {
    try{
        let statement = "SELECT * FROM products";
        let options = {type: sequelize.QueryTypes.SELECT};
        let productsData = await sequelize.query(statement, options);
        
        res.status(200).json({
            message: 'Handling GET requests to /products',
            response: productsData
        });
    } catch(error) {
        console.log(error);
        res.status(404).json({
            message: 'Not found',
            error: error
        });
    }
    
});


router.post('/', user.is_authenticated, async (req, res) => {
    try{
        const product = {
            name: req.body.name,
            price: req.body.price
        };
    
        let statement = "INSERT INTO products (name, price) VALUES (? , ?)";
        let options = {replacements: [product.name, product.price]};
        let response = await sequelize.query(statement, options);
    
        res.status(201).json({
            message: 'Handling POST requests to /products',
            response: response
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: 'Not found',
            error: error
        });
    }
    
});

router.get('/:productId', user.is_authenticated, async (req, res) => {
    try{
        const id = req.params.productId;

        let statement = `SELECT * FROM products WHERE id = ${id}`;
        let options = {type: sequelize.QueryTypes.SELECT};
        let productsId = await sequelize.query(statement, options);
        
        res.status(200).json({
            message: `Your product by ID ${id}`,
            product: productsId
        })
    } catch(error) {
        console.log(error);
        res.status(404).json({
            message: 'Not found',
            error: error
        });
    }
    
})

router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated product!'
    })
})

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted product!'
    })
})

module.exports = router;

