/**
 * Analysis API Functions
 */

import api from './axios';

/**
 * Analyze a resume.
 * @param {File|null} file - Uploaded file (PDF/DOCX)
 * @param {string|null} resumeId - ID of a saved resume
 * @param {AbortSignal} [signal] - Optional abort signal
 */
export const analyzeResume = (file, resumeId, signal) => {
  // If uploading a file, use FormData (multipart/form-data)
  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    if (resumeId) formData.append('resumeId', resumeId);

    return api.post('/analysis/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      signal,
    });
  }

  // If using a saved resume, send as JSON
  return api.post('/analysis/analyze', { resumeId }, { signal });
};

/**
 * Compare a resume against a job description.
 * @param {string|null} resumeId - ID of the resume to compare (optional if file provided)
 * @param {string} jobDescription - The job description text
 * @param {File|null} file - Optional uploaded file (PDF/DOCX)
 * @param {AbortSignal} [signal] - Optional abort signal
 */
export const compareJobDescription = (resumeId, jobDescription, file = null, signal) => {
  // If uploading a file, use FormData (multipart/form-data)
  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobDescription', jobDescription);
    if (resumeId) formData.append('resumeId', resumeId);

    return api.post('/analysis/compare-jd', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      signal,
    });
  }

  // No file — send as JSON
  return api.post('/analysis/compare-jd', { resumeId, jobDescription }, { signal });
};

// Get analysis history
export const getAnalysisHistory = () =>
  api.get('/analysis/history');
