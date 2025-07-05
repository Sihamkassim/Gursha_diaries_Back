const isAdmin = async (req, res, next) => {
  try {
    // Check if user exists and is admin
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ 
        message: 'Access denied. Admin privileges required.' 
      });
    }
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message 
    });
  }
};

module.exports = isAdmin;
