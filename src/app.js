require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 3000
const path = require('path')
const db = require('./database/db')
const mailer = require('./routes/emailer')
const mailerContact = require('./routes/emailContact')
const { codeValidator } = require('./database/db')


app.use(express.urlencoded({ extended: false }))
app.use(express.json());
// app.use(require('./routes/emailer'))
// app.use(express.static(path.join(__dirname, 'public')));



app.post('/api/searchAllProducts', async (req, res) => {
    const searchAllProducts = await db.searchAllProducts();
    res.json({
        searchAllProducts,
    })
})



app.post('/api/deletingproductsAPI', async (req, res) => {
    db.deletingproductsAPI();
    res.json({
        deletedAll: true,
    })
})



app.post('/api/datosAPI', async (req, res) => {
    const datosExist = await db.datosExist(req.body);
    if (datosExist !== false) {
        res.json({
            duplicatedOrError: false,
            added: true
        })
    } else {
        res.json({
            duplicatedOrError: true,
            added: false
        })
    }
})




app.post('/api/register', async (req, res) => {
    const userExist = await db.userExist(req.body.email);

    if (!userExist) {
        db.createUser(req.body).then((result) => {
            res.json({ id: result })
        })
    } else {
        res.status(422).json({ error: 'user already registered' })
    }
})



app.listen(port, () => {
    console.log(`server lister at port ${port}`)
})


app.post('/api/login', function (request, response) {
    // Capture the input fields
    let username = request.body.name;
    let password = request.body.password;
    db.login(username, password).then(result => {
        if (result !== false) {
            response.json(result)
        } else {
            response.status(422).send({ error: 'usuario no encontrado' })
        }
    })
});

app.post('/api/password_recovery', async (req, res) => {
    console.log("soy req body", req.body)
    const user = await db.getUserByEmail(req.body.email);
    console.log("soy user", user)
    if (user !== false) {
        function generateRandomIntegerInRange(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        console.log('existe, res.json')
        let code = generateRandomIntegerInRange(1000, 9999);
        db.setUserRecoverCode(user.id, code)
        mailer.sendPasswordCodeToEmail(user, code)
        res.json({
            user_id: user.id,
        })
    }
    else {
        res.status(421).json({ error: 'User does not exits' })
        console.log('error')
    }
})

app.post('/api/codeValidator', async (req, res) => {
    const password = (req.body.password);
    const user_id = (req.body.user_id);
    const code = (req.body.code);
    console.log("Soy la password copiada en front", password)
    console.log("Soy el user id en front", user_id)
    const code_Email = await db.codeValidator(code, user_id);
    if (code_Email !== false) {
        console.log("soy code", code_Email)
        db.updatePassword(user_id, password)
        res.json({
            user_id: user_id,
        })
    }
    else {
        res.status(422).json({ error: 'User does not exits' })
    }
});


app.post('/api/contact_us', async (req, res) => {
    const contact_names = (req.body.name);
    const contact_subject = (req.body.subject);
    const contact_email = (req.body.email);
    const contact_phone = (req.body.phone);
    const contact_message = (req.body.message);
    console.log("Soy el nombre copiado en front", contact_names)
    console.log("Soy el mensaje en front", contact_message)
    console.log("Soy el mensaje en front", contact_subject)
    if (contact_names !== '' && contact_email !== '' && contact_phone !== '' && contact_message !== '') {
        console.log('paso')
        mailerContact.sendPasswordCodeToEmail(contact_names, contact_subject, contact_email, contact_phone, contact_message)
        res.json({ form: true })
    }
    else {
        res.status(422).json({ error: 'Formulario no enviado' })
    }
});


app.post('/api/facebook', async (req, res) => {
    const name = (req.body.name);
    const email = (req.body.email);
    const id = (req.body.id);
    console.log("Soy el nombre copiado en front", name)
    console.log("Soy el mensaje en front", email)
    console.log("Soy el mensaje en front", id)
    const userExistFacebook = await db.userExistFacebook(id);
    if (userExistFacebook == false) {
        console.log("No existe")
        const facebook = await db.userFacebook(name, email, id);
        res.json({
            user_id: facebook,
            user_name: name,
            user_email: email,
            user_facebookID: id
        })
        console.log("no existe")
    }
    else {
        const user = await db.getUserByEmail(email);
        res.json({
            user_id: user.id,
            user_name: name,
            user_email: email,
            user_facebookID: id
        })
        console.log("ya existe")
    }
});


