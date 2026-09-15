const express = require('express');
const router = express.Router();
const { forwardToDjango } = require('../proxy/djangoProxy');
const { signupSchema, loginSchema, refreshSchema, validate } = require('../validators/authValidator');
const { generalLimiter } = require('../middleware/rateLimiter');

router.use(generalLimiter);

router.post('/signup', validate(signupSchema), async (req, res, next) => {
  try {
    const result = await forwardToDjango('POST', '/api/users/signup/', { data: req.validatedBody });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const result = await forwardToDjango('POST', '/api/users/login/', { data: req.validatedBody });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

router.post('/refresh', validate(refreshSchema), async (req, res, next) => {
  try {
    const result = await forwardToDjango('POST', '/api/users/refresh/', { data: req.validatedBody });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

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
