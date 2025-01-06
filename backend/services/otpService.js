// services/otpService.js

const crypto = require('crypto');
const db = require('../config/db');
const sendEmail = require('./emailService');  // Importing the email service

// Generate a 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Send OTP to email
const sendOTP = async (email) => {
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);  // 10 minutes from now
  const otpExpiryFormatted = otpExpiry.toISOString().slice(0, 19).replace('T', ' ');  // Convert to 'YYYY-MM-DD HH:MM:SS'

  // Save OTP and expiry in the database (in pending_patients table)
  const query = 'UPDATE pending_patients SET otp = ?, otp_expiry = ? WHERE email = ?';
  await db.query(query, [otp, otpExpiryFormatted, email]);

  // Send OTP to the user's email
  const subject = 'Your OTP for verification';
  const text = `Your OTP is: ${otp}. It will expire in 10 minutes.`;
  await sendEmail(email, subject, text);  // Use email service here

  console.log(`OTP sent to ${email}`);
};

// Verify OTP
const verifyOTP = async (email, otp) => {
  const query = 'SELECT otp, otp_expiry FROM pending_patients WHERE email = ?';
  const [result] = await db.query(query, [email]);

  if (!result || result.length === 0) {
    return { status: 'failed', message: 'No user found for this email' };
  }

  const { otp: storedOTP, otp_expiry } = result[0];

  if (Date.now() > otp_expiry) {
    return { status: 'failed', message: 'OTP has expired' };
  }

  if (storedOTP !== otp) {
    return { status: 'failed', message: 'Invalid OTP' };
  }
 if (storedOTP === otp) {
  return { status: 'success', message: 'OTP verified successfully' };
}};

const resendOTP = async (email) => {
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);  // 10 minutes from now
    const otpExpiryFormatted = otpExpiry.toISOString().slice(0, 19).replace('T', ' '); 
  
    // Check if pending patient exists
    const query = 'SELECT * FROM pending_patients WHERE email = ?';
    const [result] = await db.query(query, [email]);
  
    if (!result || result.length === 0) {
      throw new Error('No user found for this email');
    }
  
    // Update the OTP and expiry in the database
    const updateQuery = 'UPDATE pending_patients SET otp = ?, otp_expiry = ? WHERE email = ?';
    await db.query(updateQuery, [otp, otpExpiry, email]);
  
    const subject = 'Your OTP for verification';
    const text = `Your new OTP is: ${otp}. It will expire in 10 minutes.`;
    
    // Send new OTP to the user's email
    await sendEmail(email, subject, text);
  
    console.log(`Resent OTP to ${email}`);
  };

module.exports = { sendOTP, verifyOTP, resendOTP };
