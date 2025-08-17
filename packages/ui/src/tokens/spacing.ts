/**
 * 서예 코치 v2 디자인 토큰 - 간격 시스템
 * 일관성 있는 레이아웃을 위한 간격 정의
 */

export const spacing = {
  // 기본 간격 단위 (4px 기반)
  none: 0,
  xs: 4,     // 0.25rem
  sm: 8,     // 0.5rem
  md: 16,    // 1rem
  lg: 24,    // 1.5rem
  xl: 32,    // 2rem
  '2xl': 48, // 3rem
  '3xl': 64, // 4rem
  '4xl': 96, // 6rem

  // 컴포넌트별 특정 간격
  component: {
    // 버튼 내부 간격
    button: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      small: {
        paddingVertical: 8,
        paddingHorizontal: 16,
      },
      large: {
        paddingVertical: 16,
        paddingHorizontal: 32,
      },
    },

    // 입력 필드 간격
    input: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginBottom: 16,
    },

    // 카드 간격
    card: {
      padding: 16,
      margin: 8,
      large: {
        padding: 24,
        margin: 12,
      },
    },

    // 모달 간격
    modal: {
      padding: 24,
      margin: 16,
    },

    // 화면 간격
    screen: {
      paddingHorizontal: 16,
      paddingVertical: 24,
    },
  },

  // 반응형 간격 (화면 크기별)
  responsive: {
    mobile: {
      container: 16,
      section: 24,
      element: 12,
    },
    tablet: {
      container: 24,
      section: 32,
      element: 16,
    },
  },
} as const;

// 간격 타입 정의
export type Spacing = typeof spacing;
export type SpacingKey = keyof Omit<Spacing, 'component' | 'responsive'>;
export type ComponentSpacing = keyof Spacing['component'];
