const express = require('express');
const router = express.Router();
const FormData = require('form-data');
const { forwardToDjango, forwardFileToDjango } = require('../proxy/djangoProxy');
const { compareJDSchema, validate } = require('../validators/analysisValidator');
const { aiLimiter, generalLimiter } = require('../middleware/rateLimiter');
const { upload } = require('../middleware/upload');

// POST /api/analysis/analyze — accepts file upload or { resumeId }
router.post('/analyze', aiLimiter, upload.single('file'), async (req, res, next) => {
  try {
    if (req.file) {
      const formData = new FormData();
      formData.append('file', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });
      if (req.body.resumeId) formData.append('resumeId', req.body.resumeId);

      const result = await forwardFileToDjango(
        '/api/analysis/analyze/',
        formData,
        { authorization: req.headers.authorization }
      );
      return res.status(result.status).json(result.data);
    }

    if (!req.body.resumeId) {
      return res.status(400).json({ error: 'Please upload a file or provide a resumeId' });
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

// POST /api/analysis/compare-jd — accepts file upload or { resumeId, jobDescription }
router.post('/compare-jd', aiLimiter, upload.single('file'), async (req, res, next) => {
  try {
    if (req.file) {
      const formData = new FormData();
      formData.append('file', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });
      formData.append('jobDescription', req.body.jobDescription || '');
      if (req.body.resumeId) formData.append('resumeId', req.body.resumeId);

      const result = await forwardFileToDjango(
        '/api/analysis/compare-jd/',
        formData,
        { authorization: req.headers.authorization }
      );
      return res.status(result.status).json(result.data);
    }

    const { error, value } = (() => {
      try {
        return { value: compareJDSchema.parse(req.body) };
      } catch (err) {
        return { error: err };
      }
    })();

    if (error) return next(error);

    const result = await forwardToDjango('POST', '/api/analysis/compare-jd/', {
      data: value,
      headers: { authorization: req.headers.authorization },
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

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
