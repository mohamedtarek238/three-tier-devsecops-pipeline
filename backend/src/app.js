const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const productRoutes = require("./routes/products.routes");
const orderRoutes = require("./routes/order.routes");
const adminRoutes = require("./routes/admin.routes");

const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ================= ROUTES =================

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

// ================= ERROR HANDLING =================
app.use(notFound);
app.use(errorHandler);





module.exports = app;
