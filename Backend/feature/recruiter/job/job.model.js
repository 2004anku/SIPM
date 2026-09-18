const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    // ==========================================
    // RECRUITER & COLLEGE
    // ==========================================

    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
      required: true,
      index: true,
    },

    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
      index: true,
    },

    // ==========================================
    // JOB INFORMATION
    // ==========================================

    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
      maxlength: 3000,
    },

    employmentType: {
      type: String,
      enum: ["full_time", "part_time", "internship", "contract"],
      required: [true, "Employment type is required"],
    },

    location: {
      type: String,
      required: [true, "Job location is required"],
      trim: true,
      maxlength: 150,
    },

    // ==========================================
    // SALARY
    // ==========================================

    salaryMin: {
      type: Number,
      min: 0,
      default: null,
    },

    salaryMax: {
      type: Number,
      min: 0,
      default: null,
    },

    // ==========================================
    // SKILLS
    // ==========================================

    skills: {
      type: [String],
      default: [],
    },

    // ==========================================
    // ELIGIBILITY
    // ==========================================

    minQualification: {
      type: String,
      required: [true, "Minimum qualification is required"],
      trim: true,
    },

    minimumPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    backlogsAllowed: {
      type: Boolean,
      default: false,
    },

    // ==========================================
    // APPLICATION
    // ==========================================

    applicationDeadline: {
      type: Date,
      required: [true, "Application deadline is required"],
    },

    // ==========================================
    // JOB STATUS
    // ==========================================

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================
// INDEXES
// ==========================================

jobSchema.index({
  collegeId: 1,
  status: 1,
});

jobSchema.index({
  recruiterId: 1,
  createdAt: -1,
});

jobSchema.index({
  collegeId: 1,
  createdAt: -1,
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
