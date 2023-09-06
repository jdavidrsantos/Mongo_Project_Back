const express = require('express');
const user = express.Router();
const User = require('./userSchema');

const { hashPassword } = require('../utils/bcrypt');

user.post('/createUser', async (req, res) => {
    const { name, password, email, role } = req.body;
    try {
        const hashedPassword = await hashPassword(password);

        const newUser = new User({
            name: name,
            password: hashedPassword,
            email: email,
            role: role,
        });
        await newUser.save();
        res.json({ name: name, email: email, role: role });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Email address is already in use.' });
        } else {
            res.status(500).json({ message: 'Error creating user: ' + error.message });
        }}
});

module.exports = user;
