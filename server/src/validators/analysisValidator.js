/**
 * Analysis Validators — Zod Schemas
 */

const { z } = require('zod');
const { validate } = require('./authValidator');

const compareJDSchema = z.object({
  resumeId: z.string().optional().nullable(),
  jobDescription: z
    .string({ required_error: 'Job description is required' })
    .min(50, 'Job description must be at least 50 characters'),
});

module.exports = { compareJDSchema, validate };
