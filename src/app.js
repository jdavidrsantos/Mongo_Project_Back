const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 3000

const db = require('./database/db')

app.get('/users', (req, res) => {

    res.send('hello world!')
})


app.post('/register', async (req, res) => {
    const userExist = await db.userExist(req.body.email);
    if (!userExist) {
        db.createUser(req.body).then((result) => {
            res.json({ id: result })
        })
    } else {
        res.status(422).json({ error: 'user already registered' })
    }
})


app.post('/recovery-password', (req, res) => {
    res.send('login')
})


app.listen(port, () => {
    console.log(`server lister at port ${port}`)
})


app.post('/login', function (request, response) {
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