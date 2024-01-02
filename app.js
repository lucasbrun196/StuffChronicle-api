//CARREGANDO MODULOS
    import express from "express";
    import { engine } from 'express-handlebars';
    import bodyParser from 'body-parser';
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

    //outras configs

//ROTAS

//OUTROS
const PORT = 8081
app.listen(PORT, () => {
    console.log('Servidor rodando')
})
