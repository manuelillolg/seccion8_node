const { response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const {generarJWT} = require('../helpers/generar-jwt');
const { googleVerify } = require("../helpers/google-verify");
const usuario = require("../models/usuario");


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

const googleSingIn = async (req, res = response)=>{
    const {id_token} = req.body;

    try{
        const {nombre,img,correo} = await googleVerify(id_token)
        let usuario = await Usuario.findOne({correo});

        if(!usuario){
            const data = {
                nombre,
                correo,
                password: ':P',
                rol: 'USER_ROLE',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        //Si el usuario en bd 
        if(!usuario.estado){
            return res.status(401).json({
                msg:'Contacte con el administrador, usuario bloqueado'
            });
        }
        
        //Generar jwt
        const token = await generarJWT(usuario.id);

        res.json({
           usuario,
            token
        });
    }catch(error){
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })

        console.log(error);
    }

   


}

module.exports = {
    login,
    googleSingIn
}

