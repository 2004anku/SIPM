// ==========================================
// STUDENT ROLE MIDDLEWARE
// ==========================================

const isStudent = (req, res, next) => {
  // Authentication middleware should run first
  // so req.user is already available.

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  // Only students are allowed
  if (req.user.role !== "student") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Student only.",
    });
  }

  next();
};

module.exports = isStudent;
