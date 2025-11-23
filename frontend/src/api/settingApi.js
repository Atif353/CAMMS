import httpClient from './httpClient';

export const settingApi = {
  getAll: () => httpClient.get('/settings'),
  update: (data) => httpClient.put('/settings', data),
};

