import express, { Request, Response, Router } from "express"
import bcrypt from "bcrypt"
import { ValidationError, validationResult, Result } from "express-validator"
import jwt, {JwtPayload} from "jsonwebtoken"
import { User, IUser } from "../models/Users"
import { validateToken } from "../middleware/validateToken"
import { validateEmail, validatePassword } from "../validators/inputValidation"
import { Todo, ITodo } from "../models/Todo"


const router: Router = express.Router()

router.get('/', (req: Request, res: Response) => {
    res.render('layout')
})

router.get('/register.html', (req: Request, res: Response) => {
    res.render('register')
})

router.post('/register', 
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

        await User.create({
            email: req.body.email,
            password: hash
        })

        return res.status(200).json({ message: 'User registered successfully.' })
    } catch (error: any) {
        console.error(`Error during user registration: ${error}`)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/login.html', (req: Request, res: Response) => {
    res.render('login')
})

router.post('/login', 
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
        return res.status(401).json({ message:'Invalid password' })
    } catch (error: any) {
        console.error(`Error during user login: ${error}`)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.post('/api/todos', validateToken, async (req: Request, res: Response) => {
    try {
        const existingTodoList: ITodo | null = await Todo.findOne({ user: (req.user as {_id: string})._id })

        if (existingTodoList) {
            for (let i: number = 0; i < req.body.items.length; i++) {
                existingTodoList.items.push(req.body.items[i])
            }
            await existingTodoList.save()
        } else {
            await Todo.create({
                user: (req.user as { _id: string })._id,
                items: req.body.items
            })
        }
        return res.status(200).send('ok')

    } catch (error: any) {
        console.error(`Error while adding todos: ${error}`)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

export default router
