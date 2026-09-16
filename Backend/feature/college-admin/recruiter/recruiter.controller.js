const bcrypt = require("bcrypt");

const Recruiter = require("./recruiter.model");
const User = require("../../user/user.model");

// Add Recruiter
const addRecruiter = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      companyName,
      phone,
      companyWebsite,
      companyAddress,
      companyDescription,
    } = req.body;

    const { collegeId } = req.user;

    if (
      !name ||
      !email ||
      !password ||
      !companyName ||
      !phone ||
      !companyAddress
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "recruiter",
    });

    try {
      const recruiter = await Recruiter.create({
        userId: user._id,
        collegeId,
        companyName,
        phone,
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

// Get All Recruiters
const getAllRecruiters = async (req, res) => {
  try {
    const recruiters = await Recruiter.find()
      .populate("userId", "name email role")
      .populate("collegeId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: recruiters.length,
      data: recruiters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recruiters",
      error: error.message,
    });
  }
};

// Get Single Recruiter
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

    res.status(200).json({
      success: true,
      data: recruiter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recruiter",
      error: error.message,
    });
  }
};

// Update Recruiter
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

    res.status(200).json({
      success: true,
      message: "Recruiter updated successfully",
      data: recruiter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update recruiter",
      error: error.message,
    });
  }
};

// Delete Recruiter
const deleteRecruiter = async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.params.id);

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter not found",
      });
    }

    await User.findByIdAndDelete(recruiter.userId);
    await Recruiter.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Recruiter deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete recruiter",
      error: error.message,
    });
  }
};

module.exports = {
  addRecruiter,
  getAllRecruiters,
  getRecruiterById,
  updateRecruiter,
  deleteRecruiter,
};
