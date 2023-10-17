const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logut,
  getUser,
  loginStatus,
} = require("../controllers/userController");

const protect = require("../middleWare/authMiddleware");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/logut", logut);

router.get("/getUser", protect, getUser);

router.get("/loggedin", loginStatus);

module.exports = router;
