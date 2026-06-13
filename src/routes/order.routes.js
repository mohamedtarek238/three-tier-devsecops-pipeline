const express = require("express");
const router = express.Router();

const adminAuth = require("../middlewares/adminAuth");


const {
  createOrder,
  getAllOrders,
  updateOrderStatus
} = require("../controllers/order.controller");

// ================= PUBLIC =================

// Guest checkout
router.post("/", createOrder);

// ================= ADMIN =================

// Get all orders
router.get("/", adminAuth, getAllOrders);

// Update order status
router.put("/:id/status", adminAuth, updateOrderStatus);

module.exports = router;
