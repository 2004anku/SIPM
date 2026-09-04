const express = require("express");

const {
  addRecruiter,
  getAllRecruiters,
  getRecruiterById,
  updateRecruiter,
  deleteRecruiter,
} = require("./recruiter.controller");

const router = express.Router();

router.post("/", addRecruiter);

router.get("/", getAllRecruiters);

router.get("/:id", getRecruiterById);

router.put("/:id", updateRecruiter);

router.delete("/:id", deleteRecruiter);

module.exports = router;
