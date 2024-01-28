
    import express from "express";
    import { engine } from 'express-handlebars';
    import bodyParser from 'body-parser';
    import admin from './routes/admin.js';
    import usuario from './routes/usuario.js'
    import path from 'path'
    import { fileURLToPath } from 'url';
    import mongoose from "mongoose";
    import session from "express-session";
    import flash from 'connect-flash';
    import router from "./routes/admin.js";
    import Postagem from './models/Postagem.js'
    import Categoria from './models/Categoria.js';
    import Usuario from "./models/Usuario.js";
    import passport from 'passport';
    import initializePassport from './config/auth.js';
    initializePassport(passport)





    const app = express()
    const postagens = mongoose.model('postegens')
    const categoria = mongoose.model('categorias')


//CONFIGs

    //sessão
        app.use(session({
            secret: 'secret',
            resave: true,
            saveUninitialized: true
        }))

        app.use(passport.initialize())
        app.use(passport.session())
    
    //flash
        app.use(flash())
    
    //middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg'),
            res.locals.error_msg = req.flash('error_msg'),
            res.locals.error = req.flash('error')
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
app.get('/', (req, res) => {
    postagens.find().populate('categoria').sort({date: 'desc'}).then((postagens) => {
        res.render('index', {postagens: postagens})
    }).catch((error) => {
        req.flash('error_msg', 'Houve um erro interno')
        console.log('Internal error in root' + error)
        res.redirect('/404')
    })
})

app.get('/postagem/:slug', (req, res) => {
    postagens.findOne({slug: req.params.slug}).then((postagens) => {
        if(postagens){
            res.render('postagem/index', {postagens: postagens})
        }else{
            req.flash('error_msg', 'Postagem não encontrada')
            res.redirect('/')
        }
    }).catch((error) => {
        req.flash('error_msg', 'Houve um erro interno')
        res.redirect('/')
        console.log('Error when find this post by slug' + error)
    })
})

app.get('/categoria', (req, res) => {
    categoria.find().then((categoria) => {
        if(categoria != null){
            res.render('categoria/index', {categoria: categoria})
        }else{
            req.flash('error_msg', 'Nenhuma categoria disponivel')
            req.redirect('/')
        }
    }).catch((error) => {
        req.flash('error_msg', 'Houve um erro interno')
        res.redirect('/')
        console.log('Error when find the categorys' + error)
    })
})

app.get('/categoria/:slug', (req, res) => {
    categoria.findOne({slug: req.params.slug}).then((categoria) => {
        if(categoria){
            postagens.find({categoria: categoria._id}).then((postagens) => {
                res.render('categoria/category_route', {postagens: postagens, categoria: categoria})
            }).catch((error) => {
                req.flash('error_msg', 'Erro ao achar postagem por esse slug')
                res.redirect('/')
                console.log('Post not found by this category' + error)
            })
        }else{
            req.flash('error_msg', 'Essa categoria não existe')
        }
    }).catch((error) => {
        req.flash('error_msg', 'Houve um erro interno')
        res.redirect('/')
        console.log('Error when find category by slug' + error)
    })
})

app.get('/404', (req, res) => {
    res.send('Erro 404')
})

app.get('/posts', (req, res) => {
    res.send('Pagina de posts')
})



app.use('/admin', admin)

app.use('/usuarios', usuario)


    const PORT = 8081
    app.listen(PORT, () => {
        console.log('Server is running')
    })
