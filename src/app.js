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
const { codeValidator } = require('./database/db')


app.use(express.urlencoded({ extended: false }))
app.use(express.json());
// app.use(require('./routes/emailer'))
// app.use(express.static(path.join(__dirname, 'public')));


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
    console.log("request", request)
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


    // db.createRecoveryPassword(req.body).then((result) => {
    //     res.json({ recover_code: result })
    // })


    else {
        res.status(421).json({ error: 'User does not exits' })
        console.log('error')
    }
})
// generar codigo random en la base de datos 


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



