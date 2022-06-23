const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 3000

const db = require('./database/db')

// app.set('view engine', 'ejs');
// app.use(express.static('public'));



// app.get('/', function (req, res) {
//     res.render('index');
// });



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



app.post('/password_recovery', async (req, res) => {
    console.log("soy req body", req.body)
    const user = await db.getUserByEmail(req.body.email);
    console.log(user)
    if (user !== false) {
        function generateRandomIntegerInRange(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        console.log('existe, res.json')

        let code = generateRandomIntegerInRange(100, 999);
        db.setUserRecoverCode(user.id, code)

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