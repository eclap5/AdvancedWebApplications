const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Recipe App' });
});

router.get('/recipe/:food', (req, res, next) => {
  res.json(
    { 
      name: req.params.food,
      instructions: ['step 1', 'step 2', 'step 3'],
      ingredients: ['ingredient 1', 'ingredient 2', 'ingredient 3'] 
    }
  )
})

router.post('/recipe/', (req, res, next) => {
  res.json(req.body)
})

router.post('/images', (req, res, next) => {
  res.send('POST successful')
})

module.exports = router;
