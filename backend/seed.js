require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Doctor = require("./models/Doctor");

const sampleDoctors = [
  {
    name: " Ayesha Khan",
    email: "ayesha.khan@medassist.com",
    password: "doctor123",
    phone: "03001234567",
    specialization: "Cardiologist",
    experienceYears: 8,
    bio: "Specialist in heart-related conditions with 8 years of clinical experience.",
    consultationFee: 2000,
  },
  {
    name: " Bilal Ahmed",
    email: "bilal.ahmed@medassist.com",
    password: "doctor123",
    phone: "03011234567",
    specialization: "Dermatologist",
    experienceYears: 6,
    bio: "Expert in skin, hair, and nail conditions.",
    consultationFee: 1500,
  },
  {
    name: " Sana Malik",
    email: "sana.malik@medassist.com",
    password: "doctor123",
    phone: "03021234567",
    specialization: "General Physician",
    experienceYears: 10,
    bio: "General health consultations and preventive care.",
    consultationFee: 1000,
  },
  {
    name: " Usman Tariq",
    email: "usman.tariq@medassist.com",
    password: "doctor123",
    phone: "03031234567",
    specialization: "Neurologist",
    experienceYears: 12,
    bio: "Specialist in nervous system disorders including migraines and headaches.",
    consultationFee: 2500,
  },
  {
    name: " Hina Raza",
    email: "hina.raza@medassist.com",
    password: "doctor123",
    phone: "03041234567",
    specialization: "Pediatrician",
    experienceYears: 7,
    bio: "Child healthcare specialist from infancy through adolescence.",
    consultationFee: 1800,
  },
  {
    name: " Omar Farooq",
    email: "omar.farooq@medassist.com",
    password: "doctor123",
    phone: "03051234567",
    specialization: "Gastroenterologist",
    experienceYears: 9,
    bio: "Expert in digestive system and gastrointestinal conditions.",
    consultationFee: 2200,
  },
  {
    name: " Areeba",
    email: "areeba@medassist.com",
    password: "doctor123",
    phone: "03061234567",
    specialization: "Dietitian",
    experienceYears: 5,
    bio: "Nutrition and diet planning specialist for healthy living.",
    consultationFee: 1200,
  },
  {
    name: " Saleha Shoaib",
    email: "saleha.shoaib@medassist.com",
    password: "doctor123",
    phone: "03071234567",
    specialization: "General Physician",
    experienceYears: 6,
    bio: "General health consultations and preventive care.",
    consultationFee: 1000,
  },
];

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    for (const doc of sampleDoctors) {
      const existing = await User.findOne({ email: doc.email });
      if (existing) {
        console.log(`Skipping ${doc.name} - already exists`);
        continue;
      }

      const user = await User.create({
        name: doc.name,
        email: doc.email,
        password: doc.password,
        role: "doctor",
        phone: doc.phone,
      });

      const doctorProfile = await Doctor.create({
        user: user._id,
        specialization: doc.specialization,
        experienceYears: doc.experienceYears,
        bio: doc.bio,
        consultationFee: doc.consultationFee,
        isApproved: true,
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        totalReviews: Math.floor(Math.random() * 40) + 5,
      });

      user.doctorProfile = doctorProfile._id;
      await user.save();

      console.log(`Created: ${doc.name} (${doc.specialization})`);
    }

    console.log("\nSeeding complete!");
    console.log("All doctor accounts use password: doctor123");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDoctors();