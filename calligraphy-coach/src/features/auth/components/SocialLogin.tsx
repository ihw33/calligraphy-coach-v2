import React, { useState } from 'react';
import { GoogleAuthProvider, AppleAuthProvider, KakaoAuthProvider } from '../../../utils/auth';
import { Button } from '../../../components/ui/button';
import type { AuthResult } from '../../../types/auth';

export interface SocialLoginProps {
  onSuccess: (authResult: AuthResult) => void;
  onError: (error: Error) => void;
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
      const errorMessage = err instanceof Error ? err.message : `${provider} 로그인에 실패했습니다`;
      setError('로그인 중 오류가 발생했습니다');
      onError(new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  const authProviders = [
    {
      key: 'google' as const,
      handler: () => handleAuth('google', GoogleAuthProvider.signIn),
      label: '구글로 로그인',
      icon: (
        <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
          <span className="text-xs font-bold text-blue-600">G</span>
        </div>
      ),
      className: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
    },
    {
      key: 'apple' as const,
      handler: () => handleAuth('apple', AppleAuthProvider.signIn),
      label: '애플로 로그인',
      icon: (
        <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
          <span className="text-xs font-bold text-white">🍎</span>
        </div>
      ),
      className: 'bg-black text-white hover:bg-gray-800',
    },
    {
      key: 'kakao' as const,
      handler: () => handleAuth('kakao', KakaoAuthProvider.signIn),
      label: '카카오로 로그인',
      icon: (
        <div className="w-5 h-5 bg-yellow-400 rounded flex items-center justify-center">
          <span className="text-xs font-bold text-yellow-900">K</span>
        </div>
      ),
      className: 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500',
    },
  ];

  const isDisabled = disabled || isLoading;

  return (
    <div className={`social-login space-y-4 ${className}`}>
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="text-center p-3 text-gray-600">
          <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2"></div>
          로그인 중...
        </div>
      )}

      <div className="space-y-3">
        {authProviders.map((provider) => (
          <Button
            key={provider.key}
            onClick={provider.handler}
            disabled={isDisabled}
            className={`w-full h-12 flex items-center justify-center gap-3 ${provider.className}`}
            variant="outline"
          >
            {provider.icon}
            {provider.label}
          </Button>
        ))}
      </div>
    </div>
  );
};