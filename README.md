# 📝 서예 코치 v2 (Calligraphy Coach v2)

> AI 기반 한글/한자 서예 학습 플랫폼 - 전통과 현대 기술의 만남

## 🎯 프로젝트 개요

서예 코치 v2는 한국 전통 서예를 디지털 환경에서 학습할 수 있도록 돕는 AI 기반 교육 플랫폼입니다. 
Canvas API와 LLM(GPT-4 Vision, Claude, Gemini)을 활용하여 실시간 필기 평가와 맞춤형 피드백을 제공합니다.

### 핵심 기능
- 🖌️ **붓글씨 서예**: 판본체, 궁서체 등 전통 서체 학습
- ✏️ **펜글씨**: K-Culture 테마 기반 실용 한글 학습
- 🤖 **AI 평가**: 실시간 필기 인식 및 전문가 수준 피드백
- 📊 **진도 관리**: 개인별 학습 진도 추적 및 성취도 분석
- 🎯 **맞춤형 학습**: AI Agent 기반 개인화 커리큘럼

## 🚀 Quick Start

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 웹 앱 접속
http://localhost:3000
```

## 📁 프로젝트 구조

```
calligraphy-coach-v2/
├── calligraphy-coach/        # 메인 웹 애플리케이션
│   ├── src/
│   │   ├── features/         # 기능별 모듈 (DDD 구조)
│   │   │   ├── auth/         # 인증/로그인
│   │   │   ├── course/       # 코스 관리
│   │   │   ├── practice/     # 연습 모드
│   │   │   ├── community/    # 커뮤니티
│   │   │   └── user/         # 사용자 프로필
│   │   ├── components/       # 공통 컴포넌트
│   │   │   └── ui/          # shadcn/ui 컴포넌트
│   │   └── shared/          # 공유 유틸리티
│   ├── public/
│   │   └── images/          # 서체 참고 이미지
│   │       └── panbon/      # 판본체 자모 이미지
│   └── package.json
├── apps/                    # 추가 애플리케이션 (개발 예정)
│   ├── mobile/             # React Native 모바일 앱
│   └── web/               # 관리자 대시보드
├── services/               # 백엔드 서비스
│   └── api/               # FastAPI 서버
├── docs/                   # 프로젝트 문서
│   ├── architecture/       # 아키텍처 설계
│   ├── curriculum-structure.md  # 커리큘럼 구조
│   ├── guides/            # 개발 가이드
│   └── sessions/          # 개발 세션 기록
├── reference/             # 참고 자료
│   └── wangxizhi/        # 왕희지 서체 자료
├── archive/              # 아카이브된 파일들
│   └── cleanup-2025-01-24/  # 정리된 이전 파일들
└── README.md            # 현재 문서
```

## 🎓 현재 제공 코스

### 🖌️ 붓글씨 (전통 서예)
1. **판본체 기초** 
   - 조선 궁중의 정갈한 서체
   - 2개 레슨, 초급자용
   
2. **궁서체 정통** 
   - 아름다운 궁중 서체
   - 11개 체계적 레슨
   - 기본획부터 문장까지

### ✏️ 펜글씨 (디지털 캘리그라피)
1. **K-Culture 한글** 
   - BTS, 블랙핑크, 오징어게임 등 트렌드 학습
   - 12개 테마별 레슨
   - 외국인 학습자 최적화

### 📚 준비 중
- 한자능력시험 8급 대비
- 해서체, 행서체 코스

## 🛠️ 기술 스택

### Frontend
- **Framework**: React 18 + Vite
- **Language**: TypeScript 5.3+
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **Canvas**: HTML5 Canvas API + Pointer Events API
- **Router**: React Router v6

### AI/ML
- **OCR**: TensorFlow.js (한글/한자 인식)
- **LLM Integration**: 
  - GPT-4 Vision (고급 평가)
  - Claude API (피드백 생성)
  - Gemini (대안 평가)
- **Local AI**: Ollama + Mixtral (오프라인 모드)

### Backend
- **API**: FastAPI (Python)
- **Database**: SQLite (개발) / PostgreSQL (운영)
- **Auth**: Google OAuth 2.0
- **Storage**: Local File System

## 📊 평가 시스템

### 붓글씨 평가 기준 (100점 만점)
| 항목 | 비중 | 설명 |
|-----|------|------|
| 형태 정확도 | 40% | 글자 모양의 정확성 |
| 비례와 균형 | 30% | 자모음 간격과 크기 |
| 필압 조절 | 20% | 붓의 압력 변화 |
| 획순 준수 | 10% | 올바른 쓰기 순서 |

### 펜글씨 평가 기준
| 항목 | 비중 | 설명 |
|-----|------|------|
| 정확도 | 40% | 글자 인식률 |
| 부드러움 | 30% | 선의 매끄러움 |
| 일관성 | 30% | 글자 크기/간격 통일성 |

## 🔧 개발 명령어

```bash
# 개발
npm run dev          # 개발 서버 실행 (포트 3000)
npm run build        # 프로덕션 빌드
npm run preview      # 빌드 미리보기

# 코드 품질
npm run lint         # ESLint 검사
npm run type-check   # TypeScript 타입 체크

# 백엔드 (별도 터미널)
cd services/api
uvicorn main:app --reload  # FastAPI 서버 (포트 8000)
```

## 📈 개발 현황 (2025-01-24 기준)

### ✅ 완료된 기능
- 코스 선택 및 관리 시스템
- 한글 펜글씨 K-Culture 코스 (12 레슨)
- 붓글씨 판본체 코스 (2 레슨)
- 붓글씨 궁서체 코스 (11 레슨)
- Canvas 기반 필기 입력
- 기본 평가 시스템
- 구글 소셜 로그인
- 학습 진도 저장
- 반응형 UI 디자인

### 🚧 개발 중
- LLM 기반 고급 평가 시스템
- 카메라 촬영 평가 모드
- 실시간 피드백 애니메이션
- 커뮤니티 갤러리

### 📋 계획됨
- 한자능력시험 대비 코스
- 해서체, 행서체 추가
- React Native 모바일 앱
- 다국어 지원 (영어, 중국어, 일본어)
- 오프라인 모드
- 학습 분석 대시보드

## 🎨 디자인 원칙

- **젠(Zen) 스타일**: 미니멀하고 집중력 있는 UI
- **한국 전통 색상**: 오방색 활용
- **반응형**: 모바일/태블릿/데스크톱 최적화
- **접근성**: WCAG 2.1 AA 준수

## 👥 기여 방법

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 커밋 규칙
- `feat:` 새로운 기능
- `fix:` 버그 수정
- `docs:` 문서 수정
- `style:` 코드 포맷팅
- `refactor:` 코드 리팩토링
- `test:` 테스트 추가
- `chore:` 빌드 업무 수정

## 📝 라이선스

이 프로젝트는 비공개 소프트웨어입니다. 무단 복제 및 배포를 금지합니다.

## 🔗 관련 링크

- [프로젝트 문서](./docs/)
- [아키텍처 설계](./docs/architecture/)
- [API 문서](./services/api/README.md)
- [컴포넌트 가이드](./calligraphy-coach/src/components/README.md)

## 📞 문의

프로젝트 관련 문의사항은 GitHub Issues를 통해 남겨주세요.

---

*Last Updated: 2025-01-24 12:07 KST*  
*Version: 2.0.0-alpha*  
*Branch: 003-canvas-api-llm*