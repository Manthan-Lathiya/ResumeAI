import axios from './axios';

/**
 * Generate AI cover letter paragraphs
 */
export async function generateCoverLetter(data) {
  return axios.post('/cover-letters/generate', data);
}

/**
 * Get all saved cover letters for current user
 */
export async function getCoverLetters() {
  return axios.get('/cover-letters');
}

/**
 * Get single cover letter by ID
 */
export async function getCoverLetter(id) {
  return axios.get(`/cover-letters/${id}`);
}

/**
 * Save new cover letter
 */
export async function createCoverLetter(data) {
  return axios.post('/cover-letters', data);
}

/**
 * Update existing cover letter
 */
export async function updateCoverLetter(id, data) {
  return axios.put(`/cover-letters/${id}`, data);
}

/**
 * Delete cover letter
 */
export async function deleteCoverLetter(id) {
  return axios.delete(`/cover-letters/${id}`);
}
