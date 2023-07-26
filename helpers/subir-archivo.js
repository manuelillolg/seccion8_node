const path = require('path');
const{v4:uuidv4} = require('uuid');

const subirArchivo = (files,extensionesValidas = ['png','jpg','jpeg','gif'], carpeta ='')=>{

    return new Promise( (resolve,reject) =>{
        
        if(files){
            const {archivo} = files;
            const nombreCortado = archivo.name.split('.');
            const extension = nombreCortado[nombreCortado.length -1];

            //Validar la extension
            if(!extensionesValidas.includes(extension)){
                return reject(`La extensión ${extension} no es permitida, tiene que ser una de las siguientes: ${extensionesValidas}`)
            }
            
            const nombreTemp = uuidv4()+'.'+extension;
            const uploadPath =path.join( __dirname , '../uploads/',carpeta,nombreTemp);
            
            archivo.mv(uploadPath, (err) =>{
                if (err) {
                    return reject(err);
                }
            
                resolve(nombreTemp);
            });
        }else{
            return reject("Es obligatorio enviar una imagen en la petición");
        }

    }
    
)}

module.exports = {
    subirArchivo
}