/**
 * Error Handler Middleware
 *
 * Catches all errors thrown in route handlers and returns
 * a consistent JSON error response with USER-FRIENDLY messages.
 *
 * In Express, error-handling middleware has 4 parameters: (err, req, res, next)
 * This distinguishes it from regular middleware which has 3.
 */

/**
 * Map common error scenarios to friendly messages
 */
const FRIENDLY_MESSAGES = {
  // Authentication
  401: 'Your session has expired. Please log in again.',
  403: 'You don\'t have permission to perform this action.',
  404: 'The requested resource was not found.',
  409: 'This resource already exists. Please try a different value.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: 'Something went wrong on our end. Please try again later.',
  503: 'The service is temporarily unavailable. Please try again in a few moments.',
};

/**
 * Convert Zod validation field errors into friendly sentences.
 */
function formatZodErrors(zodErrors) {
  const messages = zodErrors.map(e => {
    const field = e.path.length > 0 ? e.path[e.path.length - 1] : '';
    // Make field name human-readable (camelCase → words)
    const friendlyField = String(field)
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, s => s.toUpperCase())
      .trim();

    // Use Zod's message if it's already descriptive
    if (e.message && e.message !== 'Required') {
      return friendlyField ? `${friendlyField}: ${e.message}` : e.message;
    }
    return friendlyField ? `${friendlyField} is required.` : 'A required field is missing.';
  });

  return messages.join(' ');
}

function errorHandler(err, req, res, next) {
  // Log the error for debugging
  console.error('❌ Error:', err.message);

  // Zod validation errors — convert to friendly message
  if (err.name === 'ZodError') {
    const friendlyMessage = formatZodErrors(err.errors);
    return res.status(400).json({
      error: friendlyMessage,
      errors: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: 'The file is too large. Please upload a file smaller than 10MB.',
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      error: 'Unexpected file type. Please upload only the allowed file types.',
    });
  }

  // Default: use a friendly message based on status code, or the error message
  const statusCode = err.status || 500;
  const friendlyMessage = FRIENDLY_MESSAGES[statusCode] || err.message || 'Something went wrong. Please try again.';

  res.status(statusCode).json({
    error: friendlyMessage,
  });
}

module.exports = { errorHandler };

