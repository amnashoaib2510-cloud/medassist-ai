# 🏥 MedAssist AI – Smart Health Appointment & Symptom Management System

A full-stack MERN web application that helps patients book appointments with
doctors, manage their medical history, and get preliminary health suggestions
based on symptoms. Includes secure role-based dashboards for **Patients**,
**Doctors**, and **Admins**.

---

## ✨ Features

- 🔐 **Authentication** — Register/Login, JWT auth, bcrypt password hashing, forgot/reset password
- 👨‍⚕️ **Doctor Management** — Profiles, specializations, experience, ratings, availability
- 📅 **Appointment Booking** — Book, cancel, reschedule, view history
- 🤖 **AI Symptom Checker** — Rule-based engine suggesting possible conditions + specialist recommendation (upgradeable to OpenAI/ML later)
- 📊 **Role-based Dashboards** — Separate views for Patient, Doctor, and Admin
- 📈 **Analytics** — Daily appointments, monthly patient growth, popular doctors (Recharts)
- 📧 **Email Notifications** — Appointment confirmations via Nodemailer
- 📱 **Responsive UI** — Tailwind CSS + Framer Motion with a glassmorphism design

---

## 🛠 Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Axios, React Router, Recharts, Framer Motion
**Backend:** Node.js, Express.js, JWT, bcryptjs, Nodemailer
**Database:** MongoDB Atlas (Mongoose)

---

## 📂 Project Structure

```
medassist-ai/
├── backend/
│   ├── config/         # DB connection
│   ├── models/         # User, Doctor, Appointment schemas
│   ├── middleware/      # auth (JWT) & role-based access
│   ├── controllers/     # business logic
│   ├── routes/          # API endpoints
│   ├── utils/           # email sender, rule-based symptom engine
│   └── server.js
└── frontend/
    └── src/
        ├── api/          # axios instance with JWT interceptor
        ├── context/      # AuthContext (global auth state)
        ├── components/   # Navbar, ProtectedRoute
        └── pages/        # Home, Login, Register, Dashboards, etc.
```

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in your Mongo URI, JWT secret, email creds
npm run dev
```

Backend runs at `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` (Vite dev server proxies `/api` to the backend)

### 3. Environment Variables (`backend/.env`)

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:5173
```

> Note: MongoDB Atlas, and Nodemailer email credentials are required for the
> app to fully function (auth, password reset emails, appointment
> confirmations). Without these, the AI Symptom Checker and general routing
> still work, but data persistence requires a live database connection.

---

## 🧪 Test Accounts (after registering)

Register with role `patient` or `doctor` from the Register page. To create an
`admin` account, register a normal user then manually update their `role`
field to `"admin"` in MongoDB Atlas (no public admin signup, by design, for security).

---

## 🤖 About the AI Symptom Checker

The symptom checker currently uses a **transparent, rule-based matching
engine** (`backend/utils/symptomEngine.js`) that maps common symptom
combinations to possible conditions and a recommended specialist. This keeps
the MVP fast, dependency-free, and fully explainable.

It's designed to be a drop-in replacement point: swap the internals of
`analyzeSymptoms()` with a call to the OpenAI API or a trained ML model
without touching the controller or frontend.

---

## 📌 Disclaimer

This project is for educational/portfolio purposes. The AI Symptom Checker
does **not** provide medical diagnoses — it only offers preliminary,
non-binding suggestions. Always consult a licensed medical professional.

---

## 📄 License

MIT — free to use for learning and portfolio purposes.
