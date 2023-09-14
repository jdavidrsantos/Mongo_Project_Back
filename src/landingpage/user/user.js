const express = require('express');
const user = express.Router();
const UserNormal = require('./userSchema');
const userFacebook = require('./userFacebookSchema');
const userGoogle = require("../user/userGoogleSchema");
const { OAuth2Client } = require("google-auth-library")
const client = new OAuth2Client()
const { hashPassword } = require('../utils/bcrypt');
const counterModel = require('./counterSchema');

user.post('/createUser', async (req, res) => {
    const { name, password, email } = req.body;
    try {
        const hashedPassword = await hashPassword(password);
         const newUser = new UserNormal({
             name: name,
             password: hashedPassword,
             email: email,
         });
         await newUser.save();
        const seq = await incrementSequence();
        newUser.seq = seq;
        await newUser.save();
         res.json({ username: newUser.name, email: newUser.email, role: newUser.role });
     } catch (error) {
         if (error.code === 11000) {
             res.status(400).json({message: `${email} ya estas registrad@`});
         } else {
             res.status(500).json({ message: 'Error creating user: ' + error.message });
        }
}
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
        const seq = await incrementSequence();
        Facebook.seq = seq;
        await Facebook.save();
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
                emailGoogle: userinfo.data.email,
                emailVerified: userinfo.data.email_verified
            });
            await Google.save();
        const seq = await incrementSequence();
        Google.seq = seq;
        await Google.save();
        res.json({ username: Google.name, role: Google.role });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({message: `${userinfo.data.name} ya estas registrad@`});
        } else {
            res.status(500).json({ message: 'Error creating user: ' + error.message });
        }}
});
async function incrementSequence() {
    const countersCollection = counterModel.collection;
    let sequenceDocument = await countersCollection.findOne({ id: 'users_seq' });
    if (!sequenceDocument) {
        await countersCollection.insertOne({ id: 'users_seq', seq: 1 });
        return 1;
    } else {
        await countersCollection.updateOne({ id: 'users_seq' }, { $inc: { seq: 1 } });
        sequenceDocument = await countersCollection.findOne({ id: 'users_seq' });
    }
    return sequenceDocument.seq;
}

module.exports = user;
