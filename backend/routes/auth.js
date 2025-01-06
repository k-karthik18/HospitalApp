const express = require('express');
const router = express.Router();
const {
    patientSignup,
    doctorSignup,
    adminstratorSignup,
    verifyOTPRequest,
    resendOTPRequest,
    login
} = require('../controllers/authController');

// Signup Routes
router.post('/patient/signup', patientSignup);
router.post('/doctor/signup', doctorSignup);
router.post('/adminstrator/signup', adminstratorSignup);

// OTP Verification Route
router.post("/verify-otp", verifyOTPRequest);

// Resend OTP Route
router.post("/resend-otp", resendOTPRequest);

// Login Routes
router.post('/login', login);

module.exports = router;