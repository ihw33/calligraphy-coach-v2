/**
 * 평가 결과 표시 모델
 * 3레벨 평가 체계를 UI에 표시하기 위한 구조화된 모델
 */

import type { EvaluationResponse } from '../core/EvaluationEngine';
import type { InputMode, FontStyle, CourseType } from '../config/evaluationConfig';

// ===================================
// 결과 페이지 표시 모델
// ===================================
export interface ResultDisplayModel {
  // 헤더 정보
  header: {
    title: string;
    mode: InputMode;
    fontStyle?: FontStyle;
    character: string;
    totalScore: number;
    maxScore: number;
    grade: {
      grade: string;
      label: string;
      color: string;
      message: string;
    };
  };
  
  // 레벨별 섹션
  sections: ResultSection[];
  
  // 피드백
  feedback: {
    strengths: string[];
    improvements: string[];
    expertAdvice?: string[];
  };
  
  // 메타 정보
  meta: {
    evaluatedAt: Date;
    courseType: CourseType;
    levelsApplied: string[];
  };
}

// 결과 섹션 (각 레벨별)
export interface ResultSection {
  level: 'LEVEL1' | 'LEVEL2' | 'LEVEL3';
  title: string;
  icon: string;
  weight?: string; // 가중치 표시 (예: "70%")
  items: SectionItem[];
  summary?: {
    score: number;
    maxScore: number;
    percentage: number;
  };
  visible: boolean;
}

// 섹션 항목
export interface SectionItem {
  id: string;
  label: string;
  description?: string;
  score: number;
  maxScore: number;
  status: 'excellent' | 'good' | 'needsImprovement';
  details?: string;
}

// ===================================
// 결과 표시 모델 생성 함수
// ===================================
export function createResultDisplayModel(
  evalResponse: EvaluationResponse,
  courseType: CourseType = 'standard'
): ResultDisplayModel {
  const { scores, checklist, grade, feedback, meta } = evalResponse;
  const sections: ResultSection[] = [];
  
  console.log('📊 createResultDisplayModel - 입력 데이터:', {
    scores,
    checklist,
    grade,
    meta
  });
  
  // 황자원 92법인지 확인 (3단계 평가 여부)
  const isHwang92 = checklist.hwang92 && meta.courseId === 'hwang92-sebeop';
  const hasLevel2 = meta.mode === 'physical' && meta.fontStyle && meta.fontStyle !== '없음';
  
  // 3단계 평가일 경우 비율: Level1(40%) + Level2(30%) + Level3(30%) = 100%
  // 2단계 평가일 경우 비율: Level1(70%) + Level2(30%) = 100%  
  // 1단계 평가일 경우 비율: Level1(100%)
  let level1MaxScore = 100;
  if (isHwang92 && hasLevel2) {
    level1MaxScore = 40; // 3단계: 기본 40%
  } else if (hasLevel2) {
    level1MaxScore = 70; // 2단계: 기본 70%
  }
  
  // Level 1: 기본서예평가 (항상 표시)
  const level1Items: SectionItem[] = [];
  const isDigital = meta.mode === 'digital';
  
  console.log('🎯 Level 1 평가 생성 시작:', {
    mode: meta.mode,
    isDigital,
    scoresBreakdown: scores.breakdown,
    normalized: scores.normalized,
    level1MaxScore
  });
  
  if (isDigital) {
    // 디지털 모드 항목 (비율에 맞게 조정)
    const ratio = level1MaxScore / 100;
    console.log('🖥️ 디지털 모드 점수 설정:', scores.breakdown, 'ratio:', ratio);
    level1Items.push(
      createSectionItem('accuracy', '정확성', 'Canvas 입력의 형태 정확도', 
        Math.round((scores.breakdown['정확성'] || 35) * ratio), Math.round(50 * ratio)),
      createSectionItem('position', '위치', '격자 내 비례와 위치', 
        Math.round((scores.breakdown['위치'] || 20) * ratio), Math.round(30 * ratio)),
      createSectionItem('smoothness', '매끄러움', '디지털 선의 부드러움', 
        Math.round((scores.breakdown['매끄러움'] || 10) * ratio), Math.round(15 * ratio)),
      createSectionItem('strokes', '획수', '획수 정확도', 
        Math.round((scores.breakdown['획수'] || 5) * ratio), Math.round(5 * ratio))
    );
  } else {
    // 실물 모드 항목 (비율에 맞게 조정)
    const ratio = level1MaxScore / 100;
    console.log('🖌️ 실물 모드 점수 설정:', { 
      breakdown: scores.breakdown, 
      ratio
    });
    
    // 점수가 없으면 기본값 설정 (100점 기준)
    const 형태점수 = scores.breakdown['형태'] !== undefined ? scores.breakdown['형태'] : 28;
    const 비례점수 = scores.breakdown['비례'] !== undefined ? scores.breakdown['비례'] : 21;
    const 굵기점수 = scores.breakdown['굵기'] !== undefined ? scores.breakdown['굵기'] : 14;
    const 획순점수 = scores.breakdown['획순'] !== undefined ? scores.breakdown['획순'] : 7;
    
    level1Items.push(
      createSectionItem('shape', '형태', '글자의 형태 정확성', 
        Math.round(형태점수 * ratio), Math.round(40 * ratio)),
      createSectionItem('proportion', '비례', '비례와 균형', 
        Math.round(비례점수 * ratio), Math.round(30 * ratio)),
      createSectionItem('thickness', '굵기', '붓의 압력과 굵기', 
        Math.round(굵기점수 * ratio), Math.round(20 * ratio)),
      createSectionItem('order', '획순', '올바른 획순', 
        Math.round(획순점수 * ratio), Math.round(10 * ratio))
    );
  }
  
  console.log('📋 Level 1 항목들:', level1Items);
  
  sections.push({
    level: 'LEVEL1',
    title: '기본서예평가',
    icon: '📊',
    weight: level1MaxScore < 100 ? `${level1MaxScore}%` : undefined,
    items: level1Items,
    summary: {
      score: level1Items.reduce((sum, item) => sum + item.score, 0),
      maxScore: level1Items.reduce((sum, item) => sum + item.maxScore, 0),
      percentage: 0
    },
    visible: true
  });
  
  // Level 2: 서체별평가 (실물 모드 + 서체 있을 때만)
  if (hasLevel2) {
    const fontCharacteristics = getFontCharacteristics(meta.fontStyle!);
    const level2MaxScore = 30; // 항상 30점
    
    // 각 항목의 최대 점수를 30점에 맞게 배분
    const itemMaxScore = Math.round(level2MaxScore / fontCharacteristics.length);
    
    const level2Items = fontCharacteristics.map((char, index) => {
      // 체크리스트에서 해당 항목 찾기
      const checkItem = checklist.basic.find(c => c.id === char.id);
      const isChecked = checkItem?.checked ?? true; // 기본값 true
      
      // 마지막 항목은 나머지 점수를 모두 할당
      const maxScore = index === fontCharacteristics.length - 1 
        ? level2MaxScore - (itemMaxScore * index)
        : itemMaxScore;
      
      const itemScore = isChecked ? maxScore : Math.round(maxScore * 0.5); // 체크되면 만점, 아니면 50%
      
      return {
        id: char.id,
        label: char.label,
        description: char.description,
        score: itemScore,
        maxScore: maxScore,
        status: isChecked ? 'good' : 'needsImprovement' as 'good' | 'needsImprovement'
      };
    });
    
    sections.push({
      level: 'LEVEL2',
      title: `${meta.fontStyle} 특성`,
      icon: '🏛️',
      weight: '30%',
      items: level2Items,
      summary: {
        score: level2Items.reduce((sum, item) => sum + item.score, 0),
        maxScore: level2MaxScore,
        percentage: 0 // 아래에서 계산됨
      },
      visible: true
    });
  }
  
  // Level 3: 전문기법평가 (황자원 92법)
  if (isHwang92) {
    const hwang92Items = checklist.hwang92!.map(item => 
      createSectionItem(
        item.id,
        item.label,
        item.description,
        item.score,
        item.maxScore
      )
    );
    
    // 황자원 점수 총합 계산
    const hwang92TotalScore = hwang92Items.reduce((sum, item) => sum + item.score, 0);
    const hwang92TotalMaxScore = hwang92Items.reduce((sum, item) => sum + item.maxScore, 0);
    
    sections.push({
      level: 'LEVEL3',
      title: '황자원 92법',
      icon: '🎯',
      weight: '30%',
      items: hwang92Items,
      summary: {
        score: hwang92TotalScore,
        maxScore: hwang92TotalMaxScore,
        percentage: hwang92TotalMaxScore > 0 ? (hwang92TotalScore / hwang92TotalMaxScore) * 100 : 0
      },
      visible: true
    });
  }
  
  // 퍼센티지 계산
  sections.forEach(section => {
    if (section.summary) {
      section.summary.percentage = section.summary.maxScore > 0 
        ? Math.round((section.summary.score / section.summary.maxScore) * 100)
        : 0;
    }
  });
  
  // 실제 총점 계산 (각 섹션의 점수 합산)
  const actualTotalScore = sections.reduce((sum, section) => 
    sum + (section.summary?.score || 0), 0
  );
  const actualMaxScore = sections.reduce((sum, section) => 
    sum + (section.summary?.maxScore || 0), 0
  );
  
  console.log('💯 총점 계산:', {
    sections: sections.map(s => ({
      title: s.title,
      score: s.summary?.score,
      maxScore: s.summary?.maxScore
    })),
    actualTotalScore,
    actualMaxScore
  });
  
  return {
    header: {
      title: getTitle(meta.mode, meta.fontStyle),
      mode: meta.mode,
      fontStyle: meta.fontStyle,
      character: '글자', // 실제 글자로 대체 필요
      totalScore: actualTotalScore,
      maxScore: actualMaxScore,
      grade
    },
    sections,
    feedback: {
      strengths: feedback.strengths,
      improvements: feedback.improvements,
      expertAdvice: getExpertAdvice(meta.mode, meta.fontStyle, scores.total)
    },
    meta: {
      evaluatedAt: meta.evaluatedAt,
      courseType,
      levelsApplied: meta.evaluationLevels
    }
  };
}

// ===================================
// 헬퍼 함수들
// ===================================
function createSectionItem(
  id: string,
  label: string,
  description: string,
  score: number,
  maxScore: number
): SectionItem {
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
  let status: 'excellent' | 'good' | 'needsImprovement';
  
  if (percentage >= 90) status = 'excellent';
  else if (percentage >= 70) status = 'good';
  else status = 'needsImprovement';
  
  return {
    id,
    label,
    description,
    score,
    maxScore,
    status,
    details: undefined
  };
}

function getTitle(mode: InputMode, fontStyle?: FontStyle): string {
  if (mode === 'digital') {
    return '디지털 서예 평가 결과';
  }
  if (fontStyle && fontStyle !== '없음') {
    return `${fontStyle} 서예 평가 결과`;
  }
  return '서예 평가 결과';
}

function getFontCharacteristics(fontStyle: FontStyle): Array<{
  id: string;
  label: string;
  description: string;
}> {
  const characteristics: Record<FontStyle, Array<{id: string; label: string; description: string}>> = {
    '판본체': [
      { id: 'balance', label: '균형', description: '단정하고 균형잡힌 형태' },
      { id: 'simplicity', label: '절제미', description: '간결하고 절제된 표현' },
      { id: 'structure', label: '구조', description: '명확한 구조적 완성도' }
    ],
    '궁서체': [
      { id: 'curve', label: '곡선미', description: '유려한 곡선 표현' },
      { id: 'elegance', label: '우아함', description: '우아하고 유연한 필치' },
      { id: 'tradition', label: '전통미', description: '전통적 미감 표현' }
    ],
    '전서체': [
      { id: 'angularity', label: '각진 형태', description: '각진 형태의 정확성' },
      { id: 'uniformity', label: '균일성', description: '획의 균일한 굵기' },
      { id: 'classical', label: '고전미', description: '고대 인장체의 품격' }
    ],
    '해서체': [
      { id: 'clarity', label: '정자체의 단정함', description: '정확하고 단정한 형태' },
      { id: 'balance', label: '균형잡힌 결구', description: '안정적인 구조 균형' },
      { id: 'readability', label: '가독성', description: '명확한 가독성' }
    ],
    '없음': []
  };
  
  return characteristics[fontStyle] || [];
}

function getExpertAdvice(mode: InputMode, fontStyle: FontStyle | undefined, score: number): string[] {
  const advice: string[] = [];
  
  if (mode === 'digital') {
    if (score < 70) {
      advice.push('디지털 펜의 압력을 일정하게 유지해보세요');
      advice.push('격자선을 참고하여 비례를 맞춰보세요');
    }
  } else if (fontStyle === '해서체') {
    advice.push('해서체는 정확성이 중요합니다');
    if (score < 80) {
      advice.push('기본 획의 시작과 끝을 명확히 표현하세요');
    }
  }
  
  return advice;
}

// ===================================
// 코스별 확장 지원
// ===================================
export interface CourseExtension {
  courseId: string;
  courseName: string;
  evaluationLevels: {
    level3?: {
      name: string;
      icon: string;
      criteria: Array<{
        id: string;
        label: string;
        description: string;
        weight: number;
      }>;
    };
  };
}

// 새로운 코스 등록
export const courseExtensions: Map<string, CourseExtension> = new Map([
  ['hwang92-sebeop', {
    courseId: 'hwang92-sebeop',
    courseName: '황자원 92법',
    evaluationLevels: {
      level3: {
        name: '황자원 92법',
        icon: '🎯',
        criteria: [
          { id: 'structure', label: '구조', description: '글자 구조의 완성도', weight: 40 },
          { id: 'balance', label: '균형', description: '전체적인 균형감', weight: 30 },
          { id: 'detail', label: '세부', description: '세부 표현의 정확성', weight: 30 }
        ]
      }
    }
  }]
]);