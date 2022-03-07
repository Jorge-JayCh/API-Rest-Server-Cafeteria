const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const { request, response } = require("express");
const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');


const cargarArchivos = async ( req = request, res = response) => {

  try {
    // Imagenes
    // txt, md
    // const nombre = await subirArchivo( req.files, ['txt', 'md'], 'textos' );
    const nombre = await subirArchivo( req.files, undefined, 'imgs' );

    res.json({
      nombre
    });
  } catch (error) {
    res.status(400).json({ error });
  }
}

const actualizarImagen = async ( req = request, res = response ) => {
  
  const { id, coleccion } = req.params;

  let modelo;

  switch ( coleccion ) {
    case 'usuarios':
      modelo = await Usuario.findById( id );
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${ id }`
        });
      }
      break;

    case 'productos':
      modelo = await Producto.findById( id );
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${ id }`
        }); 
      }
      break;
    default:
      return res.status(500).json({
        msg: 'Falta realizar esta validacion'
      });
  }

  //limpiar imagenes previas
  if ( modelo.img ) {
    // hat que borrar lo imagen del servidor
    const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
    if ( fs.existsSync( pathImagen )) {
      fs.unlinkSync( pathImagen );
    }
  }
  const nombre = await subirArchivo( req.files, undefined, coleccion);
  modelo.img = nombre;

  await modelo.save();

  res.json({
    modelo
  });
}

const actualizarImagenCloudinary = async ( req = request, res = response ) => {
  
  const { id, coleccion } = req.params;

  let modelo;

  switch ( coleccion ) {
    case 'usuarios':
      modelo = await Usuario.findById( id );
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${ id }`
        });
      }
      break;

    case 'productos':
      modelo = await Producto.findById( id );
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${ id }`
        }); 
      }
      break;
    default:
      return res.status(500).json({
        msg: 'Falta realizar esta validacion'
      });
  }

  //limpiar imagenes previas
  if ( modelo.img ) {
    // hay que borrar la imagen del servidor
    const nombreArr = modelo.img.split('/');
    const nombre = nombreArr[ nombreArr.length - 1 ];
    const [ public_id ] = nombre.split('.');
    cloudinary.uploader.destroy( public_id );
  }

  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
  modelo.img = secure_url;
  await modelo.save();

  res.json({
    modelo
    // resp
  });
}


const mostrarImagen = async ( req = request, res = response) => {
  
  const { id, coleccion } = req.params;

  let modelo;

  switch ( coleccion ) {
    case 'usuarios':
      modelo = await Usuario.findById( id );
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${ id }`
        });
      }
      break;

    case 'productos':
      modelo = await Producto.findById( id );
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${ id }`
        }); 
      }
      break;
    default:
      return res.status(500).json({
        msg: 'Falta realizar esta validacion'
      });
  }

  //limpiar imagenes previas
  if ( modelo.img ) {
    // hat que borrar lo imagen del servidor
    const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
    if ( fs.existsSync( pathImagen )) {
      return res.sendFile( pathImagen );
    }
  }

  const pathImagen = path.join( __dirname, '../assets/13.1 no-image.jpg.jpg');
  res.sendFile( pathImagen );
  
  // res.json({
  //   msg: 'Falta place holder'
  // });

  // res.json({
  //   msg: 'Hola desde mostrar Imagen',
  //   id,
  //   coleccion
  // });
}

module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}