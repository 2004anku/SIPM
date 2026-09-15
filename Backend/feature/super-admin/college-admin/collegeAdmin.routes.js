const express = require("express");

const {
  createCollegeAdmin,
  getAllCollegeAdmins,
  getCollegeAdminById,
  updateCollegeAdmin,
  deleteCollegeAdmin,
} = require("./collegeAdmin.controller");

const authMiddleware = require("../../../shared/middleware/auth.middleware");
const isSuperAdmin = require("../../../shared/middleware/isSuperAdmin.middleware");

const router = express.Router();

router.post("/", authMiddleware, isSuperAdmin, createCollegeAdmin);

router.get("/", authMiddleware, isSuperAdmin, getAllCollegeAdmins);

router.get("/:id", authMiddleware, isSuperAdmin, getCollegeAdminById);

router.put("/:id", authMiddleware, isSuperAdmin, updateCollegeAdmin);

router.delete("/:id", authMiddleware, isSuperAdmin, deleteCollegeAdmin);

module.exports = router;
