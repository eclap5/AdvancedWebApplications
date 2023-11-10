var express = require('express');
var router = express.Router();

let tasks = []

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Todo' });
});

if (tasks.length === 0) {
  router.post('/', (req, res, next) => {
    let data = req.body
    tasks.push(data)
    res.json(tasks)
  })
  console.log(tasks)
} else if (tasks.length > 0) {
  router.post('/', (req, res, next) => {
    let data = req.body
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].name === data.name) {
        tasks[i].todos.push(data.todos[0])
        res.json(tasks)
      }
    }
  })
  console.log(tasks)
}

module.exports = router;
