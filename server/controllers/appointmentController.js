const pool = require("../db");

function formatRow(row) {
  return {
    id: row.id,
    patientName: row.patient_name,
    phone: row.phone,
    doctor: row.doctor,
    appointmentDate: row.appointment_date,
    timeSlot: row.time_slot,
    status: row.status,
    createdAt: row.created_at,
  };
}

async function createAppointment(req, res) {
  try {
    const { patientName, phone, doctor, appointmentDate, timeSlot } = req.body;

    const fields = [patientName, phone, doctor, appointmentDate, timeSlot];
    if (fields.some((f) => typeof f !== "string" || !f.trim())) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (patientName.trim().length > 100 || doctor.trim().length > 100 || timeSlot.trim().length > 20) {
      return res.status(400).json({ error: "One of the fields is too long" });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ error: "Phone must be a 10-digit number" });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(appointmentDate) || Number.isNaN(Date.parse(appointmentDate))) {
      return res.status(400).json({ error: "Invalid date" });
    }

    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    if (appointmentDate < today) {
      return res.status(400).json({ error: "Date cannot be in the past" });
    }

    const [result] = await pool.query(
      "INSERT INTO appointments (patient_name, phone, doctor, appointment_date, time_slot) VALUES (?, ?, ?, ?, ?)",
      [patientName.trim(), phone, doctor.trim(), appointmentDate, timeSlot.trim()]
    );

    const [rows] = await pool.query("SELECT * FROM appointments WHERE id = ?", [result.insertId]);
    res.status(201).json(formatRow(rows[0]));
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "This slot is already booked" });
    }
    console.error("Error creating appointment:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function getAllAppointments(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM appointments ORDER BY created_at DESC");
    res.json(rows.map(formatRow));
  } catch (err) {
    console.error("Error fetching appointments:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function getAppointmentById(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM appointments WHERE id = ?", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json(formatRow(rows[0]));
  } catch (err) {
    console.error("Error fetching appointment:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function updateAppointment(req, res) {
  try {
    const { patientName, phone, doctor, appointmentDate, timeSlot, status } = req.body;

    const fields = [patientName, phone, doctor, appointmentDate, timeSlot, status];
    if (fields.some((f) => typeof f !== "string" || !f.trim())) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const allowedStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ error: "Phone must be a 10-digit number" });
    }

    if (patientName.trim().length > 100 || doctor.trim().length > 100 || timeSlot.trim().length > 20) {
      return res.status(400).json({ error: "One of the fields is too long" });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(appointmentDate) || Number.isNaN(Date.parse(appointmentDate))) {
      return res.status(400).json({ error: "Invalid date" });
    }

    const [check] = await pool.query("SELECT id FROM appointments WHERE id = ?", [req.params.id]);
    if (check.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    await pool.query(
      `UPDATE appointments
       SET patient_name = ?, phone = ?, doctor = ?, appointment_date = ?, time_slot = ?, status = ?
       WHERE id = ?`,
      [patientName.trim(), phone, doctor.trim(), appointmentDate, timeSlot.trim(), status, req.params.id]
    );

    const [rows] = await pool.query("SELECT * FROM appointments WHERE id = ?", [req.params.id]);
    res.json(formatRow(rows[0]));
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "That slot is already booked for this doctor" });
    }
    console.error("Error updating appointment:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function deleteAppointment(req, res) {
  try {
    const [result] = await pool.query("DELETE FROM appointments WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    console.error("Error deleting appointment:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
