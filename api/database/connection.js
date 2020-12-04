const Sequelize = require("sequelize");

const driver_name = "mysql";
const db_user = "antonidlr";
const db_password = "";
const db_host = "192.168.64.2";
const db_port = 3306;
const db_name = "dbdelilah";

const connection_string = `${driver_name}://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}`;

const sequelize = new Sequelize(connection_string);

sequelize.authenticate()
.then(() => {
    console.log("Conectado a Database");
}).catch(e => {
    console.log(e);
})


module.exports = sequelize;