const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  image: {
    type: String,
    required: true
  },

  stock: {
    type: Number,
    required: true,
    min: 0
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

productSchema.index({ name: "text" });

module.exports = mongoose.model("Product", productSchema);
