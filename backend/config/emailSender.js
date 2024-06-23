const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any other email service
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

// Function to send an email
 async function sendEmail(toEmail,subject_text,text_text) {

  const mailOptions = {
    from: process.env.EMAIL,
    to: toEmail,
    subject: subject_text,
    text: text_text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Email sent: ' + info.response);
  });
}

// Export the sendEmail function
module.exports = sendEmail;
