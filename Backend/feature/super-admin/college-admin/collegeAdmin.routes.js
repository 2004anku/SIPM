const express = require("express");

const {
  createCollegeAdmin,
  getAllCollegeAdmins,
  getCollegeAdminById,
  updateCollegeAdmin,
  deleteCollegeAdmin,
} = require("./collegeAdmin.controller");

const router = express.Router();

router.post("/", createCollegeAdmin);
router.get("/", getAllCollegeAdmins);
router.get("/:id", getCollegeAdminById);
router.put("/:id", updateCollegeAdmin);
router.delete("/:id", deleteCollegeAdmin);

module.exports = router;
