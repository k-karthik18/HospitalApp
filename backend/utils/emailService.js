
const nodemailer = require('nodemailer');

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use 'gmail' or any other email service provider
  auth: {
    user: 'karthik9508.vit@gmail.com', // Replace with your email
    pass: 'karthik9508', // Replace with your email password or app-specific password
  },
});

/**
 * Sends a verification email.
 * @param {string} email - Recipient's email address.
 * @param {string} token - Verification token.
 */
const sendVerificationEmail = async (email, token) => {
  try {
    const verificationLink = `http://localhost:3000/verify-email?token=${token}`; // Replace with your frontend URL
    const mailOptions = {
      from: 'karthik9508.vit@gmail.com', // Sender email
      to: email, // Recipient email
      subject: 'Verify Your Email',
      text: `Please verify your email by clicking the following link: ${verificationLink}`,
      html: `<p>Please verify your email by clicking the following link:</p>
             <a href="${verificationLink}">Verify Email</a>`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to', email);
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error('Email sending failed');
  }
};

module.exports = { sendVerificationEmail };
