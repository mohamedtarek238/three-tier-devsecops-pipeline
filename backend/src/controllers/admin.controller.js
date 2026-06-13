const Admin = require("../models/Admin");
const Product = require("../models/Product");
const Order = require("../models/Order");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= ADMIN LOGIN =================
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "All fields are required" });

    const admin = await Admin.findOne({ username });
    if (!admin)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      "supersecretkey",
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= DASHBOARD STATS =================
exports.getStats = async (req, res) => {
  try {
    const [productCount, orderCount, revenueAgg, ordersByStatus] =
      await Promise.all([
        Product.countDocuments(),
        Order.countDocuments(),
        Order.aggregate([
          { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]),
        Order.aggregate([
          { $group: { _id: "$status", count: { $sum: 1 } } }
        ])
      ]);

    res.json({
      products: productCount,
      orders: orderCount,
      revenue: revenueAgg[0]?.total || 0,
      ordersByStatus
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
