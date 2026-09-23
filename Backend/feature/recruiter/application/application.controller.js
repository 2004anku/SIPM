const mongoose = require("mongoose");
const Application = require("../../student/application/application.model");

// ==========================================
// GET RECRUITER APPLICATIONS
// ==========================================

const getRecruiterApplications = async (req, res) => {
  try {
    const { recruiterId, collegeId } = req.user;

    // ==========================================
    // GET APPLICATIONS
    // ==========================================

    const applications = await Application.find({
      recruiterId,
      collegeId,
    })
      .populate({
        path: "studentId",
        select: "name email phone enrollmentNumber course semester",
      })
      .populate({
        path: "jobId",
        select:
          "title description employmentType location salaryMin salaryMax skills applicationDeadline status",
      })
      .sort({ createdAt: -1 });

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Applications fetched successfully",
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error("Get recruiter applications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
};

// ==========================================
// SEND INTERVIEW CALL
// ==========================================

const sendInterviewCall = async (req, res) => {
  try {
    const { applicationId } = req.params;

    // ==========================================
    // GET REQUEST BODY
    // ==========================================

    const { interviewDate, interviewMode, meetingLink, message } =
      req.body || {};

    const { recruiterId, collegeId } = req.user;

    // ==========================================
    // VALIDATE APPLICATION ID
    // ==========================================

    if (!mongoose.isValidObjectId(applicationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
    }

    // ==========================================
    // VALIDATE INTERVIEW DATE
    // ==========================================

    if (!interviewDate) {
      return res.status(400).json({
        success: false,
        message: "Interview date is required",
      });
    }

    const parsedInterviewDate = new Date(interviewDate);

    if (isNaN(parsedInterviewDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview date",
      });
    }

    if (parsedInterviewDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Interview date must be in the future",
      });
    }

    // ==========================================
    // VALIDATE INTERVIEW MODE
    // ==========================================

    const allowedModes = ["online", "offline"];

    const selectedMode = interviewMode || "online";

    if (!allowedModes.includes(selectedMode)) {
      return res.status(400).json({
        success: false,
        message: "Interview mode must be online or offline",
      });
    }

    // ==========================================
    // VALIDATE MEETING LINK
    // ==========================================

    if (selectedMode === "online" && (!meetingLink || !meetingLink.trim())) {
      return res.status(400).json({
        success: false,
        message: "Meeting link is required for online interview",
      });
    }

    // ==========================================
    // GET APPLICATION
    // ==========================================

    const application = await Application.findOne({
      _id: applicationId,
      recruiterId,
      collegeId,
    });

    // ==========================================
    // APPLICATION NOT FOUND
    // ==========================================

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // ==========================================
    // CHECK APPLICATION STATUS
    // ==========================================

    if (application.status !== "applied") {
      return res.status(400).json({
        success: false,
        message: `Cannot send interview call. Application is already ${application.status}`,
      });
    }

    // ==========================================
    // UPDATE APPLICATION STATUS
    // ==========================================

    application.status = "shortlisted";

    // ==========================================
    // SAVE INTERVIEW DETAILS
    // ==========================================

    application.interview = {
      interviewDate: parsedInterviewDate,
      interviewMode: selectedMode,
      meetingLink: selectedMode === "online" ? meetingLink.trim() : "",
      message: message ? message.trim() : "",
      sentAt: new Date(),
    };

    await application.save();

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Interview call sent successfully",
      data: application,
    });
  } catch (error) {
    console.error("Send interview call error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send interview call",
    });
  }
};

// ==========================================
// REJECT APPLICATION
// ==========================================

const rejectApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    // ==========================================
    // GET REQUEST BODY
    // ==========================================

    const { rejectionReason } = req.body || {};

    const { recruiterId, collegeId } = req.user;

    // ==========================================
    // VALIDATE APPLICATION ID
    // ==========================================

    if (!mongoose.isValidObjectId(applicationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
    }

    // ==========================================
    // VALIDATE REJECTION REASON
    // ==========================================

    if (!rejectionReason || !rejectionReason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    // ==========================================
    // GET APPLICATION
    // ==========================================

    const application = await Application.findOne({
      _id: applicationId,
      recruiterId,
      collegeId,
    });

    // ==========================================
    // APPLICATION NOT FOUND
    // ==========================================

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // ==========================================
    // CHECK APPLICATION STATUS
    // ==========================================

    if (application.status !== "applied") {
      return res.status(400).json({
        success: false,
        message: `Cannot reject application. Application is already ${application.status}`,
      });
    }

    // ==========================================
    // UPDATE APPLICATION
    // ==========================================

    application.status = "rejected";

    application.rejectionReason = rejectionReason.trim();

    application.rejectedAt = new Date();

    await application.save();

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Application rejected successfully",
      data: application,
    });
  } catch (error) {
    console.error("Reject application error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject application",
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  getRecruiterApplications,
  sendInterviewCall,
  rejectApplication,
};
