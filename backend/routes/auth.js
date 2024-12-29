const express = require('express');
const router = express.Router();
const {
    patientSignup,
    doctorSignup,
    receptionistSignup,
    login
} = require('../controllers/authController');

// Signup Routes
router.post('/patient/signup', patientSignup);
router.post('/doctor/signup', doctorSignup);
router.post('/receptionist/signup', receptionistSignup);

// Login Routes
router.post('/login', login);

module.exports = router;
