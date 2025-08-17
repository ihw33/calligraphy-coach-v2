# Development Guide

## 🚀 개발 환경 설정

### 필수 요구사항
- Node.js 18+ 
- Python 3.10+
- Docker Desktop
- Git
- Ollama (AI 모델용)

### 선택 요구사항
- Xcode 14+ (iOS 개발)
- Android Studio (Android 개발)
- PostgreSQL 15+
- Redis 7+

## 📦 프로젝트 설정

### 1. 저장소 클론
```bash
git clone https://github.com/ihw33/calligraphy-coach-v2.git
cd calligraphy-coach-v2
```

### 2. 환경 변수 설정
```bash
# 루트 디렉토리
cp .env.example .env

# 필수 환경 변수
DATABASE_URL=postgresql://user:pass@localhost:5432/calligraphy
REDIS_URL=redis://localhost:6379
OLLAMA_URL=http://localhost:11434
JWT_SECRET=your-secret-key
```

### 3. 의존성 설치
```bash
# Node.js 패키지
npm install

# Python 패키지 (백엔드)
cd services/api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Docker 서비스 실행
```bash
# 루트 디렉토리에서
docker-compose up -d

# 서비스 확인
docker-compose ps
```

### 5. 데이터베이스 마이그레이션
```bash
cd services/api
alembic upgrade head
```

### 6. Ollama 모델 설치
```bash
# Ollama 설치 (Mac)
brew install ollama

# 모델 다운로드
ollama pull mixtral
ollama pull llava
```

## 🏃‍♂️ 개발 서버 실행

### 전체 서비스 실행
```bash
# 터미널 1: 백엔드
cd services/api
uvicorn main:app --reload --port 8000

# 터미널 2: 모바일 앱
cd apps/mobile
npm start

# 터미널 3: 웹 대시보드
cd apps/web
npm run dev
```

### 개별 서비스 실행
```bash
# Turborepo 사용
npm run dev          # 모든 서비스
npm run dev:api      # 백엔드만
npm run dev:mobile   # 모바일만
npm run dev:web      # 웹만
```

## 🏗️ 프로젝트 구조

```
calligraphy-coach-v2/
├── apps/
│   ├── mobile/          # React Native 앱
│   │   ├── src/
│   │   │   ├── screens/
│   │   │   ├── components/
│   │   │   ├── store/
│   │   │   └── services/
│   │   └── package.json
│   └── web/             # Next.js 대시보드
│       ├── src/
│       └── package.json
├── services/
│   ├── api/            # FastAPI 백엔드
│   │   ├── app/
│   │   ├── models/
│   │   └── routers/
│   └── ai/             # AI 서비스
├── packages/
│   ├── ui/             # 공통 UI 컴포넌트
│   └── shared/         # 공통 유틸리티
└── docker-compose.yml
```

## 💻 코딩 규칙

### TypeScript/JavaScript
```typescript
// 컴포넌트명: PascalCase
export const UserProfile: React.FC = () => { }

// 함수명: camelCase
const calculateScore = (input: string): number => { }

// 상수: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;

// 인터페이스: PascalCase with 'I' prefix
interface IUserData {
  id: string;
  name: string;
}
```

### Python
```python
# 클래스명: PascalCase
class UserService:
    pass

# 함수명: snake_case
def calculate_score(input_text: str) -> float:
    pass

# 상수: UPPER_SNAKE_CASE
MAX_RETRY_COUNT = 3

# 파일명: snake_case.py
user_service.py
```

### Git Commit Convention
```bash
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅, 세미콜론 누락 등
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드 업무 수정, 패키지 매니저 수정 등
```

## 🧪 테스트

### Frontend 테스트
```bash
# 유닛 테스트
npm test

# 테스트 커버리지
npm run test:coverage

# E2E 테스트
npm run test:e2e
```

### Backend 테스트
```bash
# pytest 실행
cd services/api
pytest

# 커버리지 포함
pytest --cov=app

# 특정 테스트만
pytest tests/test_auth.py
```

### 테스트 작성 예시
```typescript
// Frontend (Jest)
describe('Button Component', () => {
  it('should render correctly', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeInTheDocument();
  });
});
```

```python
# Backend (pytest)
def test_user_creation():
    user = User(email="test@example.com")
    assert user.email == "test@example.com"
```

## 🔧 디버깅

### VS Code 설정
```json
// .vscode/launch.json
{
  "configurations": [
    {
      "name": "Debug React Native",
      "type": "reactnative",
      "request": "launch",
      "platform": "ios"
    },
    {
      "name": "Debug FastAPI",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": ["main:app", "--reload"]
    }
  ]
}
```

### 디버깅 도구
- React Native Debugger
- Redux DevTools
- Python debugger (pdb)
- Chrome DevTools

## 📝 API 개발

### 새 엔드포인트 추가
```python
# routers/new_feature.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/v1/feature")

@router.get("/")
async def get_feature(db: Session = Depends(get_db)):
    return {"message": "Feature endpoint"}

# main.py에 추가
app.include_router(new_feature.router)
```

### API 문서 자동 생성
```bash
# Swagger UI
http://localhost:8000/docs

# ReDoc
http://localhost:8000/redoc
```

## 🎨 UI 컴포넌트 개발

### Storybook 사용
```bash
# Storybook 실행
cd packages/ui
npm run storybook

# 새 스토리 추가
# Button.stories.tsx
export default {
  title: 'Components/Button',
  component: Button,
};

export const Primary = {
  args: {
    variant: 'primary',
    children: 'Click me',
  },
};
```

## 🚢 배포 준비

### 빌드
```bash
# 프로덕션 빌드
npm run build

# Docker 이미지 빌드
docker build -t calligraphy-api services/api
docker build -t calligraphy-web apps/web
```

### 환경별 설정
```typescript
// config/index.ts
const config = {
  development: {
    API_URL: 'http://localhost:8000',
  },
  production: {
    API_URL: 'https://api.calligraphy-coach.com',
  },
};

export default config[process.env.NODE_ENV];
```

## 🐛 문제 해결

### 자주 발생하는 문제

#### 1. npm install 실패
```bash
# 캐시 클리어
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 2. Docker 포트 충돌
```bash
# 사용 중인 포트 확인
lsof -i :8000
# 프로세스 종료
kill -9 <PID>
```

#### 3. Python 가상환경 문제
```bash
# 가상환경 재생성
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 📚 추가 리소스

### 공식 문서
- [React Native](https://reactnative.dev/docs/getting-started)
- [FastAPI](https://fastapi.tiangolo.com)
- [Next.js](https://nextjs.org/docs)
- [Docker](https://docs.docker.com)

### 프로젝트 문서
- [Architecture](./Architecture)
- [API Documentation](./API-Documentation)
- [Team Process](./Team-Process)

### 유용한 도구
- [Postman](https://www.postman.com) - API 테스트
- [TablePlus](https://tableplus.com) - DB 관리
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)

---
*개발 가이드는 지속적으로 업데이트됩니다.*