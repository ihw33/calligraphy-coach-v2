/**
 * 평가 시스템 통합 Export
 * 모든 평가 관련 기능을 단일 진입점으로 제공
 */

// Core exports
export { evaluationEngine } from './core/EvaluationEngine';
export type { 
  EvaluationRequest, 
  EvaluationResponse, 
  ChecklistItem 
} from './core/EvaluationEngine';

// Config exports
export {
  BASE_SCORING,
  HWANG92_WEIGHT,
  MODE_EMPHASIS,
  SCORE_NORMALIZATION,
  FEEDBACK_RULES,
  calculateTotalScore,
  getGrade
} from './config/evaluationConfig';

export type {
  InputMode,
  CourseType,
  Hwang92SubType
} from './config/evaluationConfig';

// 간편 사용을 위한 통합 함수
import { evaluationEngine } from './core/EvaluationEngine';
import type { EvaluationRequest, EvaluationResponse } from './core/EvaluationEngine';

/**
 * 간편 평가 함수
 * 기존 코드와의 호환성을 위한 래퍼 함수
 */
export async function evaluateCalligraphy(
  canvas: HTMLCanvasElement,
  targetCharacter: string,
  strokeCount: number,
  mode: 'digital' | 'physical' = 'digital',
  courseInfo?: {
    courseId?: string;
    lessonId?: string;
    hwang92SubType?: string;
  }
): Promise<EvaluationResponse> {
  // Canvas를 base64로 변환
  const imageBase64 = canvas.toDataURL('image/png').split(',')[1];
  
  // 요청 구성
  const request: EvaluationRequest = {
    mode,
    courseId: (courseInfo?.courseId || 'standard') as any,
    lessonId: courseInfo?.lessonId,
    targetCharacter,
    strokeCount,
    imageBase64,
    hwang92SubType: courseInfo?.hwang92SubType as any
  };
  
  // 평가 실행
  return evaluationEngine.evaluate(request);
}

/**
 * 기존 aiEvaluator.ts와의 호환성 유지
 */
export async function evaluateWithAI(
  canvas: HTMLCanvasElement,
  targetCharacter: string,
  strokeCount: number,
  characterType: 'korean' | 'chinese' = 'korean',
  inputMode: 'digital' | 'physical' = 'digital',
  courseInfo?: {
    courseId: string;
    lessonId?: string;
    lessonType?: string;
    evaluationPoints?: string[];
  }
): Promise<any> {
  const response = await evaluateCalligraphy(
    canvas,
    targetCharacter,
    strokeCount,
    inputMode,
    {
      courseId: courseInfo?.courseId,
      lessonId: courseInfo?.lessonId,
      hwang92SubType: courseInfo?.lessonType
    }
  );
  
  // 기존 형식으로 변환
  return {
    scores: {
      항목1: { 
        name: Object.keys(response.scores.breakdown)[0], 
        score: Object.values(response.scores.breakdown)[0],
        maxScore: inputMode === 'digital' ? 50 : 40
      },
      항목2: {
        name: Object.keys(response.scores.breakdown)[1],
        score: Object.values(response.scores.breakdown)[1],
        maxScore: 30
      },
      항목3: {
        name: Object.keys(response.scores.breakdown)[2],
        score: Object.values(response.scores.breakdown)[2],
        maxScore: inputMode === 'digital' ? 15 : 20
      },
      항목4: {
        name: Object.keys(response.scores.breakdown)[3],
        score: Object.values(response.scores.breakdown)[3],
        maxScore: inputMode === 'digital' ? 5 : 10
      }
    },
    recognition: {
      character: targetCharacter,
      confidence: response.scores.total / 100,
      isCorrect: response.scores.total > 70
    },
    총평: response.feedback.summary,
    checklist: response.checklist.hwang92 ? 
      Object.fromEntries(response.checklist.hwang92.map(item => [item.id, item.checked])) :
      Object.fromEntries(response.checklist.basic.map(item => [item.id, item.checked])),
    strengths: response.feedback.strengths,
    improvements: response.feedback.improvements
  };
}