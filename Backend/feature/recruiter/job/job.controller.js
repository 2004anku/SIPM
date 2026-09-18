const Job = require("./job.model");

// ==========================================
// CREATE JOB
// ==========================================

const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      employmentType,
      location,
      salaryMin,
      salaryMax,
      skills,
      minQualification,
      minimumPercentage,
      backlogsAllowed,
      applicationDeadline,
    } = req.body;

    // Recruiter and college information comes
    // from isRecruiter middleware
    const { recruiterId, collegeId } = req.user;

    // ==========================================
    // VALIDATE REQUIRED FIELDS
    // ==========================================

    if (
      !title ||
      !description ||
      !employmentType ||
      !location ||
      !minQualification ||
      !applicationDeadline
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // ==========================================
    // VALIDATE SALARY
    // ==========================================

    if (
      salaryMin !== undefined &&
      salaryMin !== null &&
      salaryMax !== undefined &&
      salaryMax !== null &&
      Number(salaryMin) > Number(salaryMax)
    ) {
      return res.status(400).json({
        success: false,
        message: "Minimum salary cannot be greater than maximum salary",
      });
    }

    // ==========================================
    // VALIDATE APPLICATION DEADLINE
    // ==========================================

    const deadline = new Date(applicationDeadline);

    if (isNaN(deadline.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid application deadline",
      });
    }

    if (deadline <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Application deadline must be in the future",
      });
    }

    // ==========================================
    // CREATE JOB
    // ==========================================

    const job = await Job.create({
      recruiterId,
      collegeId,

      title,
      description,
      employmentType,
      location,

      salaryMin:
        salaryMin !== undefined && salaryMin !== null
          ? Number(salaryMin)
          : null,

      salaryMax:
        salaryMax !== undefined && salaryMax !== null
          ? Number(salaryMax)
          : null,

      skills: Array.isArray(skills) ? skills : [],

      minQualification,
      minimumPercentage:
        minimumPercentage !== undefined ? Number(minimumPercentage) : 0,

      backlogsAllowed:
        backlogsAllowed !== undefined ? Boolean(backlogsAllowed) : false,

      applicationDeadline: deadline,

      status: "open",
    });

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    console.error("Create Job error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create job",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  createJob,
};
