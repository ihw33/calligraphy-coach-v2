/**
 * Authentication types for calligraphy coach app
 */

export interface User {
  id: string;
  email: string;
  name?: string;
  provider: 'google' | 'apple' | 'kakao';
  profileImage?: string;
}

export interface AuthResult {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface AuthError extends Error {
  provider?: 'google' | 'apple' | 'kakao';
  code?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

// Data types for our simplified system
export interface WritingSession {
  id: string;
  userId: string;
  targetCharacter: string;
  course?: string;
  deviceType: 'web' | 'mobile';
  inputMethod: 'touch' | 'pen' | 'mouse';
  createdAt: number; // timestamp
  duration: number; // milliseconds
  averageScore: number;
  isCompleted: boolean;
}

export interface WritingAttempt {
  id: string;
  sessionId: string;
  userId: string;
  targetCharacter: string;
  strokeData: Array<{ x: number; y: number; timestamp: number }>;
  pressureData: number[];
  score: number;
  feedback: {
    overall: string;
    shape: string;
    proportion: string;
    thickness: string;
    strokeOrder: string;
  };
  createdAt: number; // timestamp
  duration: number; // minutes
}