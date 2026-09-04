const express = require("express");

const {
  createCollege,
  getAllColleges,
  getCollegeById,
  updateCollege,
  deleteCollege,
} = require("./college.controller");

const router = express.Router();

// Create College
router.post("/", createCollege);

// Get All Colleges
router.get("/", getAllColleges);

// Get Single College
router.get("/:id", getCollegeById);

// Update College
router.put("/:id", updateCollege);

// Delete College
router.delete("/:id", deleteCollege);

module.exports = router;
