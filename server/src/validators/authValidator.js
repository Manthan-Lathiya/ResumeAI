/**
 * Auth Validators — Zod Schemas
 *
 * Zod is a schema validation library that validates data BEFORE
 * it reaches Django. This catches bad data early and returns
 * clear error messages.
 *
 * Think of it as a bouncer — checks if the data looks right
 * before letting it into the club (Django).
 */

const { z } = require('zod');

// Signup validation schema
const signupSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name is too long'),

  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address'),

  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

// Login validation schema
const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address'),

  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

// Refresh token validation schema
const refreshSchema = z.object({
  refreshToken: z
    .string({ required_error: 'Refresh token is required' })
    .min(1, 'Refresh token is required'),
});

/**
 * Middleware factory — creates a validation middleware from a Zod schema.
 *
 * Usage: router.post('/signup', validate(signupSchema), handler)
 *
 * If validation fails, returns 400 with error details.
 * If it passes, the cleaned data is available on req.validatedBody.
 */
function validate(schema) {
  return (req, res, next) => {
    try {
      // Parse and validate the request body
      const validated = schema.parse(req.body);
      req.validatedBody = validated;
      next();  // Validation passed — continue to the route handler
    } catch (error) {
      // Validation failed — return errors
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        return res.status(400).json({ errors });
      }
      next(error);
    }
  };
}

module.exports = {
  signupSchema,
  loginSchema,
  refreshSchema,
  validate,
};
