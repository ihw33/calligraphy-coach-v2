import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SocialLogin } from '../SocialLogin';

// Simple mock of auth utils
vi.mock('@utils/auth', () => ({
  GoogleAuthProvider: {
    signIn: vi.fn().mockResolvedValue({
      token: 'test-token',
      user: { id: '1', email: 'test@test.com', provider: 'google' },
    }),
  },
  AppleAuthProvider: {
    signIn: vi.fn().mockResolvedValue({
      token: 'test-token',
      user: { id: '1', email: 'test@test.com', provider: 'apple' },
    }),
  },
  KakaoAuthProvider: {
    signIn: vi.fn().mockResolvedValue({
      token: 'test-token',
      user: { id: '1', email: 'test@test.com', provider: 'kakao' },
    }),
  },
}));

describe('SocialLogin - Basic Rendering', () => {
  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();

  it('should render all three social login buttons', () => {
    render(<SocialLogin onSuccess={mockOnSuccess} onError={mockOnError} />);

    expect(screen.getByRole('button', { name: /구글로 로그인/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /애플로 로그인/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /카카오로 로그인/i })).toBeInTheDocument();
  });

  it('should display provider icons', () => {
    render(<SocialLogin onSuccess={mockOnSuccess} onError={mockOnError} />);

    expect(screen.getByTestId('google-icon')).toBeInTheDocument();
    expect(screen.getByTestId('apple-icon')).toBeInTheDocument();
    expect(screen.getByTestId('kakao-icon')).toBeInTheDocument();
  });
});
