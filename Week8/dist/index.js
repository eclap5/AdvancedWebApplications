"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
const Users_1 = __importDefault(require("./models/Users"));
const app = (0, express_1.default)();
const port = 3000;
const mongoDB = 'mongodb://127.0.0.1:27017/testdb';
app.use(express_1.default.json());
mongoose_1.default.connect(mongoDB);
mongoose_1.default.Promise = Promise;
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));
app.post('/api/user/register/', (0, express_validator_1.body)('email').isLength({ min: 3 }).trim().escape(), (0, express_validator_1.body)('username').isLength({ min: 3 }).trim().escape(), (0, express_validator_1.body)('password').isLength({ min: 8 }), async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const existingUser = await Users_1.default.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(403).json({ email: 'Email already in use.' });
        }
        const salt = bcrypt_1.default.genSaltSync(10);
        const hash = bcrypt_1.default.hashSync(req.body.password, salt);
        Users_1.default.create({
            email: req.body.email,
            username: req.body.username,
            password: hash
        });
        return res.status(201).json({ message: 'User registered successfully.' });
    }
    catch (error) {
        console.error(`Error during user registration: ${error}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.listen(port, () => { console.log(`App is running on port ${port}`); });
