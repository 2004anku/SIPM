const bcrypt = require("bcrypt");

const User = require("../../user/user.model");
const College = require("../college/college.model");

// Create College Admin
const createCollegeAdmin = async (req, res) => {
  try {
    const { name, email, password, phone, collegeId } = req.body;

    // Check required fields
    if (!name || !email || !password || !phone || !collegeId) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, phone and collegeId are required",
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

    // Check if this college already has an admin
    const existingCollegeAdmin = await User.findOne({
      collegeId,
      role: "college_admin",
    });

    if (existingCollegeAdmin) {
      return res.status(400).json({
        success: false,
        message: "This college already has an admin",
      });
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create College Admin
    const collegeAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "college_admin",
      collegeId,
    });

    res.status(201).json({
      success: true,
      message: "College Admin created successfully",
      data: collegeAdmin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create College Admin",
      error: error.message,
    });
  }
};

// Get All College Admins
const getAllCollegeAdmins = async (req, res) => {
  try {
    const collegeAdmins = await User.find({
      role: "college_admin",
    })
      .select("-password")
      .populate("collegeId", "name code email");

    res.status(200).json({
      success: true,
      count: collegeAdmins.length,
      data: collegeAdmins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch College Admins",
      error: error.message,
    });
  }
};

// Get Single College Admin
const getCollegeAdminById = async (req, res) => {
  try {
    const collegeAdmin = await User.findOne({
      _id: req.params.id,
      role: "college_admin",
    })
      .select("-password")
      .populate("collegeId", "name code email");

    if (!collegeAdmin) {
      return res.status(404).json({
        success: false,
        message: "College Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      data: collegeAdmin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch College Admin",
      error: error.message,
    });
  }
};

// Update College Admin
const updateCollegeAdmin = async (req, res) => {
  try {
    const { password, role, collegeId, ...updateData } = req.body;

    const collegeAdmin = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        role: "college_admin",
      },
      updateData,
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!collegeAdmin) {
      return res.status(404).json({
        success: false,
        message: "College Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "College Admin updated successfully",
      data: collegeAdmin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update College Admin",
      error: error.message,
    });
  }
};

// Delete College Admin
const deleteCollegeAdmin = async (req, res) => {
  try {
    const collegeAdmin = await User.findOneAndDelete({
      _id: req.params.id,
      role: "college_admin",
    });

    if (!collegeAdmin) {
      return res.status(404).json({
        success: false,
        message: "College Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "College Admin deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete College Admin",
      error: error.message,
    });
  }
};

module.exports = {
  createCollegeAdmin,
  getAllCollegeAdmins,
  getCollegeAdminById,
  updateCollegeAdmin,
  deleteCollegeAdmin,
};
