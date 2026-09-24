const jwt = require("jsonwebtoken");

const User = require("../../feature/users/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    // ==========================================
    // GET AUTHORIZATION HEADER
    // ==========================================

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // ==========================================
    // GET TOKEN
    // ==========================================

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing",
      });
    }

    // ==========================================
    // VERIFY JWT
    // ==========================================

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ==========================================
    // FIND CURRENT USER
    // ==========================================

    const user = await User.findById(decoded.userId).select(
      "_id name email role collegeId isActive",
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found",
      });
    }

    // ==========================================
    // CHECK USER STATUS
    // ==========================================

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "User account is inactive",
      });
    }

    // ==========================================
    // ATTACH AUTHENTICATED USER TO REQUEST
    // ==========================================

    req.user = {
      userId: user._id.toString(),
      role: user.role,
      collegeId: user.collegeId ? user.collegeId.toString() : null,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;
