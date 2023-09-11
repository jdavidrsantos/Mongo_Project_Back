const express = require('express');
const recoverPassword = express.Router();
const UserNormal = require("../user/userSchema");
const emailRecover = require('./emailRecover')


recoverPassword.post('/recoverPassword', async (req, res) => {
    const {emailUser} = req.body;
    try {
        const user = await UserNormal.findOne({ email: emailUser });
        if (!user) {
            return res.status(401).json({ message: 'El usuario no tiene una cuenta activa' });
        }
        let code = generateRandomIntegerInRange(1000, 9999);
        emailRecover.sendPasswordCodeToEmail(user, code)
        await UserNormal.updateOne({ email: emailUser }, { $set: { recoverCode: code } });
     res.json({ send: 'Codigo enviado' });
    } catch (error) {
        res.status(500).json({ message: 'Correo inválido' });
    }
});

function generateRandomIntegerInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



module.exports = recoverPassword;
