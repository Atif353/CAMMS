import httpClient from './httpClient';

export const reportApi = {
  generate: (data) => httpClient.post('/reports/generate', data, {
    responseType: 'blob', // Changed to blob since generate now returns file
  }),
  generateFile: (data, format = 'pdf') => 
    httpClient.post(`/reports/generate-file?format=${format}`, data, {
      responseType: 'blob',
    }),
  getAll: (params) => httpClient.get('/reports', { params }),
  getById: (id) => httpClient.get(`/reports/${id}`),
  delete: (id) => httpClient.delete(`/reports/${id}`),
};

