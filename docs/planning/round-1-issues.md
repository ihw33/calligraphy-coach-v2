# 회차 1 - Issue 목록

## 🎯 회차 1 목표
프로젝트 기초 설정 및 개발 환경 구축

## 📋 Issue 목록

### Issue #1: [R1] 프로젝트 초기 설정 및 인프라 구축
**담당**: @codex-cli  
**우선순위**: P0-Critical  
**예상 회차**: 1회

#### 작업 내용
- [ ] GitHub 저장소 생성 및 설정
- [ ] 모노레포 구조 설정 (Turborepo)
- [ ] Docker Compose 개발 환경 구축
- [ ] ESLint, Prettier 설정
- [ ] Git hooks (Husky) 설정

#### 산출물
- `docker-compose.yml`
- `.github/workflows/ci.yml`
- 개발 환경 설정 문서

---

### Issue #2: [R1] FastAPI 백엔드 서버 기초 구축
**담당**: @gemini-cli  
**우선순위**: P0-Critical  
**예상 회차**: 1회

#### 작업 내용
- [ ] FastAPI 프로젝트 구조 생성
- [ ] 기본 라우터 설정 (/api/v1/*)
- [ ] Pydantic 모델 정의
- [ ] PostgreSQL 연결 설정
- [ ] Alembic 마이그레이션 설정
- [ ] Ollama API 연동 테스트

#### API 엔드포인트
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login  
GET    /api/v1/health
POST   /api/v1/analysis/test
```

#### 산출물
- `services/api/` 구조
- API 명세서 초안
- Ollama 연동 샘플

---

### Issue #3: [R1] React Native 모바일 앱 초기화
**담당**: @claude-cli  
**우선순위**: P0-Critical  
**예상 회차**: 1회

#### 작업 내용
- [ ] Expo React Native 프로젝트 생성
- [ ] TypeScript 설정
- [ ] React Navigation 구조 설정
- [ ] Zustand 상태 관리 설정
- [ ] 기본 화면 5개 생성 (스켈레톤)

#### 화면 목록
- SplashScreen (스플래시)
- HomeScreen (홈)
- CameraScreen (촬영)
- AnalysisScreen (분석)
- ProfileScreen (프로필)

#### 산출물
- `apps/mobile/` 구조
- 네비게이션 플로우 문서
- 화면 스크린샷

---

### Issue #4: [R1] UI/UX 디자인 시스템 및 QA 환경 구축
**담당**: @cursor-cli  
**우선순위**: P1-High  
**예상 회차**: 1회

#### 작업 내용
- [ ] Figma 디자인 토큰 정의
- [ ] 색상/타이포그래피 시스템
- [ ] Storybook 환경 구축
- [ ] 기본 컴포넌트 5개 제작
- [ ] Jest/Testing Library 설정
- [ ] 샘플 테스트 케이스 작성

#### 컴포넌트 목록
- Button (버튼)
- Input (입력)
- Card (카드)
- Modal (모달)
- Loading (로딩)

#### 산출물
- 디자인 시스템 문서
- Storybook 배포
- 컴포넌트 라이브러리

---

### Issue #5: [R1] PM 대시보드 및 문서화 시스템 구축
**담당**: @pm-claude  
**우선순위**: P1-High  
**예상 회차**: 1회

#### 작업 내용
- [ ] GitHub Project Board 설정
- [ ] Wiki 초기 페이지 작성
- [ ] 회고 템플릿 준비
- [ ] 진행 상황 추적 시스템
- [ ] 팀 커뮤니케이션 가이드 작성

#### 산출물
- 프로젝트 대시보드
- Wiki 구조
- 프로세스 문서

---

## 🔄 의존성 관계
```
#1 (인프라) 
  ├─→ #2 (백엔드)
  ├─→ #3 (프론트엔드)
  └─→ #4 (디자인/QA)
```

## 📅 예상 일정
- 시작: 회차 1 시작 시점
- 종료: 모든 작업 완료 및 통합 테스트
- 회고: 회차 1 완료 후 즉시

## ✅ 완료 기준
- [ ] 모든 개발 환경 구동 가능
- [ ] 기본 API 호출 성공
- [ ] 앱 빌드 및 실행 성공
- [ ] 테스트 환경 작동 확인
- [ ] 문서화 70% 이상 완료