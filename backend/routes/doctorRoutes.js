const express = require("express");
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  updateDoctor,
  approveDoctor,
  deleteDoctor,
} = require("../controllers/doctorController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

router.get("/", getDoctors);
router.get("/:id", getDoctorById);
router.put("/:id", protect, authorize("doctor", "admin"), updateDoctor);
router.put("/:id/approve", protect, authorize("admin"), approveDoctor);
router.delete("/:id", protect, authorize("admin"), deleteDoctor);

module.exports = router;
