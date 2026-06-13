const Order = require("../models/Order");
const Product = require("../models/Product");

// ================= CREATE ORDER (Guest) =================
exports.createOrder = async (req, res) => {
  try {
    const { customer, items } = req.body;

    if (!customer || !items || !items.length)
      return res.status(400).json({ message: "Invalid order data" });

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {

      if (!item.product || !item.quantity)
        return res.status(400).json({ message: "Invalid item data" });

      const product = await Product.findById(item.product);

      if (!product || !product.isActive)
        return res.status(404).json({ message: "Product not available" });

      if (product.stock < item.quantity)
        return res.status(400).json({ message: "Not enough stock" });

      const itemTotal = product.price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal
      });

      totalAmount += itemTotal;

      // Decrease stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      orderNumber: `ORD-${Date.now()}`,
      customer,
      items: orderItems,
      totalAmount
    });

    res.status(201).json(order);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET ALL ORDERS (Admin) =================
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= UPDATE ORDER STATUS =================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled"
    ];

    if (!allowedStatuses.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    res.json(order);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
