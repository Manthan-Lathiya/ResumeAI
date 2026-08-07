import axios from './axios';

/**
 * Tailor resume data to target Job Description keywords using AI
 */
export async function tailorResume(data) {
  return axios.post('/tailor/generate', data);
}
