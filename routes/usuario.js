import express from "express";
import bcrypt from 'bcryptjs';
import Usuario from "../models/Usuario.js";

const router = express.Router();

router.get('/registro', (req, res) => {
    res.render('usuarios/registro');
});

router.post('/registro', (req, res) => {
    try {
        var errors = []
        
        const {nome, email, senha, senha2} = req.body

        if(!nome || typeof nome == undefined || nome == null){
            errors.push({text: 'Nome invalido'})
        }
        if(!email || typeof email == undefined || email == null){
            errors.push({text: 'Email invalido'})
        }
        if(!senha || typeof senha == undefined || senha == null){
            errors.push({text: 'Senha invalida'})
        }
        if(senha != senha2){
            errors.push({text: 'As senhas digitadas são diferentes'})
        }
        if(senha.length < 4){
            errors.push({text: 'Senha muitp pequena'})
        }
        if(errors.length > 0){
            res.render('/usuarios/registro', {error: errors})
        }else{
            Usuario.findOne({email: email}).then((usuario) => {
                if(usuario){
                    req.flash('error_msg', 'Ja existe um usuario cadastrado com este email')
                    res.redirect('/usuarios/resgistro')
                }else{
                    const newUser = new Usuario({
                        nome: nome,
                        email: email,
                        senha: senha
                    })

                    bcrypt.genSalt(10, (error, salt) => {
                        bcrypt.hash(newUser.senha, salt, (error, hash) => {
                            if(error){
                                req.flash('error_msg', 'Erro ao criar novo usuario')
                                res.redirect('/')
                                console.log('Error when encrypt the password')
                            }
                            newUser.senha = hash
                            newUser.save().then(() => {
                                req.flash('success_msg', 'Usuario criado com sucesso')
                                res.redirect('/')
                            }).catch((error) => {
                                req.flash('error_msg' ,'Erro ao criar conta')
                                res.redirect('/')
                                console.log('Error when save the user' + error)
                            })
                        })
                    })
                }
            }).catch((error) => {
                req.flash('error_msg', 'Erro interno')
                res.redirect('/')
                console.log('Internal error when find email' + error)
            })
        }
        
    }catch (error){
        req.flash('error_msg', 'Erro externo ao criar novo usuario')
        res.redirect('/')
        console.log('External error when create user' + error)
    }
});

router.get('/login', (req, res) => {
    res.render('usuarios/login')
})

export default router;