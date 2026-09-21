const Job = require("../recruiter/job/job.model");
const User = require("../users/user.model");

// ==========================================
// GET AVAILABLE JOBS FOR STUDENT
// ==========================================

const getAvailableJobs = async (req, res) => {
  try {
    // ==========================================
    // GET LOGGED-IN STUDENT
    // ==========================================

    const student = await User.findById(req.user.userId).select(
      "collegeId role isActive",
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student account not found",
      });
    }

    // ==========================================
    // CHECK STUDENT ROLE
    // ==========================================

    if (student.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Student access only",
      });
    }

    // ==========================================
    // CHECK ACTIVE ACCOUNT
    // ==========================================

    if (!student.isActive) {
      return res.status(403).json({
        success: false,
        message: "Student account is inactive",
      });
    }

    // ==========================================
    // CHECK COLLEGE ASSIGNMENT
    // ==========================================

    if (!student.collegeId) {
      return res.status(400).json({
        success: false,
        message: "Student is not assigned to a college",
      });
    }

    // ==========================================
    // FETCH AVAILABLE JOBS
    // ==========================================

    const jobs = await Job.find({
      collegeId: student.collegeId,
      status: "open",
      applicationDeadline: {
        $gte: new Date(),
      },
    })
      .populate("recruiterId", "name email")
      .sort({ createdAt: -1 });

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.error("Get available jobs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch available jobs",
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  getAvailableJobs,
};
