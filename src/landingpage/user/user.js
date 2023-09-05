const express = require('express');
const user = express.Router();
const users = require('./userSchema');



user.post('/createUser', async (req, res) => {
    const { name, password, email, role } = req.body;
    try {
        await createUser( name, password, email, role)
        res.json({ user: 'El usuario fue creado' });
    } catch (error) {
        res.status(500).json({ message: 'El email ya existe' });
    }
});

async function createUser( name, password, email, role) {
    try {
        const user = new users({
            name: name,
            password: password,
            email: email,
            role: role,
        });
        await user.save();
    } catch (error) {
        throw error;
    }
}

module.exports = user;
