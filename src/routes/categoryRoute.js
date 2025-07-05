const express = require('express')
const router = express.Router();
const CategoryController = require('../controllers/categoryController')

router.get('/:category', CategoryController.getCategory)
router.get('/categories', CategoryController.getAllCategories);
router.post('/categories', CategoryController.createCategory);
router.delete('/categories/:id', CategoryController.deleteCategory);

module.exports =router;