require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const crypto = require("crypto");
const pool = require("./db");

const appointmentRoutes = require("./routes/appointments");

const app = express();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000" }));
app.use(express.json({ limit: "10kb" }));

function requireAdmin(req, res, next) {
  if (req.method === "POST") return next();
  const expected = process.env.ADMIN_TOKEN || "";
  const given = req.get("x-admin-token") || "";
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  const ok = expected && a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!ok) return res.status(401).json({ error: "Unauthorized" });
  next();
}

const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skip: (req) => req.method !== "POST",
});

app.use("/api/appointments", bookingLimiter, requireAdmin, appointmentRoutes);

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
        created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_slot (doctor, appointment_date, time_slot)
      )
    `);
    console.log("MySQL connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to connect to MySQL:", err.message);
    process.exit(1);
  }
}

start();
