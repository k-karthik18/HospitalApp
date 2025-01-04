

const db = require("../config/db"); // Correct path to db.js
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'karthik18';

// Dummy MRNs for validation
const validMRNs = ["MRN001", "MRN002", "MRN003"];

// Patient signup
const patientSignup = async (req, res) => {
  try {
    const { full_name, email, phone_number, dob, password, confirm_password } = req.body;

    if (!full_name || !email || !phone_number || !dob || !password || !confirm_password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

     // Check for duplicates in the database
     const duplicateCheckQuery = "SELECT * FROM patients WHERE email = ? OR phone_number = ?";
     const [duplicates] = await db.query(duplicateCheckQuery, [email, phone_number]);
 
     if (duplicates.length > 0) {
       return res.status(400).json({
         message: "A user with this email or phone number already exists.",
       });
     }
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = "INSERT INTO patients (full_name, email, phone_number, dob, password) VALUES (?, ?, ?, ?, ?)";
    await db.query(query, [full_name, email, phone_number, dob, hashedPassword]);

    res.status(201).json({ message: "Patient signed up successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error signing up patient", error: err.message });
  }
};

// adminstrator signup
const adminstratorSignup = async (req, res) => {
  try {
    const { full_name, email, phone_number, password, confirm_password, hospital_id } = req.body;

    if (!full_name || !email || !phone_number || !password || !confirm_password || !hospital_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
     // Check for duplicates in the database
     const duplicateCheckQuery = "SELECT * FROM adminstrators WHERE email = ? OR phone_number = ?";
     const [duplicates] = await db.query(duplicateCheckQuery, [email, phone_number]);
 
     if (duplicates.length > 0) {
       return res.status(400).json({
         message: "A user with this email or phone number already exists.",
       });
     }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = "INSERT INTO adminstrators (full_name, email, phone_number, password, hospital_id) VALUES (?, ?, ?, ?, ?)";
    await db.query(query, [full_name, email, phone_number, hashedPassword, hospital_id]);

    res.status(201).json({ message: "adminstrator signed up successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error signing up adminstrator", error: err.message });
  }
};

// Doctor signup
const doctorSignup = async (req, res) => {
  try {
    const { full_name, email, phone_number, password, confirm_password, hospital_id, medical_registration_number, specialization } = req.body;

    if (!full_name || !email || !phone_number || !password || !confirm_password || !hospital_id || !medical_registration_number) {
      return res.status(400).json({ message: "All fields are required except specialization" });
    }

    if (!validMRNs.includes(medical_registration_number)) {
      return res.status(400).json({ message: "Invalid Medical Registration Number (MRN)" });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
     // Check for duplicates in the database
     const duplicateCheckQuery = "SELECT * FROM doctors WHERE email = ? OR phone_number = ?";
     const [duplicates] = await db.query(duplicateCheckQuery, [email, phone_number]);
 
     if (duplicates.length > 0) {
       return res.status(400).json({
         message: "A user with this email or phone number already exists.",
       });
     }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = "INSERT INTO doctors (full_name, email, phone_number, password, hospital_id, medical_registration_number, specialization) VALUES (?, ?, ?, ?, ?, ?, ?)";
    await db.query(query, [full_name, email, phone_number, hashedPassword, hospital_id, medical_registration_number, specialization || null]);

    res.status(201).json({ message: "Doctor signed up successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error signing up doctor", error: err.message });
  }
};

// Login function to authenticate the user based on email or phone number
const login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ message: 'Please provide both email/phone and password' });
    }

    // Ensure consistent SELECT columns across all tables
    const userQuery = `
      SELECT id, full_name, email, phone_number, password, 'patient' AS role FROM patients WHERE email = ? OR phone_number = ?
      UNION
      SELECT id, full_name, email, phone_number, password, 'doctor' AS role FROM doctors WHERE email = ? OR phone_number = ?
      UNION
      SELECT id, full_name, email, phone_number, password, 'adminstrator' AS role FROM adminstrators WHERE email = ? OR phone_number = ?;
    `;

    const [user] = await db.query(userQuery, [emailOrPhone, emailOrPhone, emailOrPhone, emailOrPhone, emailOrPhone, emailOrPhone]);

    if (!user || user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user[0].password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Return successful login response
    res.status(200).json({
      message: 'Login successful',
      role: user[0].role, // Role is added dynamically in the query
      userId: user[0].id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error during login', error: err.message });
  }
};

module.exports = {
  patientSignup,
  adminstratorSignup,
  doctorSignup,
  login
};