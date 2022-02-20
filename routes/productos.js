const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignin } = require('../controllers/auth');

const { 
    productoPost, 
    productosGet,
    productoGet,
    productoPut,
    productoDelete
} = require('../controllers/productos');

const { 
    existeProductoPorId, 
    existeCategoriaPorId 
} = require('../helpers/db-validators');

const { 
    validarJWT,
    validarCampos,
    esAdminRole 
} = require('../middlewares');

const router = Router();

//Crear categoria - privado - cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de Mongo valido').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], productoPost );

//Obtener todas las categorias - publico
router.get('/', productosGet );

//Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es in id de Mongo Valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], productoGet );

//Actualizar - privado - cualquiera con token valido
router.put('/:id',[
    validarJWT,
    // check('categoria', 'No es in id de Mongo Valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], productoPut );

//Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es in id de Mongo Valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], productoDelete);

module.exports = router;
