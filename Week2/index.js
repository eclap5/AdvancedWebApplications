const express = require('express')
const app = express()
const port = 3000
let items = []

app.use(express.json())

app.get('/hello', (req, res) => {
    res.json({ msg: "Hello world" })
})

app.get('/echo/:id', (req, res) => {
    res.json({ id: req.params.id })
})

app.post('/sum', (req, res) => {
    const numbers = req.body.numbers
    console.log(numbers)
    let total = 0
    for (let i = 0; i < numbers.length; i++) {
        total += numbers[i]
    }

    res.json({ sum: total })
})

app.use(express.static('public'))

app.post('/list', (req, res) => {
    const text = req.body.text
    items.push(text)
    res.json({ list: items })
})

app.listen(port)