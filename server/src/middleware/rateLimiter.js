/**
 * Rate Limiter Middleware
 *
 * Limits how many requests a user can make in a time window.
 * This is especially important for AI analysis endpoints
 * because each call costs money (Anthropic API charges per token).
 *
 * Two limiters:
 * 1. General: 100 requests per 15 minutes (for normal API calls)
 * 2. AI-specific: 10 requests per 15 minutes (for analysis endpoints)
 */

const rateLimit = require('express-rate-limit');

// General rate limiter — applies to all routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 100,                     // Max 100 requests per window
  message: {
    error: 'Too many requests. Please try again in a few minutes.',
  },
  standardHeaders: true,        // Return rate limit info in response headers
  legacyHeaders: false,
});

// Strict rate limiter for AI endpoints — LLM calls cost money!
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 10,                      // Max 10 AI analysis requests per window
  message: {
    error: 'AI analysis rate limit reached. Please wait before running another analysis.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { generalLimiter, aiLimiter };
