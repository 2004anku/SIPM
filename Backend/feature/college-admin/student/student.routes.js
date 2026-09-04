const express = require("express");

const {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("./student.controller");

const router = express.Router();

router.post("/", addStudent);

router.get("/", getAllStudents);

router.get("/:id", getStudentById);

router.put("/:id", updateStudent);

router.delete("/:id", deleteStudent);

module.exports = router;
