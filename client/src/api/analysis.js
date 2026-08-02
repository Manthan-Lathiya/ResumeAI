/**
 * Analysis API Functions
 */

import api from './axios';

/**
 * Analyze a resume.
 * @param {File|null} file - Uploaded file (PDF/DOCX)
 * @param {string|null} resumeId - ID of a saved resume
 */
export const analyzeResume = (file, resumeId) => {
  // If uploading a file, use FormData (multipart/form-data)
  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    if (resumeId) formData.append('resumeId', resumeId);

    return api.post('/analysis/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  // If using a saved resume, send as JSON
  return api.post('/analysis/analyze', { resumeId });
};

/**
 * Compare a resume against a job description.
 * @param {string} resumeId - ID of the resume to compare
 * @param {string} jobDescription - The job description text
 */
export const compareJobDescription = (resumeId, jobDescription) =>
  api.post('/analysis/compare-jd', { resumeId, jobDescription });

// Get analysis history
export const getAnalysisHistory = () =>
  api.get('/analysis/history');
