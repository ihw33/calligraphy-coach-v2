# 세션 관리 가이드

## 🔄 세션 전환 프로토콜

### 1. **세션 종료 시**
```markdown
1. session-XX-handover.md 파일 업데이트
2. 현재 진행 상황 기록
3. 미완료 작업 명시
4. 다음 우선순위 정리
```

### 2. **새 세션 시작 시**
```markdown
1. "Calligraphy Coach-XX 세션으로 이어서 진행" 언급
2. 이전 handover 문서 확인
3. GitHub Issues 최신 상태 확인
4. 중단된 작업부터 재개
```

## 📁 세션 문서 구조
```
docs/sessions/
├── session-01-handover.md    # 첫 번째 세션
├── session-02-handover.md    # 두 번째 세션
├── session-03-handover.md    # 세 번째 세션
└── session-summary.md        # 전체 요약

```

## 📝 Handover 문서 템플릿
```markdown
# Session Continuity Document

## 📍 현재 세션 정보
- 세션 ID: Calligraphy Coach-XX
- 기간: YYYY-MM-DD ~ YYYY-MM-DD
- 주요 성과: 

## 🚦 작업 현황
### 완료된 작업
- ✅ 

### 진행 중인 작업
- 🔄 

### 대기 중인 작업
- ⏸️ 

## 💡 중요 이슈/결정사항
- 

## 🔗 참조 링크
- GitHub Issues: 
- 관련 PR: 
- 문서: 

## 📋 다음 세션 우선순위
1. 
2. 
3. 
```

## 🎯 세션 간 일관성 유지 방법

### 1. **프로젝트 컨텍스트 파일**
```yaml
project-context.yml:
  name: Calligraphy Coach v2
  github: https://github.com/ihw33/calligraphy-coach-v2
  tech_stack:
    - React Native
    - FastAPI
    - Ollama/Mixtral
  current_phase: R1-Foundation
```

### 2. **진행 상황 추적**
```markdown
progress-tracker.md:
  - 회차별 완료율
  - Issue 상태
  - 블로커 목록
  - 의사결정 로그
```

### 3. **팀 상태 스냅샷**
```markdown
team-status.md:
  - 각 CLI 현재 작업
  - 마지막 보고 시간
  - 대기 중인 피드백
  - 필요한 지원사항
```

## 💾 자동 백업 전략

### GitHub에 정기적 푸시
```bash
# 세션 종료 시 실행
git add docs/sessions/
git commit -m "docs: Update session handover document"
git push origin main
```

### 로컬 백업
```bash
# Time Machine 또는 수동 백업
cp -r /Users/m4_macbook/calligraphy-coach-v2 ~/Desktop/backup/
```

## 🔍 빠른 상태 확인 명령어

### 프로젝트 상태
```bash
# Git 상태
git status
git log --oneline -10

# Issue 상태 (GitHub CLI 필요)
gh issue list --limit 10

# 파일 구조
tree -L 2
```

### 세션 문서 확인
```bash
cat docs/sessions/session-*-handover.md | grep "진행 중"
```

## 📌 필수 정보 Quick Reference

```yaml
GitHub: https://github.com/ihw33/calligraphy-coach-v2
Local: /Users/m4_macbook/calligraphy-coach-v2
Session: Calligraphy Coach-XX
Teams:
  - Gemini CLI (Backend/AI)
  - Claude CLI (Mobile)
  - Cursor CLI (Design/QA)
  - Codex CLI (Infra)
Current Sprint: R1 (Round 1-5)
```

이 가이드를 참조하여 세션 간 연속성을 유지하세요!