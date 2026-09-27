const express = require("express");
const {
  register,
  login,
  profile,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  validateRegistration,
  validateLogin,
} = require("../middleware/validationMiddleware");

const router = express.Router();

router.post("/register", validateRegistration, register);
router.post("/login", validateLogin, login);
router.get("/profile", authMiddleware, profile);

module.exports = router;
