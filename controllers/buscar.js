const {response} = require('express');
const{ObjectId} = require('mongoose').Types;
const{Usuarios,Categoria,Producto} = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categoria',
    'productos',
    'roles'
]

const buscarUsuarios = async(termino="", res = response)=>{
    const esMongoID = ObjectId.isValid(termino);

    if(esMongoID){
        const usuario = await Usuarios.findById(termino);
        return res.json({
            results: (usuario) ?[usuario] : []
        });
    }

    const regex = new RegExp(termino,'i');

    const usuarios = await Usuarios.find({
        $or:[{nombre:regex },{correo:regex}],
        $and:[{estado:true}]
    });

   res.json({
        results: usuarios
    });

}

const buscarCategorias = async(termino="", res = response)=>{
    const esMongoID = ObjectId.isValid(termino);

    if(esMongoID){
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ?[categoria] : []
        });
    }

    const regex = new RegExp(termino,'i');

    const categoria = await Categoria.find({
        nombre:regex       
    });

   res.json({
        results: categoria
    });

}

const buscarProducto = async(termino="", res = response)=>{
    const esMongoID = ObjectId.isValid(termino);

    if(esMongoID){
        const producto = await Producto.findById(termino);
        return res.json({
            results: (producto) ?[producto] : []
        });
    }

    const regex = new RegExp(termino,'i');

    const producto = await Producto.find({
        nombre:regex       
    });

   res.json({
        results: producto
    });

}

const buscar = (req,res)=>{

    const {coleccion,termino} = req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg:`Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch(coleccion){
        case'usuarios':
            buscarUsuarios(termino,res);
        break;
        case'categoria':
            buscarCategorias(termino,res);
        break;
        case'productos':
            buscarProducto(termino,res);
        break;

        default:
            res.status(500).json({
                msg:"Se me olvidó hacer esta búsqueda"
            })
        break;
    }

}

module.exports ={
   buscar
}