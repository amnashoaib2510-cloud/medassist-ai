import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/dashboard/doctor");
        setData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-12">Loading dashboard...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Welcome, Dr. {user?.name} 👨‍⚕️</h1>
      <p className="text-slate-500 mb-8">Here's your practice overview for today.</p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
          <p className="text-sm text-slate-500">Today's Patients</p>
          <p className="text-3xl font-bold text-primary-600">
            {data?.todaysPatients?.length || 0}
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
          <p className="text-sm text-slate-500">Pending Appointments</p>
          <p className="text-3xl font-bold text-primary-600">
            {data?.pendingAppointmentsCount || 0}
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
          <p className="text-sm text-slate-500">Total Patients</p>
          <p className="text-3xl font-bold text-primary-600">
            {data?.totalPatientsCount || 0}
          </p>
        </motion.div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>
      <div className="space-y-3">
        {data?.todaysPatients?.length ? (
          data.todaysPatients.map((appt) => (
            <div key={appt._id} className="card flex justify-between items-center">
              <div>
                <p className="font-medium">{appt.patient?.name}</p>
                <p className="text-sm text-slate-500">{appt.timeSlot} • {appt.reason}</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-primary-100 text-primary-700 capitalize">
                {appt.status}
              </span>
            </div>
          ))
        ) : (
          <p className="text-slate-500">No patients scheduled for today.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
