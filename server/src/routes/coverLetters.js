/**
 * Cover Letter Routes — Express Gateway
 *
 * Handles AI cover letter generation and CRUD operations.
 * Forwards requests to Django API.
 */

const express = require('express');
const router = express.Router();
const { forwardToDjango } = require('../proxy/djangoProxy');
const { generalLimiter } = require('../middleware/rateLimiter');

router.use(generalLimiter);

/**
 * POST /api/cover-letters/generate
 * Generate AI cover letter paragraphs
 */
router.post('/generate', async (req, res, next) => {
  try {
    const result = await forwardToDjango('POST', '/api/cover-letters/generate/', {
      data: req.body,
      headers: { authorization: req.headers.authorization },
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/cover-letters
 * List all saved cover letters for current user
 */
router.get('/', async (req, res, next) => {
  try {
    const result = await forwardToDjango('GET', '/api/cover-letters/', {
      headers: { authorization: req.headers.authorization },
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/cover-letters/:id
 * Get single cover letter by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const result = await forwardToDjango('GET', `/api/cover-letters/${req.params.id}/`, {
      headers: { authorization: req.headers.authorization },
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/cover-letters
 * Save a new cover letter
 */
router.post('/', async (req, res, next) => {
  try {
    const result = await forwardToDjango('POST', '/api/cover-letters/', {
      data: req.body,
      headers: { authorization: req.headers.authorization },
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/cover-letters/:id
 * Update an existing cover letter
 */
router.put('/:id', async (req, res, next) => {
  try {
    const result = await forwardToDjango('PUT', `/api/cover-letters/${req.params.id}/`, {
      data: req.body,
      headers: { authorization: req.headers.authorization },
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/cover-letters/:id
 * Delete a cover letter
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await forwardToDjango('DELETE', `/api/cover-letters/${req.params.id}/`, {
      headers: { authorization: req.headers.authorization },
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
