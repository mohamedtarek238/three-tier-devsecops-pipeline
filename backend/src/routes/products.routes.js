const express = require("express");
const router = express.Router();

const adminAuth = require("../middlewares/adminAuth");
const upload = require("../middlewares/upload.middleware");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/product.controller");

// ================= PUBLIC =================
router.get("/", getProducts);
router.get("/:id", getProductById);

// ================= ADMIN =================
router.post("/", adminAuth, upload.single("image"), createProduct);
router.put("/:id", adminAuth, updateProduct);
router.delete("/:id", adminAuth, deleteProduct);

module.exports = router;