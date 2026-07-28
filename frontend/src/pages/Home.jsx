import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const features = [
  { icon: "📅", title: "Easy Appointment Booking", desc: "Book, reschedule, or cancel appointments with doctors in a few clicks." },
  { icon: "🤖", title: "AI Symptom Checker", desc: "Enter your symptoms and get preliminary suggestions on possible conditions." },
  { icon: "👨‍⚕️", title: "Verified Doctors", desc: "Browse doctors by specialization, experience, and ratings." },
  { icon: "📊", title: "Health Analytics", desc: "Track your appointment history and health activity over time." },
];

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
          Smart Healthcare, <span className="text-primary-600">Simplified</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
          MedAssist AI connects patients and doctors on one secure platform —
          book appointments, check symptoms, and manage your health journey.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="btn-primary text-base px-6 py-3">
            Get Started
          </Link>
          <Link to="/login" className="px-6 py-3 rounded-lg border border-primary-600 text-primary-700 font-medium hover:bg-primary-50">
            Login
          </Link>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card text-center"
          >
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
            <p className="text-sm text-slate-600">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;
