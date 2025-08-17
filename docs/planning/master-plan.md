# 프로젝트 마스터 플랜

## 🎯 비전 및 목표
"AI 기반 개인 맞춤형 서예 학습 플랫폼 - 전통을 현대 기술로 재해석"

## 📊 서비스 개요

### 타겟 사용자
1. **Primary**: 서예 입문자 (20-40대)
2. **Secondary**: 자녀 교육용 (학부모)  
3. **Tertiary**: 외국인 한글 학습자

### 핵심 가치
- 실시간 AI 피드백
- 개인화된 학습 경로
- 게이미피케이션
- 커뮤니티 기반 학습

## 🏗️ 기술 스택

### Frontend
- React Native (Expo)
- TypeScript
- Zustand (상태관리)
- React Navigation

### Backend  
- Python FastAPI
- PostgreSQL
- Redis
- WebSocket

### AI/ML
- Ollama + Mixtral (로컬)
- PyTorch
- MediaPipe
- OpenCV

### Infrastructure
- Docker
- GitHub Actions
- 로컬 맥북 서버

## 📅 마일스톤 (회차 기반)

### Milestone R1: Foundation (회차 1-5)
- 프로젝트 설정
- 기본 구조 구축
- 개발 환경 구성

### Milestone R2: Core Features (회차 6-15)  
- 카메라 모듈
- AI 기본 분석
- 학습 콘텐츠

### Milestone R3: Advanced (회차 16-25)
- 실시간 피드백
- 음성 안내
- 커뮤니티 기능

### Milestone R4: Polish (회차 26-30)
- 최적화
- 테스트
- 출시 준비

## 🚀 Feature List

### P0: MVP (필수)
- [ ] F001: 회원가입/로그인
- [ ] F002: 온보딩
- [ ] F003: 카메라 촬영
- [ ] F004: AI 기본 분석
- [ ] F005: 학습 콘텐츠

### P1: Core (핵심)
- [ ] F006: 실시간 자세 분석
- [ ] F007: AI 음성 피드백
- [ ] F008: 고급 분석
- [ ] F009: 학습 기록
- [ ] F010: 성취 시스템

### P2: Community (커뮤니티)
- [ ] F011: 작품 갤러리
- [ ] F012: 챌린지 모드

### P3: Premium (프리미엄)
- [ ] F013: 전문가 연계
- [ ] F014: 고급 콘텐츠

## 📐 AI 엔진 아키텍처

### 로컬 AI 구성
```
Ollama Server (Port 11434)
├── Mixtral (텍스트 분석)
├── LLaVA (이미지 이해)
└── Custom Models
    ├── CalligraphyNet (품질 평가)
    ├── StrokeOrderNet (획순 검증)
    └── PoseNet (자세 분석)
```

### 모델 규모
- 품질 평가: 50-100M 파라미터
- 자세 분석: 10-20M 파라미터
- 획순 검증: 20-30M 파라미터

## 🌍 다국어 지원

### 한글 학습
- 자음/모음 분리 학습
- 조합 원리 이해
- 받침 연습

### 한자 학습
- 기초 100자
- 획순 애니메이션
- 서체별 학습

### 글로벌 확장
- 영어 UI (기본)
- 중국어, 일본어
- 동남아 언어

## 📋 회차별 프로세스

### 작업 프로세스
1. PM이 Issue 생성 및 할당
2. 담당 CLI가 작업 진행
3. Issue 댓글로 진행상황 보고
4. PM 검토 및 피드백
5. 완료 후 다음 회차

### 회고 프로세스
1. 매 회차 종료 시 회고
2. 성과/문제점/개선사항 정리
3. 다음 회차 계획 조정

## 🔗 관련 문서
- [기술 아키텍처](architecture/technical-architecture.md)
- [API 명세서](architecture/api-specification.md)
- [AI 모델 가이드](architecture/ai-model-guide.md)
- [UI/UX 가이드](planning/ui-ux-guide.md)