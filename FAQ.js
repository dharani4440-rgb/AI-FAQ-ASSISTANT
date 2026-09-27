const mongoose = require("mongoose");

const categories = [
  "Technology",
  "Education",
  "Health",
  "Banking",
  "General",
];

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 500,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 5000,
    },
    category: {
      type: String,
      required: true,
      enum: categories,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

faqSchema.index({ question: "text", answer: "text", category: "text" });

module.exports = mongoose.model("FAQ", faqSchema);
