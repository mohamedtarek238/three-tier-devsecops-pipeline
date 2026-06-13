const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3");
const Product = require("../models/Product");
const crypto = require("crypto");




// ================= GET ALL PRODUCTS (Public) =================
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.json(products);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET PRODUCT BY ID =================
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= CREATE PRODUCT (Admin) =================


exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    if (!req.file)
      return res.status(400).json({ message: "Image is required" });

    const file = req.file;

    const fileName =
      crypto.randomBytes(16).toString("hex") +
      "-" +
      Date.now();


  await s3.send(
  new PutObjectCommand({
    Bucket: "power-store-images",
    Key: `products/${fileName}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ContentLength: file.size,
  })
);

    const imageUrl = `https://power-store-images.s3.us-east-1.amazonaws.com/products/${fileName}`;

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      image: imageUrl,
    });

    res.status(201).json(product);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
// ================= UPDATE PRODUCT =================
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= DELETE PRODUCT =================
// Soft delete instead of hard delete
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deactivated successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
