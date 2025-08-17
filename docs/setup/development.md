# 개발 환경 설정 가이드

본 문서는 Calligraphy Coach v2 레포지토리의 기본 개발 환경을 신속히 구성하는 방법을 안내합니다.

## 요구 사항
- Node.js 18 이상, npm 9 이상
- Python 3.11 (백엔드용)
- Docker Desktop (선택 사항: Compose 기반 개발)

## 설치
```bash
npm ci
```

## 워크스페이스 구조
- `apps/mobile`: React Native(Expo) 앱
- `services/backend`: FastAPI 백엔드

## 실행
### 모바일(Expo)
```bash
cd apps/mobile
npm start
```

### 백엔드(FastAPI)
```bash
cd services/backend
uvicorn main:app --reload
```

### Docker Compose(백엔드)
```bash
docker compose up --build
# http://localhost:8000
```

## 코드 규약
- ESLint + Prettier
- 커밋 메시지 규약: Conventional Commits (commitlint)

### Husky 훅 설치
```bash
npm run prepare
```
설치 후:
- pre-commit: 변경 파일에 대해 Prettier/ESLint 실행(lint-staged)
- commit-msg: commitlint 검사
- pre-push: 테스트 실행

## CI
GitHub Actions에서 다음을 수행합니다:
- Node 워크스페이스: install/lint/test/build
- Python 백엔드: 의존성 설치 및 스모크 체크

