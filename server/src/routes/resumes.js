const express = require('express');
const router = express.Router();
const FormData = require('form-data');
const { forwardToDjango, forwardFileToDjango } = require('../proxy/djangoProxy');
const { resumeSchema, validate } = require('../validators/resumeValidator');
const { generalLimiter, aiLimiter } = require('../middleware/rateLimiter');
const { upload } = require('../middleware/upload');

router.use(generalLimiter);

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

router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a file' });

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
