/**
 * 네비게이션 타입 정의
 */

export type RootStackParamList = {
  MainTabs: undefined;
  CourseDetail: { courseId: string };
  Practice: { 
    courseId: string;
    lessonId: string;
    mode: 'canvas' | 'photo';
  };
  Result: { 
    score: number;
    feedback: string;
  };
};

export type MainTabParamList = {
  Learn: undefined;      // 한글/한자 학습 (외국인용)
  Calligraphy: undefined; // 서예 마스터 (메인)
  Progress: undefined;    // 진도
  Community: undefined;   // 커뮤니티
  Profile: undefined;     // 프로필
};