const express = require('express')
const mongoose = require('mongoose')
const Recipe = require('../models/Recipe')
const router = express.Router()

const mongoDB = 'mongodb://127.0.0.1:27017/testdb'
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error'))

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Recipe App' })
})

router.get('/recipe/:food', async (req, res, next) => {
  try {
    const recipe = await Recipe.findOne({ name: req.params.food })

    if (recipe) 
      return res.json(recipe)
    else
      return res.status(404).send('recipe not found.')

  } catch (err) {
    return next(err)
  }
})

router.post('/recipe/', async (req, res, next) => {
  try {
    const existingRecipe = await Recipe.findOne({ name: req.body.name })
    
    if (existingRecipe)
      res.status(403).send('Recipe already exists')
    
    else {
      await new Recipe({ 
        name: req.body.name, 
        instructions: req.body.instructions, 
        ingredients: req.body.ingredients 
      }).save()
      return res.send(req.body)
    }
  }
  catch (err) {
   return next(err)
  }
})

router.post('/images', (req, res, next) => {
  res.send('POST successful')
})

module.exports = router
