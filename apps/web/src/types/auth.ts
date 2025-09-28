/**
 * Authentication related type definitions
 */

export interface User {
  id: string;
  email: string;
  name?: string;
  provider: 'google' | 'apple' | 'kakao';
}

export interface AuthResult {
  token: string;
  user: User;
}

export interface AuthError extends Error {
  code?: string;
  provider?: string;
}

// OAuth provider interface
export interface AuthProvider {
  signIn(): Promise<AuthResult>;
}

// Auth store interface
export interface AuthStoreInterface {
  getToken(): string | null;
  setToken(token: string): void;
  getUser(): User | null;
  setUser(user: User): void;
  clear(): void;
}

// Auth validator interface
export interface AuthValidatorInterface {
  validateToken(token: string): Promise<boolean>;
  refreshToken(token: string): Promise<string>;
}
