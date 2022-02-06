const { Router } = require('express');
const { check } = require('express-validator');

const { esRoleValido, 
        emailExiste, 
        existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');

const { usuariosGet,
        usuariosPut, 
        usuariosPost, 
        usuariosPatch, 
        usuariosDelete } = require('../controllers/usuarios');


const router = Router();

router.get('/', usuariosGet);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo ingresado no es valido').isEmail(),
    check('correo').custom( emailExiste ),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    // (rol) => esRoleValido(rol)  === esRoleValido  simplificacion
    //sintaxis
    check('rol').custom( esRoleValido ),
    validarCampos
], usuariosPost);

router.put('/:id', [
    check('id', 'No es in ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom( esRoleValido ),
    validarCampos
], usuariosPut);

router.delete('/:id',[
    check('id', 'No es in ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);


module.exports = router;