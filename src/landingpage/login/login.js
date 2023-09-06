const express = require('express');
const jwt = require('jsonwebtoken');
const login = express.Router();
const users = require('../user/userSchema');
const { comparePassword } = require('../utils/bcrypt');
const secretKey = process.env.JWT_SECRET_KEY;

login.post('/authenticate', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await users.findOne({ email: username });
        const isUserValid = user.email === username;
        if (!isUserValid) {
            return res.status(401).json({ message: 'Invalid name' });
        }
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ userId: user._id, username: user.name }, secretKey, {
            expiresIn: '1h',
        });
        res.json({ token, id: user._id, username: user.name });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Invalid user and password' });
    }
});

module.exports = login;
