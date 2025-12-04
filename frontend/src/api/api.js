import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const getJobs = () => api.get('/jobs/list');
export const createJob = (jobData) => api.post('/jobs/create', jobData);
export const toggleJob = (id) => api.post(`/jobs/${id}/toggle`);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);
export const getJobLogs = (id) => api.get(`/jobs/${id}/logs`);

export default api;
