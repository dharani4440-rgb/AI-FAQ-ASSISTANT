const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  validateFAQ,
} = require("../middleware/validationMiddleware");
const {
  createFAQ,
  getAllFAQs,
  getFAQById,
  searchFAQs,
  updateFAQ,
  deleteFAQ,
} = require("../controllers/faqController");

const router = express.Router();

router.get("/search", searchFAQs);
router.get("/", getAllFAQs);
router.get("/:id", getFAQById);
router.post("/", authMiddleware, validateFAQ, createFAQ);
router.put("/:id", authMiddleware, updateFAQ);
router.delete("/:id", authMiddleware, deleteFAQ);

module.exports = router;
