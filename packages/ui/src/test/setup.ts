/**
 * Jest 테스트 설정 파일
 */

// 전역 테스트 설정
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
