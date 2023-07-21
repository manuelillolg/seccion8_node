const validarCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-rol');

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validaRoles,
}