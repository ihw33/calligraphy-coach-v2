/**
 * 서예 평가 시스템 통합 설정
 * 모든 평가 관련 설정을 중앙 관리
 */

// ===================================
// 0. 3단계 평가 체계
// ===================================
export const EVALUATION_LEVELS = {
  LEVEL1: '기본서예평가',     // 모든 글씨 공통
  LEVEL2: '서체별평가',        // 판본체/궁서체/전서체/해서체
  LEVEL3: '전문기법평가'       // 황자원 92법 등
} as const;

// ===================================
// 1. 서체 정보
// ===================================
export const FONT_STYLES = {
  디지털: {
    available: false,  // 디지털은 서체 구분 없음
    styles: []
  },
  실물: {
    available: true,
    styles: {
      판본체: {
        id: 'panbon',
        name: '판본체',
        description: '한글 기본 서체, 단정하고 균형잡힌 형태',
        emphasis: ['균형', '단정함', '절제미']
      },
      궁서체: {
        id: 'gungseo',
        name: '궁서체',
        description: '한글 전통 서체, 우아하고 유려한 곡선',
        emphasis: ['곡선미', '유려함', '전통미']
      },
      전서체: {
        id: 'jeonseo',
        name: '전서체',
        description: '한자 고전 서체, 고대 인장체',
        emphasis: ['각진 형태', '균일성', '고전미']
      },
      해서체: {
        id: 'haeseo',
        name: '해서체',
        description: '한자 표준 서체, 정자체',
        emphasis: ['정확성', '균형', '가독성'],
        specialTechniques: {
          황자원92법: true  // 해서체에 황자원 92법 적용
        }
      }
    }
  }
} as const;

// ===================================
// 2. 기본 점수 체계 (100점 만점)
// ===================================
export const BASE_SCORING = {
  실물: {
    형태: 40,
    비례: 30,
    굵기: 20,
    획순: 10
  },
  디지털: {
    정확성: 50,  // 형태를 더 강조
    위치: 30,    // 비례와 유사
    매끄러움: 15, // 굵기 축소
    획수: 5      // 획순 축소
  }
} as const;

// ===================================
// 3. 황자원 92법 점수 배분 (해서체 전용)
// ===================================
export const HWANG92_WEIGHT = {
  적용서체: '해서체',    // 황자원 92법은 해서체에만 적용
  기본평가비중: 0.7,    // 70%
  황자원평가비중: 0.3,  // 30%
  
  // 황자원 92법 내부 배점 (총 30점 기준)
  천복자: {
    덮개구조: 12,   // 40% of 30
    보호관계: 6,    // 20% of 30
    공간비례: 6,    // 20% of 30
    결구완성도: 6   // 20% of 30
  },
  지재자: {
    받침구조: 12,
    중심균형: 6,
    지지관계: 6,
    전체균형: 6
  },
  좌포자: {
    좌측위치: 12,
    우측위치: 6,
    높이비례: 6,
    시각균형: 6
  },
  우포자: {
    우측위치: 12,
    좌측위치: 6,
    높이조화: 6,
    전체안정: 6
  }
} as const;

// ===================================
// 4. 모드별 평가 중점 사항
// ===================================
export const MODE_EMPHASIS = {
  디지털: {
    강조항목: ['형태', '비례', '결구'],
    축소항목: ['굵기', '압력', '질감'],
    제외항목: ['붓의 탄력', '먹의 번짐', '세밀한 삐침'],
    가중치조정: {
      형태: 1.2,   // 20% 증가
      비례: 1.1,   // 10% 증가  
      굵기: 0.5,   // 50% 감소
      획순: 0.7    // 30% 감소
    }
  },
  실물: {
    강조항목: ['필압', '질감', '운필'],
    축소항목: [],
    추가평가: ['삐침의 날카로움', '꺾기의 각도', '먹의 농담'],
    가중치조정: {
      형태: 1.0,
      비례: 1.0,
      굵기: 1.3,   // 30% 증가
      획순: 1.2    // 20% 증가
    }
  }
} as const;

// ===================================
// 5. 점수 정규화 규칙
// ===================================
export const SCORE_NORMALIZATION = {
  maxScore: 100,
  minScore: 0,
  
  // 점수 등급 기준
  grades: {
    S: 95,  // 탁월
    A: 85,  // 우수
    B: 75,  // 양호
    C: 65,  // 보통
    D: 50,  // 미흡
    F: 0    // 부족
  },
  
  // 자동 조정 규칙
  autoAdjust: {
    overflowHandling: 'scale',  // 'scale' | 'cap' | 'reject'
    underflowHandling: 'boost', // 'boost' | 'keep' | 'reject'
    precisionDigits: 0           // 소수점 자리수
  }
} as const;

// ===================================
// 6. 피드백 생성 규칙
// ===================================
export const FEEDBACK_RULES = {
  디지털: {
    minItems: 2,
    maxItems: 3,
    focus: ['구조', '비례', '형태'],
    tone: 'constructive',
    examples: {
      형태: [
        '글자의 전체 구조를 더 크게 그려보세요',
        '획의 시작과 끝을 더 명확하게 표현해주세요'
      ],
      비례: [
        '격자의 중앙에 글자를 배치해보세요',
        '상하 비례를 1:3으로 조정해보세요'
      ]
    }
  },
  실물: {
    minItems: 3,
    maxItems: 5,
    focus: ['붓놀림', '압력', '질감'],
    tone: 'detailed',
    examples: {
      필압: [
        '붓의 압력을 더 일정하게 유지해주세요',
        '삐침 부분에서 붓을 더 빠르게 떼어주세요'
      ],
      질감: [
        '먹의 농도를 조절하여 농담을 표현해보세요',
        '종이에 스며드는 번짐 효과를 활용해보세요'
      ]
    }
  }
} as const;

// ===================================
// 7. 통합 평가 함수
// ===================================
export function calculateTotalScore(
  mode: 'digital' | 'physical',
  baseScores: Record<string, number>,
  hwang92Scores?: Record<string, boolean>,
  courseId?: string,
  hwang92SubType?: Hwang92SubType
): {
  total: number;
  breakdown: Record<string, number>;
  normalized: boolean;
} {
  let total = 0;
  const breakdown: Record<string, number> = {};
  let normalized = false;
  
  // 황자원 92법인 경우
  if (courseId === 'hwang92-sebeop' && hwang92Scores && hwang92SubType) {
    // 기본 평가 (70%)
    const baseTotal = Object.values(baseScores).reduce((sum, score) => sum + score, 0);
    const baseWeighted = baseTotal * HWANG92_WEIGHT.기본평가비중;
    
    // 황자원 평가 (30%)
    const hwang92Total = Object.entries(hwang92Scores)
      .filter(([_, checked]) => checked)
      .reduce((sum, [key, _]) => {
        // hwang92SubType을 동적으로 사용
        return sum + (HWANG92_WEIGHT[hwang92SubType]?.[key] || 0);
      }, 0);
    
    total = baseWeighted + hwang92Total;
    
    breakdown['기본평가'] = baseWeighted;
    breakdown['황자원평가'] = hwang92Total;
  } else {
    // 일반 평가
    total = Object.values(baseScores).reduce((sum, score) => sum + score, 0);
    Object.assign(breakdown, baseScores);
  }
  
  // 100점 초과 시 정규화
  if (total > SCORE_NORMALIZATION.maxScore) {
    const scale = SCORE_NORMALIZATION.maxScore / total;
    total = SCORE_NORMALIZATION.maxScore;
    
    Object.keys(breakdown).forEach(key => {
      breakdown[key] = Math.round(breakdown[key] * scale);
    });
    
    normalized = true;
  }
  
  return { total, breakdown, normalized };
}

// ===================================
// 8. 평가 등급 판정
// ===================================
export function getGrade(score: number): {
  grade: string;
  label: string;
  color: string;
  message: string;
} {
  const { grades } = SCORE_NORMALIZATION;
  
  if (score >= grades.S) {
    return {
      grade: 'S',
      label: '탁월',
      color: 'gold',
      message: '완벽에 가까운 글씨입니다!'
    };
  } else if (score >= grades.A) {
    return {
      grade: 'A',
      label: '우수',
      color: 'green',
      message: '매우 훌륭한 글씨입니다!'
    };
  } else if (score >= grades.B) {
    return {
      grade: 'B', 
      label: '양호',
      color: 'blue',
      message: '좋은 실력을 보여주고 있습니다!'
    };
  } else if (score >= grades.C) {
    return {
      grade: 'C',
      label: '보통',
      color: 'gray',
      message: '꾸준한 연습이 필요합니다.'
    };
  } else if (score >= grades.D) {
    return {
      grade: 'D',
      label: '미흡',
      color: 'orange',
      message: '기초부터 차근차근 연습해보세요.'
    };
  } else {
    return {
      grade: 'F',
      label: '부족',
      color: 'red',
      message: '더 많은 연습이 필요합니다.'
    };
  }
}

// Type exports
export type InputMode = 'digital' | 'physical';
export type FontStyle = '판본체' | '궁서체' | '전서체' | '해서체' | '없음';
export type CourseType = 'standard' | 'hwang92-sebeop' | 'panbon' | 'gungseo' | 'jeonseo' | 'haeseo';
export type Hwang92SubType = '천복자' | '지재자' | '좌포자' | '우포자';
export type EvaluationLevel = 'LEVEL1' | 'LEVEL2' | 'LEVEL3';