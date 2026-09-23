const express = require("express");

const {
  getRecruiterApplications,
  sendInterviewCall,
  rejectApplication,
} = require("./application.controller");

const authMiddleware = require("../../../shared/middleware/auth.middleware");
const isRecruiter = require("../../../shared/middleware/isRecruiter");

const router = express.Router();

// ==========================================
// GET ALL APPLICATIONS
// ==========================================

router.get("/", authMiddleware, isRecruiter, getRecruiterApplications);

// ==========================================
// SEND INTERVIEW CALL
// ==========================================

router.patch(
  "/:applicationId/interview",
  authMiddleware,
  isRecruiter,
  sendInterviewCall,
);

// ==========================================
// REJECT APPLICATION
// ==========================================

router.patch("/:applicationId", authMiddleware, isRecruiter, rejectApplication);

module.exports = router;
