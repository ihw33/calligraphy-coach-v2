# CLAUDE.md - 서예 코치 v2 프로젝트 컨텍스트

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

## 현재 집중 작업 (브랜치: 001-)
필기 인식 및 피드백 시스템 구현
- 붓글씨 입력 (압력 감지)
- 4가지 서체 지원 (판본체, 궁서체, 전서체, 해서체)
- 100점 평가 시스템 (형태 40%, 비례 30%, 굵기 20%, 획순 10%)
- 실시간 피드백 및 향상도 추적

## 프로젝트 구조
```
frontend/
├── src/
│   ├── lib/           # 기능별 라이브러리들
│   ├── components/    # React 컴포넌트들
│   └── pages/         # Next.js 페이지들
└── tests/            # 테스트 파일들

specs/001-/           # 현재 기능 명세서들
├── spec.md           # 기능 명세서
├── plan.md           # 구현 계획
├── research.md       # 기술 연구
├── data-model.md     # 데이터 구조
├── contracts/        # API 계약
└── quickstart.md     # 사용 가이드
```

## 주요 명령어들
```bash
pnpm dev              # 개발 서버 시작
pnpm test            # 테스트 실행
pnpm lint            # 린터 실행
pnpm typecheck       # 타입 검사
```

## 테스트 요구사항 (중요)
1. TDD 필수: 테스트 먼저 작성 → 실패 확인 → 구현
2. 테스트 순서: 계약 → 통합 → E2E → 단위
3. 실제 의존성 사용 (모킹 최소화)

## 성능 목표
- 입력 지연: <16ms (60fps)
- 압력 샘플링: 120Hz
- 문자 인식: <500ms
- 평가 계산: <200ms

## 최근 변경사항
- 붓글씨 특화로 초기 프로젝트 설정
- Canvas 압력 API 통합 계획
- 한국어/중국어용 TensorFlow.js 모델 선택

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