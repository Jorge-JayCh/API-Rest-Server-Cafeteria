const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async ( req = request, res = response ) => {
    
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip( Number( desde ) )
            .limit( Number( limite ))
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async ( req = request, res = response ) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( { nombre, correo, password, rol } );
    
    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );
    //Guardar en la BD
    await usuario.save();
    res.json({
        usuario
    });
}

const usuariosPut = async ( req = request, res = response ) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;
    // Validar contra BD
    if ( password ) {
        //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto, { new:true });

    res.json({
        // id,
        usuario
    });
}

const usuariosDelete = async ( req = request, res = response ) => {
    
    const { id } = req.params;


    // const uid = req.uid;

    //Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete( id );

    //Borrado logico
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false }, { new: true});
    // const usuarioAutenticado = req.usuario;
    res.json({
        usuario,
        // usuarioAutenticado
        // uid,

    });
}

const usuariosPatch = ( req, res = response ) => {
    res.json({
        msg: 'patch API - Controlador'
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch
}