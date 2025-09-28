/**
 * 평가 시스템 설정 v2
 * 확장 가능한 구조로 재설계
 */

import { getFontEvaluationConfig, getHwang92SubType } from './fontEvaluationConfig';

export interface EvaluationContext {
  mode: 'digital' | 'physical';
  fontStyle?: string;
  courseId?: string;
  lessonId?: string;
  hwang92SubType?: string;
}

export interface ScoreCalculationResult {
  total: number;
  breakdown: Record<string, number>;
  levelScores: {
    level1?: number;
    level2?: number;
    level3?: number;
  };
  normalized: boolean;
  details: {
    appliedLevels: string[];
    weights: Record<string, number>;
  };
}

/**
 * 확장 가능한 점수 계산 함수
 */
export function calculateScoreV2(
  context: EvaluationContext,
  baseScores: Record<string, number>,
  specialScores?: Record<string, boolean>
): ScoreCalculationResult {
  const result: ScoreCalculationResult = {
    total: 0,
    breakdown: {},
    levelScores: {},
    normalized: false,
    details: {
      appliedLevels: [],
      weights: {}
    }
  };

  // 디지털 모드는 기본 평가만
  if (context.mode === 'digital') {
    result.levelScores.level1 = Object.values(baseScores).reduce((sum, score) => sum + score, 0);
    result.total = result.levelScores.level1;
    result.breakdown = { ...baseScores };
    result.details.appliedLevels = ['LEVEL1'];
    result.details.weights = { LEVEL1: 1.0 };
    return normalizeScore(result);
  }

  // 실물 모드: 서체별 평가 설정 가져오기
  const fontConfig = context.fontStyle ? getFontEvaluationConfig(context.fontStyle) : null;
  
  if (!fontConfig) {
    // 서체 설정이 없으면 기본 평가만
    result.levelScores.level1 = Object.values(baseScores).reduce((sum, score) => sum + score, 0);
    result.total = result.levelScores.level1;
    result.breakdown = { ...baseScores };
    result.details.appliedLevels = ['LEVEL1'];
    result.details.weights = { LEVEL1: 1.0 };
    return normalizeScore(result);
  }

  // Level 1: 기본 평가 (항상 적용)
  const level1Score = Object.values(baseScores).reduce((sum, score) => sum + score, 0);
  result.levelScores.level1 = level1Score;
  result.details.appliedLevels.push('LEVEL1');

  // Level 3: 황자원 92법 (해서체 + hwang92-sebeop 코스)
  if (context.fontStyle === '해서체' && 
      context.courseId === 'hwang92-sebeop' && 
      specialScores && 
      context.hwang92SubType) {
    
    const hwang92Config = fontConfig.levels.level3;
    if (hwang92Config?.subTypes?.[context.hwang92SubType]) {
      const subTypeConfig = hwang92Config.subTypes[context.hwang92SubType];
      let level3Score = 0;
      
      Object.entries(specialScores).forEach(([key, checked]) => {
        if (checked && subTypeConfig.criteria[key]) {
          level3Score += subTypeConfig.criteria[key].maxScore;
        }
      });
      
      result.levelScores.level3 = level3Score;
      result.details.appliedLevels.push('LEVEL3');
      
      // 가중치 적용 (70% 기본 + 30% 황자원)
      const level1Weighted = level1Score * fontConfig.scoringWeights.level1Weight;
      const level3Weighted = level3Score; // 이미 30% 기준으로 계산됨
      
      result.total = level1Weighted + level3Weighted;
      result.breakdown = {
        '기본평가': level1Weighted,
        '황자원92법': level3Weighted,
        ...baseScores // 세부 항목도 포함
      };
      
      result.details.weights = {
        LEVEL1: fontConfig.scoringWeights.level1Weight,
        LEVEL3: fontConfig.scoringWeights.level3Weight || 0
      };
    }
  }
  // Level 2: 서체별 특화 평가 (황자원 92법이 없는 경우)
  else if (fontConfig.levels.level2 && fontConfig.scoringWeights.level2Weight) {
    // TODO: Level 2 평가 구현 (서체별 특화 평가)
    // 현재는 Level 1만 사용
    result.total = level1Score;
    result.breakdown = { ...baseScores };
    result.details.weights = { LEVEL1: 1.0 };
  }
  // 기본 평가만
  else {
    result.total = level1Score;
    result.breakdown = { ...baseScores };
    result.details.weights = { LEVEL1: 1.0 };
  }

  return normalizeScore(result);
}

/**
 * 점수 정규화 (100점 초과 방지)
 */
function normalizeScore(result: ScoreCalculationResult): ScoreCalculationResult {
  if (result.total > 100) {
    const scale = 100 / result.total;
    result.total = 100;
    result.normalized = true;
    
    // 모든 breakdown 점수도 비례 조정
    Object.keys(result.breakdown).forEach(key => {
      result.breakdown[key] = Math.round(result.breakdown[key] * scale);
    });
    
    // levelScores도 조정
    if (result.levelScores.level1) {
      result.levelScores.level1 = Math.round(result.levelScores.level1 * scale);
    }
    if (result.levelScores.level2) {
      result.levelScores.level2 = Math.round(result.levelScores.level2 * scale);
    }
    if (result.levelScores.level3) {
      result.levelScores.level3 = Math.round(result.levelScores.level3 * scale);
    }
  }
  
  return result;
}

/**
 * 등급 판정
 */
export function getGradeV2(score: number): {
  grade: string;
  label: string;
  color: string;
  message: string;
} {
  if (score >= 95) {
    return {
      grade: 'S',
      label: '탁월',
      color: 'gold',
      message: '완벽에 가까운 글씨입니다!'
    };
  } else if (score >= 85) {
    return {
      grade: 'A',
      label: '우수',
      color: 'green',
      message: '매우 훌륭한 글씨입니다!'
    };
  } else if (score >= 75) {
    return {
      grade: 'B',
      label: '양호',
      color: 'blue',
      message: '좋은 실력을 보여주고 있습니다!'
    };
  } else if (score >= 65) {
    return {
      grade: 'C',
      label: '보통',
      color: 'gray',
      message: '꾸준한 연습이 필요합니다.'
    };
  } else if (score >= 50) {
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