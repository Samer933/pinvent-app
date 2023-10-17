const errorHandler = require("../middleWare/errorMiddleWare");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Token is for secure data exchange
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

//Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill the required fields");
  }

  if (password.lenght < 6) {
    res.status(400);
    throw new Error("Password must be up to 6 characters");
  }

  // Now we chicking if the email is already exist in the database

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("The email user is already has bees redistered");
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
  });

  //Generate Token
  const token = generateToken(user._id);
  // Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 Day
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Login User

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate Request

  if (!email) {
    res.status(400);
    throw new Error("Please add email!");
  }

  if (!password) {
    res.status(400);
    throw new Error("Please add password!");
  }

  // Check if user exist

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("The email is not exist");
  }

  // Check if the password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  //Generate Token
  const token = generateToken(user._id);
  // Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 Day
    sameSite: "none",
    secure: true,
  });

  if (user && passwordIsCorrect) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

const logut = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), // 1 Day
    sameSite: "none",
    secure: true,
  });

  return res.status(200).json({ message: "Succssfully Logged Out" });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req._id);

  if (user) {
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      phone: user.phone,
      bio: user.bio,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  //  const token = req.headers.authorization;

  if (!token) {
    return res.json(false);
  }

  const Verified = jwt.verify(token, process.env.JWT_SECRET);

  if (Verified) {
    res.json(true);
  }

  return res.json(false);
});

module.exports = { registerUser, loginUser, logut, getUser, loginStatus };
