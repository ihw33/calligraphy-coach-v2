import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from '../useAuth';

// Mock storage utilities
const mockAuthStore = {
  getToken: vi.fn(),
  setToken: vi.fn(),
  getUser: vi.fn(),
  setUser: vi.fn(),
  clear: vi.fn(),
};

const mockSettingsStore = {
  get: vi.fn(),
  set: vi.fn(),
};

vi.mock('@utils/storage', () => ({
  AuthStore: mockAuthStore,
  SettingsStore: mockSettingsStore,
}));

// Mock auth providers
const mockValidateToken = vi.fn();
const mockRefreshToken = vi.fn();

vi.mock('@utils/auth', () => ({
  AuthValidator: {
    validateToken: mockValidateToken,
    refreshToken: mockRefreshToken,
  },
}));

// Mock user data
const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  provider: 'google' as const,
};

const mockToken = 'mock-jwt-token';

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock return values
    mockAuthStore.getToken.mockReturnValue(null);
    mockAuthStore.getUser.mockReturnValue(null);
    mockSettingsStore.get.mockReturnValue({
      fontStyle: 'panbon',
      learningAmount: 10,
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Initial State', () => {
    it('should initialize with unauthenticated state when no stored auth', () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
      expect(result.current.token).toBe(null);
      expect(result.current.isLoading).toBe(false);
    });

    it('should initialize with stored auth data when available', async () => {
      mockAuthStore.getToken.mockReturnValue(mockToken);
      mockAuthStore.getUser.mockReturnValue(mockUser);
      mockValidateToken.mockResolvedValue(true);

      const { result } = renderHook(() => useAuth());

      // Initially loading
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.token).toBe(mockToken);
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should clear auth state if stored token is invalid', async () => {
      mockAuthStore.getToken.mockReturnValue('invalid-token');
      mockAuthStore.getUser.mockReturnValue(mockUser);
      mockValidateToken.mockResolvedValue(false);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBe(null);
        expect(mockAuthStore.clear).toHaveBeenCalledOnce();
      });
    });
  });

  describe('Login Function', () => {
    it('should successfully log in user with valid credentials', async () => {
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login(mockToken, mockUser);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe(mockToken);
      expect(mockAuthStore.setToken).toHaveBeenCalledWith(mockToken);
      expect(mockAuthStore.setUser).toHaveBeenCalledWith(mockUser);
    });

    it('should handle login errors gracefully', async () => {
      mockAuthStore.setToken.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const loginResult = result.current.login(mockToken, mockUser);
        await expect(loginResult).rejects.toThrow('Storage error');
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
    });

    it('should update loading state during login', async () => {
      const { result } = renderHook(() => useAuth());

      let loginPromise: Promise<void>;

      act(() => {
        loginPromise = result.current.login(mockToken, mockUser);
        // Check loading state immediately after calling login
        expect(result.current.isLoading).toBe(true);
      });

      await act(async () => {
        await loginPromise!;
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Logout Function', () => {
    it('should successfully log out authenticated user', async () => {
      // First log in
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login(mockToken, mockUser);
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Then log out
      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
      expect(result.current.token).toBe(null);
      expect(mockAuthStore.clear).toHaveBeenCalledOnce();
    });

    it('should handle logout when user is not authenticated', async () => {
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(mockAuthStore.clear).toHaveBeenCalledOnce();
    });

    it('should update loading state during logout', async () => {
      const { result } = renderHook(() => useAuth());

      let logoutPromise: Promise<void>;

      act(() => {
        logoutPromise = result.current.logout();
        expect(result.current.isLoading).toBe(true);
      });

      await act(async () => {
        await logoutPromise!;
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Token Refresh', () => {
    it('should automatically refresh expired token', async () => {
      const newToken = 'refreshed-token';
      mockAuthStore.getToken.mockReturnValue(mockToken);
      mockAuthStore.getUser.mockReturnValue(mockUser);
      mockValidateToken.mockResolvedValue(false); // Token is expired
      mockRefreshToken.mockResolvedValue(newToken);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(mockRefreshToken).toHaveBeenCalledWith(mockToken);
        expect(mockAuthStore.setToken).toHaveBeenCalledWith(newToken);
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.token).toBe(newToken);
      });
    });

    it('should logout if token refresh fails', async () => {
      mockAuthStore.getToken.mockReturnValue(mockToken);
      mockAuthStore.getUser.mockReturnValue(mockUser);
      mockValidateToken.mockResolvedValue(false);
      mockRefreshToken.mockRejectedValue(new Error('Refresh failed'));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
        expect(mockAuthStore.clear).toHaveBeenCalledOnce();
      });
    });
  });

  describe('User Update', () => {
    it('should update user information', async () => {
      const { result } = renderHook(() => useAuth());

      // First log in
      await act(async () => {
        await result.current.login(mockToken, mockUser);
      });

      const updatedUser = { ...mockUser, name: 'Updated Name' };

      await act(async () => {
        result.current.updateUser(updatedUser);
      });

      expect(result.current.user).toEqual(updatedUser);
      expect(mockAuthStore.setUser).toHaveBeenCalledWith(updatedUser);
    });

    it('should not update user when not authenticated', async () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.updateUser(mockUser);
      });

      expect(result.current.user).toBe(null);
      expect(mockAuthStore.setUser).not.toHaveBeenCalled();
    });
  });

  describe('Auto-login Check', () => {
    it('should perform auto-login check on mount', async () => {
      mockAuthStore.getToken.mockReturnValue(mockToken);
      mockAuthStore.getUser.mockReturnValue(mockUser);
      mockValidateToken.mockResolvedValue(true);

      const { result } = renderHook(() => useAuth());

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(mockValidateToken).toHaveBeenCalledWith(mockToken);
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should skip auto-login when no stored token', () => {
      mockAuthStore.getToken.mockReturnValue(null);

      const { result } = renderHook(() => useAuth());

      expect(result.current.isLoading).toBe(false);
      expect(mockValidateToken).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle storage read errors gracefully', async () => {
      mockAuthStore.getToken.mockImplementation(() => {
        throw new Error('Storage read error');
      });

      const { result } = renderHook(() => useAuth());

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle token validation errors', async () => {
      mockAuthStore.getToken.mockReturnValue(mockToken);
      mockAuthStore.getUser.mockReturnValue(mockUser);
      mockValidateToken.mockRejectedValue(new Error('Validation error'));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
        expect(mockAuthStore.clear).toHaveBeenCalledOnce();
      });
    });
  });

  describe('State Consistency', () => {
    it('should maintain consistent state between authenticated and unauthenticated', async () => {
      const { result } = renderHook(() => useAuth());

      // Start unauthenticated
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
      expect(result.current.token).toBe(null);

      // Log in
      await act(async () => {
        await result.current.login(mockToken, mockUser);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe(mockToken);

      // Log out
      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
      expect(result.current.token).toBe(null);
    });
  });

  describe('Hook Return Value', () => {
    it('should return all required properties and methods', () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current).toHaveProperty('isAuthenticated');
      expect(result.current).toHaveProperty('user');
      expect(result.current).toHaveProperty('token');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('login');
      expect(result.current).toHaveProperty('logout');
      expect(result.current).toHaveProperty('updateUser');

      expect(typeof result.current.login).toBe('function');
      expect(typeof result.current.logout).toBe('function');
      expect(typeof result.current.updateUser).toBe('function');
    });
  });
});
