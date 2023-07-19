const express = require('express');
const cors = require('cors');
const {dbConnection} = require('../database/config')

class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

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
        this.app.use(this.usuariosPath, require('../routes/usuarios'))
    }

    listen(){
        this.app.listen(this.port,()=>{
            console.log('Servidor corriendo en puerto', this.port);
        });
    }

    middlewares(){
        //directorio publico
        this.app.use(express.static('public'));
    }

    async conectarDB(){
        await dbConnection();
    }
}

module.exports = Server;