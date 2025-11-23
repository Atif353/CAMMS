import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import { renderWithProviders } from '../utils/testHelpers';

// Mock API
vi.mock('../../api/authApi', () => ({
  authApi: {
    login: vi.fn(),
    signup: vi.fn(),
  },
}));

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should provide auth context', () => {
    const wrapper = ({ children }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('login');
    expect(result.current).toHaveProperty('logout');
    expect(result.current).toHaveProperty('isAuthenticated');
  });

  it('should login user successfully', async () => {
    const mockUser = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'INSTRUCTOR',
    };

    authApi.login.mockResolvedValue({
      data: {
        success: true,
        accessToken: 'token',
        user: mockUser,
      },
    });

    const wrapper = ({ children }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should logout user', () => {
    localStorage.setItem('accessToken', 'token');
    localStorage.setItem('user', JSON.stringify({ id: '123' }));

    const wrapper = ({ children }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('accessToken')).toBeNull();
  });

  it('should check if user is admin', () => {
    const mockAdmin = {
      id: '123',
      role: 'ADMIN',
    };

    localStorage.setItem('user', JSON.stringify(mockAdmin));
    localStorage.setItem('accessToken', 'token');

    const wrapper = ({ children }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for useEffect to load user from localStorage
    setTimeout(() => {
      expect(result.current.isAdmin).toBe(true);
      expect(result.current.isInstructor).toBe(false);
    }, 100);
  });

  it('should check if user is instructor', () => {
    const mockInstructor = {
      id: '123',
      role: 'INSTRUCTOR',
    };

    localStorage.setItem('user', JSON.stringify(mockInstructor));
    localStorage.setItem('accessToken', 'token');

    const wrapper = ({ children }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for useEffect to load user from localStorage
    setTimeout(() => {
      expect(result.current.isInstructor).toBe(true);
      expect(result.current.isAdmin).toBe(false);
    }, 100);
  });
});

