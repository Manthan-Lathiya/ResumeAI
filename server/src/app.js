/**
 * Express Application Configuration
 *
 * This is the main Express app that:
 * 1. Sets up security headers (helmet)
 * 2. Handles CORS (so React can talk to us)
 * 3. Parses JSON request bodies
 * 4. Routes requests to the appropriate handler
 * 5. Each handler validates input, then forwards to Django
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Import route handlers
const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resumes');
const analysisRoutes = require('./routes/analysis');
const coverLetterRoutes = require('./routes/coverLetters');
const interviewRoutes = require('./routes/interview');
const tailorRoutes = require('./routes/tailor');

// Import error handling middleware
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// ──────────────────────────────────────────────
// MIDDLEWARE (runs on EVERY request)
// ──────────────────────────────────────────────

// Security headers — adds various HTTP headers to protect against common attacks
app.use(helmet());

// CORS — allow the React frontend to make requests to this server
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,  // Allow cookies and auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request logging — prints each request to the console (helpful for debugging)
app.use(morgan('dev'));

// Parse JSON request bodies (e.g., { "email": "...", "password": "..." })
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ──────────────────────────────────────────────
// ROUTES
// ──────────────────────────────────────────────

// Health check endpoint — useful for monitoring
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'express-gateway' });
});

// Auth routes: /api/auth/signup, /api/auth/login, etc.
app.use('/api/auth', authRoutes);

// Resume routes: /api/resumes, /api/resumes/:id
app.use('/api/resumes', resumeRoutes);

// Analysis routes: /api/analysis/analyze, /api/analysis/compare-jd
app.use('/api/analysis', analysisRoutes);

// Cover Letter routes: /api/cover-letters
app.use('/api/cover-letters', coverLetterRoutes);

// Interview routes: /api/interview/generate
app.use('/api/interview', interviewRoutes);

// Tailor routes: /api/tailor/generate
app.use('/api/tailor', tailorRoutes);

// ──────────────────────────────────────────────
// ERROR HANDLING (must be LAST)
// ──────────────────────────────────────────────

// Handle 404 — no route matched
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler — catches all errors thrown in route handlers
app.use(errorHandler);

module.exports = app;
