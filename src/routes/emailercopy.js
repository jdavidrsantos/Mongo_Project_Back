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
        subject: 'Recuperación de clave',
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

    <div style=" font-family:Arial, Helvetica, sans-serif; font-size:12px; color:#666666; background-color:#EEEEEE;">

    <h1>Recuperación de contraseña</h1>
<ul>
    <li>   Nombre de Usuario : ${user.name}</li>
    <li>   Correo : ${user.email}</li>
</ul>
<p>Este es su código de verificación : ${code}</p>

    </div>

`
}

module.exports = { sendPasswordCodeToEmail };


