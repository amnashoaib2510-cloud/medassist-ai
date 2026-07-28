const Doctor = require("../models/Doctor");
const User = require("../models/User");

// @desc   Get all doctors (with optional specialization filter)
// @route  GET /api/doctors
exports.getDoctors = async (req, res) => {
  try {
    const filter = {};
    if (req.query.specialization) {
      filter.specialization = new RegExp(req.query.specialization, "i");
    }

    const doctors = await Doctor.find(filter).populate(
      "user",
      "name email phone profileImage"
    );
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get single doctor
// @route  GET /api/doctors/:id
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      "user",
      "name email phone profileImage"
    );
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update doctor profile (doctor themself, or admin)
// @route  PUT /api/doctors/:id
exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Only the doctor themself or an admin can update
    if (
      req.user.role !== "admin" &&
      doctor.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const allowedUpdates = (({
      specialization,
      experienceYears,
      qualifications,
      availableDays,
      availableTimeSlots,
      consultationFee,
      bio,
    }) => ({
      specialization,
      experienceYears,
      qualifications,
      availableDays,
      availableTimeSlots,
      consultationFee,
      bio,
    }))(req.body);

    Object.keys(allowedUpdates).forEach(
      (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    const updated = await Doctor.findByIdAndUpdate(req.params.id, allowedUpdates, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Approve a doctor (admin only)
// @route  PUT /api/doctors/:id/approve
exports.approveDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete a doctor (admin only)
// @route  DELETE /api/doctors/:id
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    await Doctor.findByIdAndDelete(req.params.id);
    await User.findByIdAndDelete(doctor.user);

    res.json({ message: "Doctor removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
