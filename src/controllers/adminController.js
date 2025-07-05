const Item = require('../model/ItemModel');
const User = require('../model/usersModel');

exports.getStats = async (req, res) => {
  try {
    // Get total recipes
    const totalRecipes = await Item.countDocuments();
    
    // Get most rated recipe
    const mostRated = await Item.findOne()
      .sort({ ratingCount: -1 })
      .populate('creator', 'username email');
    
    // Get average ratings
    const [averageRatings] = await Item.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$averageRating' },
          totalRatings: { $sum: '$ratingCount' },
        },
      },
    ]);

    // Validate data
    if (typeof totalRecipes !== 'number') {
      throw new Error('Invalid total recipes count');
    }
    
    if (mostRated && !mostRated._id) {
      throw new Error('Invalid most rated recipe data');
    }

    res.json({
      totalRecipes,
      mostRated: mostRated || null,
      averageRatings: averageRatings || { avgRating: 0, totalRatings: 0 }
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    // Add more specific error messages
    if (error.message.includes('Mongo')) {
      return res.status(500).json({ 
        message: 'Database connection error', 
        error: error.message 
      });
    }
    return res.status(500).json({ 
      message: error.message || 'Internal server error', 
      error: error.message 
    });
  }
};

exports.getTopRated = async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const topRated = await Item.find()
      .sort({ averageRating: -1 })
      .limit(parseInt(limit))
      .populate('creator', 'username email');
    res.json(topRated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password -verificationCode -verificationCodeValidation -forgotPasswordCode -forgotPasswordCodeValidation');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
