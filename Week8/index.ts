import express, { Express, Request, Response } from "express"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import { ValidationError, body, validationResult, Result } from "express-validator"
import User from "./models/Users"


const app: Express = express()
const port: number = 3000
const mongoDB: string = 'mongodb://127.0.0.1:27017/testdb'

app.use(express.json())

mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: mongoose.Connection = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error'))

app.post('/api/user/register/', 
    body('email').isLength({min: 3}).trim().escape(),
    body('username').isLength({min: 3}).trim().escape(), 
    body('password').isLength({min: 8}), 
    async (req: Request, res: Response) => {
    const errors: Result<ValidationError> = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    try {
        const existingUser: typeof User | null = await User.findOne({ email: req.body.email })

        if (existingUser) {
            return res.status(403).json({ email: 'Email already in use.' })
        }

        const salt: string = bcrypt.genSaltSync(10)
        const hash: string = bcrypt.hashSync(req.body.password, salt)

        User.create({
            email: req.body.email,
            username: req.body.username,
            password: hash
        })

        return res.status(201).json({ message: 'User registered successfully.' })
    } catch (error: any) {
        console.error(`Error during user registration: ${error}`)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

app.listen(port, () => { console.log(`App is running on port ${port}`) })
