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

    if (!patientName || !phone || !doctor || !appointmentDate || !timeSlot) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ error: "Phone must be a 10-digit number" });
    }

    const [result] = await pool.query(
      "INSERT INTO appointments (patient_name, phone, doctor, appointment_date, time_slot) VALUES (?, ?, ?, ?, ?)",
      [patientName, phone, doctor, appointmentDate, timeSlot]
    );

    const [rows] = await pool.query("SELECT * FROM appointments WHERE id = ?", [result.insertId]);
    res.status(201).json(formatRow(rows[0]));
  } catch (err) {
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

    const allowedStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    if (phone && !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ error: "Phone must be a 10-digit number" });
    }

    const [check] = await pool.query("SELECT id FROM appointments WHERE id = ?", [req.params.id]);
    if (check.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    await pool.query(
      `UPDATE appointments
       SET patient_name = ?, phone = ?, doctor = ?, appointment_date = ?, time_slot = ?, status = ?
       WHERE id = ?`,
      [patientName, phone, doctor, appointmentDate, timeSlot, status, req.params.id]
    );

    const [rows] = await pool.query("SELECT * FROM appointments WHERE id = ?", [req.params.id]);
    res.json(formatRow(rows[0]));
  } catch (err) {
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
