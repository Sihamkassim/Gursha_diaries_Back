const express = require('express');
const router = express.Router();
const ItemController = require('../controllers/itemController');
const RatingController = require('../controllers/ratingController');
const { identifier } = require('../middlewares/identification');

// Public routes (no auth)
router.get('/all-items', ItemController.getAllItems);
router.get('/items', ItemController.getSearchedItems);
router.get('/items/:id', ItemController.getSingleItem);
router.get('/top-rated', RatingController.getTopRatedItems);
router.post('/items/:id/rate', RatingController.addRating);
router.get('/items/:id/ratings', RatingController.getRatings);
router.post('/comments', ItemController.addCommentToItem);

// Protected routes (require auth)
router.post('/items',  ItemController.createItem);
router.put('/items/:id', identifier, ItemController.updateItem);
router.delete('/items/:id', identifier, ItemController.deleteItem);

module.exports = router;
