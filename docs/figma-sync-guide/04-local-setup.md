# 4️⃣ 로컬 환경 설정하기

## 1. 프로젝트로 이동
```bash
cd /Users/m4_macbook/Projects/calligraphy-coach-v2
```

## 2. Figma Sync 패키지로 이동
```bash
cd packages/figma-sync
```

## 3. 환경 변수 파일 생성
```bash
# .env.example을 복사하여 .env 파일 생성
cp .env.example .env
```

## 4. .env 파일 편집
```bash
# VS Code로 열기
code .env

# 또는 nano 사용
nano .env
```

## 5. 토큰 정보 입력
```env
# Figma Configuration
FIGMA_ACCESS_TOKEN=figd_여기에_피그마_토큰_입력
FIGMA_FILE_KEY=여기에_파일_키_입력

# GitHub Configuration  
GITHUB_TOKEN=ghp_여기에_깃허브_토큰_입력
GITHUB_OWNER=your-github-username
GITHUB_REPO=calligraphy-coach-v2

# Optional
GITHUB_BRANCH=main
```

## 6. 의존성 설치
```bash
npm install
```

## 7. 빌드
```bash
npm run build
```
