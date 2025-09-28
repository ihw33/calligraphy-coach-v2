/**
 * Authentication utilities for social login
 */

import type { AuthResult, User } from '../types/auth';

// Mock providers for now - will be replaced with actual OAuth implementations
export class GoogleAuthProvider {
  static async signIn(): Promise<AuthResult> {
    // Simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: 'google_' + Date.now(),
      email: 'user@gmail.com',
      name: '구글 사용자',
      provider: 'google',
      profileImage: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
    };

    return {
      user,
      token: 'mock_google_token_' + Date.now(),
      refreshToken: 'mock_refresh_token'
    };
  }
}

export class AppleAuthProvider {
  static async signIn(): Promise<AuthResult> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: 'apple_' + Date.now(),
      email: 'user@icloud.com',
      name: '애플 사용자',
      provider: 'apple',
    };

    return {
      user,
      token: 'mock_apple_token_' + Date.now(),
    };
  }
}

export class KakaoAuthProvider {
  static async signIn(): Promise<AuthResult> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: 'kakao_' + Date.now(),
      email: 'user@kakao.com',
      name: '카카오 사용자',
      provider: 'kakao',
      profileImage: 'http://k.kakaocdn.net/dn/profile_image.jpg'
    };

    return {
      user,
      token: 'mock_kakao_token_' + Date.now(),
    };
  }
}

export class AuthValidator {
  static async validateToken(token: string): Promise<boolean> {
    // Mock validation - always returns true for now
    return token.startsWith('mock_');
  }

  static async refreshToken(token: string): Promise<string> {
    // Mock refresh
    return token + '_refreshed';
  }
}