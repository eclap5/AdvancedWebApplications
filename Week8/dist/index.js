"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const Users_1 = require("./src/models/Users");
const validateToken_1 = require("./src/middleware/validateToken");
const inputValidation_1 = require("./src/validators/inputValidation");
const Todo_1 = require("./src/models/Todo");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT) || 3000;
const mongoDB = 'mongodb://127.0.0.1:27017/testdb';
app.use(express_1.default.json());
mongoose_1.default.connect(mongoDB);
mongoose_1.default.Promise = Promise;
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));
app.post('/api/user/register', inputValidation_1.validateEmail, inputValidation_1.validatePassword, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const existingUser = await Users_1.User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(403).json({ email: 'Email already in use.' });
        }
        const salt = bcrypt_1.default.genSaltSync(10);
        const hash = bcrypt_1.default.hashSync(req.body.password, salt);
        await Users_1.User.create({
            email: req.body.email,
            password: hash
        });
        return res.status(200).json({ message: 'User registered successfully.' });
    }
    catch (error) {
        console.error(`Error during user registration: ${error}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/api/user/login', inputValidation_1.validateEmail, async (req, res) => {
    try {
        const user = await Users_1.User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(403).json({ message: 'Login failed' });
        }
        if (bcrypt_1.default.compareSync(req.body.password, user.password)) {
            const jwtPayload = {
                id: user._id,
                email: user.email
            };
            const token = jsonwebtoken_1.default.sign(jwtPayload, process.env.SECRET, { expiresIn: '30m' });
            return res.json({ success: true, token });
        }
        return res.send('Invalid password');
    }
    catch (error) {
        console.error(`Error during user login: ${error}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/api/private', validateToken_1.validateToken, (req, res) => {
    res.json({ email: req.user.email });
});
app.post('/api/todos', validateToken_1.validateToken, async (req, res) => {
    try {
        const existingTodoList = await Todo_1.Todo.findOne({ user: req.user._id });
        if (existingTodoList) {
            for (let i = 0; i < req.body.items.length; i++) {
                existingTodoList.items.push(req.body.items[i]);
            }
            await existingTodoList.save();
        }
        else {
            await Todo_1.Todo.create({
                user: req.user._id,
                items: req.body.items
            });
        }
        return res.status(200).send('ok');
    }
    catch (error) {
        console.error(`Error while adding todos: ${error}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.listen(port, () => { console.log(`App is running on port ${port}`); });
