const express = require('express');
const router = express.Router();
const { forwardToDjango } = require('../proxy/djangoProxy');
const { generalLimiter } = require('../middleware/rateLimiter');

router.use(generalLimiter);

/**
 * POST /api/interview/generate
 * Generate customized interview questions and STAR model answers
 */
router.post('/generate', async (req, res, next) => {
  try {
    const result = await forwardToDjango('POST', '/api/resumes/interview-prep/', {
      data: req.body,
      headers: { authorization: req.headers.authorization },
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
