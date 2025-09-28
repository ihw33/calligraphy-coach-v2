/**
 * AI 평가 프롬프트 템플릿
 * 3레벨 평가 체계에 맞춘 구조화된 프롬프트 생성
 */

import type { InputMode, FontStyle, CourseType, Hwang92SubType } from '../config/evaluationConfig';
import { FONT_STYLES, BASE_SCORING, HWANG92_WEIGHT } from '../config/evaluationConfig';

// ===================================
// 프롬프트 생성 인터페이스
// ===================================
export interface PromptConfig {
  mode: InputMode;
  courseId: CourseType;
  targetCharacter: string;
  strokeCount: number;
  fontStyle?: FontStyle;
  hwang92SubType?: Hwang92SubType;
  customCriteria?: Array<{
    name: string;
    description: string;
    weight: number;
  }>;
}

// ===================================
// 메인 프롬프트 생성 함수
// ===================================
export function generateEvaluationPrompt(config: PromptConfig): string {
  const sections: string[] = [];
  
  // 1. 역할 정의
  sections.push(getRoleSection());
  
  // 2. 평가 모드 설명
  sections.push(getModeSection(config.mode, config.fontStyle));
  
  // 3. Level 1: 기본서예평가
  sections.push(getLevel1Section(config.mode, config.fontStyle));
  
  // 4. Level 2: 서체별평가 (실물 모드 + 서체)
  if (config.mode === 'physical' && config.fontStyle && config.fontStyle !== '없음') {
    sections.push(getLevel2Section(config.fontStyle));
  }
  
  // 5. Level 3: 전문기법평가 (황자원 92법)
  if (config.courseId === 'hwang92-sebeop' && 
      config.fontStyle === '해서체' && 
      config.hwang92SubType) {
    sections.push(getLevel3Section(config.hwang92SubType));
  }
  
  // 6. 평가 대상 정보
  sections.push(getTargetSection(config.targetCharacter, config.strokeCount));
  
  // 7. 응답 형식
  sections.push(getResponseFormatSection(config));
  
  return sections.join('\n\n');
}

// ===================================
// 섹션별 생성 함수
// ===================================

function getRoleSection(): string {
  return `[역할]
당신은 30년 경력의 전문 서예 교사입니다.
한국 전통 서예와 현대 디지털 서예를 모두 깊이 이해하고 있습니다.
학생의 작품을 정확하고 건설적으로 평가하여 실력 향상을 돕습니다.`;
}

function getModeSection(mode: InputMode, fontStyle?: FontStyle): string {
  if (mode === 'digital') {
    return `[평가 모드: 디지털]
- 디지털 환경의 특성과 한계를 고려한 평가
- 서체 구분 없이 구조와 비례 중심 평가
- 붓의 질감이나 먹의 번짐은 평가하지 않음
- Canvas/태블릿 입력의 특성 고려`;
  } else {
    const fontInfo = fontStyle && fontStyle !== '없음' ? `\n- 서체: ${fontStyle}` : '';
    return `[평가 모드: 실물]
- 전통 붓과 먹을 사용한 실물 서예 평가
- 붓의 압력, 먹의 농담, 종이의 질감 모두 고려${fontInfo}
- 삐침, 꺾기, 운필의 속도감 평가
- 전통적 서예 미학 기준 적용`;
  }
}

function getLevel1Section(mode: InputMode, fontStyle?: FontStyle): string {
  const scoring = mode === 'digital' ? BASE_SCORING.디지털 : BASE_SCORING.실물;
  
  if (mode === 'digital') {
    return `[Level 1: 기본서예평가 (100점 만점)]
필수 평가 항목:

1. 정확성 (${scoring.정확성}점)
   - Canvas 입력으로 그린 글자의 형태 정확도
   - 목표 글자와의 시각적 유사성
   - 각 획의 시작과 끝 처리

2. 위치 (${scoring.위치}점)
   - 400x400 격자 내에서의 글자 배치
   - 중앙 정렬 및 여백 균형
   - 상하좌우 비례의 적절성

3. 매끄러움 (${scoring.매끄러움}점)
   - 디지털 선의 부드러운 연결
   - 떨림이나 끊김 없는 선 표현
   - 일정한 선 굵기 유지

4. 획수 (${scoring.획수}점)
   - 정확한 획수로 완성했는지
   - 획순의 논리적 진행`;
  } else {
    return `[Level 1: 기본서예평가 (100점 만점)]
필수 평가 항목:

1. 형태 (${scoring.형태}점)
   - 글자의 전체적인 형태 정확성
   - 각 획의 시작(기필)과 끝(수필) 표현
   - 전체적인 결구의 완성도

2. 비례 (${scoring.비례}점)
   - 글자 내부 요소들의 비례 관계
   - 상하좌우 균형감
   - 공간 배분의 적절성

3. 굵기 (${scoring.굵기}점)
   - 붓 압력의 일정성과 변화
   - 획의 강약 표현
   - 먹의 농담 조절

4. 획순 (${scoring.획순}점)
   - 올바른 획순 준수
   - 획순에 따른 자연스러운 연결

※ 평가 시 100점 만점으로 채점해 주세요.`;
  }
}

function getLevel2Section(fontStyle: FontStyle): string {
  const styleInfo = FONT_STYLES.실물.styles[fontStyle];
  if (!styleInfo) return '';
  
  return `[Level 2: ${fontStyle} 특성 평가]
서체별 중점 평가 사항:

${fontStyle} 특징:
- ${styleInfo.description}
- 강조점: ${styleInfo.emphasis.join(', ')}

평가 기준:
${styleInfo.emphasis.map((emp, idx) => `${idx + 1}. ${emp}: 해당 특성이 잘 표현되었는지`).join('\n')}

※ 이 항목들은 Level 1 평가에 반영되며, 별도 점수는 없음`;
}

function getLevel3Section(hwang92SubType: Hwang92SubType): string {
  const criteria = HWANG92_WEIGHT[hwang92SubType];
  const criteriaList = Object.entries(criteria).map(([key, score]) => ({
    name: key,
    score: score,
    description: getHwang92Description(hwang92SubType, key)
  }));
  
  return `[Level 3: 황자원 92법 - ${hwang92SubType} 평가]
※ 해서체 전용 전문 평가 기법
※ 이 평가는 추가 평가로, 기본 평가 100점과는 별도로 고려됩니다.

${hwang92SubType} 구조 체크리스트:
${criteriaList.map(c => `
- ${c.name}
  ${c.description}`).join('\n')}

평가 방법:
1. 각 항목의 충족 여부를 체크리스트로 평가
2. 구조적 완성도와 조화로움을 종합 평가
3. 기본 평가와 함께 최종 점수에 반영됨`;
}

function getTargetSection(character: string, strokeCount: number): string {
  return `[평가 대상]
- 목표 글자: ${character}
- 작성 획수: ${strokeCount}획
- 글자 유형: ${isHanja(character) ? '한자' : '한글'}`;
}

function getResponseFormatSection(config: PromptConfig): string {
  const hasHwang92 = config.courseId === 'hwang92-sebeop' && 
                     config.fontStyle === '해서체' && 
                     config.hwang92SubType;
  
  return `[응답 형식]
다음 JSON 형식으로 정확히 응답하세요:

{
  "scores": {
    ${config.mode === 'digital' ? `
    "정확성": { "score": 0, "maxScore": 50, "feedback": "..." },
    "위치": { "score": 0, "maxScore": 30, "feedback": "..." },
    "매끄러움": { "score": 0, "maxScore": 15, "feedback": "..." },
    "획수": { "score": 0, "maxScore": 5, "feedback": "..." }` : `
    "형태": { "score": 0, "maxScore": 40, "feedback": "..." },
    "비례": { "score": 0, "maxScore": 30, "feedback": "..." },
    "굵기": { "score": 0, "maxScore": 20, "feedback": "..." },
    "획순": { "score": 0, "maxScore": 10, "feedback": "..." }`}
  },
  "checklist": {
    ${hasHwang92 ? `
    "${getHwang92Keys(config.hwang92SubType!)[0]}": true/false,
    "${getHwang92Keys(config.hwang92SubType!)[1]}": true/false,
    "${getHwang92Keys(config.hwang92SubType!)[2]}": true/false,
    "${getHwang92Keys(config.hwang92SubType!)[3]}": true/false,` : ''}
    "기본형태완성": true/false,
    "비례균형달성": true/false,
    "일정한굵기": true/false,
    "정확한획순": true/false
  },
  "recognition": {
    "character": "${config.targetCharacter}",
    "confidence": 0.0-1.0,
    "isCorrect": true/false
  },
  "feedback": {
    "strengths": ["강점1", "강점2", "강점3"],
    "improvements": ["개선점1", "개선점2"],
    "summary": "종합 평가 메시지"
  }
}

※ 주의사항:
- 모든 점수는 정수로 표시
- confidence는 0.0~1.0 사이의 실수
- 피드백은 구체적이고 건설적으로
- JSON 형식을 정확히 준수`;
}

// ===================================
// 헬퍼 함수
// ===================================
function isHanja(character: string): boolean {
  const code = character.charCodeAt(0);
  return (code >= 0x4E00 && code <= 0x9FFF) || // CJK Unified Ideographs
         (code >= 0x3400 && code <= 0x4DBF);    // CJK Extension A
}

function getHwang92Keys(subType: Hwang92SubType): string[] {
  const keys: Record<Hwang92SubType, string[]> = {
    '천복자': ['덮개구조', '보호관계', '공간비례', '결구완성도'],
    '지재자': ['받침구조', '중심균형', '지지관계', '전체균형'],
    '좌포자': ['좌측위치', '우측위치', '높이비례', '시각균형'],
    '우포자': ['우측위치', '좌측위치', '높이조화', '전체안정']
  };
  return keys[subType] || [];
}

function getHwang92Description(subType: Hwang92SubType, criterion: string): string {
  const descriptions: Record<string, Record<string, string>> = {
    '천복자': {
      '덮개구조': '갓머리(宀)가 하부 구조를 완전히 덮고 있는지',
      '보호관계': '하부 요소들이 덮개 안에 안전하게 보호되는지',
      '공간비례': '상하 비례가 1:3 정도로 적절한지',
      '결구완성도': '천복자의 특징이 명확하게 드러나는지'
    },
    '지재자': {
      '받침구조': '하단 받침이 충분히 넓고 안정적인지',
      '중심균형': '상부와 하부의 중심선이 일치하는지',
      '지지관계': '상부 요소들이 안정적으로 받쳐지는지',
      '전체균형': '전체적인 무게중심이 안정적인지'
    },
    '좌포자': {
      '좌측위치': '왼쪽 요소가 아래쪽에 위치하는지',
      '우측위치': '오른쪽 요소가 상대적으로 위쪽에 있는지',
      '높이비례': '좌우 높이 차이가 적절한지',
      '시각균형': '비대칭임에도 시각적 균형이 유지되는지'
    },
    '우포자': {
      '우측위치': '오른쪽 요소가 아래쪽에 위치하는지',
      '좌측위치': '왼쪽 요소가 상대적으로 위쪽에 있는지',
      '높이조화': '좌우 높이 차이가 자연스러운지',
      '전체안정': '전체 글자의 안정감이 유지되는지'
    }
  };
  
  return descriptions[subType]?.[criterion] || '';
}

// ===================================
// 확장 가능한 코스별 프롬프트
// ===================================
export interface CoursePromptExtension {
  courseId: string;
  levelName: string;
  generateSection: (config: any) => string;
}

export const coursePromptExtensions = new Map<string, CoursePromptExtension>();

// 새로운 코스 프롬프트 등록 예시
export function registerCoursePrompt(extension: CoursePromptExtension) {
  coursePromptExtensions.set(extension.courseId, extension);
}

// 사용 예시: 향후 추가될 코스
/*
registerCoursePrompt({
  courseId: 'wang-xizhi-style',
  levelName: '왕희지체 평가',
  generateSection: (config) => {
    return `[왕희지체 특별 평가]
    - 행서의 유려함
    - 필세의 자유로움
    - 기운생동`;
  }
});
*/