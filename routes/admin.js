import express from "express";
import mongoose from "mongoose";
import Categoria from '../models/Categoria.js';
import Postagem from '../models/Postagem.js'

const categoria = mongoose.model('categorias')
const postagens = mongoose.model('postegens')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/posts', (req, res) => {
    res.send('Pagina de posts')
})

router.get('/categorias', (req, res) => {
    categoria.find().sort({date: 'desc'}).then((categoria) => {
        res.render('admin/categorias', {categoria: categoria})
    }).catch((error) => {
        console.log('Erro ao listar categorias' + error)
    })
})

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategoria')
})

router.post('/categorias/nova', (req, res) => {

    var errors = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        errors.push({text: 'Nome invalido'})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        errors.push({text: 'Slug invalido'})
    }

    if(errors.length > 0){
        res.render('admin/addcategoria', {errors: errors})
    }else{
        const NewCategory = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new categoria(NewCategory).save().then(() => {
            console.log('New category was created')
            req.flash('success_msg', 'Categoria criada com sucesso')
            res.redirect('/admin/categorias')
        }).catch((e) => {
            req.flash('error_msg', 'Erro ao criar a categoria')
            res.redirect('/admin/categorias')
            console.log('Error when created new category' + e)
        })
    }
})

router.get('/categorias/edit/:id', (req, res) => {
    categoria.findOne({_id:req.params.id}).then((categoria) => {
        res.render('admin/editcategorias', {categoria: categoria})

    }).catch((error) => {
        req.flash('error_msg', 'Esta categoria não existe')
        res.redirect('/admin/categorias')
    })
})

router.post('/categorias/edit', (req, res) => {
    categoria.findOne({_id:req.body.id}).then((categoria) => {
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash('success_msg', 'Categoria editada com sucesso')
            res.redirect('/admin/categorias')
        }).catch((error) => {
            req.flash('error_msg', 'Erro ao editar categoria')
            res.redirect('admin/categorias')
        })
    })
})

router.post('/categorias/delete', (req, res) => {
    categoria.deleteOne({_id: req.body.id}).then(() => {
        req.flash('success_msg', 'Categoria removida com sucesso')
        res.redirect('/admin/categorias')
    }).catch(() => {
        res.redirect('/admin/categorias')
        req.flash('error_msg', 'Erro ao deletar categoria')
    }) 
})

router.get('/postagens', (req, res) => {
    postagens.find().populate('categoria').sort({date: 'desc'}).then((postagens) => {
        res.render('admin/postagens', {postagens: postagens})
    }).catch((error) => {
        console.log('Error when show postagens' + error)
        res.redirect('/admin')
        req.flash('error_msg', 'Erro ao carregar postagens')
    })
})

router.get('/postagens/add', (req, res) => {
    categoria.find().then((categoria) => {
        res.render('admin/addpostagem', {categoria: categoria})
    }).catch((error) => {
        req.flash('error_msg', 'Nenhuma categoria encontrada')
    })
    
})

router.post('/postagens/nova', (req, res) => {

    var errors = []

    for(var prop in req.body){
        if(!req.body[prop] || req.body[prop] == undefined || req.body[prop] == null || req.body[prop] == '0'){
            errors.push({text: `${prop} invalido`})
        }
    }
    
    if(errors.length > 0){
        categoria.find().then((categoria) => {
            res.render('admin/addpostagem', {errors: errors, categoria: categoria})
        })
        
    }else{
        const NewPost = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
        }
        new postagens(NewPost).save().then(() => {
            console.log('New post was created')
            req.flash('success_msg', 'Postagem criada com sucesso')
            res.redirect('/admin/postagens')
        }).catch((error) => {
            console.log('Error when created new post' + error)
            req.flash('error_msg', 'Erro ao criar postagem')
            res.redirect('/admin/postagens')
        })
    }
})

router.get('/postagens/edit/:id', (req, res) => {
    postagens.findOne({_id: req.params.id}).then((postagens) => {
        categoria.find().then((categoria) => {
            res.render('admin/editpost', {categoria: categoria, postagens: postagens})
        }).catch(() => {
            req.flash('error_msg', 'Houve um erro ao carregar categorias')
            res.redirect('/admin/postagens')
        })

    }).catch((error) => {
        req.flash('error_msg', 'Essa postagem não existe')
        res.redirect('admin/postagens')
    })
})








export default router;