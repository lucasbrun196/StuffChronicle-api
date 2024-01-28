import { Strategy as localStrategy } from 'passport-local';
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import Usuario from "../models/Usuario.js";

// const Usuario = mongoose.model('usuarios')

export default function(passport){
    passport.use(new localStrategy({ usernameField: 'email', passwordField: 'senha' }, (email, senha, done) => {
        Usuario.findOne({ email: email }).then((usuario) => {
            if (!usuario) {
                return done(null, false, { message: 'Essa conta não existe' });
            }

            bcrypt.compare(senha, usuario.senha, (error, isValid) => {
                if (isValid) {
                    return done(null, usuario);
                } else {
                    return done(null, false, { message: 'Senha incorreta' });
                }
            });
        }).catch((error) => {
            return done(error);
        });
    }));

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id);
    });

    passport.deserializeUser((id, done) => {
        Usuario.findById(id).then((usuario) => {
            done(null, usuario)
        }).catch((error) => {
            done(error, null)
            console.log('Error in the deserializerUser ' + error)
        })
    });
}
    