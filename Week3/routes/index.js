const express = require('express');
const router = express.Router();

let tasks = []

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Todo' });
});

router.post('/todo', (req, res, next) => {
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

router.delete('/user/:id', (req, res, next) => {
  let userFound = false
  
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].name === req.params.id) {
      tasks.splice(i, 1)
      userFound = true
    }
  }

  if (userFound) {
    res.json({ message: 'User deleted' })
  } else {
    res.json({ message: 'User not found' })
  }
})

router.put('/user', (req, res, next) => {
  const index = tasks.findIndex(tasks => tasks.name === req.body.name)
  console.log(index)
  console.log(tasks[index].todos.indexOf(req.body.task))
  const taskIndex = tasks[index].todos.indexOf(req.body.task)

  if (tasks[index].todos[taskIndex] === req.body.task) {
    tasks[index].todos.splice(taskIndex, 1)
    res.json({ 
      message: 'Task deleted',
      userData: tasks[index]
    })
  } else {
    res.json({ message: 'User not found' })
  }
})

module.exports = router;
