const nodemailer = require('nodemailer');


function sendPasswordCodeToEmail(name, subject, email, phone, message) {
    const content = createTemplate(name, subject, email, phone, message)
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
        to: 'ilercon.com@gmail.com',
        subject: 'Contacto',
        html: content,
    };

    //3RD STEP
    transporter.sendMail(mailOptions, function (err, data) {
        console.log(data)
        if (err) {
            console.log('error occured', err);
        } else {
            console.log('send!!!');
        }
    });

}

function createTemplate(name, subject, email, phone, message) {
    return `
<h1>Nueva Solicitud Contacto</h1>
<ul>
    <li>   Nombre : ${name}</li>
    <li>   Asunto : ${subject}</li>
    <li>   Correo : ${email}</li>
    <li>   Telefono : ${phone}</li>
    <li>   Mensaje : ${message}</li>
</ul>

`
}
module.exports = { sendPasswordCodeToEmail };


