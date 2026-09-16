const express = require("express");

const {
  addRecruiter,
  getAllRecruiters,
  getRecruiterById,
  updateRecruiter,
  deleteRecruiter,
} = require("./recruiter.controller");

const authMiddleware = require("../../../shared/middleware/auth.middleware");
const isCollegeAdmin = require("../../../shared/middleware/isCollegeAdmin.middleware");

const router = express.Router();

// Only College Admin can create a recruiter
router.post("/", authMiddleware, isCollegeAdmin, addRecruiter);

router.get("/", authMiddleware, isCollegeAdmin, getAllRecruiters);

router.get("/:id", authMiddleware, isCollegeAdmin, getRecruiterById);

router.put("/:id", authMiddleware, isCollegeAdmin, updateRecruiter);

router.delete("/:id", authMiddleware, isCollegeAdmin, deleteRecruiter);

module.exports = router;
