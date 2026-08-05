/**
 * Resume Validators — Zod Schemas
 *
 * Validates resume data before forwarding to Django.
 */

const { z } = require('zod');

// Schema for creating/updating a resume
const resumeSchema = z.object({
  title: z
    .string({ required_error: 'Resume title is required' })
    .min(1, 'Resume title cannot be empty')
    .max(255, 'Title is too long'),

  personalInfo: z.object({
    fullName: z.string().optional().default(''),
    email: z.string().email().optional().or(z.literal('')).default(''),
    phone: z.string().optional().default(''),
    location: z.string().optional().default(''),
    linkedin: z.string().optional().default(''),
    website: z.string().optional().default(''),
  }).optional().default({}),

  summary: z.string().optional().default(''),

  experience: z.array(z.object({
    company: z.string().optional().default(''),
    title: z.string().optional().default(''),
    location: z.string().optional().default(''),
    startDate: z.string().optional().default(''),
    endDate: z.string().optional().default(''),
    current: z.boolean().optional().default(false),
    bullets: z.array(z.string()).optional().default([]),
  })).optional().default([]),

  education: z.array(z.object({
    institution: z.string().optional().default(''),
    degree: z.string().optional().default(''),
    startDate: z.string().optional().default(''),
    endDate: z.string().optional().default(''),
    gpa: z.string().optional().default(''),
  })).optional().default([]),

  skills: z.array(z.string()).optional().default([]),

  projects: z.array(z.object({
    name: z.string().optional().default(''),
    description: z.string().optional().default(''),
    technologies: z.array(z.string()).optional().default([]),
    link: z.string().optional().default(''),
  })).optional().default([]),

  status: z.enum(['draft', 'complete']).optional().default('draft'),
}).transform((data) => ({
  // Convert camelCase (frontend) to snake_case (Django)
  title: data.title,
  personal_info: data.personalInfo,
  summary: data.summary,
  experience: data.experience,
  education: data.education,
  skills: data.skills,
  projects: data.projects,
  status: data.status,
}));

// Reuse the validate middleware from authValidator
const { validate } = require('./authValidator');

module.exports = { resumeSchema, validate };
