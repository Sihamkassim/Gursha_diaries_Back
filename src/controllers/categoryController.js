const Item = require("../model/ItemModel");
const Category = require('../model/categoryModel');

const getCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const items = await Item.find({
      category: { $regex: category, $options: "i" },
    });
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error retrieving category" });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, menuId } = req.body;
    const category = new Category({ name, menuId });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategory,
  getAllCategories,
  createCategory,
  deleteCategory,
};
