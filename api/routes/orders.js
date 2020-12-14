const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const user = require('./../routes/user');
const moment = require('moment');

dotenv.config();
moment().format();

const sequelize = require('../database/connection');
//const { is_validUser } = require('./../routes/user');


//Handle inconming GET requests to /orders

router.get('/', user.is_authenticated, async (req, res, next) => {

    try{
        const statement = "SELECT * FROM orders";
        const options = {type: sequelize.QueryTypes.SELECT};
        const ordersData = await sequelize.query(statement, options);

        const statement1 = "SELECT * FROM order_items";
        const options1 = {type: sequelize.QueryTypes.SELECT};
        const ordersData1 = await sequelize.query(statement1, options1);
        
        res.status(200).json({
            message: 'GET requests to /orders fetched',
            responseOrders: ordersData,
            productsbyOrderId: ordersData1
        });

    } catch(error) {
        console.log(error);
        res.status(404).json({
            message: 'Not found',
            error: error
        });
    }
});

// Create new order
router.post('/', user.is_validUser, async (req, res, next) => {

    try {
        var newDate = moment().utc().format('YYYY-MM-DD HH:mm:ss');
        var sUtc = moment.utc(newDate).toDate();
        var localtime = moment(sUtc).local().format('YYYY-MM-DD HH:mm:ss');
        console.log(req.body.neworder);
        console.log(localtime);
        
        const orderList = req.body.neworder;
    
        if(orderList.length >= 1) {
        
            const checkTotal = () => {
                return new Promise((resolve, reject) => {
                    let totalPrice = 0;
                    orderList.forEach(async (element,index) => {
                        const statement1 = `SELECT * FROM products WHERE id = '${element.product_id}'`;
                        const options1 = {type: sequelize.QueryTypes.SELECT};
                        const productData = await sequelize.query(statement1, options1);
                        totalPrice = totalPrice + Number(element.quantity) * Number(productData[0].list_price);
                        if(index == orderList.length-1) {
                            resolve(totalPrice);
                            console.log(totalPrice);
                        }
                    });
                    
                })
            }
            const total_price = await checkTotal();
            const orderValues = [
                req.body.user_id,
                1,
                total_price,
                req.body.payment,
                localtime
            ]
    
            const statement = "INSERT INTO orders (user_id, status, total_price, payment, order_date) VALUES (?)";
            const options = {replacements: [orderValues]};
            const orderData = await sequelize.query(statement, options);
            
            const statement1 = `SELECT * FROM orders ORDER BY order_id DESC LIMIT 1`;
            const options1 = {type: sequelize.QueryTypes.SELECT};
            const orderData1 = await sequelize.query(statement1, options1);
            console.log(orderData1);
    
            orderList.forEach(async (element,index) => {
                const statement2 = `INSERT INTO order_items (order_id, product_id, quantity) VALUES
                ((SELECT order_id FROM orders ORDER BY order_id DESC LIMIT 1),(SELECT id FROM products WHERE id = '${element.product_id}'),'${element.quantity}')`;
                const orderData2 = await sequelize.query(statement2);
            })

            res.status(201).json({
                message: 'Order was created',
                response: orderData1[0]
                
            });
        } else {
            res.status(404).json({
                message: 'Not Found - Empty Order List',
            });
        }

    } catch(error) {
        console.log(error);
        res.status(400).json({
            message: 'Bad Request',
            error: error
        });
    }
    
});

//Updatind Order status by Admin

router.put('/:orderId', user.is_authenticated, async (req, res, next) => {

    try{
        const id = req.params.orderId;
        const newStatus = req.body.status;

        const statement = `SELECT * FROM orders WHERE order_id = ${id}`;
        const options = {type: sequelize.QueryTypes.SELECT};
        const orderData = await sequelize.query(statement, options);
        
        if(orderData.length == 1) {
            console.log(orderData);
            if(newStatus >= 2 && newStatus <= 6) {
                const statement1 = `UPDATE orders SET status=${newStatus} WHERE order_id=?`;
                const options1 = {replacements: [id]};
                const orderStatus = await sequelize.query(statement1, options1);
                
                res.status(200).json({
                    message: `Order ${id} - status updated to ${newStatus}`,
                    orderId: req.params.orderId
                })
            } else {
                res.status(404).json({
                    message: 'Not found - status not valid'
                });
            }
        } else {
            res.status(404).json({
                message: 'Not found - ID not found'
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


router.delete('/:orderId', user.is_authenticated, async (req, res, next) => {

    try{
        const id = req.params.orderId;
        
        const statement = `SELECT * FROM orders WHERE order_id = ${id}`;
        const options = {type: sequelize.QueryTypes.SELECT};
        const orderData = await sequelize.query(statement, options);
        
        if(orderData.length == 1) {
            console.log(orderData);
            
            const statement1 = `DELETE FROM orders WHERE order_id=?`;
            const options1 = {replacements: [id]};
            const orderData1 = await sequelize.query(statement1, options1);
            
            const statement2 = `DELETE FROM order_items WHERE id=?`;
            const options2 = {replacements: [id]};
            const orderData2 = await sequelize.query(statement2, options2);
            
            res.status(200).json({
                message: 'Order deleted',
                orderId: req.params.orderId
            });
            
        } else {
            res.status(404).json({
                message: 'Not found - Order ID not found'
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


module.exports = router;