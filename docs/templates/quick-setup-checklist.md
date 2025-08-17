# AI 모바일 프로젝트 - Quick Setup Checklist

## 🚀 30분 프로젝트 설정 체크리스트

### ✅ Phase 1: 로컬 설정 (10분)
```bash
# 1. 프로젝트 생성
mkdir ~/[project-name]-v2 && cd $_

# 2. 구조 생성
mkdir -p {apps/{mobile,web},services/{api,ai,realtime},packages/{shared,ui}}
mkdir -p {infrastructure/{docker,scripts},docs/{planning,architecture,guides,sessions,retrospectives,templates}}
mkdir -p {.github/{workflows,ISSUE_TEMPLATE},archive/{planning,test-results,ai-research}}

# 3. 기본 파일
touch README.md .gitignore package.json PROJECT_STRUCTURE.md
touch docs/sessions/{project-context.yaml,session-01-handover.md}
touch .github/ISSUE_TEMPLATE/{task-issue.md,bug-report.md,retrospective.md}
```

### ✅ Phase 2: 필수 파일 내용 (10분)

#### `.gitignore`
```
node_modules/
*.pyc
.env
.DS_Store
build/
dist/
*.log
venv/
__pycache__/
.pytest_cache/
coverage/
*.tmp
```

#### `package.json`
```json
{
  "name": "[project-name]-v2",
  "version": "2.0.0",
  "private": true,
  "workspaces": ["apps/*", "packages/*", "services/*"],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test"
  }
}
```

#### `README.md`
```markdown
# [Project Name] - AI 기반 모바일 서비스

## 프로젝트 개요
[설명]

## 팀 구성
- PM: Claude Code
- Backend/AI: Gemini CLI
- Mobile: Claude CLI
- Design/QA: Cursor CLI
- Infra: Codex CLI

## 기술 스택
- Frontend: React Native
- Backend: FastAPI
- AI: Ollama + [Model]
```

### ✅ Phase 3: GitHub 설정 (10분)

#### 1. 저장소 생성
```bash
# Git 초기화
git init && git branch -m main
git add . && git commit -m "Initial commit"

# GitHub 연결
git remote add origin https://github.com/[username]/[project]-v2.git
git push -u origin main
```

#### 2. GitHub 웹 설정
- [ ] Settings → Features → 모두 활성화
- [ ] Settings → Branches → Protection rule for 'main'
- [ ] Projects → New project → "Development Board"
- [ ] Issues → Labels → 우선순위/팀/타입 라벨
- [ ] Issues → Milestones → R1-R4 생성

#### 3. 첫 Issues 생성
```
#1 [R1] 인프라 구축 - @codex-cli
#2 [R1] Backend 초기화 - @gemini-cli  
#3 [R1] Mobile 앱 생성 - @claude-cli
#4 [R1] 디자인 시스템 - @cursor-cli
#5 [R1] PM 대시보드 - @pm
```

### ✅ 세션 문서 템플릿

#### `docs/sessions/project-context.yaml`
```yaml
project:
  name: [Project Name]
  github: https://github.com/[username]/[project]-v2
  local: ~/[project-name]-v2
  
team:
  pm: Claude Code
  backend: Gemini CLI
  mobile: Claude CLI
  design: Cursor CLI
  infra: Codex CLI
  
tech:
  frontend: React Native
  backend: FastAPI
  ai: Ollama + [Model]
  
current:
  milestone: R1-Foundation
  round: 1
  session: 01
```

#### `docs/sessions/session-01-handover.md`
```markdown
# Session 01 Handover

## 현재 상태
- GitHub 설정: ✅
- Issue 생성: ✅
- 팀 할당: ⏳

## 다음 작업
1. CLI 작업 시작
2. 개발 환경 구축
3. 첫 회고 준비

## 참조
- GitHub: [URL]
- Local: ~/[project]-v2
```

### ✅ Claude Project 설정
```markdown
프로젝트: [Project Name]
역할: PM
GitHub: [URL]
경로: ~/[project]-v2
팀: 4 AI CLIs
세션: docs/sessions/
현재: Round 1
```

### ✅ 팀 시작 명령어
```bash
# 각 CLI에게 전달
git clone [github-url]
cd [project]-v2
git checkout -b develop

# Backend (Gemini)
cd services/api && python -m venv venv

# Mobile (Claude)  
cd apps/mobile && npm init

# Design (Cursor)
npm install -D storybook

# Infra (Codex)
docker-compose up -d
```

## 🎯 Success Criteria
- [ ] GitHub 저장소 활성화
- [ ] 5개 Issue 생성
- [ ] Project Board 연결
- [ ] 세션 문서 완성
- [ ] 팀 작업 시작

---
⏱️ Total Time: ~30 minutes