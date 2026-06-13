const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("../models/Admin");

const createAdmin = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/PowerStore", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const adminExists = await Admin.findOne({ username: "admin" });

    if (adminExists) {
      console.log("Admin already exists ✅");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await Admin.create({
      username: "admin",
      password: hashedPassword,
      role: "super_admin"
    });

    console.log("Admin created successfully 🚀");
    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();
