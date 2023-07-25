const {response, request} = require ('express');
const {Producto} = require ('../models')

//obtener categorias paginado- total - populate(que aparezca la informacion del usuario)

const productosGet = async (req,res = response)=>{
    const {limite = 5,desde = 0} = req.query;

    const [total,productos] = await Promise.all([
        Producto.countDocuments({estado:true}),
        Producto.find({estado:true})
        .populate('usuario')
        .populate('categoria')
        .limit(Number(limite))
        .skip(Number(desde))
    ]);

    res.json({
        total,
        productos
    });
} 

//obtener categoria - populate
const productoGetId = async (req,res = response)=>{
    
    const {id} = req.params;
    
   const producto = await Producto.findOne({'_id':id});
  

  res.json({
        producto
    });
} 

const crearProducto = async(req, res = response) =>{
   
    
    const {nombre,descripcion,precio,disponible,categoria} = req.body;
    const productoDB = await Producto.findOne({nombre});
    

    if(productoDB){
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id,
        categoria,
        descripcion,
        precio,
        disponible
    }

    const producto = new Producto( data );
    await producto.save();

    res.status(201).json(producto);

}


//Actualizar categoria
const actualizarProducto= async(req, res) => {
    
    const {id} = req.params;   

    const {estado,usuario,...data} = req.body;
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id,data,{new:true});
    res.json(producto)
}

//borrar categoria- estado :false

const borrarProducto = async(req, res) =>{
    const {id} = req.params;
    
    const usuarioRol = req.usuario.rol;
 
    if(usuarioRol !== "ADMIN_ROLE"){
        return res.status(400).json({
            msg:'El usuario tiene que ser administrador para poder borrar'
        });
    }


    const producto = await Producto.findByIdAndUpdate(id,{'estado':false},{new:true});


    res.json(producto);


}

module.exports = {
    crearProducto,
    productosGet,
    productoGetId,
    actualizarProducto,
    borrarProducto
}