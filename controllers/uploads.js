const path = require('path')
const fs = require('fs')
const { response } = require("express");
const { subirArchivo } = require("../helpers");
const{Usuarios,Producto} = require('../models');
const { model } = require("mongoose");

const cargarArchivo = async (req,res = response)=>{   
    
    if (!req.files || Object.keys(req.files).length === 0 ||!req.files.archivo) {
        res.status(400).send('No files were uploaded.');
        return;
    }

   try{
    const nombre = await subirArchivo(req.files,undefined,'imgs');
    res.json({
        nombre
    });
   }catch(err){
    res.json(err);
   }
    
}

const actualizarImagen = async (req, res = response)=>{
    const {id,coleccion} = req.params;

    let modelo;
    
    switch(coleccion){
        case 'usuarios':
            modelo = await Usuarios.findById(id);

            if(!modelo){
                return res.status(400).json({msg:`No existe un usuario con el id ${id}`});
            }
        break;
        case 'productos':
            modelo = await Producto.findById(id);

            if(!modelo){
                return res.status(400).json({msg:`No existe un producto con el id ${id}`});
            }

        break;

        default:
            return res.status(500).json({msg:'Opcion no implementada'});
       
    }


    try{

        //Limpiar imagenes previas
        if(modelo.img){
            //Hay que borrar la imagen del servidor
            const pathImagen = path.join(__dirname,'../uploads',coleccion,modelo.img);
            if(fs.existsSync(pathImagen)){
                fs.unlinkSync(pathImagen);
            }
        }
        const nombre = await subirArchivo(req.files,undefined,coleccion);
        modelo.img = nombre;

        await modelo.save();

        res.json({
        modelo
        })
    }catch(err){
        res.json(err);
    }
    
}

const mostrarImagen = async(req, res = response) =>{
    const {id,coleccion} = req.params;

    let modelo;
    
    switch(coleccion){
        case 'usuarios':
            modelo = await Usuarios.findById(id);

            if(!modelo){
                return res.status(400).json({msg:`No existe un usuario con el id ${id}`});
            }
        break;
        case 'productos':
            modelo = await Producto.findById(id);

            if(!modelo){
                return res.status(400).json({msg:`No existe un producto con el id ${id}`});
            }

        break;

        default:
            return res.status(500).json({msg:'Opcion no implementada'});
       
    }


    try{

        //Limpiar imagenes previas
        if(modelo.img){
            //Hay que borrar la imagen del servidor
            const pathImagen = path.join(__dirname,'../uploads',coleccion,modelo.img);
            if(fs.existsSync(pathImagen)){
                return res.sendFile(pathImagen);
            }
        }

        res.sendFile(
             path.join(__dirname,'../assets','no-Image.jpg')
        );
    }catch(err){
        res.json(err);
    }
}

module.exports ={
    cargarArchivo,
    actualizarImagen,
    mostrarImagen
}