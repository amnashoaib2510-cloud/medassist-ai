const express = require("express");
const router = express.Router();
const {
  patientDashboard,
  doctorDashboard,
  adminDashboard,
  analytics,
} = require("../controllers/dashboardController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

router.get("/patient", protect, authorize("patient"), patientDashboard);
router.get("/doctor", protect, authorize("doctor"), doctorDashboard);
router.get("/admin", protect, authorize("admin"), adminDashboard);
router.get("/analytics", protect, authorize("admin"), analytics);

module.exports = router;
