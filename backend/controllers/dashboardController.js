const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const User = require("../models/User");

// @desc   Patient dashboard summary
// @route  GET /api/dashboard/patient
exports.patientDashboard = async (req, res) => {
  try {
    const upcoming = await Appointment.find({
      patient: req.user._id,
      status: { $in: ["pending", "confirmed"] },
      date: { $gte: new Date() },
    })
      .populate({ path: "doctor", populate: { path: "user", select: "name" } })
      .sort({ date: 1 });

    const completed = await Appointment.find({
      patient: req.user._id,
      status: "completed",
    }).countDocuments();

    res.json({
      upcomingAppointments: upcoming,
      completedAppointmentsCount: completed,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Doctor dashboard summary
// @route  GET /api/dashboard/doctor
exports.doctorDashboard = async (req, res) => {
  try {
    const doctorProfile = await Doctor.findOne({ user: req.user._id });
    if (!doctorProfile) return res.status(404).json({ message: "Doctor profile not found" });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaysPatients = await Appointment.find({
      doctor: doctorProfile._id,
      date: { $gte: startOfDay, $lte: endOfDay },
    }).populate("patient", "name email phone");

    const pendingAppointments = await Appointment.countDocuments({
      doctor: doctorProfile._id,
      status: "pending",
    });

    const totalPatients = await Appointment.distinct("patient", {
      doctor: doctorProfile._id,
    });

    res.json({
      todaysPatients,
      pendingAppointmentsCount: pendingAppointments,
      totalPatientsCount: totalPatients.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Admin dashboard summary
// @route  GET /api/dashboard/admin
exports.adminDashboard = async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments();
    const totalPatients = await User.countDocuments({ role: "patient" });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const appointmentsToday = await Appointment.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    res.json({
      totalDoctors,
      totalPatients,
      appointmentsToday,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Analytics data for charts
// @route  GET /api/dashboard/analytics
exports.analytics = async (req, res) => {
  try {
    // Appointments grouped by day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyAppointments = await Appointment.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Monthly patient registrations (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyPatients = await User.aggregate([
      { $match: { role: "patient", createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Most popular doctors by appointment count
    const popularDoctors = await Appointment.aggregate([
      { $group: { _id: "$doctor", appointmentCount: { $sum: 1 } } },
      { $sort: { appointmentCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "doctors",
          localField: "_id",
          foreignField: "_id",
          as: "doctorInfo",
        },
      },
      { $unwind: "$doctorInfo" },
    ]);

    res.json({ dailyAppointments, monthlyPatients, popularDoctors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
