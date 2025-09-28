# 📂 프로젝트 폴더 구조 가이드

## 🎯 현재 상황 분석

### 문제점
1. **components 폴더가 너무 비대함** (20개 이상의 Screen 컴포넌트)
2. **명확한 분류 체계 부재**
3. **중복되거나 유사한 기능의 컴포넌트들**
4. **import 경로가 복잡해짐**

## 🏗️ 제안하는 새 폴더 구조

```
src/
├── app/                      # 앱 진입점 및 라우팅
│   ├── App.tsx
│   ├── routes.tsx
│   └── providers.tsx
│
├── features/                 # 기능별 모듈 (도메인 기반)
│   ├── auth/                # 인증 관련
│   │   ├── components/
│   │   │   ├── Landing.tsx
│   │   │   └── SocialLogin.tsx
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── course/              # 코스 관리
│   │   ├── components/
│   │   │   ├── CourseList.tsx
│   │   │   ├── CourseDetail.tsx
│   │   │   ├── CourseSelection.tsx
│   │   │   ├── CourseCurriculumScreen.tsx
│   │   │   └── CourseInfoScreen.tsx
│   │   ├── data/
│   │   │   └── courses.ts
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── practice/            # 연습 및 평가
│   │   ├── components/
│   │   │   ├── PracticeScreen.tsx
│   │   │   ├── PracticeCanvas.tsx
│   │   │   └── ResultScreen.tsx
│   │   ├── hooks/
│   │   ├── services/
│   │   │   ├── evaluator.ts
│   │   │   ├── photoEvaluator.ts
│   │   │   └── aiEvaluator.ts
│   │   └── utils/
│   │
│   ├── lesson/              # 레슨 관련
│   │   ├── components/
│   │   │   ├── LessonInfoScreen.tsx
│   │   │   └── HanjaLearnScreen.tsx
│   │   ├── data/
│   │   └── types/
│   │
│   ├── user/                # 사용자 관련
│   │   ├── components/
│   │   │   ├── Home.tsx
│   │   │   ├── SettingsScreen.tsx
│   │   │   ├── HistoryScreen.tsx
│   │   │   └── MyWritingGalleryScreen.tsx
│   │   ├── hooks/
│   │   └── services/
│   │
│   ├── community/           # 커뮤니티
│   │   ├── components/
│   │   │   └── CommunityScreen.tsx
│   │   └── services/
│   │
│   ├── admin/               # 관리자
│   │   ├── components/
│   │   │   └── AdminDashboard.tsx
│   │   └── services/
│   │
│   └── guide/               # 가이드 및 튜토리얼
│       ├── components/
│       │   ├── TutorialScreen.tsx
│       │   └── ToolsGuideScreen.tsx
│       └── data/
│
├── shared/                   # 공유 리소스
│   ├── components/          # 공통 컴포넌트
│   │   ├── ui/             # shadcn/ui 컴포넌트
│   │   ├── layout/         # 레이아웃 컴포넌트
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   └── widgets/        # 재사용 위젯
│   │       └── WeeklyStatsDetails.tsx
│   │
│   ├── hooks/              # 공통 hooks
│   ├── utils/              # 유틸리티
│   ├── lib/                # 외부 라이브러리 설정
│   ├── types/              # 공통 타입
│   └── constants/          # 상수
│
├── services/                # API 및 외부 서비스
│   ├── api/
│   ├── storage/
│   │   └── progressStorage.ts
│   └── ai/
│       └── gemini.ts
│
├── assets/                  # 정적 자원
│   ├── images/
│   │   ├── panbon/         # 판본체 이미지
│   │   └── icons/
│   ├── fonts/
│   └── styles/
│
└── config/                  # 설정 파일
    ├── env.ts
    └── constants.ts
```

## 🔄 리팩토링 단계

### 1단계: 기본 구조 생성
```bash
# 폴더 구조 생성
mkdir -p src/{app,features,shared,services,assets,config}
mkdir -p src/features/{auth,course,practice,lesson,user,community,admin,guide}
mkdir -p src/shared/{components,hooks,utils,lib,types,constants}
```

### 2단계: 기능별 분류
- **auth**: Landing, SocialLogin
- **course**: Course 관련 모든 컴포넌트
- **practice**: Practice, Result, Canvas
- **user**: Home, Settings, History, Gallery
- **lesson**: Lesson, Hanja 학습
- **community**: 커뮤니티 기능
- **admin**: 관리자 대시보드
- **guide**: Tutorial, Tools 가이드

### 3단계: Import 경로 설정
```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@app/*": ["src/app/*"],
      "@features/*": ["src/features/*"],
      "@shared/*": ["src/shared/*"],
      "@services/*": ["src/services/*"],
      "@assets/*": ["src/assets/*"],
      "@config/*": ["src/config/*"]
    }
  }
}
```

### 4단계: Barrel Export 파일 생성
```typescript
// src/features/course/index.ts
export * from './components/CourseList';
export * from './components/CourseDetail';
export * from './types';
```

## 🎨 명명 규칙

### 컴포넌트
- **Screen 접미사 제거**: `HomeScreen.tsx` → `Home.tsx`
- **기능 중심 네이밍**: `PracticeCanvas.tsx` (Good)
- **Page vs Component 구분**
  - Page: 라우트 엔트리 포인트
  - Component: 재사용 가능한 UI

### 파일 구조
```typescript
// feature/course/components/CourseList.tsx
export const CourseList = () => { ... }

// feature/course/hooks/useCourse.ts
export const useCourse = () => { ... }

// feature/course/services/courseService.ts
export const courseService = { ... }
```

## 🚀 즉시 실행 가능한 액션

### 우선순위 1 (긴급)
1. **features 폴더 생성 및 기능별 분류**
2. **중복 컴포넌트 통합**
3. **Import 경로 별칭 설정**

### 우선순위 2 (중요)
1. **Barrel export 파일 생성**
2. **공통 컴포넌트 shared로 이동**
3. **서비스 레이어 정리**

### 우선순위 3 (개선)
1. **테스트 파일 구조 정립**
2. **Storybook 구조 설정**
3. **문서화 구조 개선**

## 📊 예상 효과

1. **명확한 관심사 분리**
2. **쉬운 네비게이션**
3. **효율적인 코드 재사용**
4. **팀 협업 개선**
5. **유지보수성 향상**

## ⚠️ 주의사항

1. **점진적 마이그레이션**: 한 번에 모든 것을 옮기지 말고 기능별로 진행
2. **Git 히스토리 보존**: git mv 명령어 사용
3. **Import 체크**: 모든 import 경로 업데이트
4. **테스트 실행**: 각 단계마다 테스트 확인

---
*이 구조는 확장 가능하며, 프로젝트 성장에 따라 조정 가능합니다.*