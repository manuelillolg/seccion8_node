const {Router } = require('express');
const { check } = require('express-validator');

const { validarCampos , validarJWT} = require('../middlewares');
const { crearProducto,  productoGetId, actualizarProducto, borrarProducto, productosGet } = require('../controllers/productos');
const {existeCategoria,existeProducto} = require('../helpers/db-validators');


const router = Router();

//Obtener una categorias
router.get('/',productosGet);

//Obtener una categoria en particular
router.get('/:id',[
    check('id').custom(existeProducto),
    validarCampos
],productoGetId);

//crear categoria (cualquier persona con token valido)
router.post('/',[
     validarJWT,
     check('nombre','El nombre es obligatorio').not().isEmpty(),
     check('categoria').custom(existeCategoria),
     validarCampos
],crearProducto);

//Actualizar categoria (cualquiera con token valido)
router.put('/:id',[
    validarJWT,
    check('id').custom(existeProducto),
    validarCampos
],actualizarProducto);

//Borrar una categoria (solo admin)
router.delete('/:id',[
    validarJWT,
    check('id').custom(existeProducto),
    validarCampos
],borrarProducto);

/*
En las rutas que necesitan id hay que hacer validacion personalizada en un middleware
*/

module.exports = router;