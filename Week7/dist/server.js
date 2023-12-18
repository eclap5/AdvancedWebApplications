"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use((0, express_session_1.default)({ secret: "ugDUDqgDEKvw136OkIqzuz9eW2XroQeU", resave: false, saveUninitialized: false }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
const users = [];
const todos = [];
const localStrategy = passport_local_1.default.Strategy;
passport_1.default.use(new localStrategy((username, password, done) => {
    const user = users.find(user => user.username === username);
    if (!user) {
        console.log('User not found');
        return done(null, false);
    }
    try {
        if (bcrypt_1.default.compareSync(password, user.password)) {
            console.log(`User '${user.username}' logged in!`);
            return done(null, user);
        }
        console.log('Password incorrect');
        return done(null, false);
    }
    catch (error) {
        return done(error);
    }
}));
passport_1.default.serializeUser((user, done) => {
    return done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => {
    return done(null, users.find(user => user.id === id));
});
app.post('/api/user/register', checkNotAuthenticated, (req, res) => {
    try {
        let newUser = {
            id: Date.now().toString(),
            username: req.body.username,
            password: bcrypt_1.default.hashSync(req.body.password, 10)
        };
        if (users.find(user => user.username === newUser.username)) {
            return res.status(400).send('Username not available');
        }
        users.push(newUser);
        console.log(users);
        return res.status(200).json(newUser);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});
app.get('/api/user/list', (req, res) => {
    if (users.length > 0) {
        res.json(users);
    }
});
app.post('/api/user/login', checkNotAuthenticated, (req, res, next) => {
    passport_1.default.authenticate('local', (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send('Authentication failed');
        }
        req.logIn(user, (loginErr) => {
            if (loginErr) {
                return next(loginErr);
            }
            return res.status(200).send('Login successful');
        });
    })(req, res, next);
});
app.get('/api/secret', checkAuthenticated, (req, res, next) => {
    res.status(200).send('This is secret route');
});
app.post('/api/todos', checkAuthenticated, (req, res, next) => {
    try {
        if (req.user && 'id' in req.user) {
            const loggedUserId = req.user.id;
            let userTodoList = todos.find(todo => todo.id === loggedUserId);
            if (!userTodoList) {
                userTodoList = {
                    id: loggedUserId,
                    todos: []
                };
                userTodoList.todos.push(req.body.todo);
                todos.push(userTodoList);
            }
            else {
                userTodoList.todos.push(req.body.todo);
            }
            res.json(userTodoList);
        }
    }
    catch (error) {
        console.error(error);
    }
});
app.get('/api/todos', checkAuthenticated, (req, res, next) => {
    try {
        if (todos.length > 0) {
            res.json(todos);
        }
    }
    catch (error) {
        console.error(error);
    }
});
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).send('Not authenticated');
}
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/api/secret');
    }
    return next();
}
app.listen(port, () => { console.log(`Server running on port ${port}`); });
