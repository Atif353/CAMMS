import httpClient from './httpClient';

export const activityApi = {
  getAll: (params) => httpClient.get('/activities', { params }),
  getById: (id) => httpClient.get(`/activities/${id}`),
  create: (data) => httpClient.post('/activities', data),
  update: (id, data) => httpClient.put(`/activities/${id}`, data),
  delete: (id) => httpClient.delete(`/activities/${id}`),
  markAsCompleted: (id) => httpClient.patch(`/activities/${id}/complete`),
};

