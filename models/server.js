const express = require('express');
const cors = require('cors');
const {dbConnection} = require('../database/config');
const fileUpload = require('express-fileupload');

class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';
        this.categoriasPath= '/api/categorias';
        this.productosPath = '/api/productos';
        this.buscarPath = '/api/buscar';
        this.uploadsPath = '/api/uploads';

        //Conectar bd
        this.conectarDB();
        //Middlewares
        this.middlewares();
        this.app.use(cors())

        //lectura de body
        this.app.use(express.json());
        //Rutas de la aplicacion
        this.routes();


    }

    routes(){
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
        this.app.use(this.categoriasPath, require('../routes/categorias'));
        this.app.use(this.productosPath, require('../routes/productos'));
        this.app.use(this.buscarPath, require('../routes/buscar'));
        this.app.use(this.uploadsPath, require('../routes/uploads'));

    }

    listen(){
        this.app.listen(this.port,()=>{
            console.log('Servidor corriendo en puerto', this.port);
        });
    }

    middlewares(){
        //directorio publico
        this.app.use(express.static('public'));

        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    async conectarDB(){
        await dbConnection();
    }
}

module.exports = Server;