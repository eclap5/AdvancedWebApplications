const mongoose = require('mongoose')

const Schema = mongoose.Schema

let Image = new Schema({
    name: String,
    buffer: Buffer,
    mimetype: String,
    encoding: String
})

module.exports = mongoose.model('Image', Image)

