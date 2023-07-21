const { response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const {generarJWT} = require('../helpers/generar-jwt')


const login = async(req,res=response)=>{

    const {correo, password} = req.body;

    try{

        //verificar si el correo existe
        const usuario = await Usuario.findOne({correo});

        if(!usuario){
            return res.status(400).json({
                msg:`Usuario /Password no son correcto`
            })
        }

        //verificar si el usuario esta activo en la bd
        if (!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario /password no son correctos'
            });
        }

        //verificar la pw
        const validPassword = bcryptjs.compareSync(password, usuario.password);

        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario /password no son correctos'
            });
        }

        //generar el jwt
        console.log(generarJWT)
        const token = await generarJWT(usuario.id);

        res.json({
            msg: 'Login ok',
            usuario,
            token
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

    
}

module.exports = {
    login
}

