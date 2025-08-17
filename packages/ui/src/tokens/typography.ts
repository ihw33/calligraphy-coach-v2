/**
 * 서예 코치 v2 디자인 토큰 - 타이포그래피 시스템
 * 한글 가독성과 서예 미학을 고려한 폰트 시스템
 */

export const typography = {
  // 폰트 패밀리
  fontFamily: {
    default: 'System',           // 기본 시스템 폰트
    serif: 'Times',              // 세리프 (한자/한글 학습용)
    monospace: 'Courier',        // 모노스페이스 (코드용)
    calligraphy: 'Brush Script', // 서예 스타일 (제목용)
  },

  // 폰트 크기 (scalable)
  fontSize: {
    xs: 12,    // 매우 작음 (캡션, 힌트)
    sm: 14,    // 작음 (보조 텍스트)
    base: 16,  // 기본 (본문)
    lg: 18,    // 큼 (강조 텍스트)
    xl: 20,    // 더 큼 (소제목)
    '2xl': 24, // 제목
    '3xl': 30, // 큰 제목
    '4xl': 36, // 메인 제목
    '5xl': 48, // 히어로 제목
  },

  // 폰트 굵기
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800',
  },

  // 줄 간격
  lineHeight: {
    tight: 1.2,   // 타이트한 간격
    normal: 1.4,  // 일반 간격
    relaxed: 1.6, // 여유로운 간격
    loose: 1.8,   // 느슨한 간격
  },

  // 글자 간격
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },

  // 텍스트 스타일 프리셋
  heading: {
    h1: {
      fontSize: 36,
      fontWeight: '700',
      lineHeight: 1.2,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 30,
      fontWeight: '600',
      lineHeight: 1.3,
      letterSpacing: -0.25,
    },
    h3: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 1.3,
      letterSpacing: 0,
    },
    h4: {
      fontSize: 20,
      fontWeight: '500',
      lineHeight: 1.4,
      letterSpacing: 0,
    },
    h5: {
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 1.4,
      letterSpacing: 0,
    },
    h6: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 1.4,
      letterSpacing: 0,
    },
  },

  // 본문 텍스트 스타일
  body: {
    large: {
      fontSize: 18,
      fontWeight: '400',
      lineHeight: 1.6,
      letterSpacing: 0,
    },
    medium: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    small: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 1.5,
      letterSpacing: 0,
    },
  },

  // 특수 텍스트 스타일
  special: {
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 1.4,
      letterSpacing: 0.5,
    },
    overline: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 1.4,
      letterSpacing: 1,
      textTransform: 'uppercase' as const,
    },
    button: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 1.2,
      letterSpacing: 0.5,
    },
  },

  // 서예 관련 특별 스타일
  calligraphy: {
    title: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 1.3,
      letterSpacing: 1,
    },
    instruction: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 1.6,
      letterSpacing: 0.3,
    },
    feedback: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 1.5,
      letterSpacing: 0.2,
    },
  },
} as const;

// 타이포그래피 타입 정의
export type Typography = typeof typography;
export type FontSize = keyof Typography['fontSize'];
export type FontWeight = keyof Typography['fontWeight'];
export type LineHeight = keyof Typography['lineHeight'];
export type HeadingLevel = keyof Typography['heading'];
export type BodySize = keyof Typography['body'];
