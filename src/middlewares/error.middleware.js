const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      message: "Duplicate value error",
      field: Object.keys(err.keyValue)[0],
    });
  }

  // Generic fallback
  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
