# Team Process

## 👥 팀 구성 및 역할

### 팀 멤버
| 이름 | 역할 | 책임 영역 | GitHub |
|------|------|----------|---------|
| Thomas | 최종 결정권자 | 전략, 최종 승인 | @thomas |
| PM Claude | 프로젝트 매니저 | 일정 관리, 조율 | @pm-claude |
| Gemini CLI | 백엔드 개발 | API, DB, AI 통합 | @gemini-cli |
| Claude CLI | 모바일 개발 | React Native | @claude-cli |
| Cursor CLI | 디자인/QA | UI/UX, 테스트 | @cursor-cli |
| Codex CLI | 인프라 | DevOps, CI/CD | @codex-cli |

## 🔄 개발 프로세스

### 스프린트 구조
```
회차 시작 (월요일)
    ↓
계획 수립 (1일)
    ↓
개발 작업 (3-4일)
    ↓
통합 및 테스트 (1일)
    ↓
회고 (금요일)
```

### 일일 루틴
```
09:00 - 작업 시작 알림 (Issue 댓글)
  ↓
09:00-12:00 - 오전 작업
  ↓
12:00 - 중간 체크인 (진행상황 공유)
  ↓
13:00-18:00 - 오후 작업
  ↓
18:00 - 일일 보고 (Issue 업데이트)
```

## 📋 작업 관리

### Issue 생성 및 할당

#### Issue 템플릿
```markdown
## 작업 개요
[작업 설명]

## 완료 조건
- [ ] 조건 1
- [ ] 조건 2
- [ ] 조건 3

## 기술 스펙
- 사용 기술:
- 의존성:
- 예상 시간:

## 참고 자료
- 링크 1
- 링크 2
```

#### Label 규칙
- **우선순위**: P0-Critical, P1-High, P2-Medium, P3-Low
- **팀**: gemini-backend, claude-frontend, cursor-design-qa, codex-infra
- **타입**: feature, bug, docs, test, task
- **상태**: in-progress, blocked, review-needed

### 브랜치 전략

#### Git Flow
```
main (production)
  ├── develop (개발)
  │   ├── feature/[issue-number]-[feature-name]
  │   ├── fix/[issue-number]-[bug-name]
  │   └── hotfix/[issue-number]-[hotfix-name]
  └── release/[version]
```

#### 브랜치 명명 규칙
```bash
feature/2-user-authentication
fix/15-login-error
hotfix/23-critical-bug
release/v1.0.0
```

### Pull Request 프로세스

#### PR 템플릿
```markdown
## 변경 사항
- 구현 내용 요약

## 관련 Issue
Closes #[issue-number]

## 테스트
- [ ] 유닛 테스트 통과
- [ ] 통합 테스트 통과
- [ ] 로컬 환경 테스트

## 스크린샷
(해당되는 경우)

## 체크리스트
- [ ] 코드 스타일 가이드 준수
- [ ] 문서 업데이트
- [ ] 리뷰어 지정
```

#### 코드 리뷰 규칙
1. 최소 1명 이상 리뷰
2. 24시간 내 리뷰 완료
3. Approve 후 머지
4. 머지 전 CI 통과 필수

## 🚀 배포 프로세스

### 배포 파이프라인
```
개발 (feature branch)
    ↓ PR
develop branch
    ↓ 테스트
staging 환경
    ↓ QA
main branch
    ↓ 배포
production
```

### 배포 체크리스트
- [ ] 모든 테스트 통과
- [ ] 코드 리뷰 완료
- [ ] 문서 업데이트
- [ ] 마이그레이션 스크립트 준비
- [ ] 롤백 계획 수립
- [ ] 모니터링 설정

## 📊 회고 프로세스

### 회고 진행 방식
1. **데이터 수집** (30분)
   - 완료된 작업 정리
   - 메트릭스 수집
   - 피드백 수집

2. **분석** (30분)
   - Keep: 잘한 점
   - Problem: 문제점
   - Try: 개선 방안

3. **액션 아이템** (30분)
   - 구체적 개선 계획
   - 담당자 지정
   - 기한 설정

### 회고 메트릭스
- 계획 대비 완료율
- 평균 Issue 처리 시간
- 버그 발생률
- 코드 리뷰 시간
- 팀 만족도

## 📈 성과 관리

### KPI (Key Performance Indicators)

#### 개발 지표
- Sprint 목표 달성률
- 코드 커버리지
- 기술 부채 비율
- 배포 빈도

#### 품질 지표
- 버그 발견율
- 테스트 통과율
- 코드 리뷰 커버리지
- 문서화 완성도

#### 협업 지표
- PR 리뷰 응답 시간
- Issue 해결 시간
- 커뮤니케이션 빈도
- 지식 공유 횟수

## 🔧 도구 및 자동화

### 개발 도구
- **IDE**: VS Code, Cursor
- **Git GUI**: GitKraken, SourceTree
- **API 테스트**: Postman, Insomnia
- **DB 관리**: TablePlus, DBeaver

### 자동화 설정

#### GitHub Actions
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm test
      - run: npm run lint
```

#### Pre-commit Hooks
```bash
# .husky/pre-commit
npm run lint
npm test
```

## 📚 문서화 규칙

### 문서 종류
1. **README**: 프로젝트 개요
2. **CONTRIBUTING**: 기여 가이드
3. **API Docs**: API 명세
4. **Wiki**: 상세 문서
5. **Comments**: 코드 주석

### 문서 작성 원칙
- 명확하고 간결하게
- 예제 코드 포함
- 스크린샷 활용
- 정기적 업데이트
- 버전 관리

## 🚨 이슈 대응

### 버그 대응 프로세스
```
버그 발견
    ↓
Issue 생성 (P0-Critical 라벨)
    ↓
담당자 지정
    ↓
원인 분석
    ↓
수정 및 테스트
    ↓
Hotfix 배포
    ↓
사후 분석
```

### 장애 대응 매뉴얼
1. **감지**: 모니터링 알람
2. **분석**: 로그 확인
3. **대응**: 임시 조치
4. **복구**: 서비스 정상화
5. **보고**: 장애 보고서 작성

## 🎓 지식 공유

### 정기 세션
- **Tech Talk**: 매주 금요일
- **Code Review**: 매일 오후
- **Pair Programming**: 필요시

### 문서 공유
- Wiki 업데이트
- 블로그 포스팅
- 내부 가이드 작성

## 🔐 보안 프로세스

### 보안 체크리스트
- [ ] 민감 정보 제거
- [ ] 환경변수 사용
- [ ] SQL Injection 방지
- [ ] XSS 방지
- [ ] 인증/인가 검증

### 보안 도구
- GitHub Security Alerts
- Dependabot
- SonarQube
- OWASP ZAP

---
*팀 프로세스는 지속적으로 개선됩니다.*