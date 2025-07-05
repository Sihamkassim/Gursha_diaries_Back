const Item = require('../model/ItemModel');

exports.addRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const { id } = req.params;
    
    // Handle both authenticated and unauthenticated users
    let userId, fullName;
    if (req.user) {
      userId = req.user.id;
      fullName = req.user.fullName;
    } else {
      // For unauthenticated users, generate a temporary ID and use Anonymous
      userId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      fullName = 'Anonymous';
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Find or create rating
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user has already rated
    const existingRating = item.ratings.find(r => r.user.toString() === userId);
    
    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
    } else {
      // Create new rating
      item.ratings.push({
        user: userId,
        userName: fullName,
        rating,
        createdAt: new Date()
      });
    }

    // Calculate new average rating
    const totalRatings = item.ratings.length;
    const sum = item.ratings.reduce((acc, r) => acc + r.rating, 0);
    item.averageRating = totalRatings > 0 ? (sum / totalRatings).toFixed(1) : 0;
    item.ratingCount = totalRatings;

    await item.save();

    res.status(200).json({
      message: 'Rating added/updated successfully',
      rating: {
        user: userId,
        userName: fullName,
        rating,
        createdAt: new Date()
      },
      averageRating: item.averageRating,
      ratingCount: item.ratingCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRatings = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findById(itemId).populate('ratings.user', 'fullName');
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({
      ratings: item.ratings,
      averageRating: item.averageRating,
      ratingCount: item.ratingCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTopRatedItems = async (req, res) => {
  try {
    const items = await Item.find({ averageRating: { $exists: true } })
      .sort({ averageRating: -1 })
      .limit(10)
      .populate('ratings.user', 'fullName');

    res.status(200).json({ items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
