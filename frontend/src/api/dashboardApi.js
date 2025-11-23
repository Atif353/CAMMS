import httpClient from './httpClient';

export const dashboardApi = {
  getInstructor: (params = {}) => httpClient.get('/dashboard/instructor', { params }),
  getAdmin: (params = {}) => httpClient.get('/dashboard/admin', { params }),
};

