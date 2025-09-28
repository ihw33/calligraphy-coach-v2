import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';

// Simple mock of storage
vi.mock('@utils/storage', () => ({
  AuthStore: {
    getToken: vi.fn().mockReturnValue(null),
    setToken: vi.fn(),
    getUser: vi.fn().mockReturnValue(null),
    setUser: vi.fn(),
    clear: vi.fn(),
  },
}));

// Simple mock of auth validator
vi.mock('@utils/auth', () => ({
  AuthValidator: {
    validateToken: vi.fn().mockResolvedValue(true),
    refreshToken: vi.fn().mockResolvedValue('new-token'),
  },
}));

describe('useAuth - Basic Functionality', () => {
  it('should initialize with unauthenticated state', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.token).toBe(null);
    expect(result.current.isLoading).toBe(false);
  });

  it('should provide login and logout functions', () => {
    const { result } = renderHook(() => useAuth());

    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
    expect(typeof result.current.updateUser).toBe('function');
  });

  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth());

    const mockToken = 'test-token';
    const mockUser = {
      id: 'user-1',
      email: 'test@test.com',
      provider: 'google',
    };

    await act(async () => {
      await result.current.login(mockToken, mockUser);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe(mockToken);
  });
});
