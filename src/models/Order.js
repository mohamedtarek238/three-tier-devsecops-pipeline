const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },

  customer: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    address: { type: String, required: true },
    city: String,
    notes: String
  },

  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },

      name: String,       // snapshot
      price: Number,      // snapshot
      quantity: { type: Number, required: true },
      total: Number
    }
  ],

  totalAmount: { type: Number, required: true },

  paymentMethod: {
    type: String,
    enum: ["COD"],
    default: "COD"
  },

  status: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
    default: "pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
