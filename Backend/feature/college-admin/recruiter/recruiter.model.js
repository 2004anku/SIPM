const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
      index: true,
    },

    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true,
      maxlength: 100,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: 150,
    },

    companyWebsite: {
      type: String,
      default: "",
      trim: true,
      maxlength: 250,
    },

    companyAddress: {
      type: String,
      required: [true, "Company address is required"],
      trim: true,
      maxlength: 300,
    },

    companyDescription: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

recruiterSchema.index({
  collegeId: 1,
  isActive: 1,
});

recruiterSchema.index({
  collegeId: 1,
  createdAt: -1,
});

const Recruiter = mongoose.model("Recruiter", recruiterSchema);

module.exports = Recruiter;
