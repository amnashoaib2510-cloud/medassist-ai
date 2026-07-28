import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDoctors = async (specialization = "") => {
    setLoading(true);
    try {
      const { data } = await api.get("/doctors", {
        params: specialization ? { specialization } : {},
      });
      setDoctors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors(search);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Find a Doctor</h1>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8 max-w-md">
        <input
          className="input-field"
          placeholder="Search by specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn-primary whitespace-nowrap">
          Search
        </button>
      </form>

      {loading ? (
        <p>Loading doctors...</p>
      ) : doctors.length === 0 ? (
        <p className="text-slate-500">No doctors found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc, i) => (
            <motion.div
              key={doc._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card"
            >
              <h3 className="text-lg font-semibold">{doc.user?.name || "Doctor"}</h3>
              <p className="text-primary-600 font-medium">{doc.specialization}</p>
              <p className="text-sm text-slate-600 mt-1">
                {doc.experienceYears} years experience
              </p>
              <p className="text-sm text-slate-600">⭐ {doc.rating || "New"} ({doc.totalReviews} reviews)</p>
              <button
                onClick={() => navigate(`/book-appointment/${doc._id}`)}
                className="btn-primary w-full mt-4"
              >
                Book Appointment
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctors;
