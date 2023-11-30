const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let Recipe = new Schema({
    name: String,
    ingredients: [String],
    instructions: [String]
});

module.exports = mongoose.model('Recipe', Recipe);
