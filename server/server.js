require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const appointmentRoutes = require("./routes/appointments");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
}));
app.use(express.json());

app.use("/api/appointments", appointmentRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Dental Clinic API is running" });
});

async function start() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id               INT AUTO_INCREMENT PRIMARY KEY,
        patient_name     VARCHAR(100)  NOT NULL,
        phone            VARCHAR(15)   NOT NULL,
        doctor           VARCHAR(100)  NOT NULL,
        appointment_date DATE          NOT NULL,
        time_slot        VARCHAR(20)   NOT NULL,
        status           ENUM('pending', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
        created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("MySQL connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MySQL:", err.message);
    process.exit(1);
  }
}

start();
