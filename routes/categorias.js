const {Router } = require('express');
const { check } = require('express-validator');

const { validarCampos , validarJWT} = require('../middlewares');
const { crearCategoria, categoriasGet, categoriaGetId, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const {existeCategoria} = require('../helpers/db-validators')


const router = Router();

//Obtener una categorias
router.get('/',categoriasGet);

//Obtener una categoria en particular
router.get('/:id',[
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
],categoriaGetId);

//crear categoria (cualquier persona con token valido)
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
],crearCategoria);

//Actualizar categoria (cualquiera con token valido)
router.put('/:id',[
    validarJWT,
    check('id').custom(existeCategoria),
    validarCampos
],actualizarCategoria);

//Borrar una categoria (solo admin)
router.delete('/:id',[
    validarJWT,
    check('id').custom(existeCategoria),
    validarCampos
],borrarCategoria);

/*
En las rutas que necesitan id hay que hacer validacion personalizada en un middleware
*/

module.exports = router;