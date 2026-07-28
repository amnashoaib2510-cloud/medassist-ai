const express = require("express");
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  updateAppointment,
  cancelAppointment,
} = require("../controllers/appointmentController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

router.post("/", protect, authorize("patient"), bookAppointment);
router.get("/my", protect, getMyAppointments);
router.put("/:id", protect, authorize("doctor", "admin"), updateAppointment);
router.delete("/:id", protect, cancelAppointment);

module.exports = router;
