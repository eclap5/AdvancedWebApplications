const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const Recipe = require('../models/Recipe')
const Category = require('../models/Category')
const Image = require('../models/Image')
const router = express.Router()

const mongoDB = 'mongodb://127.0.0.1:27017/testdb'
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error'))

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


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
      return res.status(404).send('Recipe not found.')

  } 
  catch (err) {
    return next(err)
  }
})


// Populate categories to database
// Category.create({
//   name: 'Gluten-free'
// })
// Category.create({
//   name: 'Lactose-free'
// })
// Category.create({
//   name: 'Vegan'
// })


router.get('/categories', async (req, res, next) => {
  try {
    const categories = await Category.find({})
    if (categories)
      return res.send(categories)
    else
      return res.status(404).send('Categories not found.')
  } 
  catch (error) {
    return next(error)
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
        ingredients: req.body.ingredients,
        categories: req.body.categories,
        images: req.body.images
      }).save()
      return res.send(req.body)
    }
  }
  catch (err) {
   return next(err)
  }
})


router.post('/images', upload.array('images'), async (req, res, next) => {
  let imageIds = []
  try {
    for (let i = 0; i < req.files.length; i++) {
      const image = await new Image({
        name: req.files[i].originalname,
        buffer: req.files[i].buffer,
        mimetype: req.files[i].mimetype,
        encoding: req.files[i].encoding
      }).save()
      imageIds.push(image._id)
    }
    console.log(imageIds)
    return res.send(imageIds)
  } 
  catch (error) {
    return next(error)
  }
})


module.exports = router
