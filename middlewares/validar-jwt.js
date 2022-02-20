const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async ( req = request, res = response, next ) => {
    const token = req.header( 'x-token');

    if (!token ) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    try {
        const { uid } = jwt.verify( token, process.env.PRIVATE_KEY);
        //Obtengo el id del usuario mediante el token
        const usuario = await Usuario.findById( uid );
        // req.uid = uid;
        //Verificar si el usuario existe
        if (!usuario) {
            return res.status(401).json({
                msg: 'Usuario no existe en la BD'
            });
        }
        // Verificar si el usuario esta activo
        if ( !usuario.estado) {
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado: false'
            });
        }
        req.usuario = usuario;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }

}

module.exports = {
    validarJWT
}