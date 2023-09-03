require('dotenv').config();
const express = require('express')
const app = express();
const port = 3109;
const cors = require('cors')
const routerApi=require('./routes')
const connectToDatabase = require('./mongoose');


const corsOptions = {
    origin: 'http://127.0.0.1:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 204,
};

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.use(cors(corsOptions))
app.use(express.json())
connectToDatabase();
routerApi(app)
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
