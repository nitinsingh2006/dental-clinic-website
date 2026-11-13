"use client";

import { useState } from "react";
import { z } from "zod";

const doctors = ["Dr. Sarah Patel", "Dr. James Okafor", "Dr. Meera Nair", "Dr. Tom Chen"];

const timeSlots = [
  "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM",
  "4:00 PM", "5:00 PM",
];

const bookingSchema = z.object({
  patientName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be a valid 10-digit number"),
  doctor: z.string().min(1, "Please select a doctor"),
  appointmentDate: z.string().min(1, "Please select a date").refine((val) => {
    const selected = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today;
  }, "Date cannot be in the past"),
  timeSlot: z.string().min(1, "Please select a time slot"),
});

const defaultForm = {
  patientName: "",
  phone: "",
  doctor: "",
  appointmentDate: "",
  timeSlot: "",
};

export default function BookingForm() {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const today = new Date().toLocaleDateString("en-CA");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    setSuccess(false);

    const result = bookingSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
      setForm(defaultForm);
      setErrors({});
    } catch (err) {
      setServerError("Could not connect to the server. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="book" className="py-16 px-4 bg-teal-50">
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Book an Appointment</h2>
        <p className="text-center text-gray-500 mb-8">Fill in the form below and we will confirm your slot.</p>

        {success && (
          <div className="bg-green-100 border border-green-300 text-green-700 rounded-lg px-4 py-3 mb-6 text-sm">
            Your appointment has been booked successfully. We will get in touch with you soon.
          </div>
        )}

        {serverError && (
          <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 md:p-8 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
            <input
              type="text"
              name="patientName"
              value={form.patientName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            {errors.patientName && <p className="text-red-500 text-xs mt-1">{errors.patientName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor</label>
            <select
              name="doctor"
              value={form.doctor}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
            >
              <option value="">-- Choose a doctor --</option>
              {doctors.map((doc) => (
                <option key={doc} value={doc}>{doc}</option>
              ))}
            </select>
            {errors.doctor && <p className="text-red-500 text-xs mt-1">{errors.doctor}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date</label>
            <input
              type="date"
              name="appointmentDate"
              value={form.appointmentDate}
              onChange={handleChange}
              min={today}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            {errors.appointmentDate && <p className="text-red-500 text-xs mt-1">{errors.appointmentDate}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
            <select
              name="timeSlot"
              value={form.timeSlot}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
            >
              <option value="">-- Choose a time slot --</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
            {errors.timeSlot && <p className="text-red-500 text-xs mt-1">{errors.timeSlot}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-teal-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-60"
          >
            {submitting ? "Booking..." : "Book Appointment"}
          </button>
        </form>
      </div>
    </section>
  );
}
