const Application = require("./application.model");
const Job = require("../../recruiter/job/job.model");
const User = require("../../users/user.model");
const Student = require("../../college-admin/student/student.model");

// ==========================================
// APPLY FOR JOB
// ==========================================

const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // ==========================================
    // GET LOGGED-IN USER
    // ==========================================

    const user = await User.findById(req.user.userId).select(
      "email role collegeId isActive",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Student account not found",
      });
    }

    // ==========================================
    // CHECK STUDENT ROLE
    // ==========================================

    if (user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Student access only",
      });
    }

    // ==========================================
    // CHECK ACTIVE ACCOUNT
    // ==========================================

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Student account is inactive",
      });
    }

    // ==========================================
    // CHECK COLLEGE
    // ==========================================

    if (!user.collegeId) {
      return res.status(400).json({
        success: false,
        message: "Student is not assigned to a college",
      });
    }

    // ==========================================
    // GET STUDENT PROFILE
    // ==========================================

    const student = await Student.findOne({
      email: user.email,
      collegeId: user.collegeId,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // ==========================================
    // GET JOB
    // ==========================================

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // ==========================================
    // CHECK JOB COLLEGE
    // ==========================================

    if (job.collegeId.toString() !== user.collegeId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot apply for this job",
      });
    }

    // ==========================================
    // CHECK JOB STATUS
    // ==========================================

    if (job.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "This job is no longer open",
      });
    }

    // ==========================================
    // CHECK APPLICATION DEADLINE
    // ==========================================

    if (new Date() > new Date(job.applicationDeadline)) {
      return res.status(400).json({
        success: false,
        message: "Application deadline has passed",
      });
    }

    // ==========================================
    // CHECK DUPLICATE APPLICATION
    // ==========================================

    const existingApplication = await Application.findOne({
      studentId: student._id,
      jobId: job._id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // ==========================================
    // CREATE APPLICATION
    // ==========================================

    const application = await Application.create({
      studentId: student._id,
      jobId: job._id,
      recruiterId: job.recruiterId,
      collegeId: job.collegeId,
      status: "applied",
    });

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Job application submitted successfully",
      data: application,
    });
  } catch (error) {
    console.error("Apply for job error:", error);

    // ==========================================
    // DUPLICATE APPLICATION PROTECTION
    // ==========================================

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to apply for job",
    });
  }
};

module.exports = {
  applyForJob,
};
