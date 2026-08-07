import axios from './axios';

/**
 * Generate customized interview prep questions and STAR model answers
 */
export async function generateInterviewPrep(data) {
  return axios.post('/interview/generate', data);
}
