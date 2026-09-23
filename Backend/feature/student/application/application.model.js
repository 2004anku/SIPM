const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    // ==========================================
    // STUDENT
    // ==========================================

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },

    // ==========================================
    // JOB
    // ==========================================

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },

    // ==========================================
    // RECRUITER
    // ==========================================

    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
      required: true,
      index: true,
    },

    // ==========================================
    // COLLEGE
    // ==========================================

    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
      index: true,
    },

    // ==========================================
    // APPLICATION STATUS
    // ==========================================

    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected", "selected"],
      default: "applied",
      index: true,
    },

    // ==========================================
    // INTERVIEW
    // ==========================================

    interview: {
      interviewDate: {
        type: Date,
      },

      interviewMode: {
        type: String,
        enum: ["online", "offline"],
      },

      meetingLink: {
        type: String,
        trim: true,
        maxlength: 500,
      },

      message: {
        type: String,
        trim: true,
        maxlength: 1000,
      },

      sentAt: {
        type: Date,
      },
    },

    // ==========================================
    // REJECTION
    // ==========================================

    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    rejectedAt: {
      type: Date,
    },

    // ==========================================
    // APPLICATION DATE
    // ==========================================

    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================
// PREVENT DUPLICATE APPLICATION
// ==========================================

applicationSchema.index(
  {
    studentId: 1,
    jobId: 1,
  },
  {
    unique: true,
  },
);

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
