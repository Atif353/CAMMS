import httpClient from './httpClient';

export const authApi = {
  signup: (data) => httpClient.post('/auth/signup', data),
  login: (data) => httpClient.post('/auth/login', data),
};

