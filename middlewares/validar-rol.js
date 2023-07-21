

const validarRol = (req, res, next)=>{
    if(!req.usuario){
        return res.status(500).json({
            msg:'Se quiere verificar un rol sin validar el token primero'
        });
    }

    const {rol,nombre} = req.usuario;
    if(rol !=='ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${nombre} no es administrador`
        });
    }

    next();
}

tieneRole = (...roles)=>{
    
    return (req,res,next)=>{
        if(!req.usuario){
            return res.status(500).json({
                msg:'Se quiere verificar un rol sin validar el token primero'
            });
        }

        if(!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg:`El servicio requiere uno de estos roles: ${roles}` 
            });
        }

        next();
    }
}

module.exports = {
    validarRol,
    tieneRole
}