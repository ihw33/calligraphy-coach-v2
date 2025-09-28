/**
 * WritingAttempt 인터페이스 - MVP용 기본 구조만 정의
 */

/** 2D 좌표점 */
export interface Point {
  x: number;
  y: number;
}

/** 붓 획 데이터 */
export interface Stroke {
  /** 획을 구성하는 점들 */
  points: Point[];
}

/** 글자 작성 시도 */
export interface WritingAttempt {
  /** 고유 식별자 */
  id: string;
  
  /** 작성한 문자 ID */
  characterId: string;
  
  /** 붓 획들 */
  strokes: Stroke[];
  
  /** 작성 시간 */
  timestamp: Date;
}

// Future: pressure, velocity, deviceInfo, sessionId 등