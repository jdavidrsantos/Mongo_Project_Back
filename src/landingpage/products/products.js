const express = require('express');
const contactUs = express.Router();
const contactUsSchema = require('./contactUsSchema');

contactUs.post('/contactus', async (req, res) => {
    const contact_names = req.body.username;
    const contact_email = req.body.email;
    const contact_phone = req.body.tel;
    const contact_message = req.body.message;
    if (contact_names !== '' && contact_email !== '' && contact_phone !== '' && contact_message !== '') {
        try {
            await contactus(contact_names,contact_email, contact_phone, contact_message);
            res.json({ send: 'success' });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Error processing the contact form' });
        }
    } else {
        res.status(422).json({ error: 'Formulario no enviado' });
    }
});

async function contactus(contact_names, contact_email, contact_phone, contact_message) {
    try {
        const contactusData = new contactUsSchema({
            name: contact_names,
            email: contact_email,
            phone: contact_phone,
            message: contact_message
        });
        await contactusData.save();
    } catch (error) {
        throw error;
    }
}
module.exports = contactUs;
