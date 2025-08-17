# Calligraphy Coach v2 프로젝트 구조

## 🏗️ 전체 구조
```
calligraphy-coach-v2/
├── apps/                    # 애플리케이션
│   ├── mobile/             # React Native 모바일 앱
│   └── web/                # 관리자 웹 대시보드
├── services/               # 백엔드 서비스
│   ├── api/               # FastAPI REST API
│   ├── ai/                # AI 모델 서빙
│   └── realtime/          # WebSocket 실시간 서버
├── packages/               # 공유 패키지
│   ├── shared/            # 공통 타입/유틸리티
│   └── ui/                # UI 컴포넌트 라이브러리
├── infrastructure/         # 인프라 설정
│   ├── docker/            # Docker 설정
│   ├── k8s/               # Kubernetes 매니페스트
│   └── scripts/           # 배포 스크립트
├── docs/                   # 문서
│   ├── architecture/      # 아키텍처 문서
│   ├── guides/            # 개발 가이드
│   ├── planning/          # 기획 문서
│   └── retrospectives/    # 회고 문서
├── archive/               # 이전 버전 자료
│   ├── planning/          # 기획 문서
│   ├── test-results/      # 테스트 결과
│   └── ai-research/       # AI 연구 자료
└── .github/               # GitHub 설정
    ├── ISSUE_TEMPLATE/    # 이슈 템플릿
    └── workflows/         # GitHub Actions

## 📦 상세 구조

### apps/mobile
```
mobile/
├── src/
│   ├── screens/          # 화면 컴포넌트
│   ├── components/       # UI 컴포넌트
│   ├── navigation/       # 네비게이션 설정
│   ├── store/           # 상태 관리 (Zustand)
│   ├── services/        # API 서비스
│   ├── utils/           # 유틸리티 함수
│   └── types/           # TypeScript 타입
├── assets/              # 이미지, 폰트 등
├── android/             # Android 네이티브 코드
├── ios/                 # iOS 네이티브 코드
└── package.json
```

### services/api
```
api/
├── app/
│   ├── api/            # API 엔드포인트
│   │   ├── v1/         # v1 API
│   │   └── v2/         # v2 API (future)
│   ├── core/           # 핵심 설정
│   ├── models/         # 데이터베이스 모델
│   ├── schemas/        # Pydantic 스키마
│   ├── services/       # 비즈니스 로직
│   └── utils/          # 유틸리티
├── tests/              # 테스트
├── alembic/            # DB 마이그레이션
└── requirements.txt
```

### services/ai
```
ai/
├── models/             # AI 모델 파일
│   ├── calligraphy/    # 서예 평가 모델
│   ├── pose/           # 자세 분석 모델
│   └── stroke/         # 획순 검증 모델
├── serving/            # 모델 서빙
├── training/           # 학습 스크립트
├── data/              # 학습 데이터
└── ollama/            # Ollama 설정
```

### packages/shared
```
shared/
├── src/
│   ├── types/         # 공통 타입 정의
│   ├── constants/     # 상수
│   ├── utils/         # 유틸리티
│   └── api/           # API 클라이언트
└── package.json
```

## 🔧 설정 파일

### 루트 설정
- `package.json` - 모노레포 설정
- `turbo.json` - Turborepo 설정
- `.gitignore` - Git 무시 파일
- `.env.example` - 환경 변수 예제

### 개발 도구
- `.eslintrc.js` - ESLint 설정
- `.prettierrc` - Prettier 설정
- `tsconfig.json` - TypeScript 설정
- `jest.config.js` - Jest 설정

### Docker
- `docker-compose.yml` - 개발 환경
- `docker-compose.prod.yml` - 프로덕션
- `Dockerfile` - 각 서비스별

## 🌐 포트 할당
- 3000: Mobile Metro
- 3001: Web 개발 서버
- 8000: API 서버
- 8001: AI 모델 서버
- 8002: WebSocket 서버
- 11434: Ollama 서버
- 5432: PostgreSQL
- 6379: Redis

## 📝 명명 규칙

### 파일명
- React 컴포넌트: `PascalCase.tsx`
- 유틸리티: `camelCase.ts`
- 상수: `UPPER_SNAKE_CASE.ts`
- 스타일: `ComponentName.styles.ts`

### 폴더명
- 모두 `kebab-case` 사용
- 복수형 사용 (예: `components`, `utils`)

### Git 브랜치
- `main` - 프로덕션
- `develop` - 개발
- `feature/기능명` - 기능 개발
- `fix/버그명` - 버그 수정
- `hotfix/이슈명` - 긴급 수정