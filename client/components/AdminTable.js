"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function authFetch(url, options = {}) {
  const token = sessionStorage.getItem("adminToken") || "";
  return fetch(url, {
    ...options,
    headers: { ...(options.headers || {}), "x-admin-token": token },
  });
}

const doctors = ["Dr. Sarah Patel", "Dr. James Okafor", "Dr. Meera Nair", "Dr. Tom Chen"];
const timeSlots = [
  "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM",
  "4:00 PM", "5:00 PM",
];
const statuses = ["pending", "confirmed", "completed", "cancelled"];

function AdminPanel({ onLogout }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    setLoading(true);
    setError("");
    try {
      const res = await authFetch(`${API_URL}/api/appointments`);
      if (res.status === 401) {
        onLogout("Incorrect password or session expired.");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError("Failed to load appointments.");
        return;
      }
      setAppointments(data);
    } catch (err) {
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  function openEdit(appointment) {
    setEditing(appointment.id);
    setEditForm({
      patientName: appointment.patientName,
      phone: appointment.phone,
      doctor: appointment.doctor,
      appointmentDate: appointment.appointmentDate
        ? new Date(appointment.appointmentDate).toISOString().split("T")[0]
        : "",
      timeSlot: appointment.timeSlot,
      status: appointment.status,
    });
    setEditError("");
  }

  function closeEdit() {
    setEditing(null);
    setEditForm({});
    setEditError("");
  }

  async function handleSave() {
    if (!editForm.patientName || editForm.patientName.length < 2) {
      setEditError("Name must be at least 2 characters.");
      return;
    }
    if (!/^\d{10}$/.test(editForm.phone)) {
      setEditError("Phone must be a 10-digit number.");
      return;
    }

    setSaving(true);
    setEditError("");
    try {
      const res = await authFetch(`${API_URL}/api/appointments/${editing}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error || "Failed to update appointment.");
        return;
      }
      setAppointments(appointments.map((a) => (a.id === editing ? data : a)));
      closeEdit();
    } catch (err) {
      setEditError("Could not connect to the server.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Are you sure you want to delete this appointment?");
    if (!confirmed) return;

    try {
      const res = await authFetch(`${API_URL}/api/appointments/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        alert("Failed to delete appointment.");
        return;
      }
      setAppointments(appointments.filter((a) => a.id !== id));
    } catch (err) {
      alert("Could not connect to the server.");
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  }

  function statusBadge(status) {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return (
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[status] || "bg-gray-100 text-gray-600"}`}>
        {status}
      </span>
    );
  }

  if (loading) {
    return <p className="text-center text-gray-500 py-16">Loading appointments...</p>;
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={fetchAppointments} className="text-sm text-teal-600 hover:underline">
          Try again
        </button>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p>No appointments yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">All Appointments ({appointments.length})</h2>
        <button onClick={fetchAppointments} className="text-sm text-teal-600 hover:underline">
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Patient</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Doctor</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {appointments.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{a.patientName}</td>
                <td className="px-4 py-3 text-gray-600">{a.phone}</td>
                <td className="px-4 py-3 text-gray-600">{a.doctor}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(a.appointmentDate)}</td>
                <td className="px-4 py-3 text-gray-600">{a.timeSlot}</td>
                <td className="px-4 py-3">{statusBadge(a.status)}</td>
                <td className="px-4 py-3 flex gap-3">
                  <button
                    onClick={() => openEdit(a)}
                    className="text-teal-600 hover:underline text-xs font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="text-red-500 hover:underline text-xs font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Appointment</h3>

            {editError && (
              <p className="text-red-500 text-sm mb-3">{editError}</p>
            )}

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                <input
                  type="text"
                  value={editForm.patientName}
                  onChange={(e) => setEditForm({ ...editForm, patientName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                <select
                  value={editForm.doctor}
                  onChange={(e) => setEditForm({ ...editForm, doctor: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
                >
                  {doctors.map((doc) => (
                    <option key={doc} value={doc}>{doc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={editForm.appointmentDate}
                  onChange={(e) => setEditForm({ ...editForm, appointmentDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
                <select
                  value={editForm.timeSlot}
                  onChange={(e) => setEditForm({ ...editForm, timeSlot: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={closeEdit}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminTable() {
  const [token, setToken] = useState(null);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setToken(sessionStorage.getItem("adminToken") || "");
  }, []);

  function handleLogin(e) {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;
    sessionStorage.setItem("adminToken", value);
    setMessage("");
    setInput("");
    setToken(value);
  }

  function handleLogout(msg) {
    sessionStorage.removeItem("adminToken");
    setMessage(typeof msg === "string" ? msg : "");
    setToken("");
  }

  if (token === null) return null;

  if (!token) {
    return (
      <form
        onSubmit={handleLogin}
        className="max-w-sm mx-auto bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4"
      >
        <h2 className="text-lg font-semibold text-gray-800">Admin login</h2>
        {message && <p className="text-red-500 text-sm">{message}</p>}
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Admin password"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        <button
          type="submit"
          className="bg-teal-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-teal-700"
        >
          Sign in
        </button>
      </form>
    );
  }

  return <AdminPanel onLogout={handleLogout} />;
}
