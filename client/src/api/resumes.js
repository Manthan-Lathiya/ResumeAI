/**
 * Resumes API Functions
 */

import api from './axios';

// Get all resumes for the current user
export const getResumes = () =>
  api.get('/resumes');

// Get a single resume by ID
export const getResume = (id) =>
  api.get(`/resumes/${id}`);

// Create a new resume
export const createResume = (data) =>
  api.post('/resumes', data);

// Update an existing resume
export const updateResume = (id, data) =>
  api.put(`/resumes/${id}`, data);

// Delete a resume
export const deleteResume = (id) =>
  api.delete(`/resumes/${id}`);
