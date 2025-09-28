/**
 * Score 인터페이스 - MVP용 간단한 평가 구조
 */

/** 점수 평가 결과 */
export interface Score {
  /** 전체 점수 (0-100) */
  total: number;
  
  /** 작성 시도 ID */
  attemptId: string;
  
  /** 평가 시간 */
  timestamp: Date;
}

// Future: 세부 점수 breakdown, 피드백 메시지, 비교 기준 등