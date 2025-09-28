# 🔧 calligraphy-coach UI + 백엔드 통합 계획

## 📋 현황 분석

### ✅ 기존 완성된 UI (calligraphy-coach)
- **위치**: `/Users/m4_macbook/Projects/calligraphy-coach-v2/calligraphy-coach/`
- **실행 중**: http://localhost:3000
- **기술 스택**: React 18 + Vite + shadcn/ui + Tailwind CSS v4
- **완성도**: 젠 스타일 디자인, 전체 화면 구조, 하드코딩된 데이터

### ✅ 우리 개발 백엔드 (apps/web)
- **위치**: `/Users/m4_macbook/Projects/calligraphy-coach-v2/apps/web/src/`
- **기술 스택**: React 18 + TypeScript + Zustand + IndexedDB
- **완성도**: 인증시스템, 스토리지, 타입 정의 완료

## 🎯 통합 전략

### Phase 1: 환경 통합 (진행 중)
- [x] 기존 UI 서버 실행 (localhost:3000)
- [x] 백엔드 컴포넌트 분석 완료
- [ ] 의존성 통합 및 호환성 확인

### Phase 2: 인증 시스템 통합
- [ ] calligraphy-coach/src/contexts/AuthContext.tsx → 우리 useAuth 훅
- [ ] Landing.tsx 소셜 로그인 버튼 → 실제 OAuth 연동
- [ ] 사용자 상태 관리 통합

### Phase 3: 데이터 레이어 통합
- [ ] 하드코딩 데이터 → IndexedDB + 우리 엔티티
- [ ] 통계 데이터 → 실제 사용자 연습 기록
- [ ] localStorage → AuthStore + SettingsStore

### Phase 4: Canvas + LLM 시스템 통합
- [ ] PracticeScreen Canvas → stroke-capture 패키지
- [ ] 카메라 촬영 → LLM 평가 시스템
- [ ] 평가 결과 표시

## 📂 주요 통합 파일

### 1. 인증 시스템
```bash
# 교체 대상
calligraphy-coach/src/contexts/AuthContext.tsx

# 통합 소스 
apps/web/src/hooks/useAuth.ts
apps/web/src/components/auth/SocialLogin.tsx
apps/web/src/utils/storage.ts (AuthStore)
```

### 2. 데이터 스토리지
```bash
# 통합 대상
calligraphy-coach/src/components/Home.tsx (하드코딩 데이터)
calligraphy-coach/src/components/WeeklyStatsDetails.tsx (통계)

# 통합 소스
apps/web/src/utils/storage.ts (CalligraphyDB, SettingsStore)
apps/web/src/types/auth.ts
```

### 3. Canvas 시스템  
```bash
# 통합 대상
calligraphy-coach/src/components/PracticeScreen.tsx

# 통합 소스
apps/web/src/components/practice/ (stroke-capture 예정)
```

## 🚀 다음 단계

1. **의존성 통합**: package.json 병합 및 Tailwind v4 ↔ v3 호환성 확인
2. **AuthContext 교체**: 기존 데모 인증 → 실제 소셜 로그인
3. **데이터 교체**: 하드코딩 → 실제 API/DB 연동
4. **Canvas 통합**: 기본 Canvas → stroke-capture 패키지
5. **최종 테스트**: 전체 플로우 검증

## 💡 통합 우선순위

1. **인증 먼저**: 로그인 없이는 다른 기능 테스트 불가
2. **데이터 다음**: 실제 사용자 데이터로 UI 검증
3. **Canvas 마지막**: 핵심 기능이므로 신중히 통합

---
*목표: 2-3일 내 실용적인 서예 앱 완성*