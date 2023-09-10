const express = require('express');
const user = express.Router();
const UserNormal = require('./userSchema');
const userFacebook = require('./userFacebookSchema');
const userGoogle = require("../user/userGoogleSchema");
const { OAuth2Client } = require("google-auth-library")
const client = new OAuth2Client()

const { hashPassword } = require('../utils/bcrypt');
const users = require("./userSchema");

user.post('/createUser', async (req, res) => {
    const { name, password, email } = req.body;
    console.log(req.body)
    try {
        const hashedPassword = await hashPassword(password);
        const newUser = new UserNormal({
            name: name,
            password: hashedPassword,
            email: email,
        });
        await newUser.save();
        let user = newUser
        res.json({ username: user.name, email: user.email, role: user.role });
    } catch (error) {
        console.log('Error creating user: ', error);
        if (error.code === 11000) {
            res.status(400).json({message: `${email} ya estas registrad@`});
        } else {
            res.status(500).json({ message: 'Error creating user: ' + error.message });
        }}
});


user.post('/createUserFacebook', async (req, res) => {
    const { name, userID, graphDomain } = req.body;
    try {
        const Facebook = new userFacebook({
            name: name,
            userID: userID,
            graphDomain: graphDomain,
        });
        await Facebook.save();
       const user=Facebook
        res.json({ username: user.name, role: user.role });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({message: `${name} ya estas registrad@`});
        } else {
            res.status(500).json({ message: 'Error creating user: ' + error.message });
        }}
});

user.post('/createUserGoogle', async (req, res) => {
    const {access_token} = req.body;
    client.setCredentials({ access_token: access_token })
    const userinfo = await client.request({
        url: "https://www.googleapis.com/oauth2/v3/userinfo",
    });
    try {
                const Google = new userGoogle({
                name: userinfo.data.name,
                userID: userinfo.data.sub,
                picture: userinfo.data.picture,
                email: userinfo.data.email,
                emailVerified: userinfo.data.email_verified
            });
            await Google.save();
            const user=Google
        res.json({ username: user.name, role: user.role });
    } catch (error) {
        if (error.code === 11000) {
            let user = await users.findOne({ userID: userinfo.data.sub});
            res.status(400).json({message: `${user.name} ya estas registrad@`});
        } else {
            res.status(500).json({ message: 'Error creating user: ' + error.message });
        }}
});

module.exports = user;
