export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Database errors
  if (err.message.includes("database") || err.message.includes("query")) {
    return res.status(500).json({
      success: false,
      error: "Database error occurred"
    });
  }

  // Validation errors
  if (Array.isArray(err.message)) {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }

  // Unique constraint errors
  if (err.message.includes("already exists")) {
    return res.status(409).json({
      success: false,
      error: err.message
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
};

export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
};