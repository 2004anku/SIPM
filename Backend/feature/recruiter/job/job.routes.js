const express = require("express");

const { createJob } = require("./job.controller");

const authMiddleware = require("../../../shared/middleware/auth.middleware");
const isRecruiter = require("../../../shared/middleware/isRecruiter");

const router = express.Router();

// ==========================================
// CREATE JOB
// ==========================================
// Only authenticated and active Recruiters
// can create jobs.

router.post("/", authMiddleware, isRecruiter, createJob);

module.exports = router;
