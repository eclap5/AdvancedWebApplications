const express = require('express');
const mongoose = require('mongoose')
const Book = require('../models/Book')
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/book/', async (req, res, next) => {
  await new Book({
    name: req.body.name,
    author: req.body.author,
    pages: req.body.pages
  }).save()

  return res.json({message: 'book added'})
})

module.exports = router;
