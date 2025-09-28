# Figma-GitHub 연동 가이드

이 패키지는 Figma 디자인을 GitHub 레포지토리와 자동으로 동기화하는 도구입니다.

## 설정 방법

### 1. Figma Access Token 발급

1. [Figma 계정 설정](https://www.figma.com/settings)으로 이동
2. "Personal Access Tokens" 섹션에서 새 토큰 생성
3. 토큰을 안전한 곳에 복사

### 2. GitHub Personal Access Token 발급

1. GitHub Settings > Developer settings > Personal access tokens
2. "Generate new token (classic)" 클릭
3. 필요한 권한 선택:
   - `repo` (전체 권한)
   - `workflow` (GitHub Actions 사용시)
4. 토큰 생성 및 복사

### 3. 환경 변수 설정

```bash
cd packages/figma-sync
cp .env.example .env
```

`.env` 파일을 열고 토큰 정보 입력:

```env
FIGMA_ACCESS_TOKEN=figd_xxxxxxxxxxxxx
FIGMA_FILE_KEY=ABC123def456  # Figma URL에서 추출
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
GITHUB_OWNER=your-username
GITHUB_REPO=calligraphy-coach-v2
```

### 4. 패키지 설치

```bash
npm install
npm run build
```

## 사용 방법

### 기본 동기화

```bash
npm run sync
```

### CLI 옵션 사용

```bash
# 특정 파일 동기화
npx figma-sync sync -f FILE_KEY

# 특정 노드만 동기화
npx figma-sync sync -f FILE_KEY -n NODE_ID1 NODE_ID2

# 다른 브랜치에 푸시
npx figma-sync sync -b feature/new-design
```

## Figma File Key 찾기

1. Figma에서 디자인 파일 열기
2. URL 확인: `https://www.figma.com/file/[FILE_KEY]/[FILE_NAME]`
3. FILE_KEY 부분이 필요한 값

## GitHub Actions 통합

`.github/workflows/figma-sync.yml`:

```yaml
name: Sync Figma to GitHub

on:
  schedule:
    - cron: '0 */6 * * *'  # 6시간마다 실행
  workflow_dispatch:  # 수동 실행 가능

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: npm run sync
        env:
          FIGMA_ACCESS_TOKEN: ${{ secrets.FIGMA_ACCESS_TOKEN }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## 문제 해결

### "401 Unauthorized" 오류
- Figma 또는 GitHub 토큰이 올바른지 확인
- 토큰의 권한이 충분한지 확인

### "404 Not Found" 오류
- File Key가 올바른지 확인
- GitHub 레포지토리 이름과 소유자가 맞는지 확인

### 동기화된 파일 위치
- 기본적으로 `src/components/figma/` 디렉토리에 생성
- 파일명은 Figma 노드 이름을 기반으로 자동 생성

## 개발 가이드

### 로컬 개발

```bash
npm run dev -- sync -f YOUR_FILE_KEY
```

### 새로운 변환 규칙 추가

`src/index.ts`의 `convertFigmaStyleToCSS` 메서드를 수정하여 
추가적인 Figma 속성을 CSS로 변환할 수 있습니다.

## 라이선스

MIT
