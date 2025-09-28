/**
 * OAuth authentication utilities for social login
 */

import type { AuthResult, AuthProvider, AuthValidatorInterface } from '@types/auth';

// Base auth provider with common functionality
abstract class BaseAuthProvider implements AuthProvider {
  protected static simulateAuth(provider: 'google' | 'apple' | 'kakao'): Promise<AuthResult> {
    return new Promise(resolve => {
      setTimeout(
        () => {
          resolve({
            token: `${provider}-mock-token-${Date.now()}`,
            user: {
              id: `${provider}-${Math.random().toString(36).substr(2, 9)}`,
              email: `test@${provider === 'google' ? 'gmail' : provider}.com`,
              name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
              provider,
            },
          });
        },
        Math.random() * 200 + 100
      ); // 100-300ms delay
    });
  }

  abstract signIn(): Promise<AuthResult>;
}

export class GoogleAuthProvider extends BaseAuthProvider {
  static async signIn(): Promise<AuthResult> {
    // TODO: Replace with actual Google OAuth SDK
    // window.google?.accounts?.oauth2?.initTokenClient()
    return this.simulateAuth('google');
  }
}

export class AppleAuthProvider extends BaseAuthProvider {
  static async signIn(): Promise<AuthResult> {
    // TODO: Replace with actual Apple Sign In SDK
    // window.AppleID?.auth?.signIn()
    return this.simulateAuth('apple');
  }
}

export class KakaoAuthProvider extends BaseAuthProvider {
  static async signIn(): Promise<AuthResult> {
    // TODO: Replace with actual Kakao SDK
    // window.Kakao?.Auth?.login()
    return this.simulateAuth('kakao');
  }
}

export class AuthValidator implements AuthValidatorInterface {
  static async validateToken(token: string): Promise<boolean> {
    if (!token) return false;

    return new Promise(resolve => {
      setTimeout(() => {
        // Enhanced validation logic
        const isValidFormat = token.includes('-') && token.length > 10;
        const isNotExpired = !token.includes('expired') && !token.includes('invalid');

        resolve(isValidFormat && isNotExpired);
      }, 50);
    });
  }

  static async refreshToken(token: string): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(
        () => {
          if (!token) {
            reject(new Error('No token provided for refresh'));
            return;
          }

          if (token.includes('expired') || token.includes('invalid')) {
            reject(new Error('Token cannot be refreshed'));
            return;
          }

          // Generate new token with timestamp
          const newToken = `refreshed-${token}-${Date.now()}`;
          resolve(newToken);
        },
        Math.random() * 100 + 50
      ); // 50-150ms delay
    });
  }
}
