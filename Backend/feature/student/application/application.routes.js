const express = require("express");

const { applyForJob } = require("./application.controller");

const authMiddleware = require("../../../shared/middleware/auth.middleware");
const isStudent = require("../../../shared/middleware/isStudent");

const router = express.Router();

// ==========================================
// STUDENT APPLY FOR JOB
// ==========================================

router.post("/:jobId", authMiddleware, isStudent, applyForJob);

module.exports = router;
