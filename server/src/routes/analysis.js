/**
 * Analysis Routes — Express Gateway
 *
 * Handles AI analysis requests:
 * - File upload + forwarding to Django
 * - JD comparison
 * - Analysis history
 *
 * Uses STRICT rate limiting because AI calls cost money!
 */

const express = require('express');
const router = express.Router();
const FormData = require('form-data');
const { forwardToDjango, forwardFileToDjango } = require('../proxy/djangoProxy');
const { compareJDSchema, validate } = require('../validators/analysisValidator');
const { aiLimiter, generalLimiter } = require('../middleware/rateLimiter');
const { upload } = require('../middleware/upload');

/**
 * POST /api/analysis/analyze
 *
 * Analyze a resume. Accepts either:
 * - File upload (multipart/form-data with "file" field)
 * - JSON body with { resumeId: "uuid" }
 *
 * Rate limited to 10 requests per 15 minutes (AI calls are expensive).
 */
router.post('/analyze', aiLimiter, upload.single('file'), async (req, res, next) => {
  try {
    // If a file was uploaded, forward it as multipart/form-data
    if (req.file) {
      const formData = new FormData();
      formData.append('file', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      // Also forward resumeId if provided
      if (req.body.resumeId) {
        formData.append('resumeId', req.body.resumeId);
      }

      const result = await forwardFileToDjango(
        '/api/analysis/analyze/',
        formData,
        { authorization: req.headers.authorization }
      );
      return res.status(result.status).json(result.data);
    }

    // No file — forward as JSON (must have resumeId)
    if (!req.body.resumeId) {
      return res.status(400).json({
        error: 'Please upload a file or provide a resumeId',
      });
    }

    const result = await forwardToDjango('POST', '/api/analysis/analyze/', {
      data: { resumeId: req.body.resumeId },
      headers: { authorization: req.headers.authorization },
    });
    res.status(result.status).json(result.data);

  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/analysis/compare-jd
 * Compare a resume against a job description.
 */
router.post('/compare-jd', aiLimiter, validate(compareJDSchema), async (req, res, next) => {
  try {
    const result = await forwardToDjango('POST', '/api/analysis/compare-jd/', {
      data: req.validatedBody,
      headers: { authorization: req.headers.authorization },
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/analysis/history
 * Get the user's analysis history.
 */
router.get('/history', generalLimiter, async (req, res, next) => {
  try {
    const result = await forwardToDjango('GET', '/api/analysis/history/', {
      headers: { authorization: req.headers.authorization },
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
