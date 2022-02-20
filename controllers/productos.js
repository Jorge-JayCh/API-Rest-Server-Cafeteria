const { request, response } = require('express');
const { Producto } = require('../models');

//Crear producto - privado - cualquier persona con un token valido
const productoPost = async ( req = request, res = response ) => {
    
    const { estado, usuario, nombre, ...body } = req.body;
    // const nombre = req.body.nombre.toUpperCase();
    try {
        const productoDB = await Producto.findOne({ nombre: nombre.toUpperCase() });
    
        if ( productoDB ) {
            res.status(400).json({
                msg: `El Producto ${ productoDB.nombre }, ya existe .`
            });
        }
        //Generar data a guardar
        const data = {
            ...body,
            nombre: nombre.toUpperCase(),
            usuario: req.usuario._id
        }
        const producto = new Producto( data );
        //Guardar en DB
        await producto.save();

        res.status(201).json({
            producto    
        });
    } catch (error) {
        // console.log(error)
    }
}

//ObtenerProductos - paginado - total - populate
const productosGet = async ( req = request, res = response ) => {
    
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip( Number( desde ) )
            .limit( Number( limite ))
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
    ]);

    res.json({
        total,
        productos
    });
}
//ObtenerProducto - populate {}

const productoGet = async ( req = request, res = response ) => {
    const { id } = req.params;
    const producto = await Producto.findById( id )
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');
    res.json({
        producto
    });
}


// Actualizar Producto
const productoPut = async ( req = request, res = response ) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if ( data.nombre ) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate( id, data, {new: true});
    res.json({
        producto
    });
}
// Borrar Producto - estado: false
const productoDelete = async ( req = request, res = response ) => {
    
    const { id } = req.params;

    const productoBorrado = await Producto.findByIdAndUpdate( id, { estado: false }, { new: true });
     res.json({
         productoBorrado
     });
}
module.exports = {
    productoPost,
    productosGet,
    productoGet,
    productoPut,
    productoDelete
}