require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./feature/auth/auth.routes");
const userRoutes = require("./feature/user/user.model");
const collegeRoutes = require("./feature/super-admin/college/college.routes");
const collegeAdminRoutes = require("./feature/super-admin/college-admin/collegeAdmin.routes");
const studentRoutes = require("./feature/college-admin/student/student.routes");
const recruiterRoutes = require("./feature/recruiter/recruiter.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/colleges", collegeRoutes);
app.use("/api/college-admins", collegeAdminRoutes);
app.use("/api/college-admin/students", studentRoutes);
app.use("/api/recruiters", recruiterRoutes);
app.use("/api/auth", authRoutes);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port 🚀🚀 ${PORT}`);
});
