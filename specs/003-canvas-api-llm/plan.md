# 구현 계획: 필기 인식 및 피드백 시스템

**브랜치**: `003-canvas-api-llm` | **날짜**: 2025-09-15 | **명세서**: [spec.md](./spec.md)
**입력**: Feature specification from `/specs/003-canvas-api-llm/spec.md`

## 실행 흐름 (/plan 명령 범위)
```
1. 입력 경로에서 기능 명세 로드
   → 찾을 수 없으면: 오류 "{path}에 기능 명세 없음"
2. 기술 컨텍스트 채우기 (명확화 필요 사항 스캔)
   → 컨텍스트에서 프로젝트 유형 감지 (web=frontend+backend, mobile=app+api)
   → 프로젝트 유형에 따라 구조 결정 설정
3. 아래 헌법 체크 섹션 평가
   → 위반 사항이 있으면: 복잡도 추적에 문서화
   → 정당화가 불가능하면: 오류 "먼저 접근 방식 단순화"
   → 진행 상황 추적 업데이트: 초기 헌법 체크
4. Phase 0 실행 → research.md
   → 명확화 필요 사항이 남아있으면: 오류 "미확인 사항 해결"
5. Phase 1 실행 → contracts, data-model.md, quickstart.md, CLAUDE.md
6. 헌법 체크 섹션 재평가
   → 새로운 위반 사항이 있으면: 설계 리팩터링, Phase 1로 복귀
   → 진행 상황 추적 업데이트: 설계 후 헌법 체크
7. Phase 2 계획 → 작업 생성 접근 방식 설명 (tasks.md 생성하지 않음)
8. 중지 - /tasks 명령 준비 완료
```

**중요**: /plan 명령은 7단계에서 중지됩니다. Phase 2-4는 다른 명령으로 실행됩니다:
- Phase 2: /tasks 명령이 tasks.md 생성
- Phase 3-4: 구현 실행 (수동 또는 도구 사용)

## 요약
실물 서예와 디지털 입력을 모두 지원하는 서예 연습 및 평가 시스템. Canvas API를 사용한 기본 평가로 시작하여 LLM 통합으로 확장.

## 기술 컨텍스트
**언어/버전**: TypeScript 5.x, JavaScript ES2022  
**주요 의존성**: React 18, Next.js 14, TensorFlow.js, Canvas API  
**저장소**: IndexedDB (로컬), Supabase (클라우드)  
**테스트**: Vitest, Testing Library, Playwright  
**대상 플랫폼**: 웹 (모바일/데스크톱 브라우저)  
**프로젝트 유형**: web - frontend + backend 구조  
**성능 목표**: 
  - 입력 지연 <16ms (60fps)
  - 평가 처리 <2초 (Canvas API)
  - LLM 응답 <10초  
**제약 사항**: 
  - 카메라 권한 필요
  - 최소 HD 해상도 이미지
  - 네트워크 연결 (LLM 평가)  
**규모/범위**: 
  - MVP: 4가지 서체, 기본 평가
  - 확장: LLM 통합, 학습 커리큘럼

## 헌법 체크
*게이트: Phase 0 연구 전 필수 통과. Phase 1 설계 후 재확인.*

**단순성**:
- 프로젝트 수: 2개 (frontend, backend)
- 프레임워크 직접 사용? ✅ (React/Next.js 직접 사용)
- 단일 데이터 모델? ✅ (직렬화 동일)
- 패턴 회피? ✅ (Repository/UoW 없음)

**아키텍처**:
- 모든 기능을 라이브러리로? ✅
- 라이브러리 목록:
  - stroke-capture: 붓 획 입력 및 압력 감지
  - character-recognition: 한글/한자 문자 인식
  - calligraphy-evaluator: 서예 평가 엔진
  - feedback-generator: 피드백 생성
- 라이브러리별 CLI: 각 라이브러리에 --help/--version/--format 지원
- 라이브러리 문서: llms.txt 형식 계획

**테스트 (협상 불가)**:
- RED-GREEN-리팩터링 사이클 적용? ✅
- 테스트 먼저 커밋? ✅
- 순서: 계약→통합→E2E→단위 엄격 준수? ✅
- 실제 의존성 사용? ✅ (실제 DB, 모킹 없음)
- 통합 테스트: 새 라이브러리, 계약 변경, 공유 스키마? ✅
- 금지: 테스트 전 구현, RED 단계 건너뛰기

**관찰 가능성**:
- 구조화된 로깅 포함? ✅
- 프론트엔드 로그 → 백엔드? ✅ (통합 스트림)
- 오류 컨텍스트 충분? ✅

**버전 관리**:
- 버전 번호 할당? ✅ (1.0.0)
- BUILD 번호 매 변경마다 증가? ✅
- 중대한 변경 처리? ✅ (병렬 테스트, 마이그레이션 계획)

## 프로젝트 구조

### 문서 (이 기능)
```
specs/003-canvas-api-llm/
├── spec.md              # 기능 명세서
├── plan.md              # 이 파일 (/plan 명령 출력)
├── research.md          # Phase 0 출력 (/plan 명령)
├── data-model.md        # Phase 1 출력 (/plan 명령)
├── quickstart.md        # Phase 1 출력 (/plan 명령)
├── contracts/           # Phase 1 출력 (/plan 명령)
└── tasks.md             # Phase 2 출력 (/tasks 명령 - /plan에서 생성 안함)
```

### 소스 코드 (저장소 루트)
```
# Option 2: 웹 애플리케이션 (frontend + backend)
apps/mobile/               # 기존 React 앱
├── src/
│   ├── components/       # React 컴포넌트
│   ├── lib/             # 기능 라이브러리들
│   │   ├── stroke-capture/
│   │   ├── character-recognition/
│   │   ├── calligraphy-evaluator/
│   │   └── feedback-generator/
│   ├── pages/           # Next.js 페이지
│   └── services/        # API 클라이언트
└── tests/
    ├── contract/
    ├── integration/
    └── unit/

apps/api/                 # 백엔드 API (추후 LLM 통합용)
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/
```

**구조 결정**: Option 2 (웹 애플리케이션) - frontend + backend 감지됨

## Phase 0: 개요 및 연구

### 연구 작업
1. **Canvas API 압력 감지 연구**
   - Pointer Events API와 압력 레벨 지원
   - 브라우저 호환성 및 폴백 전략
   - 성능 최적화 방법

2. **한글/한자 인식 모델 선택**
   - TensorFlow.js 사전 훈련 모델 조사
   - 커스텀 모델 훈련 필요성 평가
   - 모델 크기 vs 정확도 트레이드오프

3. **LLM 통합 옵션 분석**
   - OpenAI Vision API vs Claude Vision
   - 비용 및 성능 비교
   - 응답 시간 최적화 전략

4. **이미지 처리 최적화**
   - Canvas to Base64 인코딩 최적화
   - 이미지 압축 및 크기 조정
   - WebWorker 활용 가능성

**출력**: research.md에 모든 명확화 필요 사항 해결됨

## Phase 1: 설계 및 계약

### 1. 데이터 모델 생성 (`data-model.md`)
```typescript
// 핵심 엔티티
WritingSession {
  id: string
  userId: string
  startTime: Date
  endTime?: Date
  fontStyle: FontStyle
  characters: Character[]
}

WritingAttempt {
  id: string
  sessionId: string
  characterId: string
  strokeData: StrokePoint[]
  imageData?: string // Base64 인코딩
  evaluation: Evaluation
  timestamp: Date
}

Evaluation {
  overallScore: number // 0-100
  detailedScores: {
    form: number      // 40점
    proportion: number // 30점
    thickness: number  // 20점
    strokeOrder: number // 10점
  }
  feedback: Feedback
}
```

### 2. API 계약 생성 (`/contracts/`)
- POST /api/evaluate/canvas - Canvas 그리기 평가
- POST /api/evaluate/photo - 사진 촬영 평가
- GET /api/progress/{userId} - 진도 조회
- POST /api/feedback/generate - 피드백 생성

### 3. 계약 테스트 생성
- 각 엔드포인트별 스키마 검증 테스트
- 요청/응답 형식 검증
- 오류 케이스 처리

### 4. 빠른 시작 가이드 (`quickstart.md`)
- 기본 설정 및 실행 방법
- 주요 사용 시나리오 데모
- API 사용 예제

### 5. CLAUDE.md 업데이트
- 프로젝트 컨텍스트 추가
- 기술 스택 업데이트
- 최근 변경사항 기록

**출력**: data-model.md, /contracts/*, 실패하는 테스트, quickstart.md, CLAUDE.md

## Phase 2: 작업 계획 접근 방식
*/tasks 명령이 수행할 내용 설명 - /plan 중에는 실행하지 않음*

**작업 생성 전략**:
- Phase 1 설계 문서에서 작업 생성 (계약, 데이터 모델, 빠른 시작)
- 각 계약 → 계약 테스트 작업 [P]
- 각 엔티티 → 모델 생성 작업 [P]
- 각 사용자 스토리 → 통합 테스트 작업
- 테스트를 통과시키는 구현 작업

**순서 전략**:
- TDD 순서: 구현 전 테스트
- 의존성 순서: 모델 → 서비스 → UI
- 병렬 실행 가능한 작업에 [P] 표시

**예상 출력**: tasks.md에 25-30개의 번호가 매겨진 정렬된 작업

**중요**: 이 단계는 /tasks 명령으로 실행되며, /plan에서는 실행되지 않음

## Phase 3+: 향후 구현
*/plan 명령 범위를 벗어난 단계들*

**Phase 3**: 작업 실행 (/tasks 명령이 tasks.md 생성)  
**Phase 4**: 구현 (헌법 원칙에 따라 tasks.md 실행)  
**Phase 5**: 검증 (테스트 실행, quickstart.md 실행, 성능 검증)

## 복잡도 추적
*헌법 체크에 정당화가 필요한 위반 사항이 있을 때만 작성*

| 위반 사항 | 필요한 이유 | 더 간단한 대안이 거부된 이유 |
|-----------|------------|------------------------------|
| 없음      | -          | -                            |

## 진행 상황 추적
*실행 흐름 중 업데이트되는 체크리스트*

**단계 상태**:
- [x] Phase 0: 연구 완료 (/plan 명령)
- [x] Phase 1: 설계 완료 (/plan 명령)
- [x] Phase 2: 작업 계획 완료 (/plan 명령 - 접근 방식만 설명)
- [ ] Phase 3: 작업 생성됨 (/tasks 명령)
- [ ] Phase 4: 구현 완료
- [ ] Phase 5: 검증 통과

**게이트 상태**:
- [x] 초기 헌법 체크: 통과
- [x] 설계 후 헌법 체크: 통과
- [x] 모든 명확화 필요 사항 해결됨
- [x] 복잡도 이탈 문서화됨

---
*헌법 v2.1.1 기반 - `/memory/constitution.md` 참조*