const express = require("express");
const bodyParser = require("body-parser");
const db = require("./config/db"); // Ensure database connection is initialized
const authRoutes = require("./routes/auth");
const cors = require("cors");
const app = express();

const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api", authRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});