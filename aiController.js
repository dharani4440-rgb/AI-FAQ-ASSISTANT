const {
  generateAnswer,
  generateFAQ,
} = require("../services/geminiService");

async function answerQuestion(req, res, next) {
  try {
    const answer = await generateAnswer(req.body.question);

    res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    next(error);
  }
}

async function generateFAQPair(req, res, next) {
  try {
    const result = await generateFAQ(req.body.topic);

    res.status(200).json({
      success: true,
      question: result.question,
      answer: result.answer,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { answerQuestion, generateFAQPair };
