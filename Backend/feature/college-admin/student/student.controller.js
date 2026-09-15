const Student = require("./student.model");
const College = require("../../super-admin/college/college.model");

// Add Student
const addStudent = async (req, res) => {
  try {
    const { name, email, phone, enrollmentNumber, course, semester } = req.body;

    // College ID comes from the authenticated College Admin
    const collegeId = req.user.collegeId;

    // Check required fields
    if (
      !name ||
      !email ||
      !phone ||
      !enrollmentNumber ||
      !course ||
      !semester
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, phone, enrollment number, course and semester are required",
      });
    }

    // Check if College Admin's college still exists
    const college = await College.findById(collegeId);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "Assigned college not found",
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
    // IMPORTANT: collegeId comes from req.user, NOT req.body
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
    console.error("Add student error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add student",
    });
  }
};

// Get All Students
const getAllStudents = async (req, res) => {
  try {
    const collegeId = req.user.collegeId;

    const students = await Student.find({
      collegeId,
    })
      .populate("collegeId", "name code")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error("Get students error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
    });
  }
};

// Get Single Student
const getStudentById = async (req, res) => {
  try {
    const collegeId = req.user.collegeId;

    const student = await Student.findOne({
      _id: req.params.id,
      collegeId,
    }).populate("collegeId", "name code email");

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
    console.error("Get student error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch student",
    });
  }
};

// Update Student
const updateStudent = async (req, res) => {
  try {
    const collegeId = req.user.collegeId;

    // Never allow College Admin to change the student's collegeId
    const { collegeId: requestedCollegeId, ...updateData } = req.body;

    const student = await Student.findOneAndUpdate(
      {
        _id: req.params.id,
        collegeId,
      },
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

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
    console.error("Update student error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update student",
    });
  }
};

// Delete Student
const deleteStudent = async (req, res) => {
  try {
    const collegeId = req.user.collegeId;

    const student = await Student.findOneAndDelete({
      _id: req.params.id,
      collegeId,
    });

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
    console.error("Delete student error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete student",
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
