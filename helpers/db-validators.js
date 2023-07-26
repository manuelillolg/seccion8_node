
const {Categoria,Role,Usuarios, Producto} = require ('../models')

const esRoleValido = async (rol='') =>{
    const existeRol = await Role.findOne({rol});
   
    if(!existeRol){
       
        throw new Error(`El rol ${rol} no está registrado en la BD`);
      
    }
}

const emailExiste = async (correo='') =>{
    const existeEmail = await Usuarios.findOne({correo});

    if(existeEmail){
        throw new Error(`El correo ${correo} ya está registrado.`);
    }
}

const existeUsuarioPorId = async(id)=>{
    const existeUsuario = await Usuarios.findById(id);

    if(!existeUsuario){
        throw new Error(`El id no existe ${id}`);
    }
}

const existeCategoria = async(id)=>{
    const existeId = await Categoria.findById(id);
    if(!existeId || !existeId.estado){
        throw new Error(`El id no existe: ${id}`);
    }
}

const existeProducto = async (id)=>{
    const existeId = await Producto.findById(id);
    if(!existeId || !existeId.estado){
        throw new Error(`El id no existe: ${id}`);
    }
}

const coleccionesPermitidas = (coleccion = '', colecciones = []) =>{
    const incluida = colecciones.includes(coleccion);

    if(!incluida){
        throw new Error(`La coleccion ${coleccion} no es permitida. Las colecciones permitidas son: ${colecciones}`);
    }

    return true;
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto,
    coleccionesPermitidas
}