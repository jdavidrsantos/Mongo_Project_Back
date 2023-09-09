const express = require('express');
const jwt = require('jsonwebtoken');
const login = express.Router();
const users = require('../user/userSchema');
const { comparePassword, hashPassword} = require('../utils/bcrypt');
const userFacebook = require("../user/userFacebookSchema");
const secretKey = process.env.JWT_SECRET_KEY;
const { OAuth2Client } = require("google-auth-library")
const client = new OAuth2Client()

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
        res.json({ token, id: user._id, username: user.name, role: user.role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Invalid user and password' });
    }
});

login.post('/authenticateFacebook', async (req, res) => {
    const { username, userID, graphDomain } = req.body;
    try {
        let user = await users.findOne({ userID: userID });
        let isNewUser = false;
        if (user === null) {
            const Facebook = new userFacebook({
                name: username,
                userID: userID,
                graphDomain: graphDomain,
            });
            await Facebook.save();
            isNewUser = true;
            user = Facebook; // Set 'user' to the newly created user
        }
        const token = jwt.sign({ userId: user._id, username: user.name }, secretKey, {
            expiresIn: '1h',
        });
        res.json({ token, id: user._id, username: user.name, role: user.role, newUser: isNewUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Por favor, inténtelo de nuevo más tarde.' });
    }
});

login.post('/authenticateGoogle', async (req, res) => {
    const {access_token } = req.body;
    try {
        client.setCredentials({ access_token: access_token })
        const userinfo = await client.request({
            url: "https://www.googleapis.com/oauth2/v3/userinfo",
        });
        console.log(userinfo.data);
        res.json({ userinfo: userinfo.data });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Por favor, inténtelo de nuevo más tarde.' });
    }
});

module.exports = login;
