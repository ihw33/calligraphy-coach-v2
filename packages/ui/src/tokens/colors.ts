/**
 * 서예 코치 v2 디자인 토큰 - 색상 시스템
 * 한국 전통 색상을 기반으로 한 현대적 디자인 시스템
 */

export const colors = {
  // 메인 브랜드 색상 - 전통 먹색과 녹색
  primary: {
    main: '#2E7D32',      // 전통 녹색 (솔잎색)
    light: '#4CAF50',     // 밝은 녹색
    dark: '#1B5E20',      // 진한 녹색
    contrast: '#FFFFFF',  // 대비색
  },

  // 보조 색상 - 전통 적색
  secondary: {
    main: '#D32F2F',      // 전통 적색 (단청색)
    light: '#EF5350',     // 밝은 적색
    dark: '#B71C1C',      // 진한 적색
    contrast: '#FFFFFF',  // 대비색
  },

  // 먹색 계열 - 서예의 핵심 색상
  ink: {
    black: '#212121',     // 진한 먹색
    dark: '#424242',      // 중간 먹색
    medium: '#757575',    // 회색 먹색
    light: '#BDBDBD',     // 연한 먹색
    paper: '#FAFAFA',     // 한지색
  },

  // 기능성 색상
  semantic: {
    success: '#4CAF50',   // 성공 (녹색)
    warning: '#FF9800',   // 경고 (황색)
    error: '#F44336',     // 오류 (적색)
    info: '#2196F3',      // 정보 (청색)
  },

  // 배경 색상
  background: {
    primary: '#FFFFFF',   // 메인 배경
    secondary: '#F5F5F5', // 보조 배경
    paper: '#FAFAFA',     // 종이 배경
    elevated: '#FFFFFF',  // 상승된 요소 배경
  },

  // 텍스트 색상
  text: {
    primary: '#212121',   // 메인 텍스트
    secondary: '#757575', // 보조 텍스트
    disabled: '#BDBDBD',  // 비활성화 텍스트
    hint: '#9E9E9E',      // 힌트 텍스트
    inverse: '#FFFFFF',   // 역방향 텍스트
  },

  // 선 및 경계선
  border: {
    light: '#E0E0E0',     // 연한 경계선
    medium: '#BDBDBD',    // 중간 경계선
    dark: '#757575',      // 진한 경계선
    focus: '#2E7D32',     // 포커스 경계선
  },

  // 오버레이 및 그림자
  overlay: {
    light: 'rgba(0, 0, 0, 0.04)',
    medium: 'rgba(0, 0, 0, 0.08)',
    dark: 'rgba(0, 0, 0, 0.16)',
    modal: 'rgba(0, 0, 0, 0.5)',
  },

  // 다크모드 준비 (향후 사용)
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    primary: '#4CAF50',
    secondary: '#EF5350',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
  },
} as const;

// 색상 타입 정의
export type ColorScheme = typeof colors;
export type ColorKey = keyof ColorScheme;
export type PrimaryColor = keyof ColorScheme['primary'];
export type SemanticColor = keyof ColorScheme['semantic'];
