const {response,request} = require('express');

const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');


const usuariosGet = async (req,res = response)=>{
    const {limite = 5,desde = 0} = req.query;

    const [total,usuarios] = await Promise.all([
        Usuario.countDocuments({estado:true}),
        Usuario.find({estado:true})
        .limit(Number(limite))
        .skip(Number(desde))
    ]);

    res.json({
        total,
        usuarios
    });
} 

const usuariosPost = async (req,res)=>{
    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});    
    
    //Verificar si el corrreo existe
   // const existeEmail = await Usuario.findOne({correo: correo});

    // if(existeEmail){
    //     return res.status(400).json({
    //         msg: 'El correo está registrado'
    //     });
    // }

    //encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(usuario.password,salt);


    //Guardar en BD
   await  usuario.save();
    res.json({
        msg: 'post API',
        usuario
    });
}
const usuariosPut = async (req,res)=>{

    const {id} = req.params;
    const {_id,password,google,correo,...resto} = req.body;

    //TODO validar contra base de datos

    if(password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password,salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id,resto);
  


    res.json({
        msg: 'put API',
        usuario

    });
}
const usuariosDelete = async (req,res)=>{
    const {id} = req.params;

    const usuarioRegistrado = req.usuario;


    const usuario = await Usuario.findByIdAndUpdate(id,{estado:false});

    res.json({
        usuario
    });
} 

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}