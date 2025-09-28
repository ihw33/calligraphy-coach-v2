# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 서예 코치 v2 프로젝트 컨텍스트

## 프로젝트 개요
붓글씨(서예) 연습 및 평가 시스템 - 한글/한자 필기 인식과 실시간 피드백 제공

## 기술 스택
- **프레임워크**: React 18 + Next.js 14 (TypeScript)
- **캔버스**: Canvas API + Pointer Events API (압력 감지)
- **머신러닝**: TensorFlow.js (한글/한자 인식)
- **상태관리**: Zustand
- **스타일링**: Tailwind CSS
- **테스트**: Vitest, Testing Library, Playwright
- **빌드**: Turbo (monorepo)

## 핵심 라이브러리들 (기능 기반)
1. **stroke-capture**: 붓 획 입력 및 압력 감지
2. **character-recognition**: 한글/한자 문자 인식
3. **calligraphy-evaluator**: 서예 평가 (형태/비례/굵기/획순)
4. **feedback-generator**: 평가 기반 피드백 생성

## 현재 집중 작업 (브랜치: 003-canvas-api-llm)
필기 인식 및 피드백 시스템 구현 - Canvas API 기반 평가에서 LLM 확장
- **1단계**: Canvas API 기반 기본 평가 시스템
- **2단계**: LLM(GPT-4 Vision, Claude, Gemini) 기반 전문가 평가
- **입력 방식**: Canvas 그리기 + 카메라 촬영 병행 지원
- **평가 체계**: 100점 만점 (형태 40%, 비례 30%, 굵기 20%, 획순 10%)
- **폴백 전략**: LLM 실패 시 Canvas API로 자동 전환

## 프로젝트 구조 및 아키텍처

### Monorepo 구조 (Turbo + npm workspaces)
```
calligraphy-coach-v2/
├── apps/
│   ├── mobile/                    # React Native + Expo 앱
│   │   ├── src/
│   │   │   ├── components/        # PracticeCanvas, CharacterSelector 등
│   │   │   ├── screens/           # HomeScreen, PracticeScreen, ResultScreen
│   │   │   ├── navigation/        # AppNavigator, TabNavigator
│   │   │   ├── store/             # Zustand 상태 관리
│   │   │   ├── services/          # API 클라이언트, 스토리지
│   │   │   ├── utils/             # evaluator, math 유틸리티
│   │   │   └── types/             # TypeScript 타입 정의
│   │   ├── babel.config.js        # Module resolver 별칭 설정
│   │   ├── jest.setup.js          # Jest 설정
│   │   └── app.json               # Expo 앱 설정
│   └── web/                       # Next.js 웹 앱
│       ├── src/
│       │   ├── components/        # shadcn/ui 기반 컴포넌트
│       │   │   ├── ui/            # Button, Card, Dialog 등 기본 UI
│       │   │   └── figma/         # Figma 디자인 시스템 컴포넌트
│       │   ├── lib/               # Canvas API, 평가 로직
│       │   └── __tests__/         # Vitest + Testing Library 테스트
│       ├── vite.config.ts         # Vite 설정
│       └── vitest.config.ts       # 테스트 설정
├── packages/                      # 공유 라이브러리들
│   ├── stroke-capture/            # Canvas API + Pointer Events
│   ├── character-recognition/     # TensorFlow.js 모델
│   ├── figma-sync/               # Figma API 연동
│   └── ui/                       # 공통 UI 컴포넌트
├── specs/                        # 기능 명세서들
│   ├── 003-canvas-api-llm/       # 현재 작업 브랜치 명세
│   │   ├── spec.md               # 상세 기능 명세
│   │   ├── plan.md               # 구현 계획
│   │   └── research.md           # 기술 연구
│   ├── contracts/                # API 계약서
│   └── tasks.md                  # 전체 작업 목록
├── figma-plugin/                 # Figma 플러그인
├── services/api/                 # FastAPI 백엔드 (Python)
└── turbo.json                    # Turbo 빌드 설정
```

### 기술적 아키텍처 패턴

#### 모바일 앱 (apps/mobile/)
- **프레임워크**: React Native 0.76.5 + Expo 51
- **네비게이션**: React Navigation v6 (Bottom Tabs + Native Stack)
- **상태 관리**: Zustand (전역 상태)
- **그래픽스**: @shopify/react-native-skia (Canvas 처리)
- **테스트**: Jest + Testing Library React Native
- **별칭 설정**: Babel module-resolver로 @components, @screens 등 별칭 사용

#### 웹 앱 (apps/web/)  
- **프레임워크**: React 18 + Vite (현재), Next.js 14 (향후 전환 예정)
- **UI 시스템**: shadcn/ui + Tailwind CSS + Radix UI
- **Canvas**: HTML5 Canvas API + Pointer Events
- **테스트**: Vitest + Testing Library
- **타입**: TypeScript 5.3+

#### 공유 라이브러리 패턴
- **독립성**: 각 패키지는 독립적으로 테스트 가능
- **CLI 제공**: 모든 패키지가 CLI 인터페이스 제공
- **TDD**: RED-GREEN-Refactor 사이클 강제

## 개발 명령어들

### 전체 프로젝트 (Turbo 기반)
```bash
# 전체 프로젝트 개발 서버 시작
npm run dev          # 모든 앱/패키지의 dev 스크립트 실행
npm run build        # 전체 빌드
npm run test         # 전체 테스트
npm run lint         # 전체 린터 실행
npm run clean        # 빌드 아티팩트 정리
```

### 모바일 앱 (React Native + Expo)
```bash
cd apps/mobile
npm run dev          # Expo 개발 서버 (expo start)
npm run android      # Android 에뮬레이터
npm run ios          # iOS 시뮬레이터
npm run web          # 웹 버전
npm run test         # Jest 테스트 (--passWithNoTests)
npm run lint         # ESLint 검사
```

### 웹 앱 (Vite + React)
```bash
cd apps/web
npm run dev          # Vite 개발 서버
npm run build        # 프로덕션 빌드
npm run test         # Vitest 테스트
npm run test:ui      # Vitest UI 모드
```

### 개별 패키지 테스트
```bash
# 특정 패키지/앱만 실행
npx turbo dev --filter=mobile
npx turbo test --filter=web
npx turbo lint --filter=@calligraphy/ui

# 의존성 그래프 확인
npx turbo build --dry-run
npx turbo build --graph

# 패키지 간 의존성 체크
npm run build          # 전체 빌드로 의존성 검증
```

## 중요한 설정 파일들

### TypeScript 설정
- **apps/mobile/tsconfig.json**: React Native 타입 설정
- **apps/web/tsconfig.json**: 웹 앱 타입 설정  
- **packages/*/tsconfig.json**: 각 패키지별 타입 설정

### 테스트 설정
- **apps/mobile/jest.setup.js**: Jest + React Native Testing Library  
- **apps/web/**: Vitest + Testing Library (구성은 vite.config.ts에 포함)
- **turbo.json**: 테스트 캐싱 및 병렬 실행 설정

### 핵심 개발 명령어
```bash
# 단일 테스트 실행
cd apps/mobile && npm test -- --testNamePattern="specific test"
cd apps/web && npm test -- --run specific-test-file

# 특정 앱/패키지만 개발
npx turbo dev --filter=mobile      # 모바일 앱만
npx turbo dev --filter=web         # 웹 앱만

# 코드 품질 체크
npm run lint                        # 전체 린터 실행
npm run build                       # 전체 빌드로 타입 검증
```

### Linting & Formatting
- **commitlint.config.cjs**: Conventional Commits 강제
- **.husky/**: Git hooks (pre-commit, commit-msg)
- **apps/mobile/babel.config.js**: 모듈 별칭 설정

## 테스트 요구사항 (중요)
1. TDD 필수: 테스트 먼저 작성 → 실패 확인 → 구현
2. 테스트 순서: 계약 → 통합 → E2E → 단위
3. 실제 의존성 사용 (모킹 최소화)

## 성능 목표
- 입력 지연: <16ms (60fps)
- 압력 샘플링: 120Hz
- 문자 인식: <500ms
- 평가 계산: <200ms

## 코딩 컨벤션 및 패턴

### 파일 구조 패턴
```typescript
// 컴포넌트 구조 (apps/mobile/src/components/)
PracticeCanvas.tsx           # 메인 컴포넌트
__tests__/
  PracticeCanvas.test.tsx    # 컴포넌트 테스트

// 유틸리티 구조 (apps/mobile/src/utils/)
evaluator.ts                 # 유틸리티 함수
__tests__/
  evaluator.test.ts          # 유틸리티 테스트
```

### 모듈 별칭 (apps/mobile/babel.config.js)
```javascript
'@': './src',
'@components': './src/components',
'@screens': './src/screens',
'@navigation': './src/navigation',
'@store': './src/store',
'@services': './src/services',
'@utils': './src/utils',
'@types': './src/types'
```

### 상태 관리 패턴 (Zustand)
```typescript
// apps/mobile/src/store/useAppStore.ts
interface AppState {
  // 상태 정의
}

interface AppActions {
  // 액션 정의
}

export const useAppStore = create<AppState & AppActions>((set) => ({
  // 구현
}));
```

### 테스트 패턴
```typescript
// TDD 사이클 예시
describe('PracticeCanvas', () => {
  test('should render canvas element', () => {
    // 1. RED: 실패하는 테스트 작성
  });
  
  test('should capture stroke data on drawing', () => {
    // 2. GREEN: 최소 구현으로 테스트 통과
  });
});
```

## 주요 개발 가이드라인

### Canvas API 통합 시 주의사항
- **압력 감지**: Pointer Events API 사용 (터치 + 마우스 통합)
- **성능**: requestAnimationFrame으로 렌더링 최적화
- **크로스 플랫폼**: React Native에서는 react-native-skia 사용

### LLM 연동 시 주의사항  
- **이미지 인코딩**: Base64 형태로 전송
- **에러 처리**: LLM 실패 시 Canvas API로 폴백
- **비용 관리**: 사용자별 일일 호출 제한

## 중요한 아키텍처 결정사항

### 브랜치 및 현재 작업 상태
- **현재 브랜치**: 003-canvas-api-llm (LLM 평가 시스템 구현)
- **앱 구조**: 모바일(React Native + Expo) + 웹(Vite + React) 병행 개발
- **UI 시스템**: shadcn/ui 컴포넌트 기반 통합 디자인 시스템
- **평가 시스템**: Canvas API 기본 → LLM 확장 (폴백 전략 포함)

## 헌법 규칙
- 모든 기능은 독립 라이브러리로
- 각 라이브러리는 CLI 제공
- TDD 필수 (RED-GREEN-리팩토링)
- 구조화된 로깅 포함

## 데이터 모델 핵심
- **WritingSession**: 연습 세션 (서체, 장치 정보 포함)
- **WritingAttempt**: 개별 글자 작성 시도 (압력 데이터 포함)
- **Evaluation**: 100점 평가 (4가지 요소별 점수)
- **Feedback**: 개선 제안 및 시각적 가이드
- **Progress**: 시간별 향상도 추적

## 지원 서체
- **판본체** (panbon): 한글 기본 서체
- **궁서체** (gungseo): 한글 전통 서체  
- **전서체** (jeonseo): 한자 고전 서체
- **해서체** (haeseo): 한자 표준 서체

---
*자동 생성됨 (/plan 명령어로부터) - 수동 편집 금지*
*최종 업데이트: 2025-09-12*
- tasks에 계획해서 작성해 두지 않은 작업은 하지앟는다