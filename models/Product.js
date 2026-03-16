const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: String,
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    genre: [String],
    platform: [String],
    ageRating: String,
    publisher: String,
    releaseDate: Date,
    price: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
      default: 0,
    },
    totalStock: {
      type: Number,
      required: true,
    },
    isMultiplayer: {
      type: Boolean,
      default: false,
    },
    inTheBox: [String],
    systemRequirements: {
      os: String,
      processor: String,
      memory: String,
      graphics: String,
      storage: String,
    },
    trailerUrl: String,  
    systemRequirements: {
      os: String,
      processor: String,
      memory: String,
      graphics: String,
      storage: String,
    },
    averageReview: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);