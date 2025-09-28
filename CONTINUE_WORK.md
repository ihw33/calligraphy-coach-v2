# 작업 이어하기 문서 (2025-09-25)

## 현재 상태
- **작업 중인 브랜치**: 003-canvas-api-llm
- **개발 서버**: http://localhost:3000 (포트 3000에서 실행 중)

## 진행 중인 작업: 황자원 92 서법 구현

### 완료된 작업 ✅
1. **T040.1**: 황자원 92 서법 커리큘럼 데이터 구축 (서법 1-4)
   - `/src/features/course/data/courses/hwang92-sebeop.ts` 생성
   - 서법 1-4까지 16개 한자 데이터 입력 완료

2. **문서 작성**
   - `/specs/hwang92-location-state.md` - 데이터 구조 명세
   - `/specs/practice-screen-design.md` - 페이지 설계
   - `/specs/tasks.md` - T040.1~T040.4 추가

3. **UI 연결**
   - `/learn` 페이지에 황자원 92 서법 코스 표시
   - CourseDetail에서 PracticeScreen으로 라우팅 설정

4. **T040.2**: PracticeScreen과 황92 서법 레슨 연동 ✅ (2025-09-25 완료)
   - location.state 데이터 처리 로직 구현
   - 황자원 92 서법 한자 문자 정상 표시
   - 평가 포인트 UI 표시 기능 추가

### 남은 작업 ❌

1. **T040.3**: 한자별 평가 포인트 표시 시스템
   - ~~서법별 평가 포인트 UI 표시~~ (완료)
   - 각 한자별 세부 평가 기준 적용

2. **T040.4**: 실물 모드 카메라 촬영 및 AI 평가
   - 기본 photo 모드로 시작
   - 평가 결과 처리

## 수정 완료 사항 (2025-09-25)
**해결**: PracticeScreen에서 황자원 92 서법 데이터 정상 표시
- location.state 데이터를 properly 처리하는 로직 추가
- `isHwang92` 플래그로 황자원 서법 감지
- 황자원 92 서법의 한자 문자들을 practiceSession에 연결
- 평가 포인트 UI 섹션 추가 (amber 색상 박스)

**구현**: 황자원 92법 서법 1 (천복자) 전용 AI 평가 시스템
- 3단계 평가 프롬프트 구조 설계 (한자 기본 → 황자원 92법 → 서법별)
- 천복자 전용 최적화 프롬프트 (`generateHwang92Sebeop1Prompt`)
- 황자원 92법 응답 형식 변환 로직
- 천복자 체크리스트 생성 함수

## 다음 작업 시작점
```javascript
// 현재 동작 확인됨:
// 1. CourseDetail에서 location.state 전달
// 2. PracticeScreen에서 state 받아서 처리
// 3. 황자원 92 한자 문자 정상 표시
// 4. 평가 포인트 표시

// TODO: 
// - 각 한자별 세부 평가 기준 적용
// - AI 평가 시 황92 특별 기준 적용
```

## 주요 파일 위치
- **코스 데이터**: `/src/features/course/data/courses/hwang92-sebeop.ts`
- **코스 상세**: `/src/features/course/components/CourseDetail.tsx`
- **연습 화면**: `/src/features/practice/components/PracticeScreen.tsx`
- **참고 이미지**: `/reference/황자원_92_서법/`

## 테스트 경로
1. http://localhost:3000/learn → 서예 탭
2. "황자원 92 서법" 클릭
3. "서법 1: 천복..." 클릭
4. PracticeScreen에서 한자 '宇' 표시 확인

## Git 상태
- Modified: 여러 파일 수정됨
- Branch: 003-canvas-api-llm

## 명령어
```bash
# 개발 서버 (이미 실행 중)
cd /Users/m4_macbook/Projects/calligraphy-coach-v2/calligraphy-coach
npm run dev

# 포트 3000에서 실행 중
```

---
*다음 작업자가 이 문서를 보고 바로 이어서 작업할 수 있도록 작성됨*