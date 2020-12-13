const jwt = require('jsonwebtoken');
const express = require('express');
const server = express();
server.use(express.json());
​
const firma = "dragon_ballZ";
​
let usuarios = [
    { user: "nelson", password: "nelson", isAdmin: false },
    { user: "angel", password: "angel", isAdmin: true }];
​
server.listen(3000, () => {
    console.log("Servidor iniciado...");
});
​
const autenticarUser = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const objetoDecodificado = jwt.verify(token, firma);
        console.log(objetoDecodificado);
        if (objetoDecodificado) {
            if (objetoDecodificado.isAdmin) {
                req.usuario = objetoDecodificado;
                next();
            }else{
                res.json({ error: 'Ud no tiene permisos necesarios' });
            }
        }
​
    } catch (error) {
        res.json({ error: 'Error al autenticar usuario' });
    }
}
​
server.get('/verpaquetes', autenticarUser, (req, res) => {
    res.send("Endpoint securizado. Hola " + req.usuario.user);
});
​
server.post('/login', (req, res) => {
    console.log(req.body);
    // Deberia validar. Seria ir a una BD o un lugar donde esté esa informacion.
​
    const { user, password } = req.body;
    let usuario = validarUsuario(user, password);
    if (usuario == null) {
        res.json({ error: 'Error al loguear' });
        return;
    }
    let token = jwt.sign(usuario, firma);
    res.json({ token });
});
​
function validarUsuario(user, pass) {
    for (let index = 0; index < usuarios.length; index++) {
        const element = usuarios[index];
        if (element.user == user) {
            if (element.password == pass) {
                return element;
            }
        }
    }
    return null;
}