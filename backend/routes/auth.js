const express = require('express');
const router = express.Router();
const {
    patientSignup,
    doctorSignup,
    adminstratorSignup,
    login
} = require('../controllers/authController');

// Signup Routes
router.post('/patient/signup', patientSignup);
router.post('/doctor/signup', doctorSignup);
router.post('/adminstrator/signup', adminstratorSignup);

// Login Routes
router.post('/login', login);

module.exports = router;