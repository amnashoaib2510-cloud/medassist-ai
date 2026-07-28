import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const PatientDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/dashboard/patient");
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
      <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name} 👋</h1>
      <p className="text-slate-500 mb-8">Here's an overview of your health journey.</p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
          <p className="text-sm text-slate-500">Upcoming Appointments</p>
          <p className="text-3xl font-bold text-primary-600">
            {data?.upcomingAppointments?.length || 0}
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
          <p className="text-sm text-slate-500">Completed Appointments</p>
          <p className="text-3xl font-bold text-primary-600">
            {data?.completedAppointmentsCount || 0}
          </p>
        </motion.div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
      <div className="space-y-3">
        {data?.upcomingAppointments?.length ? (
          data.upcomingAppointments.map((appt) => (
            <div key={appt._id} className="card flex justify-between items-center">
              <div>
                <p className="font-medium">Dr. {appt.doctor?.user?.name}</p>
                <p className="text-sm text-slate-500">
                  {new Date(appt.date).toDateString()} • {appt.timeSlot}
                </p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-primary-100 text-primary-700 capitalize">
                {appt.status}
              </span>
            </div>
          ))
        ) : (
          <p className="text-slate-500">No upcoming appointments. Book one from the Doctors page!</p>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
