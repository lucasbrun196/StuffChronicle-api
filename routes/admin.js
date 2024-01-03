import express from "express";
import mongoose from "mongoose";
import Categoria from '../models/Categoria.js';

const categoria = mongoose.model('categorias')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/posts', (req, res) => {
    res.send('Pagina de posts')
})

router.get('/categorias', (req, res) => {
    res.render('admin/categorias')
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
            res.redirect('/admin')
            console.log('Error when created new category' + e)
        })
    }
})


export default router;