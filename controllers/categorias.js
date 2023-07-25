const {response, request} = require ('express');
const {Categoria} = require ('../models')

//obtener categorias paginado- total - populate(que aparezca la informacion del usuario)

const categoriasGet = async (req,res = response)=>{
    const {limite = 5,desde = 0} = req.query;

    const [total,categorias] = await Promise.all([
        Categoria.countDocuments({estado:true}),
        Categoria.find({estado:true})
        .populate('usuario')
        .limit(Number(limite))
        .skip(Number(desde))
    ]);

    res.json({
        total,
        categorias
    });
} 

//obtener categoria - populate
const categoriaGetId = async (req,res = response)=>{
    
    const {id} = req.params;
    
   const categoria = await Categoria.findOne({'_id':id});
  

  res.json({
        categoria
    });
} 

const crearCategoria = async(req, res = response) =>{
    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data );
    await categoria.save();

    res.status(201).json(categoria);

}


//Actualizar categoria
const actualizarCategoria= async(req, res) => {
    
    const {id} = req.params;   

    const {estado,usuario,...data} = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id,data,{new:true});
    res.json(categoria)
}

//borrar categoria- estado :false

const borrarCategoria = async(req, res) =>{
    const {id} = req.params;
    
    const usuarioRol = req.usuario.rol;
 
    if(usuarioRol !== "ADMIN_ROLE"){
        return res.status(400).json({
            msg:'El usuario tiene que ser administrador para poder borrar'
        });
    }


    const categoria = await Categoria.findByIdAndUpdate(id,{'estado':false},{new:true});


    res.json(categoria);


}

module.exports = {
    crearCategoria,
    categoriasGet,
    categoriaGetId,
    actualizarCategoria,
    borrarCategoria
}