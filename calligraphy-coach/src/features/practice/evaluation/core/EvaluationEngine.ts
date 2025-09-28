/**
 * 통합 평가 엔진
 * 모든 평가 로직을 단일 엔진으로 통합 관리
 */

import {
  EVALUATION_LEVELS,
  FONT_STYLES,
  BASE_SCORING,
  HWANG92_WEIGHT,
  MODE_EMPHASIS,
  SCORE_NORMALIZATION,
  FEEDBACK_RULES,
  calculateTotalScore,
  getGrade,
  type InputMode,
  type FontStyle,
  type CourseType,
  type Hwang92SubType,
  type EvaluationLevel
} from '../config/evaluationConfig';
import { generateEvaluationPrompt, type PromptConfig } from '../prompts/PromptTemplates';

// ===================================
// 평가 요청 및 응답 타입
// ===================================
export interface EvaluationRequest {
  mode: InputMode;
  courseId: CourseType;
  lessonId?: string;
  targetCharacter: string;
  strokeCount: number;
  imageBase64?: string;
  
  // 서체 정보 (실물 모드에서만)
  fontStyle?: FontStyle;
  
  // 황자원 92법 전용 (해서체에서만)
  hwang92SubType?: Hwang92SubType;
}

export interface EvaluationResponse {
  // 점수
  scores: {
    total: number;
    breakdown: Record<string, number>;
    normalized: boolean;
  };
  
  // 체크리스트
  checklist: {
    basic: ChecklistItem[];
    hwang92?: ChecklistItem[];
  };
  
  // 등급
  grade: {
    grade: string;
    label: string;
    color: string;
    message: string;
  };
  
  // 피드백
  feedback: {
    strengths: string[];
    improvements: string[];
    summary: string;
  };
  
  // 메타 정보
  meta: {
    evaluatedAt: Date;
    mode: InputMode;
    courseId: CourseType;
    fontStyle?: FontStyle;
    evaluationLevels: string[]; // 적용된 평가 레벨들
    aiProvider?: 'gemini' | 'mock';
  };
}

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  score: number;
  maxScore: number;
  category?: string;
}

// ===================================
// 통합 평가 엔진 클래스
// ===================================
export class EvaluationEngine {
  private static instance: EvaluationEngine;
  
  private constructor() {}
  
  static getInstance(): EvaluationEngine {
    if (!this.instance) {
      this.instance = new EvaluationEngine();
    }
    return this.instance;
  }
  
  /**
   * 평가 실행
   */
  async evaluate(request: EvaluationRequest): Promise<EvaluationResponse> {
    // 0. 평가 레벨 결정
    const evaluationLevels = this.determineEvaluationLevels(request);
    
    // 1. AI 평가 실행 (Gemini 또는 Mock)
    const aiResult = await this.runAIEvaluation(request);
    
    // 2. 점수 계산 및 정규화
    const scores = this.calculateScores(request, aiResult);
    
    // 3. 체크리스트 생성
    const checklist = this.generateChecklist(request, aiResult, scores);
    
    // 4. 등급 판정
    const grade = getGrade(scores.total);
    
    // 5. 피드백 생성
    const feedback = this.generateFeedback(request, scores, checklist);
    
    // 6. 응답 구성
    return {
      scores,
      checklist,
      grade,
      feedback,
      meta: {
        evaluatedAt: new Date(),
        mode: request.mode,
        courseId: request.courseId,
        fontStyle: request.fontStyle,
        evaluationLevels,
        aiProvider: aiResult.provider
      }
    };
  }
  
  /**
   * 평가 레벨 결정
   */
  private determineEvaluationLevels(request: EvaluationRequest): string[] {
    const levels: string[] = [EVALUATION_LEVELS.LEVEL1]; // 기본 평가는 항상 포함
    
    // 서체별 평가 (Level 2)
    if (request.mode === 'physical' && request.fontStyle && request.fontStyle !== '없음') {
      levels.push(EVALUATION_LEVELS.LEVEL2);
    }
    
    // 황자원 92법 (Level 3) - 해서체에서만
    if (request.fontStyle === '해서체' && request.courseId === 'hwang92-sebeop') {
      levels.push(EVALUATION_LEVELS.LEVEL3);
    }
    
    return levels;
  }
  
  /**
   * AI 평가 실행 (Gemini 또는 Mock)
   */
  private async runAIEvaluation(request: EvaluationRequest): Promise<any> {
    const prompt = this.generatePrompt(request);
    
    // Gemini API 키 확인
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (geminiKey && request.imageBase64) {
      return this.callGeminiAPI(prompt, request.imageBase64);
    } else {
      return this.mockEvaluation(request);
    }
  }
  
  /**
   * 프롬프트 생성
   */
  private generatePrompt(request: EvaluationRequest): string {
    // 새로운 프롬프트 템플릿 사용
    const promptConfig: PromptConfig = {
      mode: request.mode,
      courseId: request.courseId,
      targetCharacter: request.targetCharacter,
      strokeCount: request.strokeCount,
      fontStyle: request.fontStyle,
      hwang92SubType: request.hwang92SubType
    };
    
    return generateEvaluationPrompt(promptConfig);
  }
  
  // 기존 프롬프트 생성 코드는 주석 처리
  private generatePromptOld(request: EvaluationRequest): string {
    const { mode, courseId, targetCharacter, strokeCount, fontStyle, hwang92SubType } = request;
    
    let basePrompt = `당신은 전문 서예 교사입니다.\n`;
    
    // 서체 정보 추가
    if (fontStyle && fontStyle !== '없음') {
      const styleInfo = FONT_STYLES.실물.styles[fontStyle];
      if (styleInfo) {
        basePrompt += `\n서체: ${styleInfo.name}\n`;
        basePrompt += `특징: ${styleInfo.description}\n`;
        basePrompt += `중점사항: ${styleInfo.emphasis.join(', ')}\n\n`;
      }
    } else if (mode === 'digital') {
      basePrompt += `\n디지털 모드: 서체 구분 없음 (구조와 비례 중심 평가)\n\n`;
    }
    
    // 모드별 평가 기준
    if (mode === 'digital') {
      const scoring = BASE_SCORING.디지털;
      basePrompt += `
디지털 모드 평가 기준:
1. ${Object.keys(scoring)[0]} (${Object.values(scoring)[0]}점): Canvas 입력의 정확성
2. ${Object.keys(scoring)[1]} (${Object.values(scoring)[1]}점): 격자 내 위치
3. ${Object.keys(scoring)[2]} (${Object.values(scoring)[2]}점): 선의 매끄러움
4. ${Object.keys(scoring)[3]} (${Object.values(scoring)[3]}점): 획수 정확도

주의사항:
- 디지털 환경의 한계 고려
- 구조와 비례 중점 평가
- 붓의 질감 평가 제외
`;
    } else {
      const scoring = BASE_SCORING.실물;
      basePrompt += `
실물 모드 평가 기준:
1. ${Object.keys(scoring)[0]} (${Object.values(scoring)[0]}점): 글자의 형태
2. ${Object.keys(scoring)[1]} (${Object.values(scoring)[1]}점): 비례와 균형
3. ${Object.keys(scoring)[2]} (${Object.values(scoring)[2]}점): 붓의 압력과 굵기
4. ${Object.keys(scoring)[3]} (${Object.values(scoring)[3]}점): 올바른 획순

주의사항:
- 붓의 질감과 먹의 번짐 평가
- 삐침, 꺾기 등 세밀한 표현
- 운필의 속도감과 힘
`;
    }
    
    // 황자원 92법 추가 (해서체 전용)
    if (courseId === 'hwang92-sebeop' && fontStyle === '해서체' && hwang92SubType) {
      const hwangCriteria = HWANG92_WEIGHT[hwang92SubType];
      basePrompt += `
      
[해서체 전용] 황자원 92법 ${hwang92SubType} 평가 (30점 추가):
${Object.entries(hwangCriteria).map(([key, score]) => 
  `- ${key}: ${score}점`
).join('\n')}

※ 황자원 92법은 해서체(정자체) 전용 평가 기법입니다.
`;
    }
    
    basePrompt += `

목표 글자: ${targetCharacter}
작성 획수: ${strokeCount}개

JSON 형식으로 응답하세요:
{
  "scores": {
    "항목1": {"name": "...", "score": 0, "maxScore": 0},
    "항목2": {"name": "...", "score": 0, "maxScore": 0},
    "항목3": {"name": "...", "score": 0, "maxScore": 0},
    "항목4": {"name": "...", "score": 0, "maxScore": 0}
  },
  "checklist": {
    ${(courseId === 'hwang92-sebeop' && fontStyle === '해서체') ? `
    "덮개충분": true/false,
    "내부안전": true/false,
    "공간비례": true/false,
    "결구완성도": true/false,
    ` : ''}
    "형태정확": true/false,
    "비례적절": true/false,
    "굵기일정": true/false,
    "획순정확": true/false
  },
  "strengths": ["..."],
  "improvements": ["..."]
}`;
    
    return basePrompt;
  }
  
  /**
   * Gemini API 호출
   */
  private async callGeminiAPI(prompt: string, imageBase64: string): Promise<any> {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: prompt },
                { inline_data: { mime_type: "image/png", data: imageBase64 } }
              ]
            }],
            generationConfig: {
              maxOutputTokens: 2000,
              temperature: 0.7
            }
          })
        }
      );
      
      const data = await response.json();
      const content = data.candidates[0].content.parts[0].text;
      
      console.log('🔍 Gemini API 원본 응답 (EvaluationEngine):', content);
      
      // JSON 파싱 - 더 안전한 방법
      let parsedResult;
      try {
        // 먼저 전체 content가 JSON인지 시도
        parsedResult = JSON.parse(content);
      } catch (e) {
        // JSON 블록 찾기 (코드블록 제거)
        const cleanContent = content.replace(/```json\s*/g, '').replace(/```\s*/g, '');
        const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) {
          console.error('JSON 파싱 실패 - 원본:', content);
          throw new Error('JSON 형식을 찾을 수 없습니다');
        }
        
        parsedResult = JSON.parse(jsonMatch[0]);
      }
      
      return {
        ...parsedResult,
        provider: 'gemini'
      };
    } catch (error) {
      console.error('Gemini API 오류:', error);
      return this.mockEvaluation({ mode: 'digital' } as EvaluationRequest);
    }
  }
  
  /**
   * Mock 평가
   */
  private mockEvaluation(request: EvaluationRequest): any {
    const isHwang92 = request.courseId === 'hwang92-sebeop' && request.fontStyle === '해서체';
    const isDigital = request.mode === 'digital';
    
    // 모드별 점수 생성 (항상 100점 만점 기준)
    let mockScores;
    if (isDigital) {
      // 디지털 모드 점수 (100점 만점)
      mockScores = {
        정확성: { score: Math.round(50 * (0.6 + Math.random() * 0.35)), maxScore: 50, feedback: '형태가 전체적으로 양호합니다' },
        위치: { score: Math.round(30 * (0.6 + Math.random() * 0.35)), maxScore: 30, feedback: '격자 내 위치가 적절합니다' },
        매끄러움: { score: Math.round(15 * (0.6 + Math.random() * 0.35)), maxScore: 15, feedback: '선이 비교적 매끄럽습니다' },
        획수: { score: Math.round(5 * (0.6 + Math.random() * 0.35)), maxScore: 5, feedback: '획수가 정확합니다' }
      };
    } else {
      // 실물 모드 점수 (항상 100점 만점, 황자원 92법 비중은 내부적으로 처리)
      mockScores = {
        형태: { score: Math.round(40 * (0.6 + Math.random() * 0.35)), maxScore: 40, feedback: '형태가 우수합니다' },
        비례: { score: Math.round(30 * (0.6 + Math.random() * 0.35)), maxScore: 30, feedback: '비례가 적절합니다' },
        굵기: { score: Math.round(20 * (0.6 + Math.random() * 0.35)), maxScore: 20, feedback: '굵기 조절이 양호합니다' },
        획순: { score: Math.round(10 * (0.6 + Math.random() * 0.35)), maxScore: 10, feedback: '획순이 정확합니다' }
      };
    }
    
    return {
      scores: mockScores,
      checklist: {
        ...(isHwang92 ? {
          덮개구조: Math.random() > 0.3,
          보호관계: Math.random() > 0.4,
          공간비례: Math.random() > 0.3,
          결구완성도: Math.random() > 0.5
        } : {}),
        기본형태완성: Math.random() > 0.3,
        비례균형달성: Math.random() > 0.4,
        일정한굵기: Math.random() > 0.5,
        정확한획순: Math.random() > 0.4
      },
      recognition: {
        character: request.targetCharacter,
        confidence: 0.7 + Math.random() * 0.25,
        isCorrect: true
      },
      feedback: {
        strengths: ['Mock 평가 장점 1', 'Mock 평가 장점 2'],
        improvements: ['Mock 평가 개선점 1', 'Mock 평가 개선점 2'],
        summary: '기초부터 차근차근 연습해보세요. ' + (isHwang92 ? '황자원 92법 천복자 구조를 더 연습해보세요.' : '기본기를 잘 다져가고 있습니다.')
      },
      provider: 'mock'
    };
  }
  
  /**
   * 점수 계산
   */
  private calculateScores(request: EvaluationRequest, aiResult: any): EvaluationResponse['scores'] {
    let baseScores: Record<string, number> = {};
    
    console.log('🔍 calculateScores - aiResult.scores:', aiResult.scores);
    
    // AI 결과 구조에 따라 유연하게 처리
    if (aiResult.scores) {
      // Case 1: 항목1, 항목2 구조
      if (aiResult.scores.항목1) {
        baseScores[aiResult.scores.항목1.name] = aiResult.scores.항목1.score;
        baseScores[aiResult.scores.항목2.name] = aiResult.scores.항목2.score;
        baseScores[aiResult.scores.항목3.name] = aiResult.scores.항목3.score;
        baseScores[aiResult.scores.항목4.name] = aiResult.scores.항목4.score;
        console.log('📦 baseScores (항목 구조):', baseScores);
      } 
      // Case 2: 직접 키 구조 (정확성/형태 등)
      else {
        // 모든 가능한 키들을 확인하고 처리
        const scoreKeys = Object.keys(aiResult.scores);
        scoreKeys.forEach(key => {
          const scoreData = aiResult.scores[key];
          // 객체 형태 {score, maxScore}인 경우
          if (typeof scoreData === 'object' && scoreData.score !== undefined) {
            baseScores[key] = scoreData.score;
          }
          // 숫자 값인 경우
          else if (typeof scoreData === 'number') {
            baseScores[key] = scoreData;
          }
        });
        
        console.log('📦 baseScores (직접 키 구조):', baseScores);
        
        // 필수 키가 없으면 기본값 사용
        if (Object.keys(baseScores).length === 0) {
          if (request.mode === 'digital') {
            baseScores = { '정확성': 40, '위치': 25, '매끄러움': 12, '획수': 4 };
          } else {
            baseScores = { '형태': 30, '비례': 20, '굵기': 15, '획순': 7 };
          }
          console.log('📦 baseScores (폴백):', baseScores);
        }
      }
    }
    
    const hwang92Scores = request.courseId === 'hwang92-sebeop' ? 
      aiResult.checklist : undefined;
    
    console.log('📊 calculateScores - baseScores:', baseScores);
    console.log('📋 calculateScores - hwang92Scores:', hwang92Scores);
    
    const result = calculateTotalScore(
      request.mode === 'digital' ? 'digital' : 'physical',
      baseScores,
      hwang92Scores,
      request.courseId,
      request.hwang92SubType
    );
    
    console.log('🎯 calculateScores - result:', result);
    return result;
  }
  
  /**
   * 체크리스트 생성
   */
  private generateChecklist(
    request: EvaluationRequest,
    aiResult: any,
    scores: EvaluationResponse['scores']
  ): EvaluationResponse['checklist'] {
    // 체크리스트 안전 검사
    const checklist = aiResult.checklist || {};
    
    const basicChecklist: ChecklistItem[] = [
      {
        id: '형태정확',
        label: '형태 정확성',
        description: '글자의 기본 형태가 정확한지',
        checked: checklist.형태정확 || checklist.기본형태완성 || false,
        score: (checklist.형태정확 || checklist.기본형태완성) ? 
          (scores.breakdown['형태'] || scores.breakdown['정확성'] || 0) : 0,
        maxScore: request.mode === 'digital' ? BASE_SCORING.디지털.정확성 : BASE_SCORING.실물.형태,
        category: '형태'
      },
      {
        id: '비례적절',
        label: '비례와 균형',
        description: '글자의 비례가 적절한지',
        checked: checklist.비례적절 || checklist.비례균형달성 || false,
        score: (checklist.비례적절 || checklist.비례균형달성) ? 
          (scores.breakdown['비례'] || scores.breakdown['위치'] || 0) : 0,
        maxScore: request.mode === 'digital' ? BASE_SCORING.디지털.위치 : BASE_SCORING.실물.비례,
        category: '비례'
      },
      {
        id: '굵기일정',
        label: request.mode === 'digital' ? '선의 매끄러움' : '압력과 굵기',
        description: request.mode === 'digital' ? '디지털 선이 매끄러운지' : '붓의 압력이 일정한지',
        checked: checklist.굵기일정 || checklist.일정한굵기 || false,
        score: (checklist.굵기일정 || checklist.일정한굵기) ? 
          (scores.breakdown['굵기'] || scores.breakdown['매끄러움'] || 0) : 0,
        maxScore: request.mode === 'digital' ? BASE_SCORING.디지털.매끄러움 : BASE_SCORING.실물.굵기,
        category: '굵기'
      },
      {
        id: '획순정확',
        label: '획순 정확성',
        description: '올바른 획순으로 작성했는지',
        checked: checklist.획순정확 || checklist.정확한획순 || false,
        score: (checklist.획순정확 || checklist.정확한획순) ? 
          (scores.breakdown['획순'] || scores.breakdown['획수'] || 0) : 0,
        maxScore: request.mode === 'digital' ? BASE_SCORING.디지털.획수 : BASE_SCORING.실물.획순,
        category: '획순'
      }
    ];
    
    let hwang92Checklist: ChecklistItem[] | undefined;
    
    if (request.courseId === 'hwang92-sebeop' && request.fontStyle === '해서체' && request.hwang92SubType) {
      const hwangScoring = HWANG92_WEIGHT[request.hwang92SubType];
      hwang92Checklist = Object.entries(hwangScoring).map(([key, maxScore]) => ({
        id: key,
        label: key,
        description: this.getHwang92Description(request.hwang92SubType!, key),
        checked: aiResult.checklist[key] || false,
        score: aiResult.checklist[key] ? maxScore : 0,
        maxScore,
        category: 'hwang92'
      }));
    }
    
    return {
      basic: basicChecklist,
      hwang92: hwang92Checklist
    };
  }
  
  /**
   * 황자원 92법 설명 가져오기
   */
  private getHwang92Description(subType: Hwang92SubType, criterion: string): string {
    const descriptions = {
      천복자: {
        덮개구조: '갓머리가 하부를 완전히 덮는지',
        보호관계: '하부 요소가 안전하게 보호되는지',
        공간비례: '상하 비례가 적절한지 (1:3)',
        결구완성도: '천복자 특징이 명확한지'
      },
      지재자: {
        받침구조: '하단 받침이 충분히 넓고 안정적인지',
        중심균형: '상부와 하부의 중심이 일치하는지',
        지지관계: '상부 요소들이 안정적으로 받쳐지는지',
        전체균형: '전체적인 안정감이 느껴지는지'
      },
      좌포자: {
        좌측위치: '왼쪽 요소가 낮은 위치에 있는지',
        우측위치: '오른쪽 요소가 상대적으로 높은지',
        높이비례: '좌우 높이차가 적절한지',
        시각균형: '시각적 균형이 유지되는지'
      },
      우포자: {
        우측위치: '오른쪽 요소가 낮은 위치에 있는지',
        좌측위치: '왼쪽 요소가 상대적으로 높은지',
        높이조화: '좌우 높이차가 자연스러운지',
        전체안정: '전체 글자의 안정감이 유지되는지'
      }
    };
    
    return descriptions[subType]?.[criterion] || '';
  }
  
  /**
   * 피드백 생성
   */
  private generateFeedback(
    request: EvaluationRequest,
    scores: EvaluationResponse['scores'],
    checklist: EvaluationResponse['checklist']
  ): EvaluationResponse['feedback'] {
    // mode 변환: digital -> 디지털, physical -> 실물
    const modeKey = request.mode === 'digital' ? '디지털' : '실물';
    const rules = FEEDBACK_RULES[modeKey];
    const strengths: string[] = [];
    const improvements: string[] = [];
    
    // 체크된 항목은 강점으로
    checklist.basic.filter(item => item.checked).forEach(item => {
      if (strengths.length < rules.maxItems) {
        strengths.push(`${item.label}이(가) 우수합니다`);
      }
    });
    
    // 체크 안된 항목은 개선점으로
    checklist.basic.filter(item => !item.checked).forEach(item => {
      if (improvements.length < rules.maxItems) {
        const examples = rules.examples?.[item.category || ''] || [];
        improvements.push(examples[0] || `${item.label}을(를) 개선해보세요`);
      }
    });
    
    // 황자원 92법 피드백 추가
    if (checklist.hwang92) {
      const hwangStrengths = checklist.hwang92.filter(item => item.checked);
      const hwangImprovements = checklist.hwang92.filter(item => !item.checked);
      
      if (hwangStrengths.length > 0) {
        strengths.push(`${request.hwang92SubType} 구조가 잘 표현되었습니다`);
      }
      
      if (hwangImprovements.length > 0) {
        improvements.push(`${hwangImprovements[0].label}을(를) 더 신경써주세요`);
      }
    }
    
    // 최소 개수 보장
    while (strengths.length < rules.minItems) {
      strengths.push('꾸준한 연습이 돋보입니다');
    }
    
    while (improvements.length < rules.minItems) {
      improvements.push('더욱 자신감 있게 써보세요');
    }
    
    // 요약 생성
    const grade = getGrade(scores.total);
    const summary = `${grade.message} ${request.courseId === 'hwang92-sebeop' ? 
      `황자원 92법 ${request.hwang92SubType} 구조를 ${scores.breakdown['황자원평가'] > 15 ? '잘' : '더'} 연습해보세요.` : 
      `기본기를 ${scores.total > 70 ? '잘 다져가고 있습니다' : '더 연습해보세요'}.`}`;
    
    return {
      strengths: strengths.slice(0, rules.maxItems),
      improvements: improvements.slice(0, rules.maxItems),
      summary
    };
  }
}

// 싱글톤 인스턴스 export
export const evaluationEngine = EvaluationEngine.getInstance();