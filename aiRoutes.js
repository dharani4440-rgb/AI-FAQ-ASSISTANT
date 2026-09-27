const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  validateAIQuestion,
  validateAITopic,
} = require("../middleware/validationMiddleware");
const {
  answerQuestion,
  generateFAQPair,
} = require("../controllers/aiController");

const router = express.Router();

router.post("/answer", authMiddleware, validateAIQuestion, answerQuestion);
router.post(
  "/generate-faq",
  authMiddleware,
  validateAITopic,
  generateFAQPair
);

module.exports = router;
