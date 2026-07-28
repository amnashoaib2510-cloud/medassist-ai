import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const dashboardPath = user
    ? user.role === "admin"
      ? "/admin/dashboard"
      : user.role === "doctor"
      ? "/doctor/dashboard"
      : "/patient/dashboard"
    : "/";

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass sticky top-0 z-50 mx-4 mt-4 rounded-2xl px-6 py-3 flex items-center justify-between"
    >
      <Link to="/" className="text-xl font-bold text-primary-700">
        🏥 MedAssist <span className="text-primary-500">AI</span>
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to={dashboardPath} className="text-slate-700 hover:text-primary-600 font-medium">
              Dashboard
            </Link>
            {user.role === "patient" && (
              <>
                <Link to="/doctors" className="text-slate-700 hover:text-primary-600 font-medium">
                  Find Doctors
                </Link>
                <Link to="/symptom-checker" className="text-slate-700 hover:text-primary-600 font-medium">
                  Symptom Checker
                </Link>
              </>
            )}
            <span className="text-sm text-slate-500 hidden md:inline">
              {user.name} ({user.role})
            </span>
            <button onClick={handleLogout} className="btn-primary text-sm">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-slate-700 hover:text-primary-600 font-medium">
              Login
            </Link>
            <Link to="/register" className="btn-primary text-sm">
              Get Started
            </Link>
          </>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
