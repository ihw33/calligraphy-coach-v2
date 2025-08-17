/**
 * 서예 코치 v2 디자인 토큰 - 통합 내보내기
 */

export * from './colors';
export * from './typography';
export * from './spacing';

// 통합 테마 객체
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

export const theme = {
  colors,
  typography,
  spacing,
} as const;

// 테마 타입
export type Theme = typeof theme;
