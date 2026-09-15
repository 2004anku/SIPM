const express = require("express");

const {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("./student.controller");

const authMiddleware = require("../../../shared/middleware/auth.middleware");
const isCollegeAdmin = require("../../../shared/middleware/isCollegeAdmin.middleware");

const router = express.Router();

router.post("/", authMiddleware, isCollegeAdmin, addStudent);

router.get("/", authMiddleware, isCollegeAdmin, getAllStudents);

router.get("/:id", authMiddleware, isCollegeAdmin, getStudentById);

router.put("/:id", authMiddleware, isCollegeAdmin, updateStudent);

router.delete("/:id", authMiddleware, isCollegeAdmin, deleteStudent);

module.exports = router;
