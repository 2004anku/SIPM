const bcrypt = require("bcrypt");

const Recruiter = require("./recruiter.model");
const User = require("../../users/user.model");

// ==========================================
// ADD RECRUITER
// ==========================================

const addRecruiter = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      designation,
      phone,
      companyName,
      companyWebsite,
      companyAddress,
      companyDescription,
    } = req.body;

    // College Admin's college ID comes from middleware
    const { collegeId } = req.user;

    // ==========================================
    // VALIDATE REQUIRED FIELDS
    // ==========================================

    if (
      !name ||
      !email ||
      !password ||
      !designation ||
      !phone ||
      !companyName ||
      !companyAddress
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // ==========================================
    // CHECK EXISTING USER
    // ==========================================

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // ==========================================
    // HASH PASSWORD
    // ==========================================

    const hashedPassword = await bcrypt.hash(password, 10);

    // ==========================================
    // CREATE USER ACCOUNT
    // ==========================================

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "recruiter",
    });

    // ==========================================
    // CREATE RECRUITER PROFILE
    // ==========================================

    try {
      const recruiter = await Recruiter.create({
        userId: user._id,
        collegeId,

        designation,
        phone,

        companyName,
        companyWebsite,
        companyAddress,
        companyDescription,
      });

      return res.status(201).json({
        success: true,
        message: "Recruiter created successfully",
        data: recruiter,
      });
    } catch (recruiterError) {
      // Roll back User if Recruiter creation fails
      await User.findByIdAndDelete(user._id);

      throw recruiterError;
    }
  } catch (error) {
    console.error("Add Recruiter error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create recruiter",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL RECRUITERS
// ==========================================

const getAllRecruiters = async (req, res) => {
  try {
    const recruiters = await Recruiter.find()
      .populate("userId", "name email role")
      .populate("collegeId", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: recruiters.length,
      data: recruiters,
    });
  } catch (error) {
    console.error("Get Recruiters error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch recruiters",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE RECRUITER
// ==========================================

const getRecruiterById = async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.params.id)
      .populate("userId", "name email role")
      .populate("collegeId", "name");

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: recruiter,
    });
  } catch (error) {
    console.error("Get Recruiter error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch recruiter",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE RECRUITER
// ==========================================

const updateRecruiter = async (req, res) => {
  try {
    const recruiter = await Recruiter.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("userId", "name email role")
      .populate("collegeId", "name");

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Recruiter updated successfully",
      data: recruiter,
    });
  } catch (error) {
    console.error("Update Recruiter error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update recruiter",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE RECRUITER
// ==========================================

const deleteRecruiter = async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.params.id);

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter not found",
      });
    }

    // Delete linked User account
    await User.findByIdAndDelete(recruiter.userId);

    // Delete Recruiter profile
    await Recruiter.findByIdAndDelete(recruiter._id);

    return res.status(200).json({
      success: true,
      message: "Recruiter deleted successfully",
    });
  } catch (error) {
    console.error("Delete Recruiter error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete recruiter",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  addRecruiter,
  getAllRecruiters,
  getRecruiterById,
  updateRecruiter,
  deleteRecruiter,
};
