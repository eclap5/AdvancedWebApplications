import express, { Express } from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import path from 'path';
import multer, { Multer, StorageEngine } from 'multer'
import routes from "./src/routes"

dotenv.config()

const app: Express = express()
const port: number = parseInt(process.env.PORT as string) || 3000
const mongoDB: string = 'mongodb://127.0.0.1:27017/testdb'
const storage: StorageEngine = multer.memoryStorage()
const upload: Multer = multer({ storage: storage })

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '../views'))

app.use(express.static(path.join(__dirname, '../public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(upload.any())

mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: mongoose.Connection = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error'))

app.use('/', routes)

app.listen(port, () => { console.log(`App is running on port ${port}`) })

export default app