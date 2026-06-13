const express = require("express");
const connectDB = require("../src/config/db");
const app = require("./app");

const PORT = 5000;

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
