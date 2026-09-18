const User = require("../../feature/users/user.model");
const Recruiter = require("../../feature/college-admin/recruiter/recruiter.model");

const isRecruiter = async (req, res, next) => {
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

    if (user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Recruiter only.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Recruiter account is inactive",
      });
    }

    if (!user.collegeId) {
      return res.status(403).json({
        success: false,
        message: "Recruiter is not assigned to a college",
      });
    }

    const recruiter = await Recruiter.findOne({
      userId: user._id,
      collegeId: user.collegeId,
      isActive: true,
    }).select("_id userId collegeId");

    if (!recruiter) {
      return res.status(403).json({
        success: false,
        message: "Recruiter profile not found or inactive",
      });
    }

    // Store recruiter information for controllers
    req.user.recruiterId = recruiter._id.toString();
    req.user.collegeId = user.collegeId.toString();

    next();
  } catch (error) {
    console.error("Recruiter authorization error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify Recruiter access",
    });
  }
};

module.exports = isRecruiter;
