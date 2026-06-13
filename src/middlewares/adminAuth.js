const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "Not authorized, no token" });

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, "supersecretkey");

    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin)
      return res.status(401).json({ message: "Admin not found" });

    req.admin = admin;

    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
