const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

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

module.exports = {
    is_authenticated
  };