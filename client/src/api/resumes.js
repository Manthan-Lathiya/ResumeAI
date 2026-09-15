import api from './axios';

export const getResumes = () => api.get('/resumes');
export const getResume = (id) => api.get(`/resumes/${id}`);
export const createResume = (data) => api.post('/resumes', data);
export const updateResume = (id, data) => api.put(`/resumes/${id}`, data);
export const deleteResume = (id) => api.delete(`/resumes/${id}`);

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const generateResumeWithAI = (params) => api.post('/resumes/generate', params);
export const enhanceFieldWithAI = (params) => api.post('/resumes/enhance-field', params);
