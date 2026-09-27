const mongoose = require("mongoose");
const FAQ = require("../models/FAQ");

async function createFAQ(req, res, next) {
  try {
    const faq = await FAQ.create({
      question: req.body.question,
      answer: req.body.answer,
      category: req.body.category,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "FAQ created successfully",
      data: faq,
    });
  } catch (error) {
    next(error);
  }
}

async function getAllFAQs(req, res, next) {
  try {
    const faqs = await FAQ.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs,
    });
  } catch (error) {
    next(error);
  }
}

async function getFAQById(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid FAQ ID",
      });
    }

    const faq = await FAQ.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    res.status(200).json({
      success: true,
      data: faq,
    });
  } catch (error) {
    next(error);
  }
}

async function searchFAQs(req, res, next) {
  try {
    const q = String(req.query.q || "").trim();

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query q is required",
      });
    }

    const safeQuery = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const faqs = await FAQ.find({
      $or: [
        { question: { $regex: safeQuery, $options: "i" } },
        { answer: { $regex: safeQuery, $options: "i" } },
        { category: { $regex: safeQuery, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs,
    });
  } catch (error) {
    next(error);
  }
}

async function updateFAQ(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid FAQ ID",
      });
    }

    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    if (faq.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can update only your own FAQ",
      });
    }

    const allowed = ["question", "answer", "category"];
    for (const field of allowed) {
      if (req.body[field] !== undefined) {
        faq[field] = req.body[field];
      }
    }

    await faq.save();

    res.status(200).json({
      success: true,
      message: "FAQ updated successfully",
      data: faq,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteFAQ(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid FAQ ID",
      });
    }

    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    if (faq.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can delete only your own FAQ",
      });
    }

    await faq.deleteOne();

    res.status(200).json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createFAQ,
  getAllFAQs,
  getFAQById,
  searchFAQs,
  updateFAQ,
  deleteFAQ,
};
