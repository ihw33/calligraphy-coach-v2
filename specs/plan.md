# 구현 계획: 디지털 서예 웹앱 (Phase 2: UI-백엔드 통합)

**프로젝트**: 디지털 서예 연습 및 AI 평가 시스템 | **날짜**: 2025-09-22 | **명세**: [spec.md](./spec.md)
**입력**: Phase 2 기존 UI와 백엔드 통합 요구사항 `/specs/spec.md`

## 실행 흐름 (/plan 명령 범위)
```
1. 입력 경로에서 기능 명세 로드
   → 찾을 수 없으면: 오류 "{path}에 기능 명세 없음"
2. 기술 컨텍스트 작성 (명확화 필요 항목 스캔)
   → 컨텍스트에서 프로젝트 타입 감지 (웹=프론트엔드+백엔드, 모바일=앱+API)
   → 프로젝트 타입에 따라 구조 결정
3. 헌법 체크 섹션 평가
   → 위반 사항 있으면: 복잡도 추적에 문서화
   → 정당화 불가능하면: 오류 "먼저 접근 방식 단순화"
   → 진행 상황 추적 업데이트: 초기 헌법 체크
4. Phase 0 실행 → research.md
   → 명확화 필요 항목 남아있으면: 오류 "미해결 사항 해결"
5. Phase 1 실행 → contracts, data-model.md, quickstart.md, AI 어시스턴트 파일 (예: Claude용 `CLAUDE.md`)
6. 헌법 체크 재평가
   → 새 위반 사항: 설계 리팩토링, Phase 1로 복귀
   → 진행 상황 추적 업데이트: 설계 후 헌법 체크
7. Phase 2 계획 → 작업 생성 접근법 설명 (tasks.md 생성하지 않음)
8. 중지 - /tasks 명령 준비 완료
```

**중요**: /plan 명령은 7단계에서 중지됩니다. Phase 2-4는 다른 명령으로 실행:
- Phase 2: /tasks 명령이 tasks.md 생성
- Phase 3-4: 구현 실행 (수동 또는 도구 사용)

## 요약
**Phase 2 목표**: 기존 Figma 기반 완성된 UI (`calligraphy-coach` 폴더)와 우리 백엔드 시스템(`apps/web` 폴더)을 통합하여 완전한 서예 앱 구현. 기존 UI의 하드코딩된 데이터를 실제 API로 교체하고, Canvas 평가와 LLM 시스템을 연동하여 실용적인 서예 학습 앱 완성.

## 기술 컨텍스트 (Phase 2 통합)
**통합 대상**: 
- **기존 UI**: `calligraphy-coach` (React 18 + Tailwind v4 + shadcn/ui)
- **우리 백엔드**: `apps/web` (React 18 + Vite + TypeScript + Zustand)

**호환성 이슈**:
- Tailwind CSS: v4 (기존 UI) ↔ v3 (우리 시스템)
- 상태 관리: React State (기존) ↔ Zustand (우리)
- 데이터: 하드코딩 (기존) ↔ API + IndexedDB (우리)

**통합 전략**: 기존 UI를 베이스로 우리 백엔드 시스템 심기
**성능 목표**: 기존 UI 성능 유지 + 우리 평가 시스템 <2초  
**제약사항**: 기존 젠 스타일 디자인 보존, 사용자 경험 일관성  
**규모/범위**: Phase 2 = 통합 완료, 실용적 서예 앱 런칭

## 헌법 체크
*게이트: Phase 0 연구 전 통과 필수. Phase 1 설계 후 재확인.*

**단순성**:
- 프로젝트 수: 1개 (통합 웹앱)
- 프레임워크 직접 사용? 예 (React + Canvas API + LLM API 직접 사용)
- 단일 데이터 모델? 예 (1차 개발 = 기본 기능만)
- 패턴 회피? 예 (MVP 중심, 과도한 추상화 없음)

**아키텍처**:
- 모든 기능이 라이브러리? 부분적으로 - 핵심 기능만 컴포넌트화
- 핵심 컴포넌트: 
  - SocialLogin: 소셜 로그인 처리
  - CourseSelector: 코스 및 글자 선택
  - CanvasDrawing: 화면 그리기 (기본 평가)
  - CameraCapture: 카메라 촬영 + LLM 평가  
  - ProgressTracker: 진도 관리 (오프라인 지원)
- 컴포넌트 문서: JSDoc + Storybook (나중에 추가)
- 1차 개발 = 단순함 우선, 2차 개발 = 모듈화 확장

**테스팅 (협상 불가)**:
- RED-GREEN-리팩토링 사이클 적용? 예
- Git 커밋이 구현 전 테스트 표시? 예
- 순서: 계약→통합→E2E→단위 엄격히 준수? 예
- 실제 의존성 사용? 예 (실제 소셜 로그인, LLM API, 카메라)
- 통합 테스트 대상: 소셜로그인-진도관리, 카메라-LLM평가, 오프라인-동기화
- 금지: 테스트 전 구현, RED 단계 건너뛰기 - 이해함

**관찰성**:
- 구조화된 로깅 포함? 예
- 프론트엔드 중심: 로컬 스토리지 로그, 오류 추적
- 오류 컨텍스트 충분? 예 (LLM 응답, 사용자 행동, 오프라인 상태)

**버전 관리**:
- 버전 번호 할당? 0.1.0
- 모든 변경마다 BUILD 증가? 예
- 주요 변경사항 처리? 예 (저장된 연습 데이터 마이그레이션)

## 프로젝트 구조

### 문서 (현재 기능)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### 소스 코드 (1차 개발안)
```
apps/web/                 # 메인 웹 애플리케이션
├── public/
│   ├── index.html        # 메인 HTML 파일
│   └── assets/           # 정적 자산들 (이미지, 아이콘)
├── src/
│   ├── components/       # 핵심 컴포넌트들
│   │   ├── auth/         # SocialLogin
│   │   ├── course/       # CourseSelector
│   │   ├── practice/     # CanvasDrawing, CameraCapture
│   │   ├── feedback/     # FeedbackDisplay
│   │   └── progress/     # ProgressTracker
│   ├── hooks/            # 커스텀 훅들
│   ├── utils/            # 유틸리티 함수들
│   ├── types/            # TypeScript 타입 정의
│   └── App.tsx           # 메인 앱 컴포넌트
├── package.json          # 의존성 관리
└── vite.config.ts        # Vite 설정

docs/                     # 프로젝트 문서
├── sessions/             # 개발 세션 기록
└── retrospectives/       # 회고 문서

specs/                    # 기능 명세서
├── spec.md              # 1차 개발안 기능 명세
├── plan.md              # 구현 계획 (현재 파일)
├── data-model.md        # 데이터 모델
└── tasks.md             # 작업 목록 (/tasks 명령으로 생성)

tests/                   # 테스트 파일들
├── integration/         # 통합 테스트
├── e2e/                # E2E 테스트
└── unit/               # 단위 테스트
```

**구조 결정**: 스마트폰 우선 웹 애플리케이션 - React + Vite 기반 SPA 구조

## Phase 0: 개요 및 연구 *(완료)*
**주요 기술 결정사항:**

1. **소셜 로그인 방식**:
   - 결정: OAuth 2.0 기반 소셜 로그인 (구글/애플/카카오)
   - 근거: 사용자 진입 장벽 최소화, 빠른 온보딩
   - 대안: 이메일 가입 (복잡함으로 인해 제외)

2. **LLM 서비스 선택**:
   - 결정: 저렴한 상용 서비스 (GPT-3.5, Claude Haiku, Gemini Flash)
   - 근거: 비용 효율성, 안정성, API 품질
   - 대안: 오픈소스 모델 (성능 부족으로 제외)

3. **오프라인 지원 방식**:
   - 결정: IndexedDB + LocalStorage 조합
   - 근거: 브라우저 네이티브 지원, 대용량 데이터 처리
   - 대안: Web SQL (deprecated), Memory only (제한적)

**Output**: 1차 개발에 최적화된 기술 스택 확정

## Phase 1: 설계 및 계약 *(완료)*

1. **핵심 엔티티 정의** → `data-model.md`:
   - User, WritingSession, Character, Evaluation, Feedback, Progress
   - 1차 개발 = 기본 필드만, 확장성 고려한 구조
   - 소셜 로그인, 오프라인 저장 지원

2. **컴포넌트 인터페이스 설계**:
   - SocialLogin: OAuth 처리
   - CourseSelector: 코스/글자 선택
   - CanvasDrawing: 터치 그리기
   - CameraCapture: 촬영 + LLM 연동
   - ProgressTracker: 진도 관리

3. **LLM 연동 계약**:
   - 8개 평가 기준 (선의각도, 굵기, 결구, 비율, 중심위치, 시작점/끝점, 연결부, 붓세우기)
   - 구역 기반 평가 시스템
   - Suggestion 스크립트 매핑

4. **오프라인 데이터 스키마**:
   - IndexedDB: 연습 기록, 이미지 데이터
   - LocalStorage: 사용자 설정, 진도 상태

**Output**: 1차 개발안 완전한 설계 문서

## Phase 2: 통합 작업 계획 접근법
*이 섹션은 /tasks 명령이 수행할 작업을 설명 - /plan 중에는 실행하지 않음*

**Task Generation Strategy (Phase 2 통합)**:
- 기존 UI 보존 우선: 디자인과 UX 최대한 유지
- 점진적 통합: 컴포넌트별 단계적 교체
- TDD 적용: 통합 후 기능 테스트 → 구현 검증
- 호환성 우선: Tailwind v4 ↔ v3 충돌 최소화

**Key Task Groups (Phase 2 통합)**:
1. **환경 설정 및 호환성** (4-5 tasks)
   - 프로젝트 구조 통합, Tailwind 버전 호환
   - 의존성 정리, 빌드 설정 통합
   
2. **인증 시스템 통합** (3-4 tasks)
   - AuthContext → useAuth 훅 교체
   - 소셜 로그인 컴포넌트 연동
   - 사용자 상태 관리 통합

3. **데이터 레이어 교체** (5-6 tasks)
   - 하드코딩 데이터 → 실제 API 교체
   - localStorage → IndexedDB 마이그레이션
   - 엔티티 매핑 및 데이터 구조 표준화

4. **Canvas 시스템 통합** (4-5 tasks)
   - PracticeScreen Canvas → stroke-capture 패키지
   - 압력 감지 및 획 데이터 수집
   - 실시간 평가 시스템 연동

5. **LLM 평가 통합** (4-5 tasks)
   - 카메라 촬영 → LLM API 연동
   - 8개 평가 기준 결과 표시
   - 폴백 시스템 구현

6. **UI 최적화 및 마무리** (3-4 tasks)
   - 성능 최적화, 젠 스타일 보정
   - 통합 테스트, 사용자 경험 검증

**통합 우선순위**:
1. 인증 → 2. 데이터 → 3. Canvas → 4. LLM → 5. UI 마무리

**Estimated Output**: 23-28 numbered, ordered integration tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: 향후 구현
*이 단계들은 /plan 명령의 범위를 벗어남*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

### 병렬 Phase: Design System Hardening (Team C)
- DS1: 대비·상태 확장 감사 → ThemeAudit로 기본/hover/active/disabled 대비 점검, AA 미달 보정안 제시
- DS2: 추가 컴포넌트 토큰화 → Badge/Input/Switch/Tabs를 토큰 기반으로 정렬 (Props 변경 없이)
- DS3: 다크 테마 토큰 + 토글 → `:root[data-theme="dark"]` 정의 및 Settings 토글 연동
- 세부 내역은 `specs/tasks.md`의 “Phase DS (병렬)” 섹션 참조

## 복잡도 추적
*헌법 체크에 정당화가 필요한 위반 사항이 있을 때만 작성*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## 진행 상황 추적
*이 체크리스트는 실행 흐름 중 업데이트됨*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved (붓글씨 focus clarified)
- [x] Complexity deviations documented (None - follows constitution)

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*