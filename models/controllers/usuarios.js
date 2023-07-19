const {response} = require('express');

const usuariosGet = (req,res = response)=>{
    const query = req.query;
    res.json({
        msg: 'get API - controlador',
        query
    });
} 

const usuariosPost = (req,res)=>{
    const {nombre,edad} = req.body;
    
    res.status(400).json({
        msg: 'post API',
        nombre,
        edad
    });
}
const usuariosPut = (req,res)=>{

    const id = req.params.id;

    res.json({
        msg: 'put API',
        id

    });
}
const usuariosDelete = (req,res)=>{
    res.json({
        msg: 'delete API'
    });
} 

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}