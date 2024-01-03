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
    const NewCategory = {
        nome: req.body.nome,
        slug: req.body.slug
    }
    new categoria(NewCategory).save().then(() => {
        console.log('New category was created')
    }).catch((e) => {
        console.log('Error when created new category' + e)
    })
})


export default router;