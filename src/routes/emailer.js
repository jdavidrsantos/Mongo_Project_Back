require('dotenv').config();
const nodemailer = require('nodemailer');


function sendPasswordCodeToEmail(user, code) {
    const content = createTemplate(user, code)
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        requireTLS: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    //2ND
    let mailOptions = {
        from: 'ilercon.com@gmail.com',
        to: user.email,
        subject: 'Recuperacion de clave',
        html: content,
    };

    //3RD STEP
    transporter.sendMail(mailOptions, function (err, data) {
        console.log(data)
        if (err) {
            console.log('error occurs', err);
        } else {
            console.log('send!!!');
        }
    });

}

function createTemplate(user, code) {
    return `
<h1>Recuperacion de contrasena</h1>
<ul>
    <li>   Username : ${user.name}</li>
    <li>   User email : ${user.email}</li>
</ul>
<p>Este es su codigo de verificacion: ${code}</p>
`
}

module.exports = { sendPasswordCodeToEmail };


