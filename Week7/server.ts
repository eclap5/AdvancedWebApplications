import express, { Express, NextFunction, Request, Response } from "express"
import session from "express-session"
import bcrypt from "bcrypt"
import passport from "passport"
import passportLocal from "passport-local"

const app: Express = express()
const port: number = 3000

app.use(express.json())
app.use(session({ secret: "ugDUDqgDEKvw136OkIqzuz9eW2XroQeU", resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

type User = {
    id: string,
    username: string,
    password: string
}

type TodoList = {
    id: string,
    todos: string[]
}

const users: User[] = [] 
const todos: TodoList[] = []

const localStrategy = passportLocal.Strategy

passport.use(new localStrategy((username, password, done) => {
    const user: User | undefined = users.find(user => user.username === username)
    
    if (!user) {
        console.log('User not found')
        return done(null, false)
    }

    try {
        if (bcrypt.compareSync(password, user.password)) {
            console.log(`User '${user.username}' logged in!`)
            return done(null, user)
        }
        console.log('Password incorrect')
        return done(null, false)
    } catch (error) {
        return done(error)
    }
}))

passport.serializeUser((user: Express.User, done) => {
    return done(null, (user as User).id)
})

passport.deserializeUser((id: string, done) => {
    return done(null, users.find(user => user.id === id))
})

app.post('/api/user/register', checkNotAuthenticated, (req: Request, res: Response) => {
    try {
        let newUser: User = {
            id: Date.now().toString(),
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 10)
        }
    
        if (users.find(user => user.username === newUser.username)) {
            return res.status(400).send('Username not available')
        }
    
        users.push(newUser)
        console.log(users)
        return res.status(200).json(newUser)

    } catch (error) {
        console.error(error)
        return res.status(500).send('Internal Server Error')
    }
})

app.get('/api/user/list', (req: Request, res: Response) => {
    if (users.length > 0) {
        res.json(users)
    }
})

app.post('/api/user/login', checkNotAuthenticated, (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err: Error, user: User) => {
        if (err) {
            return next(err)
        }

        if (!user) {
            return res.status(401).send('Authentication failed')
        }

        req.logIn(user, (loginErr) => {
            if (loginErr) {
                return next(loginErr)
            }
            return res.status(200).send('Login successful')
        })
    })(req, res, next)
})

app.get('/api/secret', checkAuthenticated, (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send('This is secret route')
})

app.post('/api/todos', checkAuthenticated, (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user && 'id' in req.user) {
            const loggedUserId: any = req.user.id

            let userTodoList: TodoList | undefined = todos.find(todo => todo.id === loggedUserId)
            if (!userTodoList) {
                userTodoList = {
                    id: loggedUserId,
                    todos: []
                }
                userTodoList.todos.push(req.body.todo)
                todos.push(userTodoList)
            } else {
                userTodoList.todos.push(req.body.todo)
            } 
            res.json(userTodoList)
        }
    } catch (error) {
        console.error(error)
    }
})

app.get('/api/todos/list', checkAuthenticated, (req: Request, res: Response, next: NextFunction) => {
    try {
        if (todos.length > 0) {
            res.json(todos)
        }
    } catch (error) {
        console.error(error)
    }
})

function checkAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        return next()
    }
    return res.status(401).send('Not authenticated')
}

function checkNotAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        return res.redirect('/api/secret')
    }
    return next()
}

app.listen(port, () => {console.log(`Server running on port ${port}`)})