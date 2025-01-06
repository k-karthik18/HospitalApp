// services/emailService.js

const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'karthik9508.vit@gmail.com',  // Replace with your email
      pass: 'ryhz ozff myfi zzan',   // Replace with your email password
    },
  });

  const mailOptions = {
    from: 'karthik9508.vit@gmail.com',  // Replace with your email
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;