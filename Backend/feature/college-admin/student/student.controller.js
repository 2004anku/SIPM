const Student = require("./student.model");
const College = require("../../super-admin/college/college.model");

// Add Student
const addStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      enrollmentNumber,
      course,
      semester,
      collegeId,
    } = req.body;

    // Check required fields
    if (
      !name ||
      !email ||
      !phone ||
      !enrollmentNumber ||
      !course ||
      !semester ||
      !collegeId
    ) {
      return res.status(400).json({
        success: false,
        message: "All student fields are required",
      });
    }

    // Check if college exists
    const college = await College.findById(collegeId);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    // Check existing student
    const existingStudent = await Student.findOne({
      $or: [{ email }, { enrollmentNumber }],
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student with this email or enrollment number already exists",
      });
    }

    // Create student
    const student = await Student.create({
      name,
      email,
      phone,
      enrollmentNumber,
      course,
      semester,
      collegeId,
    });

    res.status(201).json({
      success: true,
      message: "Student added successfully",
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add student",
      error: error.message,
    });
  }
};

// Get All Students
const getAllStudents = async (req, res) => {
  try {
    const { collegeId } = req.query;

    const filter = {};

    if (collegeId) {
      filter.collegeId = collegeId;
    }

    const students = await Student.find(filter)
      .populate("collegeId", "name code")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
      error: error.message,
    });
  }
};

// Get Single Student
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate(
      "collegeId",
      "name code email",
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch student",
      error: error.message,
    });
  }
};

// Update Student
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update student",
      error: error.message,
    });
  }
};

// Delete Student
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete student",
      error: error.message,
    });
  }
};

module.exports = {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
