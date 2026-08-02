/**
 * File Upload Middleware (Multer)
 *
 * Handles multipart/form-data file uploads (PDF, DOCX).
 * Files are stored in memory (not on disk) because we immediately
 * forward them to Django for processing.
 *
 * Limits:
 * - Max file size: 10MB
 * - Allowed types: PDF, DOCX only
 */

const multer = require('multer');
const path = require('path');

// Store files in memory (as Buffer) — we'll forward them to Django
const storage = multer.memoryStorage();

// File filter — only allow PDF and DOCX
function fileFilter(req, file, cb) {
  const allowedExtensions = ['.pdf', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);   // Accept the file
  } else {
    cb(new Error('Only PDF and DOCX files are allowed'), false);
  }
}

// Create the multer upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,  // 10MB max
  },
});

module.exports = { upload };
