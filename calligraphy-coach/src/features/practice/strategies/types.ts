/**
 * 평가 전략 시스템 타입 정의
 */

// 평가 기준
export interface EvaluationCriterion {
  id: string;
  label: string;
  description: string;
  weight: number; // 점수 비중
  category: '형태' | '비례' | '굵기' | '획순';
}

// 체크리스트 아이템
export interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  score: number;
  maxScore: number;
}

// 상세 점수
export interface DetailedScores {
  형태: number;
  비례: number;
  굵기: number;
  획순: number;
  총점: number;
}

// UI 설정
export interface UIConfig {
  theme: 'purple' | 'blue' | 'green' | 'orange' | 'red';
  icon: string;
  title: string;
  description: string;
  accentColor: string;
  bgGradient: string;
}

// 평가 전략 인터페이스
export interface EvaluationStrategy {
  id: string;
  name: string;
  evaluationType: 'hwang92' | 'standard' | 'custom';
  
  // 평가 기준 반환
  getCriteria(): EvaluationCriterion[];
  
  // AI 평가 결과를 체크리스트로 변환
  generateChecklist(evaluation: any, scores: DetailedScores): ChecklistItem[];
  
  // 점수 매핑 (AI 결과 → 표준 점수)
  mapScores(aiScores: any): DetailedScores;
  
  // UI 렌더링 정보
  getUIConfig(): UIConfig;
  
  // 평가 프롬프트 생성 (AI 평가용)
  generatePrompt?(targetChar: string, additionalInfo?: any): string;
}

// 평가 전략 팩토리
export interface EvaluationStrategyFactory {
  register(key: string, strategy: EvaluationStrategy): void;
  getStrategy(courseId: string, lessonId?: string): EvaluationStrategy;
  hasStrategy(courseId: string, lessonId?: string): boolean;
}