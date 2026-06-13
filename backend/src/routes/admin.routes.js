const express = require("express");
const router = express.Router();

const adminAuth = require("../middlewares/adminAuth");

const {
  login,
  getStats
} = require("../controllers/admin.controller");

// ================= PUBLIC =================

// Admin login
router.post("/login", login);

// ================= PROTECTED =================

// Dashboard stats
router.get("/stats", adminAuth, getStats);

module.exports = router;
