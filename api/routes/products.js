const express = require('express');
const router = express.Router();
const user = require('./../routes/user');

/* /Users/antoniodelosrios/Desktop/Fullstack/2.CLASES/BLOQUE_3/clases/delilah_resto/connection */
const sequelize = require('../database/connection');

router.get('/', user.is_validUser, async (req, res) => {
    try{
        const statement = "SELECT * FROM products";
        const options = {type: sequelize.QueryTypes.SELECT};
        const productsData = await sequelize.query(statement, options);
        
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
        const product = [
            req.body.product_name,
            req.body.list_price
        ]

        const statement = "INSERT INTO products (product_name, list_price) VALUES (?)";
        const options = {replacements: [product]};
        const response = await sequelize.query(statement, options);
        
        res.status(201).json({
            message: 'Handling POST requests to /products - Product created',
            response: product
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
        
        if(productsId.length >=1) {
            res.status(200).json({
                message: `Your product by ID ${id}`,
                product: productsId
            })
        }else {
            res.status(404).json({
                message: `Product by ID ${id} Not found`
            });
        }
        
    } catch(error) {
        console.log(error);
        res.status(404).json({
            message: 'Not found',
            error: error
        });
    }
    
})

router.put('/:productId', user.is_authenticated, async (req, res, next) => {
    
    try{
        const id = req.params.productId;
        const newName = req.body.product_name;
        const newPrice = req.body.list_price;
        
        const statement = `SELECT * FROM products WHERE id = ${id}`;
        const options = {type: sequelize.QueryTypes.SELECT};
        const productData = await sequelize.query(statement, options);
        
        if(productData.length == 1) {
            console.log(productData);
            
            let statement1 = `UPDATE products SET product_name = '${newName}' WHERE id=?`;
            let options1 = {replacements: [id]};
            let orderData = await sequelize.query(statement1, options1);
            
            const statement2 = `UPDATE products SET list_price = ${newPrice} WHERE id=?`;
            const options2 = {replacements: [id]};
            const orderData1 = await sequelize.query(statement2, options2);

            res.status(200).json({
                message: `Product ${id} - updated`,
            })
            
        } else {
            res.status(404).json({
                message: 'Not found - Product ID not found'
            });
        }
        
    } catch(error) {
        console.log(error);
        res.status(404).json({
            message: 'Not found',
            error: error
        });
    }
})

router.delete('/:productId', user.is_authenticated, async (req, res, next) => {

    try{
        const id = req.params.productId;
        
        const statement = `SELECT * FROM products WHERE id = ${id}`;
        const options = {type: sequelize.QueryTypes.SELECT};
        const productData = await sequelize.query(statement, options);
        
        if(productData.length == 1) {
            console.log(productData);
            
            const statement1 = `DELETE FROM products WHERE id=?`;
            const options1 = {replacements: [id]};
            const orderData1 = await sequelize.query(statement1, options1);

            res.status(200).json({
                message: 'Product deleted!'
            })
            
        } else {
            res.status(404).json({
                message: 'Not found - Product ID not found'
            });
        }
        
    } catch(error) {
        console.log(error);
        res.status(404).json({
            message: 'Not found',
            error: error
        });
    }
    
})

module.exports = router;

