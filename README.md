# Calligraphy Coach v2 - AI 기반 서예 학습 플랫폼

## 프로젝트 개요
AI 기술을 활용한 실시간 서예(한글/한자) 학습 플랫폼입니다.

### 핵심 특징
- 🎯 실시간 자세 분석 및 음성 피드백
- 📱 한글/한자 듀얼 모드 지원
- 🌍 다국어 지원 (외국인 한글 학습)
- 🤖 로컬 AI 엔진 (Ollama + Mixtral)

## 팀 구성
- **PM/기획**: Claude Code (이 창)
- **Backend/AI**: Gemini CLI
- **Mobile/Integration**: Claude CLI  
- **Design/QA**: Cursor CLI (ChatGPT-5)
- **Infrastructure**: Codex CLI

## 개발 방식
- 회차 기반 스프린트 (기간이 아닌 횟수)
- GitHub Issue 기반 비동기 협업
- 100% 문서화 원칙

## 프로젝트 구조
```
calligraphy-coach-v2/
├── apps/               # 애플리케이션
│   ├── mobile/        # React Native 앱
│   └── web/           # 관리자 웹
├── services/          # 백엔드 서비스
│   ├── api/          # FastAPI 서버
│   ├── ai/           # AI 모델 서빙
│   └── realtime/     # WebSocket 서버
├── packages/          # 공용 패키지
│   ├── shared/       # 공용 타입/유틸
│   └── ui/           # UI 컴포넌트
├── infrastructure/    # 인프라 설정
├── docs/             # 문서
└── archive/          # 이전 자료
```

## 시작하기
1. [개발 환경 설정](docs/setup/development.md)
2. [AI CLI 가이드](docs/guides/ai-cli-guide.md)
3. [기여 가이드](docs/CONTRIBUTING.md)

## 빠른 시작(요약)
- Node 18+, npm 9+, Python 3.11 준비
- 의존성 설치: `npm ci`
- 모바일 앱(Expo):
  - `cd apps/mobile && npm start`
- 백엔드(FastAPI):
  - `cd services/backend && uvicorn main:app --reload`
- Docker Compose(백엔드):
  - `docker compose up --build` → http://localhost:8000

## CI/CD
GitHub Actions가 다음을 수행합니다:
- Node 워크스페이스: install/lint/test/build
- Backend 파이썬: 의존성 설치 및 임포트 스모크 체크

## 코드 규약 및 훅
- 커밋 규칙: Conventional Commits (commitlint)
- Husky 훅:
  - pre-commit: lint-staged(Prettier + ESLint)
  - commit-msg: commitlint
  - pre-push: `npm test`
훅 설치: `npm run prepare`
