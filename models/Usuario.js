import mongoose from "mongoose";
const Schema = mongoose.Schema

const Usuario = new Schema({
    nome: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    senha: {
        type: String,
        require: true
    }
})

mongoose.model('usuario', Usuario)

export default Usuario