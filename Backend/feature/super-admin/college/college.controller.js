const College = require("./college.model");

// Create College
const createCollege = async (req, res) => {
  try {
    const {
      name,
      code,
      email,
      phone,
      address,
      city,
      state,
      pinCode,
      logo,
      website,
    } = req.body;

    // Check if college already exists
    const existingCollege = await College.findOne({
      $or: [{ code }, { email }],
    });

    if (existingCollege) {
      return res.status(400).json({
        success: false,
        message: "College with this code or email already exists",
      });
    }

    // Create college
    const college = await College.create({
      name,
      code,
      email,
      phone,
      address,
      city,
      state,
      pinCode,
      logo,
      website,
    });

    res.status(201).json({
      success: true,
      message: "College created successfully",
      data: college,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create college",
      error: error.message,
    });
  }
};

// Get All Colleges
const getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: colleges.length,
      data: colleges,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch colleges",
      error: error.message,
    });
  }
};

// Get Single College
const getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    res.status(200).json({
      success: true,
      data: college,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch college",
      error: error.message,
    });
  }
};

// Update College
const updateCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "College updated successfully",
      data: college,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update college",
      error: error.message,
    });
  }
};

// Delete College
const deleteCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndDelete(req.params.id);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "College deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete college",
      error: error.message,
    });
  }
};

module.exports = {
  createCollege,
  getAllColleges,
  getCollegeById,
  updateCollege,
  deleteCollege,
};
