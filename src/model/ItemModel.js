const mongoose = require("mongoose");
const { Schema } = mongoose;

// Reuse your existing schemas
const moreSchema = new Schema({
  prep_time: { type: String, required: true },
  cook_time: { type: String, required: true },
  services: { type: String, required: true },
  Difficulty: { type: String, required: true },
  source: { type: String, required: true },
});

const commentSchema = new Schema({
  user: { type: String, required: true },
  comment: { type: String, required: true },
});

const ingredientsSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
});

// ✅ Add this rating schema
const ratingSchema = new Schema({
  user: { type: Schema.Types.Mixed, required: true }, // Allow ObjectId or string
  userName: { type: String, required: true }, // Add this if you want to show username directly
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String }, // Optional comment
  createdAt: { type: Date, default: Date.now },
});

const ItemSchema = new Schema(
  {
    menuId: { type: Number, required: true },
    name: { type: String, required: true },
    thumbnail_image: { type: String, required: true },
    category: { type: String, required: true },
    instructions: { type: String, required: true },
    tags: [String],
    ingredients: { type: [ingredientsSchema], required: true },
    comments: { type: [commentSchema], required: true },
    more: { type: [moreSchema], required: true },

    // ✅ Rating integration
    ratings: [ratingSchema],
    averageRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    creator: {
      type: Object,
      ref: "User",
      select: { username: 1, email: 1 },
    },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", ItemSchema, "items");
module.exports = Item;
