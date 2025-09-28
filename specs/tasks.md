# Tasks: 디지털 서예 웹앱 (Phase 2: UI-백엔드 통합)

**Input**: Integration requirements from `/specs/spec.md` Phase 2 section
**Prerequisites**: plan.md (updated), existing UI (`calligraphy-coach/`), backend (`apps/web/`)

## 실행 흐름 (Phase 2 통합)
```
1. Phase 2 목표: 기존 완성된 UI + 우리 백엔드 시스템 통합
   → 기존: calligraphy-coach (shadcn/ui + Tailwind v4)
   → 우리: apps/web (React + Vite + TypeScript + Zustand)
2. 통합 전략:
   → 기존 UI 베이스로 활용 (디자인/UX 보존)
   → 하드코딩 데이터 → 실제 API 교체
   → AuthContext → useAuth 훅 연동
   → Canvas 시스템 → stroke-capture 패키지
   → LLM 평가 시스템 연동
3. 통합 순서 (점진적):
   → 환경 설정 → 인증 → 데이터 → Canvas → LLM → 최적화
4. TDD 적용: 통합 테스트 → 기능 검증 → 최종 구현
5. Phase 2 = 실용적 앱 완성 (23-28 tasks)
```

## Format: `[ID] [P?] Description`
- **[P]**: 병렬 실행 가능 (다른 파일, 의존성 없음)
- 정확한 파일 경로 포함

## Path Conventions
**기존 UI 베이스**: `calligraphy-coach/src/` (완성된 UI)
**우리 백엔드**: `apps/web/src/` (개발된 백엔드 시스템)
**통합 작업 공간**: `calligraphy-coach/` 기반 확장

---

## Phase 1: 환경 설정 및 호환성 (T001-T005)

- [ ] T001 [P] 기존 UI와 우리 백엔드 폴더 구조 분석 및 통합 계획 수립
- [ ] T002 프로젝트 의존성 통합 - calligraphy-coach package.json에 우리 백엔드 패키지 추가
- [ ] T003 [P] Tailwind CSS v4 ↔ v3 호환성 확인 및 충돌 해결
- [ ] T004 [P] TypeScript 설정 통합 및 컴파일 에러 해결
- [ ] T005 통합 개발 환경 구성 - 단일 npm run dev로 전체 앱 실행

## Phase 2: 인증 시스템 통합 (T006-T009)
**목표: 기존 UI의 AuthContext를 우리 소셜 로그인 시스템으로 교체**

- [ ] T006 [P] 기존 AuthContext와 우리 useAuth 훅 인터페이스 비교 분석
- [ ] T007 기존 AuthContext.tsx를 우리 소셜 로그인 시스템으로 교체
- [ ] T008 [P] Landing.tsx 소셜 로그인 버튼을 실제 OAuth 연동으로 교체
- [ ] T009 인증 상태 관리 통합 테스트 - 로그인/로그아웃 플로우 검증

## Phase 3: 데이터 레이어 통합 (T010-T015)
**목표: 하드코딩된 데이터를 실제 API 및 IndexedDB 연동으로 교체**

- [ ] T010 [P] 기존 UI 하드코딩 데이터 구조 분석 (Home.tsx, PracticeScreen.tsx 등)
- [ ] T011 우리 엔티티 (WritingSession, Progress, Evaluation) 매핑 테이블 작성
- [ ] T012 [P] localStorage 기반 데이터를 IndexedDB + 우리 storage.ts로 마이그레이션
- [ ] T013 WeeklyStatsDetails.tsx 통계 데이터를 실제 사용자 연습 기록으로 교체
- [ ] T014 Home.tsx 개인 최고 기록 위젯을 실제 성취 데이터와 연동
- [ ] T015 데이터 통합 테스트 - 연습 기록 저장/조회 플로우 검증

## Phase 4: Canvas 시스템 통합 (T016-T020)
**목표: PracticeScreen Canvas를 우리 stroke-capture 패키지로 교체**

- [ ] T016 [P] 기존 PracticeScreen.tsx Canvas 구현 분석
- [ ] T017 우리 stroke-capture 패키지를 기존 UI 구조에 통합
- [ ] T018 [P] 압력 감지 및 실시간 획 데이터 수집 기능 추가
- [ ] T019 Canvas 그리기 평가를 우리 character-recognition 시스템으로 연동
- [ ] T020 Canvas 통합 테스트 - 그리기 → 평가 → 결과 표시 플로우 검증

## Phase 5: LLM 평가 통합 (T021-T025)
**목표: 카메라 촬영 기능을 우리 LLM 평가 시스템과 연동**

- [ ] T021 [P] 기존 카메라 촬영 모드 분석 (PracticeScreen.tsx photo 탭)
- [ ] T022 카메라 촬영 → LLM API 연동 파이프라인 구현
- [ ] T023 [P] LLM 평가 결과 (8개 기준)를 기존 UI 구조에 맞게 표시
- [ ] T024 LLM 실패 시 Canvas API 폴백 시스템 구현
- [ ] T025 LLM 평가 통합 테스트 - 촬영 → 평가 → 피드백 플로우 검증

## Phase 6: UI 최적화 및 마무리 (T026-T028)
**목표: 성능 최적화 및 사용자 경험 완성**

- [ ] T026 [P] 젠 스타일 디자인 보정 - 우리 브랜드와 기존 UI 조화
- [ ] T027 성능 최적화 - Canvas 60fps, LLM 응답 <10초, 메모리 사용량 최적화
- [ ] T028 통합 E2E 테스트 - 전체 사용자 플로우 (로그인 → 연습 → 평가 → 기록)

---

## 핵심 원칙 (Phase 2 통합)
- ✅ **기존 UI 보존**: 젠 스타일 디자인과 UX 최대한 유지
- ✅ **점진적 통합**: 컴포넌트별 단계적 교체로 안정성 확보
- ✅ **성능 우선**: 기존 UI 성능 + 우리 백엔드 최적화
- ✅ **사용자 경험**: 통합 후에도 일관된 서예 학습 경험 제공

## 🎯 Phase 2 통합 목표
- **핵심 가치**: 완성된 UI + 실제 동작하는 백엔드 = 실용적 서예 앱
- **UI 기반**: 기존 calligraphy-coach (shadcn/ui + Tailwind v4 + 젠 스타일)
- **백엔드**: 우리 인증/스토리지/Canvas/LLM 시스템
- **통합 방식**: 기존 UI 컴포넌트 내부 로직만 교체

## 🎨 통합할 기존 컴포넌트
```
calligraphy-coach/src/components/
├── Home.tsx             🔧 데이터 → 실제 API
├── PracticeScreen.tsx   🔧 Canvas → stroke-capture
├── Landing.tsx          🔧 AuthContext → useAuth
├── AuthContext.tsx      🔧 → 우리 소셜 로그인
├── WeeklyStatsDetails.tsx 🔧 차트 데이터 → 실제 기록
└── ui/                  ✅ shadcn/ui (그대로 유지)
```

## 📁 통합 경로 규칙
- **작업 공간**: `calligraphy-coach/` (기존 UI 베이스)
- **백엔드 소스**: `apps/web/src/` (우리 개발 시스템)
- **통합 방향**: `apps/web/src/*` → `calligraphy-coach/src/*`

---

## ✅ 완료 기준 (Phase 2)
- ✅ **기존 UI 보존**: 젠 스타일 디자인 및 사용자 경험 유지
- ✅ **인증 시스템**: 실제 소셜 로그인 (Google/Apple/Kakao) 작동
- ✅ **데이터 연동**: 하드코딩 → 실제 사용자 데이터 표시
- ✅ **Canvas 통합**: stroke-capture 기반 그리기 및 평가
- ✅ **LLM 평가**: 카메라 촬영 → AI 피드백 제공
- ✅ **성능 목표**: 60fps Canvas + <10초 LLM 응답
- ✅ **통합 테스트**: 전체 앱 플로우 정상 작동

## 📊 예상 통합 소요 시간
**약 2-3주** (환경설정 3일 + 인증통합 4일 + 데이터연동 5일 + Canvas통합 4일 + LLM통합 5일 + 최적화 3일)

## ⚡ Phase 2 통합 원칙
- **기존 우선**: 기존 UI 디자인과 UX를 최대한 보존
- **점진적**: 한 번에 하나의 컴포넌트씩 통합
- **검증**: 각 단계마다 기능 테스트 후 다음 단계 진행
- **성능**: 통합 후에도 기존 성능 수준 유지 또는 개선

---

## Phase 7: 한자 서예 및 법첩 수업 구축 (T029-T040)
**목표: 한자 서예 커리큘럼 확장 - 서법92 + 명가 법첩 시리즈**

### 서법 92 기본 과정
- [ ] T029 서법 92 기본 이론 커리큘럼 구성
- [ ] T030 서법 92 평가 기준 및 AI 프롬프트 개발

### 왕희지 법첩 시리즈
- [ ] T031 왕희지 천자문(해서) 수업 구축 - 한자, 내용, 평가자료 세트
- [ ] T032 왕희지 집자성교서(행서) 수업 구축
- [ ] T033 왕희지 난정서(행서) 수업 구축

### 안진경 법첩 시리즈  
- [ ] T034 안진경 안근례비(해서) 수업 구축 - 한자, 내용, 평가자료 세트

### 구양순 법첩 시리즈
- [ ] T035 구양순 구성궁예천명(해서) 수업 구축

### AI 평가 프롬프트 차별화
- [ ] T036 왕희지 작품별 AI 평가 프롬프트 개발 (유려함, 중화미)
- [ ] T037 안진경 작품 AI 평가 프롬프트 개발 (웅장함, 안체)
- [ ] T038 구양순 작품 AI 평가 프롬프트 개발 (정교함, 구체)

### 확장 준비
- [ ] T039 조맹부, 왕탁 등 추가 법첩 리스트 정리
- [ ] T040 한자 서예 통합 커리큘럼 체계 구축

### 황자원 92 서법 구현 (진행중)
- [x] T040.1 황자원 92 서법 커리큘럼 데이터 구축 (서법 1-4 완료)
- [ ] T040.2 PracticeScreen과 황92 서법 레슨 연동
- [ ] T040.3 한자별 평가 포인트 표시 시스템
- [ ] T040.4 실물 모드 카메라 촬영 및 AI 평가

**참고 자료**:
- `/specs/practice-screen-design.md` - PracticeScreen 페이지 설계
- `/specs/hwang92-location-state.md` - 황자원 92 서법 데이터 구조 명세

---

## Phase 8: 서체별 AI 평가 시스템 구현 (T041-T045)
**목표: 각 서체/법첩별 차별화된 평가 시스템**

- [ ] T041 한글 서체별 평가 기준 구현 (판본체, 궁서체, K-Culture)
- [ ] T042 한자 해서 평가 시스템 (왕희지, 안진경, 구양순 차별화)
- [ ] T043 한자 행서 평가 시스템 (집자성교서, 난정서)
- [ ] T044 서법 92 기본기 평가 시스템
- [ ] T045 평가 결과 피드백 생성 시스템 (서체별 맞춤형)

---

## Phase 9: 앱스토어 등록을 위한 React Native 전환 (T046-T060)
**목표: iOS/Android 네이티브 앱 개발 및 스토어 등록**

### 기반 구축
- [ ] T046 React Native + Expo 프로젝트 초기화
- [ ] T047 React Navigation 네비게이션 시스템 구축
- [ ] T048 i18n 다국어 시스템 설정 (한/영/중/일)
- [ ] T049 컴포넌트 매핑 계획 수립 (React → React Native)

### 핵심 기능 이식
- [ ] T050 Canvas → React Native Skia 전환
- [ ] T051 Google/Apple 소셜 로그인 구현
- [ ] T052 AsyncStorage 로컬 데이터 저장
- [ ] T053 Expo Camera 카메라 기능 구현
- [ ] T054 오프라인 모드 지원

### UI/UX 네이티브 최적화
- [ ] T055 플랫폼별 UI 컴포넌트 조정 (iOS/Android)
- [ ] T056 네이티브 제스처 및 애니메이션 구현
- [ ] T057 성능 최적화 (60fps 목표)

### 스토어 준비
- [ ] T058 앱 아이콘/스플래시 스크린 제작
- [ ] T059 스토어 스크린샷 준비 (각 언어별)
- [ ] T060 앱스토어/구글플레이 등록 및 심사

---

## Phase 10: 네비게이션 재구조화 (T061-T065)
**목표: 서예 중심 + 다양한 진입점 제공**

- [ ] T061 3개 메인 카테고리 구현 (Learn Korean / 서예 마스터 / Study Hanja)
- [ ] T062 K-Culture 섹션 영어 UI 구현
- [ ] T063 코스 완료 시 서예 유도 시스템
- [ ] T064 진도별 다음 단계 추천 로직
- [ ] T065 통합 학습 경로 대시보드

---
*Phase 2 통합: 기존 완성된 UI + 우리 백엔드 시스템 = 실용적 서예 앱*
*Phase 7-8 추가: 한자 서예 확장 + 서체별 AI 평가 차별화*
*Phase 9-10 추가: 앱스토어 등록 + 네비게이션 재구조화*


