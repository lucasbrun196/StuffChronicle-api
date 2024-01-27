import express from "express";
import mongoose from "mongoose";
import Usuario from "../models/Usuario.js"

const router = express.Router()
const usuario = mongoose.model('usuario')

router.get('/registro', (req, res) => {
    res.render('usuarios/registro')
})

router.post('/registro', (req, res) => {
    var errors = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        errors.push({text: 'Nome invalido'})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        errors.push({text: 'Email invalido'})
    }

    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        errors.push({text: 'Senha invalido'})
    }

    if(req.body.senha.length < 4){
        errors.push({text: 'Senha muito pequena'})
    }

    if(req.body.senha != req.body.senha2){
        errors.push({text: 'As senhas são diferentes'})
    }

    if(errors.length > 0){
        res.render('usuarios/registro', {errors, errors})
    }
    
})



export default router;