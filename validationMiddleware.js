function validateRegistration(req, res, next) {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required",
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email address",
    });
  }

  if (String(password).length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must contain at least 6 characters",
    });
  }

  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  next();
}

function validateFAQ(req, res, next) {
  const { question, answer, category } = req.body || {};

  if (!question || !answer || !category) {
    return res.status(400).json({
      success: false,
      message: "Question, answer and category are required",
    });
  }

  next();
}

function validateAIQuestion(req, res, next) {
  if (!req.body?.question || !String(req.body.question).trim()) {
    return res.status(400).json({
      success: false,
      message: "Question is required",
    });
  }

  next();
}

function validateAITopic(req, res, next) {
  if (!req.body?.topic || !String(req.body.topic).trim()) {
    return res.status(400).json({
      success: false,
      message: "Topic is required",
    });
  }

  next();
}

module.exports = {
  validateRegistration,
  validateLogin,
  validateFAQ,
  validateAIQuestion,
  validateAITopic,
};
