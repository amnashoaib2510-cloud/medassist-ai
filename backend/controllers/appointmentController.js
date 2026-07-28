const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const sendEmail = require("../utils/sendEmail");
const { analyzeSymptoms } = require("../utils/symptomEngine");

// @desc   Book a new appointment
// @route  POST /api/appointments
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, reason, symptoms } = req.body;

    const doctor = await Doctor.findById(doctorId).populate("user", "name email");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    let symptomCheckResult = undefined;
    if (symptoms && symptoms.length > 0) {
      const result = analyzeSymptoms(symptoms);
      symptomCheckResult = {
        symptoms,
        possibleConditions: result.possibleConditions,
        recommendation: result.recommendation,
      };
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date,
      timeSlot,
      reason,
      symptomCheckResult,
    });

    // Fire-and-forget confirmation email
    sendEmail({
      to: req.user.email,
      subject: "Appointment Confirmation - MedAssist AI",
      html: `<p>Hi ${req.user.name},</p><p>Your appointment with Dr. ${doctor.user.name} on ${new Date(
        date
      ).toDateString()} at ${timeSlot} has been booked and is pending confirmation.</p>`,
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get appointments for logged-in user (patient or doctor)
// @route  GET /api/appointments/my
exports.getMyAppointments = async (req, res) => {
  try {
    let appointments;

    if (req.user.role === "patient") {
      appointments = await Appointment.find({ patient: req.user._id })
        .populate({ path: "doctor", populate: { path: "user", select: "name" } })
        .sort({ date: -1 });
    } else if (req.user.role === "doctor") {
      const doctorProfile = await Doctor.findOne({ user: req.user._id });
      appointments = await Appointment.find({ doctor: doctorProfile?._id })
        .populate("patient", "name email phone")
        .sort({ date: -1 });
    } else {
      // admin sees all
      appointments = await Appointment.find()
        .populate("patient", "name email")
        .populate({ path: "doctor", populate: { path: "user", select: "name" } })
        .sort({ date: -1 });
    }

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update appointment status (confirm / cancel / complete / reschedule)
// @route  PUT /api/appointments/:id
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    const { status, date, timeSlot, notes } = req.body;

    if (status) appointment.status = status;
    if (date) appointment.date = date;
    if (timeSlot) appointment.timeSlot = timeSlot;
    if (notes !== undefined) appointment.notes = notes;

    await appointment.save();
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Cancel appointment
// @route  DELETE /api/appointments/:id
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    appointment.status = "cancelled";
    await appointment.save();

    res.json({ message: "Appointment cancelled", appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
