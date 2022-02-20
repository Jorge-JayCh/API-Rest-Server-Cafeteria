const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignin } = require('../controllers/auth');
const { 
    categoriaPost, 
    categoriasGet, 
    categoriaGet, 
    categoriaPut,
    categoriaDelete
} = require('../controllers/categorias');

const { existeCategoriaPorId } = require('../helpers/db-validators');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();

//Crear categoria - privado - cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], categoriaPost );

//Obtener todas las categorias - publico
router.get('/', categoriasGet);

//Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es in id de Mongo Valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],categoriaGet);

//Actualizar - privado - cualquiera con token valido
router.put('/:id',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es in id de Mongo Valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], categoriaPut);

//Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es in id de Mongo Valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
] ,categoriaDelete);

module.exports = router;
