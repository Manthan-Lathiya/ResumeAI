/**
 * Error Handler Middleware
 *
 * Catches all errors thrown in route handlers and returns
 * a consistent JSON error response.
 *
 * In Express, error-handling middleware has 4 parameters: (err, req, res, next)
 * This distinguishes it from regular middleware which has 3.
 */

function errorHandler(err, req, res, next) {
  // Log the error for debugging
  console.error('❌ Error:', err.message);

  // Zod validation errors
  if (err.name === 'ZodError') {
    const errors = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({ errors });
  }

  // Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File size must be less than 10MB' });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: 'Unexpected file field' });
  }

  // Default: Internal server error
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
}

module.exports = { errorHandler };
