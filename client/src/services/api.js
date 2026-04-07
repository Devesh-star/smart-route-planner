import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const computeRoute = (start, end, preference) =>
  api.post('/route', { start, end, preference }).then(r => r.data);

export const getGraph = () =>
  api.get('/graph').then(r => r.data);

export const submitReport = (data) =>
  api.post('/report', data).then(r => r.data);

export const getReports = () =>
  api.get('/reports').then(r => r.data);

export const updateReport = (id, data) =>
  api.patch(`/report/${id}`, data).then(r => r.data);
