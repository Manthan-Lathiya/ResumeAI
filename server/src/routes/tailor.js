const express = require('express');
const router = express.Router();
const { forwardToDjango } = require('../proxy/djangoProxy');
const { generalLimiter } = require('../middleware/rateLimiter');

router.use(generalLimiter);

/**
 * POST /api/tailor/generate
 * Tailor resume to match target Job Description using AI
 */
router.post('/generate', async (req, res, next) => {
  try {
    const result = await forwardToDjango('POST', '/api/resumes/tailor/', {
      data: req.body,
      headers: { authorization: req.headers.authorization },
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
