import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SocialLogin } from '../SocialLogin';
import { GoogleAuthProvider, AppleAuthProvider, KakaoAuthProvider } from '@utils/auth';

vi.mock('@utils/auth', () => ({
  GoogleAuthProvider: {
    signIn: vi.fn(),
  },
  AppleAuthProvider: {
    signIn: vi.fn(),
  },
  KakaoAuthProvider: {
    signIn: vi.fn(),
  },
}));

// Mock storage
vi.mock('@utils/storage', () => ({
  AuthStore: {
    setToken: vi.fn(),
    setUser: vi.fn(),
  },
}));

describe('SocialLogin Component', () => {
  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all social login buttons', () => {
      render(<SocialLogin onSuccess={mockOnSuccess} onError={mockOnError} />);

      // 구글 로그인 버튼
      expect(screen.getByRole('button', { name: /구글로 로그인/i })).toBeInTheDocument();

      // 애플 로그인 버튼
      expect(screen.getByRole('button', { name: /애플로 로그인/i })).toBeInTheDocument();

      // 카카오 로그인 버튼
      expect(screen.getByRole('button', { name: /카카오로 로그인/i })).toBeInTheDocument();
    });

    it('should display appropriate icons for each provider', () => {
      render(<SocialLogin onSuccess={mockOnSuccess} onError={mockOnError} />);

      // Google icon
      expect(screen.getByTestId('google-icon')).toBeInTheDocument();

      // Apple icon
      expect(screen.getByTestId('apple-icon')).toBeInTheDocument();

      // Kakao icon
      expect(screen.getByTestId('kakao-icon')).toBeInTheDocument();
    });

    it('should have proper accessibility attributes', () => {
      render(<SocialLogin onSuccess={mockOnSuccess} onError={mockOnError} />);

      const googleButton = screen.getByRole('button', { name: /구글로 로그인/i });
      const appleButton = screen.getByRole('button', { name: /애플로 로그인/i });
      const kakaoButton = screen.getByRole('button', { name: /카카오로 로그인/i });

      expect(googleButton).toHaveAttribute('aria-label', '구글로 로그인');
      expect(appleButton).toHaveAttribute('aria-label', '애플로 로그인');
      expect(kakaoButton).toHaveAttribute('aria-label', '카카오로 로그인');
    });
  });

  describe('Google Login', () => {
    it('should call Google OAuth when Google button is clicked', async () => {
      const user = userEvent.setup();
      vi.mocked(GoogleAuthProvider.signIn).mockResolvedValue({
        token: 'google-token',
        user: { id: '123', email: 'test@gmail.com', name: 'Test User', provider: 'google' },
      });

      render(<SocialLogin onSuccess={mockOnSuccess} onError={mockOnError} />);

      const googleButton = screen.getByRole('button', { name: /구글로 로그인/i });
      await user.click(googleButton);

      expect(GoogleAuthProvider.signIn).toHaveBeenCalledOnce();
    });

    it('should show loading state during Google authentication', async () => {
      const user = userEvent.setup();
      let resolveAuth: (value: any) => void;

      mockGoogleAuth.mockReturnValue(
        new Promise(resolve => {
          resolveAuth = resolve;
        })
      );

      render(<SocialLogin onSuccess={mockOnSuccess} onError={mockOnError} />);

      const googleButton = screen.getByRole('button', { name: /구글로 로그인/i });
      await user.click(googleButton);

      // Loading state
      expect(googleButton).toBeDisabled();
      expect(screen.getByText(/로그인 중.../i)).toBeInTheDocument();

      // Resolve auth
      resolveAuth!({
        token: 'google-token',
        user: { id: '123', email: 'test@gmail.com', name: 'Test User', provider: 'google' },
      });

      await waitFor(() => {
        expect(googleButton).not.toBeDisabled();
      });
    });

    it('should call onSuccess callback on successful Google login', async () => {
      const user = userEvent.setup();
      const mockAuthResult = {
        token: 'google-token',
        user: { id: '123', email: 'test@gmail.com', name: 'Test User', provider: 'google' },
      };

      mockGoogleAuth.mockResolvedValue(mockAuthResult);

      render(<SocialLogin onSuccess={mockOnSuccess} onError={mockOnError} />);

      const googleButton = screen.getByRole('button', { name: /구글로 로그인/i });
      await user.click(googleButton);

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledWith(mockAuthResult);
      });
    });

    it('should call onError callback on Google login failure', async () => {
      const user = userEvent.setup();
      const mockError = new Error('Google login failed');

      mockGoogleAuth.mockRejectedValue(mockError);

      render(<SocialLogin onSuccess={mockOnSuccess} onError={mockOnError} />);

      const googleButton = screen.getByRole('button', { name: /구글로 로그인/i });
      await user.click(googleButton);

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(mockError);
      });
    });
  });

  describe('Apple Login', () => {
    it('should call Apple OAuth when Apple button is clicked', async () => {
      const user = userEvent.setup();
      mockAppleAuth.mockResolvedValue({
        token: 'apple-token',
        user: { id: '456', email: 'test@apple.com', name: 'Apple User', provider: 'apple' },
      });

      render(<SocialLogin onSuccess={mockOnSuccess} onError={mockOnError} />);

      const appleButton = screen.getByRole('button', { name: /애플로 로그인/i });
      await user.click(appleButton);

      expect(mockAppleAuth).toHaveBeenCalledOnce();
    });

    it('should handle Apple login success', async () => {
      const user = userEvent.setup();
      const mockAuthResult = {
        token: 'apple-token',
        user: { id: '456', email: 'test@apple.com', name: 'Apple User', provider: 'apple' },
      };

      mockAppleAuth.mockResolvedValue(mockAuthResult);

      render(<SocialLogin onSuccess={mockOnSuccess} onError={mockOnError} />);

      const appleButton = screen.getByRole('button', { name: /애플로 로그인/i });
      await user.click(appleButton);

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledWith(mockAuthResult);
      });
    });
  });

  describe('Kakao Login', () => {
    it('should call Kakao OAuth when Kakao button is clicked', async () => {
      const user = userEvent.setup();
      mockKakaoAuth.mockResolvedValue({
        token: 'kakao-token',
        user: { id: '789', email: 'test@kakao.com', name: 'Kakao User', provider: 'kakao' },
      });

      render(<SocialLogin onSuccess={mockOnSuccess} onError={mockOnError} />);

      const kakaoButton = screen.getByRole('button', { name: /카카오로 로그인/i });
      await user.click(kakaoButton);

      expect(mockKakaoAuth).toHaveBeenCalledOnce();
    });

    it('should handle Kakao login success', async () => {
      const user = userEvent.setup();
      const mockAuthResult = {
        token: 'kakao-token',
        user: { id: '789', email: 'test@kakao.com', name: 'Kakao User', provider: 'kakao' },
      };

      mockKakaoAuth.mockResolvedValue(mockAuthResult);

      render(<SocialLogin onSuccess={mockOnSuccess} onError={mockOnError} />);

      const kakaoButton = screen.getByRole('button', { name: /카카오로 로그인/i });
      await user.click(kakaoButton);

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledWith(mockAuthResult);
      });
    });
  });

  describe('Error Handling', () => {
    it('should disable all buttons during any authentication', async () => {
      const user = userEvent.setup();
      let resolveAuth: (value: any) => void;

      mockGoogleAuth.mockReturnValue(
        new Promise(resolve => {
          resolveAuth = resolve;
        })
      );

      render(<SocialLogin onSuccess={mockOnSuccess} onError={mockOnError} />);

      const googleButton = screen.getByRole('button', { name: /구글로 로그인/i });
      const appleButton = screen.getByRole('button', { name: /애플로 로그인/i });
      const kakaoButton = screen.getByRole('button', { name: /카카오로 로그인/i });

      await user.click(googleButton);

      // All buttons should be disabled during authentication
      expect(googleButton).toBeDisabled();
      expect(appleButton).toBeDisabled();
      expect(kakaoButton).toBeDisabled();

      resolveAuth!({
        token: 'google-token',
        user: { id: '123', email: 'test@gmail.com', name: 'Test User', provider: 'google' },
      });

      await waitFor(() => {
        expect(googleButton).not.toBeDisabled();
        expect(appleButton).not.toBeDisabled();
        expect(kakaoButton).not.toBeDisabled();
      });
    });

    it('should display error message on authentication failure', async () => {
      const user = userEvent.setup();
      const mockError = new Error('네트워크 오류가 발생했습니다');

      mockGoogleAuth.mockRejectedValue(mockError);

      render(<SocialLogin onSuccess={mockOnSuccess} onError={mockOnError} />);

      const googleButton = screen.getByRole('button', { name: /구글로 로그인/i });
      await user.click(googleButton);

      await waitFor(() => {
        expect(screen.getByText(/로그인 중 오류가 발생했습니다/i)).toBeInTheDocument();
      });
    });
  });

  describe('Component Props', () => {
    it('should accept custom className prop', () => {
      const { container } = render(
        <SocialLogin
          onSuccess={mockOnSuccess}
          onError={mockOnError}
          className="custom-social-login"
        />
      );

      expect(container.firstChild).toHaveClass('custom-social-login');
    });

    it('should accept disabled prop to disable all buttons', () => {
      render(<SocialLogin onSuccess={mockOnSuccess} onError={mockOnError} disabled={true} />);

      expect(screen.getByRole('button', { name: /구글로 로그인/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /애플로 로그인/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /카카오로 로그인/i })).toBeDisabled();
    });
  });
});
