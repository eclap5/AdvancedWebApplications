import express, { Express, Request, Response } from "express"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import { ValidationError, validationResult, Result } from "express-validator"
import jwt, {JwtPayload} from "jsonwebtoken"
import dotenv from "dotenv"
import { User, IUser } from "./src/models/Users"
import { validateToken } from "./src/middleware/validateToken"
import { validateEmail, validatePassword } from "./src/validators/inputValidation"

dotenv.config()

const app: Express = express()
const port: number = parseInt(process.env.PORT as string) || 3000
const mongoDB: string = 'mongodb://127.0.0.1:27017/testdb'

app.use(express.json())

mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: mongoose.Connection = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error'))

app.post('/api/user/register', 
    validateEmail, validatePassword,
    async (req: Request, res: Response) => {
    const errors: Result<ValidationError> = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const existingUser: IUser | null = await User.findOne({ email: req.body.email })

        if (existingUser) {
            return res.status(403).json({ email: 'Email already in use.' })
        }

        const salt: string = bcrypt.genSaltSync(10)
        const hash: string = bcrypt.hashSync(req.body.password, salt)

        User.create({
            email: req.body.email,
            password: hash
        })

        return res.status(200).json({ message: 'User registered successfully.' })
    } catch (error: any) {
        console.error(`Error during user registration: ${error}`)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

app.post('/api/user/login', 
    validateEmail, 
    async (req: Request, res: Response) => {
    try {
        const user: IUser | null = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.status(403).json({ message: 'Login failed' })
        }
        
        if (bcrypt.compareSync(req.body.password, user.password)) {
            const jwtPayload: JwtPayload = {
                id: user._id,
                email: user.email
            }
            const token: string = jwt.sign(jwtPayload, process.env.SECRET as string, { expiresIn: '30m' })
            return res.json({ success: true, token })
        }
        return res.send('Invalid password')
    } catch (error: any) {
        console.error(`Error during user login: ${error}`)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

app.get('/api/private', validateToken, (req: Request, res: Response) => {
    res.json({ email: (req.user as { email: string }).email })
})

app.listen(port, () => { console.log(`App is running on port ${port}`) })
