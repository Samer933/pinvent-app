const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(token);
    if (!token) {
      res.status(401);
      throw new Error("No authorized, please login");
    }

    // Verify Token
    // Check if the token is not exired
    const Verified = jwt.verify(token, process.env.JWT_SECRET);
    // Get user id from token

    // select means that don't include the password, means dont put it in user variable
    const user = await User.findById(Verified.id).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("User is not found");
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, please login");
  }
});

module.exports = protect;
