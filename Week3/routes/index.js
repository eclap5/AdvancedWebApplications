const express = require('express');
const router = express.Router();

let tasks = []

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Todo' });
});

router.post('/', (req, res, next) => {
  if (tasks.length === 0) {
    tasks.push(req.body)
    res.json({ userActionStatus: 'User added' })
  }
  else {
    let nameFound = false
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].name === req.body.name) {
        tasks[i].todos.push(req.body.todos[0])
        res.json({ userActionStatus: 'Todo added' })
        nameFound = true
      }
    }
    if (!nameFound) {
      tasks.push(req.body)
      res.json({ userActionStatus: 'User added' })
    }
  }
  console.log(tasks)
})


router.get('/user/:id', (req, res, next) => {
  let nameFound = false
  
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].name === req.params.id) {
      res.json(tasks[i])
      nameFound = true
    }
  }
  if (!nameFound) {
    res.json({ searchStatus: 'User not found' })
  }
})

module.exports = router;
