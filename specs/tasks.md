# 작업 목록: React 웹앱 기반 서예 연습 시스템

**브랜치**: `001-` | **날짜**: 2025-09-16 | **계획**: [plan.md](./plan.md)
**TDD 접근**: RED-GREEN-리팩토링 | **기반**: 기존 Figma 소스 활용

## 핵심 원칙
- ✅ 테스트 먼저 작성 (RED)
- ✅ 최소한으로 구현 (GREEN) 
- ✅ 기존 Figma UI 컴포넌트 활용
- ✅ Canvas API + Camera API 통합
- ✅ 오버엔지니어링 금지

## 🎯 React 웹앱 목표 
- **핵심 가치**: React 웹앱에서 캔버스 그리기 + 카메라 촬영 → 평가 결과
- **UI 기반**: 기존 Figma 소스 (shadcn/ui + Tailwind CSS)
- **기술 스택**: React + Next.js + Canvas API + Camera API
- **평가 방식**: 2단계 (기본 평가 → 향후 LLM 확장)

## 🎨 활용할 기존 컴포넌트
```
apps/web/src/components/ (Figma 소스 기반)
├── HomeScreen.tsx        ✅ 메인 화면 (완성됨)
├── CameraScreen.tsx      🔧 Canvas API 통합 필요
├── EvaluationScreen.tsx  ✅ 평가 결과 화면 (완성됨)
├── TabNavigation.tsx     ✅ 네비게이션 (완성됨)
└── ui/                   ✅ shadcn/ui 컴포넌트 (완성됨)
```

## 📁 경로 규칙
- **메인 앱**: `apps/web/` (React + Next.js)
- **기존 UI**: `apps/web/src/components/` (Figma 소스)
- **테스트**: `apps/web/src/__tests__/` (Vitest + Testing Library)
- **Canvas 로직**: `apps/web/src/lib/canvas/`

---

## Phase 1: 개발 환경 설정 (1-3)

### 1. [SETUP] Vite → Next.js 변환
- **목표**: 기존 Figma 소스를 Next.js 14 구조로 변환
- **접근**: package.json, vite.config.ts → next.config.js 변환
- **성공 조건**: `npm run dev` 실행 시 기존 UI 정상 표시
- **경로**: `apps/web/`
- **예상 시간**: 30분

### 2. [SETUP] 테스트 환경 구성
- **목표**: Vitest + Testing Library + Playwright 설정
- **접근**: 기존 shadcn/ui 컴포넌트 테스트 가능하도록 설정
- **성공 조건**: `npm test` 실행 시 기본 테스트 통과
- **경로**: `apps/web/vitest.config.ts`, `apps/web/playwright.config.ts`
- **예상 시간**: 25분

### 3. [TEST] 기존 컴포넌트 테스트 작성
- **목표**: HomeScreen, TabNavigation 등 기존 컴포넌트 테스트
- **접근**: Testing Library 기반 렌더링 테스트
- **성공 조건**: 기존 UI 컴포넌트들이 정상 렌더링됨
- **경로**: `apps/web/src/__tests__/components/`
- **예상 시간**: 20분

## Phase 2: Canvas API 통합 (4-8)

### 4. [TEST] Canvas 컴포넌트 테스트 작성
- **목표**: CameraScreen에 Canvas 요소 추가를 위한 테스트
- **접근**: Canvas 엘리먼트 존재 및 크기 확인
- **성공 조건**: Canvas가 CameraScreen 내에서 정상 렌더링
- **경로**: `apps/web/src/__tests__/components/CameraScreen.test.tsx`
- **예상 시간**: 20분

### 5. [IMPL] CameraScreen에 Canvas 통합
- **목표**: 기존 CameraScreen UI에 Canvas 요소 추가
- **접근**: 기존 가이드 오버레이 위에 Canvas 레이어 추가
- **성공 조건**: 테스트 통과 + Canvas가 UI에 자연스럽게 통합
- **경로**: `apps/web/src/components/CameraScreen.tsx`
- **예상 시간**: 35분

### 6. [TEST] 터치/마우스 그리기 테스트
- **목표**: Canvas에서 터치/마우스 입력으로 그리기 기능 확인
- **접근**: Pointer Events 시뮬레이션 (터치 + 마우스 통합)
- **성공 조건**: 터치/마우스 모두에서 선 그리기 가능
- **경로**: `apps/web/src/__tests__/lib/canvas.test.ts`
- **예상 시간**: 30분

### 7. [IMPL] Canvas 그리기 로직 구현
- **목표**: Pointer Events API 기반 그리기 시스템
- **접근**: 압력 감지 지원 (향후 확장 준비)
- **성공 조건**: 테스트 통과 + 부드러운 그리기 경험
- **경로**: `apps/web/src/lib/canvas/drawing.ts`
- **예상 시간**: 45분

### 8. [TEST] 스트로크 데이터 저장 테스트
- **목표**: 그린 선의 좌표/압력 데이터 저장 확인
- **접근**: 스트로크 데이터 구조 및 상태 관리 테스트
- **성공 조건**: 그리기 시 스트로크 배열에 데이터 저장
- **경로**: `apps/web/src/__tests__/lib/stroke-data.test.ts`
- **예상 시간**: 20분

## Phase 3: 평가 시스템 통합 (9-12)

### 9. [IMPL] 스트로크 데이터 저장 구현
- **목표**: Phase 2 테스트를 통과시키는 상태 관리
- **접근**: React Context 또는 Zustand로 스트로크 배열 관리
- **성공 조건**: 그리기 시 좌표/압력 데이터가 배열에 저장
- **경로**: `apps/web/src/lib/canvas/stroke-storage.ts`
- **예상 시간**: 25분

### 10. [TEST] 기본 평가 로직 테스트
- **목표**: 간단한 이미지 비교 기반 점수 계산 확인
- **접근**: Canvas ImageData 비교 알고리즘 테스트
- **성공 조건**: 스트로크 데이터 → 0-100점 점수 반환
- **경로**: `apps/web/src/__tests__/lib/evaluation.test.ts`
- **예상 시간**: 30분

### 11. [IMPL] 기본 평가 알고리즘 구현
- **목표**: Canvas 기반 간단한 평가 시스템
- **접근**: 면적, 중심점, 획 수 기반 점수 계산
- **성공 조건**: 테스트 통과 + 일관된 점수 산출
- **경로**: `apps/web/src/lib/evaluation/basic-evaluator.ts`
- **예상 시간**: 40분

### 12. [IMPL] EvaluationScreen 연동
- **목표**: 기존 EvaluationScreen에 실제 평가 결과 표시
- **접근**: 기존 UI 구조 유지하면서 실제 데이터 연결
- **성공 조건**: 그리기 완료 후 평가 화면에 실제 점수 표시
- **경로**: `apps/web/src/components/EvaluationScreen.tsx`
- **예상 시간**: 30분

## Phase 4: Camera API 통합 (13-16)

### 13. [TEST] 카메라 기능 테스트
- **목표**: 기존 CameraScreen의 촬영 버튼 기능 확인
- **접근**: getUserMedia Mock + 촬영 버튼 클릭 테스트
- **성공 조건**: 버튼 클릭 시 카메라 스트림 획득 및 촬영
- **경로**: `apps/web/src/__tests__/components/CameraScreen.test.tsx`
- **예상 시간**: 25분

### 14. [IMPL] Camera API 연동
- **목표**: 기존 CameraScreen에 실제 카메라 기능 추가
- **접근**: getUserMedia + video element 연동
- **성공 조건**: 실제 카메라 프리뷰 표시 + 촬영 가능
- **경로**: `apps/web/src/lib/camera/camera-capture.ts`
- **예상 시간**: 40분

### 15. [TEST] 촬영 이미지 처리 테스트
- **목표**: 촬영한 이미지를 평가용으로 전처리하는 기능 확인
- **접근**: 이미지 → Canvas → ImageData 변환 테스트
- **성공 조건**: 촬영 이미지가 평가 가능한 형태로 변환
- **경로**: `apps/web/src/__tests__/lib/image-processing.test.ts`
- **예상 시간**: 30분

### 16. [IMPL] 이미지 전처리 구현
- **목표**: 촬영 이미지를 평가 알고리즘에 적합하게 전처리
- **접근**: 크기 정규화, 노이즈 제거, 이진화
- **성공 조건**: 테스트 통과 + 카메라/Canvas 모두 동일한 평가 가능
- **경로**: `apps/web/src/lib/image-processing/preprocessor.ts`
- **예상 시간**: 45분

## Phase 5: 통합 및 완성 (17-20)

### 17. [TEST] 네비게이션 통합 테스트
- **목표**: HomeScreen → CameraScreen → EvaluationScreen 플로우 확인
- **접근**: 기존 TabNavigation 기반 화면 전환 테스트
- **성공 조건**: 전체 사용자 플로우가 끊김없이 작동
- **경로**: `apps/web/src/__tests__/integration/user-flow.test.ts`
- **예상 시간**: 30분

### 18. [IMPL] 전체 플로우 연결
- **목표**: 모든 화면과 기능을 하나의 완성된 앱으로 통합
- **접근**: React Router 또는 Next.js 라우팅 + 상태 공유
- **성공 조건**: 홈 → 연습 → 평가 → 결과 저장 전체 플로우 완성
- **경로**: `apps/web/src/app/` (Next.js App Router)
- **예상 시간**: 40분

### 19. [TEST] E2E 테스트 (Playwright)
- **목표**: 실제 브라우저에서 전체 사용자 시나리오 확인
- **접근**: Playwright로 Canvas 그리기, 카메라 촬영, 평가 확인
- **성공 조건**: 실제 사용 환경에서 모든 기능 정상 작동
- **경로**: `apps/web/e2e/calligraphy-practice.spec.ts`
- **예상 시간**: 45분

### 20. [IMPL] 성능 최적화 및 마무리
- **목표**: Canvas 렌더링 최적화 및 전체 앱 안정화
- **접근**: 메모이제이션, 이벤트 디바운싱, 에러 바운더리
- **성공 조건**: 60fps 유지, 모든 테스트 통과, 에러 처리 완비
- **경로**: 전체 앱 최적화
- **예상 시간**: 50분

## ✅ 완료 기준
- ✅ **모든 테스트 통과**: Vitest + Testing Library + Playwright
- ✅ **React 웹앱 완성**: `apps/web/` 에서 실제 동작 확인
- ✅ **Canvas 그리기 플로우**: 터치/마우스 → 평가 → 결과 표시
- ✅ **카메라 촬영 플로우**: 촬영 → 이미지 처리 → 평가 → 결과 표시
- ✅ **기존 UI 통합**: Figma 디자인 시스템 활용
- ✅ **성능 목표**: Canvas 60fps, 평가 <2초
- ✅ **에러 처리**: 카메라 권한, Canvas 지원, 네트워크 오류

## 📊 예상 총 소요 시간
**약 8-10시간** (환경설정 1.5시간 + Canvas 통합 3시간 + 평가시스템 2.5시간 + Camera API 2.5시간 + 통합 1.5시간)

## ⚡ TDD 원칙
- **RED**: 실패하는 테스트 먼저 작성
- **GREEN**: 테스트를 통과시키는 최소 구현  
- **REFACTOR**: 기존 Figma UI 구조 활용하여 코드 정리
- **한 번에 하나씩**: 여러 기능 동시 작업 금지

## 🚀 향후 확장 로드맵 (Phase 6+)
### 단기 (1-2주)
- **압력 감지**: Pointer Events API로 펜 태블릿 지원
- **LocalStorage**: 연습 기록 저장/불러오기
- **PWA**: 오프라인 지원, 앱 설치 가능

### 중기 (1-2개월)  
- **TensorFlow.js**: 실제 문자 인식 및 고급 평가
- **IndexedDB**: 대용량 이미지 및 획 데이터 관리
- **다양한 서체**: 판본체, 궁서체, 전서체, 해서체

### 장기 (3-6개월)
- **LLM 통합**: GPT-4 Vision 기반 전문가 수준 평가
- **학습 커리큘럼**: 단계별 학습 과정 및 진도 관리
- **소셜 기능**: 작품 공유, 커뮤니티, 랭킹 시스템

---
*React 웹앱 기반: 기존 Figma UI + Canvas API + Camera API 통합*
*TDD 방식: 각 구현 전 반드시 실패하는 테스트부터 작성*


