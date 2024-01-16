const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose')
const cors = require('cors')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const mongoDB = 'mongodb://127.0.0.1:27017/testdb'
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error'))

const app = express();

if (process.env.NODE_ENV === 'development') {
    var corsOptions = {
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200
    }
    app.use(cors(corsOptions))
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
