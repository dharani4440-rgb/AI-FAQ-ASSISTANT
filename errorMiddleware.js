function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

function errorHandler(error, req, res, next) {
  console.error(error);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: Object.values(error.errors).map((item) => item.message),
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  if (error.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "A record with that value already exists",
    });
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
}

module.exports = { notFound, errorHandler };
