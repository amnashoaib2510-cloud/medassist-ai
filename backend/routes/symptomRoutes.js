const express = require("express");
const router = express.Router();
const { checkSymptoms } = require("../controllers/symptomController");
const { protect } = require("../middleware/auth");

router.post("/check", protect, checkSymptoms);

module.exports = router;
