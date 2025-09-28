import React, { useState } from 'react';
import { GoogleAuthProvider, AppleAuthProvider, KakaoAuthProvider } from '@utils/auth';
import type { AuthResult, AuthError } from '@types/auth';

export interface SocialLoginProps {
  onSuccess: (authResult: AuthResult) => void;
  onError: (error: AuthError) => void;
  className?: string;
  disabled?: boolean;
}

export const SocialLogin: React.FC<SocialLoginProps> = ({
  onSuccess,
  onError,
  className = '',
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (
    provider: 'google' | 'apple' | 'kakao',
    authFn: () => Promise<AuthResult>
  ) => {
    if (isLoading || disabled) return;

    try {
      setIsLoading(true);
      setError(null);

      const result = await authFn();
      onSuccess(result);
    } catch (err) {
      const authError: AuthError =
        err instanceof Error
          ? { ...err, provider }
          : new Error(`${provider} 로그인에 실패했습니다`);

      setError('로그인 중 오류가 발생했습니다');
      onError(authError);
    } finally {
      setIsLoading(false);
    }
  };

  const authProviders = {
    google: {
      handler: () => handleAuth('google', GoogleAuthProvider.signIn),
      label: '구글로 로그인',
      icon: 'google-icon',
      styles: {
        backgroundColor: '#fff',
        color: '#000',
        border: '1px solid #ddd',
      },
    },
    apple: {
      handler: () => handleAuth('apple', AppleAuthProvider.signIn),
      label: '애플로 로그인',
      icon: 'apple-icon',
      styles: {
        backgroundColor: '#000',
        color: '#fff',
        border: '1px solid #000',
      },
    },
    kakao: {
      handler: () => handleAuth('kakao', KakaoAuthProvider.signIn),
      label: '카카오로 로그인',
      icon: 'kakao-icon',
      styles: {
        backgroundColor: '#fee500',
        color: '#000',
        border: '1px solid #fee500',
      },
    },
  };

  const isDisabled = disabled || isLoading;

  const baseButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 16px',
    borderRadius: '8px',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.6 : 1,
    fontSize: '16px',
    gap: '8px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  };

  return (
    <div className={`social-login ${className}`}>
      {error && (
        <div
          className="error-message"
          style={{
            color: '#dc2626',
            marginBottom: '16px',
            padding: '8px',
            borderRadius: '4px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            fontSize: '14px',
          }}
        >
          {error}
        </div>
      )}

      {isLoading && (
        <div
          className="loading-message"
          style={{
            textAlign: 'center',
            marginBottom: '16px',
            color: '#6b7280',
            fontSize: '14px',
          }}
        >
          로그인 중...
        </div>
      )}

      <div
        className="social-buttons"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {Object.entries(authProviders).map(([provider, config]) => (
          <button
            key={provider}
            onClick={config.handler}
            disabled={isDisabled}
            aria-label={config.label}
            style={{
              ...baseButtonStyle,
              ...config.styles,
            }}
          >
            <div
              data-testid={config.icon}
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '2px',
                backgroundColor:
                  provider === 'google' ? '#4285f4' : provider === 'apple' ? '#fff' : '#3c1e1e',
              }}
            />
            {config.label}
          </button>
        ))}
      </div>
    </div>
  );
};
