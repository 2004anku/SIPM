const express = require("express");

const { getAvailableJobs } = require("./student.controller");

const authMiddleware = require("../../shared/middleware/auth.middleware");
const isStudent = require("../../shared/middleware/isStudent");

const router = express.Router();

// ==========================================
// GET AVAILABLE JOBS
// ==========================================

// Only authenticated Students can access
// available jobs.

router.get("/jobs", authMiddleware, isStudent, getAvailableJobs);

module.exports = router;
