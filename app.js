//CARREGANDO MODULOS
    import express from "express";
    import { engine } from 'express-handlebars';
    import bodyParser from 'body-parser';
    import admin from './routes/admin.js';
    import path from 'path'
    import { fileURLToPath } from 'url';
    // import mongoose from "mongoose";
    const app = express()


//CONFIGURAÇÕES

    //body-parser
        app.use(bodyParser.urlencoded({extended: false}))
        app.use(bodyParser.json())

    //handlebars
        app.engine('handlebars', engine({
            defaultLayout: 'main',
            runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
            },
        }));
        app.set('view engine', 'handlebars');
        app.set('views', './views');

    //mongoose

    //public
        // const __filename = fileURLToPath(import.meta.url);
        // const __dirname = path.dirname(__filename);
        // app.use(express.static(path.join(__dirname, 'public')));

    //outras configs

//ROTAS
    app.use('/admin', admin)



//OUTROS
    const PORT = 8081
    app.listen(PORT, () => {
        console.log('Servidor rodando')
    })
