const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'asthmabois@hotmail.com',
        pass: 'LucIsVenom1!'
    }
});

const mailOptions = {
    from: 'asthmabois@hotmail.com',
    to: 'kilaniabdal@gmail.com',
    subject: 'Fire Alert',
    text: 'A fire has been detected in your area. Please take necessary precautions.'
};
    

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});