# 서예 코치 v2 - 전체 시스템 계획

## 📋 프로젝트 개요
디지털 서예 교육 플랫폼 - 펜글씨와 붓글씨 통합 학습 시스템

## 🏗️ 시스템 아키텍처

### 1. 기술 스택
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Canvas**: HTML5 Canvas API + Pointer Events
- **AI**: Google Gemini Vision API
- **Storage**: IndexedDB (로컬) + Supabase (클라우드 예정)
- **Media**: WebRTC (카메라) + File API (업로드)

### 2. 주요 모듈 구조
```
src/
├── components/
│   ├── course/           # 코스 관련 컴포넌트
│   │   ├── CourseList    # 코스 목록
│   │   ├── CourseDetail  # 코스 상세
│   │   └── CourseProgress # 진도 관리
│   │
│   ├── practice/         # 연습 모드
│   │   ├── PenMode       # 펜글씨 (디지털)
│   │   └── BrushMode     # 붓글씨 (실물)
│   │
│   ├── evaluation/       # 평가 시스템
│   │   ├── AIEvaluator   # AI 평가
│   │   └── ResultView    # 결과 표시
│   │
│   └── learning/         # 학습 콘텐츠
│       ├── HangulLearn   # 한글 학습
│       ├── HanjaLearn    # 한자 학습
│       └── CalligraphyLearn # 서예 학습
│
├── services/
│   ├── ai/              # AI 서비스
│   ├── storage/         # 저장소
│   ├── media/           # 미디어 처리
│   └── audio/           # 음성 서비스
│
└── data/
    ├── courses/         # 코스 데이터
    ├── characters/      # 문자 데이터
    └── references/      # 참조 이미지
```

## 🎯 구현 로드맵

### Phase 1: 기반 시스템 구축 (현재)
- [x] Canvas 시스템 구현
- [x] 카메라/업로드 시스템
- [x] AI 평가 통합
- [ ] 코스 관리 시스템
- [ ] 진도 추적 시스템

### Phase 2: 펜글씨 콘텐츠
- [ ] 한글 학습 모듈
  - [ ] 자모 학습
  - [ ] 단어 학습
  - [ ] 음성 지원
- [ ] 한자 학습 모듈
  - [ ] 급수별 분류
  - [ ] 한자능력시험 대비

### Phase 3: 붓글씨 콘텐츠
- [ ] 한글 서예
  - [ ] 판본체 완성
  - [ ] 궁서체 추가
- [ ] 한문 서예
  - [ ] 해서체 기초
  - [ ] 결구 92법
  - [ ] 작가별 임서

### Phase 4: 고급 기능
- [ ] 사용자 계정 시스템
- [ ] 클라우드 저장
- [ ] 소셜 공유
- [ ] 실시간 피드백
- [ ] 멀티플레이어 대전

## 📊 데이터 구조

### 코스 데이터
```typescript
interface Course {
  id: string;
  type: 'pen' | 'brush';
  category: 'hangul' | 'hanja';
  level: 'beginner' | 'intermediate' | 'advanced';
  title: string;
  description: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  characters: Character[];
  practiceMode: 'single' | 'word' | 'sentence';
  evaluationCriteria: EvaluationCriteria;
}
```

### 평가 기준
```typescript
interface EvaluationCriteria {
  pen: {
    accuracy: number;    // 정확도
    smoothness: number;  // 매끄러움
    consistency: number; // 일관성
  };
  brush: {
    form: number;        // 형태
    proportion: number;  // 비례
    pressure: number;    // 필압
    strokeOrder: number; // 획순
  };
}
```

## 🔑 핵심 기능

### 1. 적응형 학습
- 사용자 수준 자동 감지
- 개인화된 커리큘럼 제공
- 약점 집중 훈련

### 2. 실시간 피드백
- 획 그리기 중 실시간 가이드
- 즉각적인 교정 제안
- 압력 센싱 피드백

### 3. AI 평가
- 표준 서체와 비교 분석
- 구체적인 개선 방향 제시
- 진도 추적 및 리포트

### 4. 멀티모달 학습
- 시각 (이미지/영상)
- 청각 (발음/설명)
- 촉각 (압력 감지)

## 🎨 UI/UX 원칙

1. **모바일 우선**: 터치 중심 인터페이스
2. **직관적 네비게이션**: 3단계 이내 접근
3. **시각적 피드백**: 즉각적인 반응
4. **게이미피케이션**: 성취감과 동기부여
5. **접근성**: 다양한 연령대 고려

## 📈 성과 지표

- 일일 활성 사용자 (DAU)
- 평균 학습 시간
- 완주율
- 실력 향상도
- 사용자 만족도

## 🚀 다음 단계

1. **즉시**: 코스 관리 시스템 구축
2. **1주차**: 한글 펜글씨 모듈
3. **2주차**: 한자 펜글씨 모듈
4. **3주차**: 붓글씨 확장
5. **4주차**: 전체 통합 테스트

---
*최종 업데이트: 2024-12-24*