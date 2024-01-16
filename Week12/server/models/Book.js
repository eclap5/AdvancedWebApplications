const mongoose = require('mongoose')

const Schema = mongoose.Schema

let Book = new Schema({
    name: String,
    author: String,
    pages: Number
})

module.exports = mongoose.model('Book', Book)