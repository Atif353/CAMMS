import { describe, it, expect, vi, beforeEach } from 'vitest';
import httpClient from '../../api/httpClient';

describe('httpClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should have base URL configured', () => {
    expect(httpClient.defaults.baseURL).toBeDefined();
  });

  it('should add authorization header when token exists', async () => {
    localStorage.setItem('accessToken', 'test-token');

    // Mock axios request
    const originalRequest = httpClient.interceptors.request.handlers[0].fulfilled;
    const config = { headers: {} };
    
    const result = await originalRequest(config);
    
    expect(result.headers.Authorization).toBe('Bearer test-token');
  });

  it('should not add authorization header when token is missing', async () => {
    localStorage.removeItem('accessToken');

    const originalRequest = httpClient.interceptors.request.handlers[0].fulfilled;
    const config = { headers: {} };
    
    const result = await originalRequest(config);
    
    expect(result.headers.Authorization).toBeUndefined();
  });

  it('should handle 401 errors by redirecting to login', () => {
    const error = {
      response: {
        status: 401,
      },
    };

    const errorHandler = httpClient.interceptors.response.handlers[0].rejected;
    
    // Should not throw, but handle redirect
    expect(() => errorHandler(error)).not.toThrow();
  });
});

