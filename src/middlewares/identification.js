const jwt = require("jsonwebtoken");
const User = require('../model/usersModel');

exports.identifier = async (req, res, next) => {
  try {
    // Try to get token from cookies or Authorization header
    const token =
      req.cookies.Authorization?.replace('Bearer ', '') ||
      req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    // Attach complete user data to the request object
    req.user = {
      id: user._id,
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      verified: user.verified,
      fullName: user.fullName
    };
    
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
    });
  }
};
