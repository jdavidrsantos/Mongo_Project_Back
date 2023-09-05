const express = require('express');
const user = express.Router();
const users = require('./userSchema');
const { hashPassword } = require('../utils/bcrypt');



user.post('/createUser', async (req, res) => {
    const { name, password, email, role } = req.body;
    try {
        const hashedPassword = await hashPassword(password)
        await createUser( name, hashedPassword, email, role)
        res.json({ name: name,email: email, role: role });
    } catch (error) {
        res.status(500).json({ message: 'El email ya existe' });
    }
});

async function createUser( name, hashedPassword, email, role) {
    try {
        const user = new users({
            name: name,
            password: hashedPassword,
            email: email,
            role: role,
        });
        await user.save();
    } catch (error) {
        throw error;
    }
}

module.exports = user;
