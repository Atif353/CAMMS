import httpClient from './httpClient';

export const userApi = {
  getAll: (params) => httpClient.get('/users', { params }),
  getById: (id) => httpClient.get(`/users/${id}`),
  create: (data) => httpClient.post('/users', data),
  update: (id, data) => httpClient.put(`/users/${id}`, data),
  delete: (id) => httpClient.delete(`/users/${id}`),
  getInstructors: () => httpClient.get('/users', { params: { role: 'INSTRUCTOR' } }),
};
