/**
 * Auth Routes — Express Gateway
 *
 * These routes handle authentication:
 * 1. Validate input using Zod
 * 2. Forward the validated data to Django
 * 3. Return Django's response to React
 *
 * Express NEVER touches the database — it only validates and proxies.
 */

const express = require('express');
const router = express.Router();
const { forwardToDjango } = require('../proxy/djangoProxy');
const { signupSchema, loginSchema, refreshSchema, validate } = require('../validators/authValidator');
const { generalLimiter } = require('../middleware/rateLimiter');

// Apply rate limiting to all auth routes
router.use(generalLimiter);

/**
 * POST /api/auth/signup
 * Validates input, forwards to Django, returns JWT tokens.
 */
router.post('/signup', validate(signupSchema), async (req, res, next) => {
  try {
    const result = await forwardToDjango('POST', '/api/users/signup/', {
      data: req.validatedBody,
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/login
 * Validates email/password, forwards to Django.
 */
router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const result = await forwardToDjango('POST', '/api/users/login/', {
      data: req.validatedBody,
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/refresh
 * Validates refresh token, forwards to Django for new access token.
 */
router.post('/refresh', validate(refreshSchema), async (req, res, next) => {
  try {
    const result = await forwardToDjango('POST', '/api/users/refresh/', {
      data: req.validatedBody,
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/logout
 * Forwards logout request to Django (requires Authorization header).
 */
router.post('/logout', async (req, res, next) => {
  try {
    const result = await forwardToDjango('POST', '/api/users/logout/', {
      data: req.body,
      headers: { authorization: req.headers.authorization },
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/auth/me
 * Get current user's profile (requires Authorization header).
 */
router.get('/me', async (req, res, next) => {
  try {
    const result = await forwardToDjango('GET', '/api/users/me/', {
      headers: { authorization: req.headers.authorization },
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
