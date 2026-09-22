const express = require("express");

const { getAvailableJobs, getMyApplications } = require("./student.controller");
const authMiddleware = require("../../../shared/middleware/auth.middleware");
const isStudent = require("../../../shared/middleware/isStudent");

const router = express.Router();

// ==========================================
// GET AVAILABLE JOBS
// ==========================================

// Only authenticated Students can access
// available jobs.

router.get("/jobs", authMiddleware, isStudent, getAvailableJobs);
// ==========================================
// GET MY APPLICATIONS
// ==========================================

router.get("/applications", authMiddleware, isStudent, getMyApplications);
module.exports = router;
