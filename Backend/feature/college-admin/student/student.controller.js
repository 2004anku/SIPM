const bcrypt = require("bcrypt");

const Student = require("./student.model");
const User = require("../../users/user.model");
const College = require("../../super-admin/college/college.model");

// ============================================================
// Add Student
// ============================================================

const addStudent = async (req, res) => {
  try {
    const { name, email, phone, enrollmentNumber, course, semester } = req.body;

    const collegeId = req.user.collegeId;

    // --------------------------------------------------------
    // Check required fields
    // --------------------------------------------------------

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

    const normalizedEmail = email.toLowerCase().trim();

    // --------------------------------------------------------
    // Check if College Admin's college still exists
    // --------------------------------------------------------

    const college = await College.findById(collegeId);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "Assigned college not found",
      });
    }

    // --------------------------------------------------------
    // Check if student profile already exists
    // --------------------------------------------------------

    const existingStudent = await Student.findOne({
      $or: [{ email: normalizedEmail }, { enrollmentNumber }],
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student with this email or enrollment number already exists",
      });
    }

    // --------------------------------------------------------
    // Check if login account already exists
    // --------------------------------------------------------

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user account with this email already exists",
      });
    }

    // --------------------------------------------------------
    // Create User login account
    // --------------------------------------------------------

    const defaultPassword = "123456";

    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "student",
      collegeId,
      isActive: true,
    });

    // --------------------------------------------------------
    // Create Student profile
    // --------------------------------------------------------

    try {
      const student = await Student.create({
        name,
        email: normalizedEmail,
        phone,
        enrollmentNumber,
        course,
        semester,
        collegeId,
      });

      const studentData = student.toObject();

      // Never send password in API response
      delete studentData.password;

      return res.status(201).json({
        success: true,
        message: "Student added successfully. Default password is 123456.",
        data: studentData,
      });
    } catch (studentError) {
      // ------------------------------------------------------
      // Roll back User if Student creation fails
      // ------------------------------------------------------

      await User.findByIdAndDelete(user._id);

      throw studentError;
    }
  } catch (error) {
    console.error("Add student error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Student with this email or enrollment number already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to add student",
    });
  }
};

// ============================================================
// Get All Students
// ============================================================

const getAllStudents = async (req, res) => {
  try {
    const collegeId = req.user.collegeId;

    const students = await Student.find({
      collegeId,
    })
      .select("-password")
      .populate("collegeId", "name code")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error("Get students error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch students",
    });
  }
};

// ============================================================
// Get Single Student
// ============================================================

const getStudentById = async (req, res) => {
  try {
    const collegeId = req.user.collegeId;

    const student = await Student.findOne({
      _id: req.params.id,
      collegeId,
    })
      .select("-password")
      .populate("collegeId", "name code email");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Get student error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch student",
    });
  }
};

// ============================================================
// Update Student
// ============================================================

const updateStudent = async (req, res) => {
  try {
    const collegeId = req.user.collegeId;

    // College Admin cannot change these fields
    const {
      collegeId: requestedCollegeId,
      password,
      email,
      ...updateData
    } = req.body;

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
    )
      .select("-password")
      .populate("collegeId", "name code email");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    console.error("Update student error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update student",
    });
  }
};

// ============================================================
// Delete Student
// ============================================================

const deleteStudent = async (req, res) => {
  try {
    const collegeId = req.user.collegeId;

    // --------------------------------------------------------
    // Find student belonging to this college
    // --------------------------------------------------------

    const student = await Student.findOne({
      _id: req.params.id,
      collegeId,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // --------------------------------------------------------
    // Delete Student profile
    // --------------------------------------------------------

    await Student.findByIdAndDelete(student._id);

    // --------------------------------------------------------
    // Delete corresponding User login account
    // --------------------------------------------------------

    await User.findOneAndDelete({
      email: student.email,
      role: "student",
      collegeId,
    });

    return res.status(200).json({
      success: true,
      message: "Student and login account deleted successfully",
    });
  } catch (error) {
    console.error("Delete student error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete student",
    });
  }
};

// ============================================================
// Export Controllers
// ============================================================

module.exports = {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
