require("dotenv").config();

const express = require("express");
const cors = require("cors");

// DATABASE

const connectDB = require("./config/db");

// ROUTES

// Authentication
const authRoutes = require("./feature/auth/auth.routes");

// Users
const userRoutes = require("./feature/users/user.model");

// Super Admin
const collegeRoutes = require("./feature/super-admin/college/college.routes");
const collegeAdminRoutes = require("./feature/super-admin/college-admin/collegeAdmin.routes");

// College Admin
const studentRoutes = require("./feature/college-admin/student/student.routes");
const recruiterRoutes = require("./feature/college-admin/recruiter/recruiter.routes");

// Recruiter
const jobRoutes = require("./feature/recruiter/job/job.routes");

// Student routes
const studentPortalRoutes = require("./feature/student/student-deshboard/student.routes");
const studentApplicationRoutes = require("./feature/student/application/application.routes");

const app = express();

// MIDDLEWARE

app.use(cors());
app.use(express.json());

// DATABASE CONNECTION

connectDB();

// API ROUTES

// User routes
app.use("/api/users", userRoutes);

// Authentication routes
app.use("/api/auth", authRoutes);

// Super Admin routes
app.use("/api/colleges", collegeRoutes);
app.use("/api/college-admins", collegeAdminRoutes);

// College Admin routes
app.use("/api/college-admin/students", studentRoutes);
app.use("/api/college-admin/recruiters", recruiterRoutes);

// Recruiter Job routes

app.use("/api/recruiter/jobs", jobRoutes);

// Student routes
app.use("/api/student", studentPortalRoutes);
app.use("/api/student/applications", studentApplicationRoutes);
// SERVER

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port 🚀🚀 ${PORT}`);
});
