const Sequelize = require("sequelize");
const dotenv = require('dotenv');

dotenv.config();
/*
console.log(process.env.DRIVER_NAME);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_HOST);
console.log(process.env.DB_PORT);
console.log(process.env.DB_NAME);
*/

const driver_name = `${process.env.DRIVER_NAME}`;
const db_user = `${process.env.DB_USER}`;
const db_password = `${process.env.DB_PASSWORD}`;
const db_host = `${process.env.DB_HOST}`;
const db_port = `${process.env.DB_PORT}`;
const db_name = `${process.env.DB_NAME}`;

const connection_string = `${driver_name}://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}`;

const sequelize = new Sequelize(connection_string);

sequelize.authenticate()
.then(() => {
    console.log("Conectado a Database");
}).catch(e => {
    console.log(e);
})


module.exports = sequelize;