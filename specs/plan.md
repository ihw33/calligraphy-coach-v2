# 구현 계획: 캔버스 그리기 및 카메라 촬영 서예 연습 시스템

**브랜치**: `002-canvas-drawing-and` | **날짜**: 2025-09-15 | **명세**: [spec.md](./spec.md)
**입력**: 통합 기능 명세서 `/specs/spec.md`

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
사용자가 디지털 캔버스에 직접 그리거나 카메라로 촬영한 서예 작품을 실시간으로 인식하고, 표준 서예 작품과 비교하여 형태(40%), 비례(30%), 굵기(20%), 획순(10%)으로 100점 만점 평가하는 시스템. 순수 React + Canvas API + Camera API를 사용한 웹 애플리케이션으로 구현.

## 기술 컨텍스트
**언어/버전**: TypeScript 5+ / React 18  
**주요 의존성**: Canvas API (그리기), Camera API (촬영), React 18 (UI), Babel (변환)  
**저장소**: LocalStorage (연습 기록), IndexedDB (이미지 데이터)  
**테스팅**: 순수 HTML/React 테스트 (Vitest 나중에 추가)  
**대상 플랫폼**: 웹 애플리케이션 (데스크톱 + 모바일 브라우저)  
**프로젝트 타입**: web - 순수 React 기반 서예 연습 시스템  
**성능 목표**: 캔버스 그리기 60fps, 이미지 비교 평가 <2초, 압력 감지 256레벨  
**제약사항**: 브라우저 호환성, 카메라 권한 처리, 실시간 성능  
**규모/범위**: 개인 사용자, 로컬 처리 우선, 30개 글자 지원

## 헌법 체크
*게이트: Phase 0 연구 전 통과 필수. Phase 1 설계 후 재확인.*

**단순성**:
- 프로젝트 수: 2개 (프론트엔드, 테스트)
- 프레임워크 직접 사용? 예 (React/Canvas API 직접 사용)
- 단일 데이터 모델? 예 (통합 문자/피드백 모델)
- 패턴 회피? 예 (불필요한 추상화 없음)

**아키텍처**:
- 모든 기능이 라이브러리? 예 - 각 기능을 독립 컴포넌트로 구현
- 라이브러리 목록: 
  - CanvasDrawing: 캔버스 그리기 및 압력 감지
  - CameraCapture: 카메라 촬영 및 이미지 전처리  
  - ImageComparison: 이미지 비교 및 평가 알고리즘
  - ScoreCalculation: 4가지 기준 점수 계산
  - ProgressTracking: 연습 기록 및 진도 관리
- 라이브러리별 CLI: 해당없음 (웹 컴포넌트)
- 라이브러리 문서: 컴포넌트별 JSDoc

**테스팅 (협상 불가)**:
- RED-GREEN-리팩토링 사이클 적용? 예
- Git 커밋이 구현 전 테스트 표시? 예
- 순서: 계약→통합→E2E→단위 엄격히 준수? 예
- 실제 의존성 사용? 예 (실제 캔버스, 입력 장치)
- 통합 테스트 대상: 캔버스-평가 통합, 카메라-평가 통합
- 금지: 테스트 전 구현, RED 단계 건너뛰기 - 이해함

**관찰성**:
- 구조화된 로깅 포함? 예
- 프론트엔드 로그 → 백엔드? 해당없음 (초기에는 프론트엔드만)
- 오류 컨텍스트 충분? 예 (획 데이터, 인식 신뢰도)

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

### 소스 코드 (저장소 루트)
```
apps/mobile/public/
├── mvp.html              # 메인 애플리케이션 (인라인 React 컴포넌트)
├── react-test.html       # React 테스트 파일 (기준점)
└── assets/               # 정적 자산들

docs/                     # 프로젝트 문서
├── sessions/             # 세션 기록
└── retrospectives/       # 회고 문서

specs/                    # 기능 명세서 (통합)
├── spec.md              # 통합 기능 명세
├── plan.md              # 구현 계획 (현재 파일)
├── research.md          # 기술 연구
├── data-model.md        # 데이터 모델
├── quickstart.md        # 사용 가이드
├── contracts/           # API 계약
└── tasks.md             # 작업 목록 (/tasks 명령으로 생성)

# 향후 확장을 위한 구조 (필요시 생성)
src/                     # 독립 라이브러리들
├── components/          # React 컴포넌트들
│   ├── CanvasDrawing.js
│   ├── CameraCapture.js
│   ├── ImageComparison.js
│   ├── ScoreCalculation.js
│   └── ProgressTracking.js
└── utils/               # 유틸리티 함수들

tests/                   # 테스트 파일들
├── integration/         # 통합 테스트
├── e2e/                # E2E 테스트
└── unit/               # 단위 테스트
```

**구조 결정**: 단순 웹 애플리케이션 - 모든 기능이 mvp.html에 인라인으로 구현된 순수 React 구조

## Phase 0: 개요 및 연구
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: 설계 및 계약
*전제조건: research.md 완료*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `/scripts/update-agent-context.sh [claude|gemini|copilot]` for your AI assistant
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: 작업 계획 접근법
*이 섹션은 /tasks 명령이 수행할 작업을 설명 - /plan 중에는 실행하지 않음*

**Task Generation Strategy**:
- Load `/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Canvas/Input tasks: Setup pressure-sensitive drawing [P]
- Recognition tasks: TensorFlow.js model integration [P]
- Evaluation tasks: Scoring algorithm implementation
- UI tasks: Practice interface components
- Each contract → contract test task [P]
- Each entity → model creation task [P] 
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:
- TDD order: Tests before implementation 
- Infrastructure first: Canvas setup before stroke capture
- Core before features: Recognition before evaluation
- Dependency order: Models → Libraries → Services → UI
- Mark [P] for parallel execution (independent files)

**Key Task Groups**:
1. Canvas & Input Setup (5-6 tasks)
2. Character Recognition Integration (4-5 tasks)
3. Evaluation Algorithm (6-7 tasks)
4. Feedback Generation (3-4 tasks)
5. UI Components (5-6 tasks)
6. Progress Tracking (3-4 tasks)

**Estimated Output**: 30-35 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: 향후 구현
*이 단계들은 /plan 명령의 범위를 벗어남*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

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