/**
 * Express Server Entry Point
 *
 * This file starts the Express server.
 * The actual app configuration is in src/app.js
 */

// Load environment variables from .env file FIRST (before anything else)
require('dotenv').config();

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🚀 Express Gateway running on http://localhost:${PORT}`);
  console.log(`📡 Proxying to Django at ${process.env.DJANGO_URL || 'http://localhost:8000'}`);
  console.log(`🌐 CORS allowed for ${process.env.CORS_ORIGIN || 'http://localhost:5173'}\n`);
});
