const { request, response} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
// const { body } = require('express-validator');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async ( req = request, res = response) => {


    const { correo, password } = req.body;

    try {
        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }
        //Si el usuario esta activo
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }
        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password);
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }
        //Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            // msg: 'Login OK',
            // correo,
            // password
            usuario,
            token
        });


    } catch ( error ) {
        console.log(error);
        return res.status(500).json({
            msg: 'Habla con el administrador'
        });
    }
}

const googleSignin  = async ( req = request, res = response ) => {

    const { id_token } = req.body;
    // console.log( id_token );
    try {
        // const googleUser = await googleVerify( id_token );
        const { nombre, correo, img } = await googleVerify( id_token );
        // console.log( googleUser );
        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {
            //Si no existe lo Creamos
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };
            usuario = new Usuario( data );
            await usuario.save();
        }
        //Si el usuario esta en DB pero bloqueado
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Comuniquese con el administrador, usuario bloqueado'
            });
        }

        //Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            msg: 'Todo ok! google signin',
            usuario,
            token
            // id_token
        });
    } catch (error) {
        res.status(400).json({
            msg: 'Token de Google no es valido'
        });
    }
}

module.exports = {
    login,
    googleSignin
}