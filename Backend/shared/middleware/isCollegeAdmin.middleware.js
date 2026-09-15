const User = require("../../feature/user/user.model");

const isCollegeAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await User.findById(req.user.userId).select(
      "_id role collegeId isActive",
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "college_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. College Admin only.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "College Admin account is inactive",
      });
    }

    if (!user.collegeId) {
      return res.status(403).json({
        success: false,
        message: "College Admin is not assigned to a college",
      });
    }

    // Store fresh user information for the next middleware/controller
    req.user.collegeId = user.collegeId.toString();

    next();
  } catch (error) {
    console.error("College Admin authorization error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify College Admin access",
    });
  }
};

module.exports = isCollegeAdmin;
