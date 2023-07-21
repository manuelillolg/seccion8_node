const { request } = require('express');
const jwt = require ('jsonwebtoken');
const usuarios = require('../models/usuario');

const validarJWT = async(req = request, response,next)=>{
    const token = req.header('x-token');
    if (!token){
        return response.status(401).json({
            msg:'No hay token en la petición'
        });
    }

    try{

        const {uid} = jwt.verify(token,process.env.SECRETORPRIVATEKEY);
        //leer el usuario que corresponde el uid
        const usuario =  await usuarios.findById(uid);
        
        req.usuario = usuario;

        if(!usuario){
            return response.status(401).json({
                msg:'Token no valido'
            });
        }

        //verificar si el usuario esta borrado 
        if(!usuario.estado){
            return response.status(401).json({
                msg:'Token no valido'
            });
        }
        
        next();

    }catch(error){
        console.log(error);
        response.status(401).json({
            msg:'Token no válido'
        });
    }
    
}

module.exports = {
    validarJWT
}