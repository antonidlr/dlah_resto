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

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders were fetched'
    });
});

// Create new order
router.post('/', user.is_validUser, async (req, res, next) => {

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
    }
    
    res.status(201).json({
        message: 'Order was created',
        
    });
});

router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order details',
        orderId: req.params.orderId
    });
});

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order deleted',
        orderId: req.params.orderId
    });
});


module.exports = router;