import express from "express";

const router = express.Router()

router.get('/', (req, res) => {
    res.send('Pagina principal do painel ADM')
})

router.get('/posts', (req, res) => {
    res.send('Pagina de posts')
})

router.get('/categorias', (req, res) => {
    res.send('Pagina de categorias')
})

export default router;