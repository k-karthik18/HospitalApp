const db = require('../config/db');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'karthik18';

const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);
    const email = decoded.email;

    // Find the pending user
    const [pendingUser] = await db.query('SELECT * FROM pending_patients WHERE email = ?', [email]);
    if (!pendingUser || pendingUser.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Move user from pending_patients to patients
    const { full_name, phone_number, dob, password } = pendingUser[0];
    const insertQuery = `
      INSERT INTO patients (full_name, email, phone_number, dob, password)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.query(insertQuery, [full_name, email, phone_number, dob, password]);

    // Remove from pending_patients
    await db.query('DELETE FROM pending_patients WHERE email = ?', [email]);

    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error verifying email', error: err.message });
  }
};

module.exports = { verifyEmail };
