import { useState, useEffect, useCallback } from 'react';
import { AuthStore } from '@utils/storage';
import { AuthValidator } from '@utils/auth';
import type { User, AuthResult } from '@types/auth';

export interface UseAuthReturn {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

export function useAuth(): UseAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearAuthState = useCallback(() => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const setAuthState = useCallback((authToken: string, authUser: User) => {
    setToken(authToken);
    setUser(authUser);
    setIsAuthenticated(true);
  }, []);

  // Auto-login check on mount
  useEffect(() => {
    const checkStoredAuth = async () => {
      try {
        const storedToken = AuthStore.getToken();
        const storedUser = AuthStore.getUser();

        if (!storedToken || !storedUser) {
          return; // No stored auth data
        }

        setIsLoading(true);

        // Validate stored token
        const isValid = await AuthValidator.validateToken(storedToken);

        if (isValid) {
          setAuthState(storedToken, storedUser);
        } else {
          // Token is invalid, try to refresh
          try {
            const refreshedToken = await AuthValidator.refreshToken(storedToken);
            AuthStore.setToken(refreshedToken);
            setAuthState(refreshedToken, storedUser);
          } catch (refreshError) {
            // Refresh failed, clear auth data
            console.warn('Token refresh failed:', refreshError);
            AuthStore.clear();
            clearAuthState();
          }
        }
      } catch (error) {
        // Handle storage read errors gracefully
        console.error('Error checking stored auth:', error);
        clearAuthState();
      } finally {
        setIsLoading(false);
      }
    };

    checkStoredAuth();
  }, [setAuthState, clearAuthState]);

  const login = useCallback(async (authToken: string, authUser: User): Promise<void> => {
    try {
      setIsLoading(true);

      // Store auth data
      AuthStore.setToken(authToken);
      AuthStore.setUser(authUser);

      // Update state
      setToken(authToken);
      setUser(authUser);
      setIsAuthenticated(true);
    } catch (error) {
      // Re-throw error to let caller handle it
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);

      // Clear storage
      AuthStore.clear();

      // Clear state
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, clear the state
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback(
    (updatedUser: User): void => {
      if (!isAuthenticated) {
        return; // Don't update if not authenticated
      }

      try {
        AuthStore.setUser(updatedUser);
        setUser(updatedUser);
      } catch (error) {
        console.error('Error updating user:', error);
      }
    },
    [isAuthenticated]
  );

  return {
    isAuthenticated,
    user,
    token,
    isLoading,
    login,
    logout,
    updateUser,
  };
}
