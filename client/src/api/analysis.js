import api from './axios';

// Accepts either a File (PDF/DOCX) or a resumeId string
export const analyzeResume = (file, resumeId, signal) => {
  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    if (resumeId) formData.append('resumeId', resumeId);
    return api.post('/analysis/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      signal,
    });
  }
  return api.post('/analysis/analyze', { resumeId }, { signal });
};

// Accepts either a File or { resumeId, jobDescription }
export const compareJobDescription = (resumeId, jobDescription, file = null, signal) => {
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
  return api.post('/analysis/compare-jd', { resumeId, jobDescription }, { signal });
};

export const getAnalysisHistory = () => api.get('/analysis/history');
