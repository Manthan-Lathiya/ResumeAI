/**
 * Resume Routes — Express Gateway
 *
 * CRUD operations for resumes.
 * Validates input, then forwards to Django.
 */

const express = require('express');
const router = express.Router();
const FormData = require('form-data');
const { forwardToDjango, forwardFileToDjango } = require('../proxy/djangoProxy');
const { resumeSchema, validate } = require('../validators/resumeValidator');
const { generalLimiter, aiLimiter } = require('../middleware/rateLimiter');
const { upload } = require('../middleware/upload');

router.use(generalLimiter);

/**
 * POST /api/resumes/generate
 * Generates a full structured resume using AI
 */
router.post('/generate', aiLimiter, async (req, res, next) => {
  try {
    const result = await forwardToDjango('POST', '/api/resumes/generate/', {
      data: req.body,
      headers: { authorization: req.headers.authorization },
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/resumes/enhance-field
 * Enhances a specific resume field using AI
 */
router.post('/enhance-field', async (req, res, next) => {
  try {
    const result = await forwardToDjango('POST', '/api/resumes/enhance-field/', {
      data: req.body,
      headers: { authorization: req.headers.authorization },
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/resumes/upload
 * Upload a raw resume (PDF/DOCX)
 */
router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a file' });
    }

    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const result = await forwardFileToDjango(
      '/api/resumes/upload/',
      formData,
      { authorization: req.headers.authorization }
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/resumes
 * List all resumes for the authenticated user.
 */
router.get('/', async (req, res, next) => {
  try {
    const result = await forwardToDjango('GET', '/api/resumes/', {
      headers: { authorization: req.headers.authorization },
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/resumes
 * Create a new resume. Validates the resume data first.
 */
router.post('/', validate(resumeSchema), async (req, res, next) => {
  try {
    const result = await forwardToDjango('POST', '/api/resumes/', {
      data: req.validatedBody,
      headers: { authorization: req.headers.authorization },
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/resumes/:id
 * Get a specific resume.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const result = await forwardToDjango('GET', `/api/resumes/${req.params.id}/`, {
      headers: { authorization: req.headers.authorization },
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/resumes/:id
 * Update a specific resume.
 */
router.put('/:id', validate(resumeSchema), async (req, res, next) => {
  try {
    const result = await forwardToDjango('PUT', `/api/resumes/${req.params.id}/`, {
      data: req.validatedBody,
      headers: { authorization: req.headers.authorization },
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/resumes/:id
 * Delete a specific resume.
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await forwardToDjango('DELETE', `/api/resumes/${req.params.id}/`, {
      headers: { authorization: req.headers.authorization },
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
