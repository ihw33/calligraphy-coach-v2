/**
 * 코스 관련 타입 정의
 */

// 코스 타입 (펜글씨 vs 붓글씨)
export type CourseType = 'pen' | 'brush';

// 언어 카테고리 (한글 vs 한자)
export type LanguageCategory = 'hangul' | 'hanja';

// 난이도 수준
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// 연습 모드
export type PracticeMode = 'single' | 'word' | 'sentence' | 'paragraph';

// 서체 스타일
export type FontStyle = 'panbon' | 'gungseo' | 'haeseo' | 'jeonseo' | 'standard';

// 코스 상태
export type CourseStatus = 'locked' | 'available' | 'in_progress' | 'completed';

// 문자 데이터
export interface Character {
  id: string;
  character: string;
  type: 'korean' | 'chinese';
  strokeOrder?: number[];
  referenceImage?: string;
  audioUrl?: string;
  meaning?: string;
  pronunciation?: string;
}

// 레슨 데이터
export interface Lesson {
  id: string;
  title: string;
  description?: string;
  order: number;
  characters: Character[];
  practiceMode: PracticeMode;
  fontStyle?: FontStyle;
  duration?: number; // 예상 소요 시간 (분)
  status: CourseStatus;
  progress: number; // 0-100
  completedAt?: Date;
}

// 평가 기준
export interface EvaluationCriteria {
  pen?: {
    accuracy: number;    // 정확도 (40점)
    smoothness: number;  // 매끄러움 (30점)
    consistency: number; // 일관성 (30점)
  };
  brush?: {
    form: number;        // 형태 (40점)
    proportion: number;  // 비례 (30점)
    pressure: number;    // 필압 (20점)
    strokeOrder: number; // 획순 (10점)
  };
}

// 코스 데이터
export interface Course {
  id: string;
  type: CourseType;
  category: LanguageCategory;
  level: DifficultyLevel;
  title: string;
  description: string;
  thumbnail?: string;
  order: number;
  lessons: Lesson[];
  totalLessons: number;
  completedLessons: number;
  progress: number; // 0-100
  estimatedTime: number; // 총 예상 시간 (분)
  evaluationCriteria?: EvaluationCriteria;
  prerequisites?: string[]; // 선수 코스 ID
  status: CourseStatus;
  startedAt?: Date;
  completedAt?: Date;
}

// 학습 기록
export interface LearningRecord {
  id: string;
  userId?: string;
  courseId: string;
  lessonId: string;
  characterId: string;
  score: number;
  evaluation: any; // AI 평가 결과
  canvasData?: string; // Base64 이미지
  timestamp: Date;
  duration: number; // 소요 시간 (초)
}

// 진도 통계
export interface ProgressStats {
  totalCoursesCompleted: number;
  totalLessonsCompleted: number;
  totalCharactersPracticed: number;
  totalPracticeTime: number; // 분
  averageScore: number;
  streakDays: number;
  lastPracticeDate: Date;
  achievements: Achievement[];
}

// 성취도/뱃지
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: Date;
  type: 'course' | 'streak' | 'score' | 'special';
}