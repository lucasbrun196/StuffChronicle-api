
    import express from "express";
    import { engine } from 'express-handlebars';
    import bodyParser from 'body-parser';
    import admin from './routes/admin.js';
    import path from 'path'
    import { fileURLToPath } from 'url';
    import mongoose from "mongoose";
    import session from "express-session";
    import flash from 'connect-flash';
    const app = express()


//CONFIGs

    //sessão
        app.use(session({
            secret: 'secret',
            resave: true,
            saveUninitialized: true
        }))
    
    //flash
        app.use(flash())
    
    //middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg'),
            res.locals.error_msg = req.flash('error_msg'),
            next()
        })

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
        mongoose.Promise = global.Promise
        mongoose.connect('mongodb://localhost:27017/blogapp').then(() => {
            console.log('Database was connected')
        }).catch((e) => {
            console.log('Error when connecting whit database' + e)
        })

    //public
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        app.use(express.static(path.join(__dirname, 'public')));


//ROUTES
    app.use('/admin', admin)


    const PORT = 8081
    app.listen(PORT, () => {
        console.log('Server is running')
    })
