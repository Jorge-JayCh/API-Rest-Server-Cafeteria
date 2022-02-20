const { request, response } = require('express');
const { Categoria } = require('../models');

//Crear categoria - privado - cualquier persona con un token valido
const categoriaPost = async ( req = request, res = response ) => {
    
    const nombre = req.body.nombre.toUpperCase();
    try {
        const categoriaDB = await Categoria.findOne({ nombre });
    
        if ( categoriaDB ) {
            res.status(400).json({
                msg: `La Categoria ${ categoriaDB.nombre }, ya existe .`
            });
        }
        //Generar data a guardar
        const data = {
            nombre,
            usuario: req.usuario._id
        }
        const categoria = new Categoria( data );
        //Guardar en DB
        await categoria.save();

        res.status(201).json({
            categoria
        });
    } catch (error) {
        // console.log(error)
    }
}

//ObtenerCategorias - paginado - total - populate
const categoriasGet = async ( req = request, res = response ) => {
    
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip( Number( desde ) )
            .limit( Number( limite ))
            .populate('usuario', 'nombre')
    ]);

    res.json({
        total,
        categorias
    });
}
//ObtenerCategoria - populate {}

const categoriaGet = async ( req = request, res = response ) => {
    const { id } = req.params;
    const categoria = await Categoria.findById( id )
        .populate('usuario', 'nombre');
    res.json({
        categoria
    });
}


// ActualizarCategoria
const categoriaPut = async ( req = request, res = response ) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate( id, data, {new: true});
    res.json({
        categoria
    });
}
// BorrarCategoria - estado: false
const categoriaDelete = async ( req = request, res = response ) => {
    const { id } = req.params;

    const categoriaBorrada = await Categoria.findByIdAndUpdate( id, { estado: false }, { new: true });
     res.json({
         categoriaBorrada
     });
}
module.exports = {
    categoriaPost,
    categoriasGet,
    categoriaGet,
    categoriaPut,
    categoriaDelete
}