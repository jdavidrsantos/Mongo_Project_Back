const express = require('express');
const jwt = require('jsonwebtoken');
const login = express.Router();
const authenticate = require('./loginSchema');
const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');

login.post('/authenticate', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await authenticate.findOne({ name: username });
        const isUserValid = user.name === username;
        if (!isUserValid) {
            return res.status(401).json({ message: 'Invalid name' });
        }
        const isPasswordValid = user.password === password;
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ userId: user._id, username: user.name }, secretKey, {
            expiresIn: '1h',
        });
        res.json({ token, id: user._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = login;
