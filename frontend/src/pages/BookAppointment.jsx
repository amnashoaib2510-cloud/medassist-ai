import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ date: "", timeSlot: "", reason: "" });
  const [symptoms, setSymptoms] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const symptomList = symptoms
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await api.post("/appointments", {
        doctorId,
        ...form,
        symptoms: symptomList,
      });

      setMessage("✅ Appointment booked successfully!");
      setTimeout(() => navigate("/patient/dashboard"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
        <h2 className="text-2xl font-bold mb-6">Book Appointment</h2>

        {message && (
          <div className="bg-primary-50 text-primary-700 text-sm px-4 py-2 rounded-lg mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-600">Date</label>
            <input
              type="date"
              className="input-field mt-1"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Time Slot</label>
            <input
              placeholder="e.g. 10:00 - 10:30"
              className="input-field mt-1"
              value={form.timeSlot}
              onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Reason for Visit</label>
            <textarea
              className="input-field mt-1"
              rows={3}
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">
              Symptoms (optional, comma-separated)
            </label>
            <input
              placeholder="e.g. fever, cough, headache"
              className="input-field mt-1"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default BookAppointment;
