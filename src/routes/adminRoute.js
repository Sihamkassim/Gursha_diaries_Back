const express = require('express');
const router = express.Router();
const { identifier } = require('../middlewares/identification');
const isAdmin = require('../middlewares/isAdmin'); // ✅ FIXED: imported as a single function
const adminController = require('../controllers/adminController');

// Admin routes (require admin auth)
router.get('/stats', identifier, isAdmin, adminController.getStats);
router.get('/top-rated', identifier, isAdmin, adminController.getTopRated);
router.delete('/item/:id', identifier, isAdmin, adminController.deleteItem);
router.get('/users', identifier, isAdmin, adminController.getAllUsers);
router.delete('/users/:id', identifier, isAdmin, adminController.deleteUser);

module.exports = router;
