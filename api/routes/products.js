const express = require('express');
const router = express.Router();

/* /Users/antoniodelosrios/Desktop/Fullstack/2.CLASES/BLOQUE_3/clases/delilah_resto/connection */
const sequelize = require('../database/connection');

router.get('/', async (req, res) => {
    let statement = "SELECT * FROM products";
    let options = {type: sequelize.QueryTypes.SELECT};
    let productsData = await sequelize.query(statement, options);
    
    res.status(200).json({
        message: 'Handling GET requests to /products',
        response: productsData
    });
});
/*
router.post('/', (req, res, next) => {
    const product = {
        name: req.body.name,
        price: req.body.price
    };

    res.status(201).json({
        message: 'Handling POST requests to /products',
        createdProduct: product
    });
});
*/

router.post('/', async (req, res) => {
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
});

router.get('/:productId', async (req, res) => {
    const id = req.params.productId;

    let statement = `SELECT * FROM products WHERE id = ${id}`;
    let options = {type: sequelize.QueryTypes.SELECT};
    let productsId = await sequelize.query(statement, options);
    
    res.status(200).json({
        message: `Your product by ID ${id}`,
        id: productsId
    })
    /*
    if(id === 'special') {
        res.status(200).json({
            message: 'You discovered the special ID',
            id: productsId
        })
    } else {
        res.status(200).json({
            message: 'You passed an ID',
            id: id
        })
    }
    */
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

