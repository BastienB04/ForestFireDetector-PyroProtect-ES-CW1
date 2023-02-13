const nodemailer = require('nodemailer');
// const {affectedArea} = ;

function sendEmail(affectedArea){
    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: 'asthmabois@hotmail.com',
            pass: 'LucIsVenom1!'
        }
    });
    
    // Can just add groups and if statements to expand to other locations
    const area1 = ['kilaniabdal@gmail.com', 'asthmaticbois@gmail.com'];
    const area2 = ['bcb20@ic.ac.uk', 'lxj20@ic.ac.uk'];
    
    let recipients;
    if (affectedArea == 1) {
      recipients = area1;
    } else {
      recipients = area2;
    }
    
    const mailOptions = {
        from: 'asthmabois@hotmail.com',
        to: recipients.join(','),
        subject: 'Fire Alert!',
        text: 'A fire has been detected in your area. Please take necessary precautions.'
    };
    
    
        
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {
    sendEmail
}