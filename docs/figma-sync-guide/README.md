# 📚 Figma-GitHub 동기화 전체 가이드

이 디렉토리에는 Figma와 GitHub를 연동하는 방법에 대한 상세 가이드가 포함되어 있습니다.

## 📖 가이드 목차

1. **[Figma Token 발급](./01-figma-token.md)**
   - Figma Personal Access Token 생성 방법
   
2. **[GitHub Token 발급](./02-github-token.md)**
   - GitHub Personal Access Token 생성 및 권한 설정

3. **[Figma File Key 찾기](./03-figma-file-key.md)**
   - Figma URL에서 File Key와 Node ID 추출하기

4. **[로컬 환경 설정](./04-local-setup.md)**
   - 프로젝트 설정 및 환경 변수 구성

5. **[동기화 실행](./05-run-sync.md)**
   - CLI 명령어와 옵션 사용법

6. **[GitHub Actions 설정](./06-github-actions.md)**
   - 자동화 워크플로우 구성

7. **[컴포넌트 사용](./07-use-components.md)**
   - 생성된 React 컴포넌트 활용 방법

8. **[문제 해결](./08-troubleshooting.md)**
   - 자주 발생하는 오류와 해결 방법

## 🚀 빠른 시작

```bash
# 1. 패키지로 이동
cd packages/figma-sync

# 2. 환경 설정
cp .env.example .env
# .env 파일에 토큰 정보 입력

# 3. 설치 및 빌드
npm install
npm run build

# 4. 동기화 실행
npm run sync
```

## 💡 주요 기능

- ✅ Figma 디자인을 React 컴포넌트로 자동 변환
- ✅ GitHub에 자동 커밋 및 PR 생성
- ✅ GitHub Actions를 통한 자동화
- ✅ 선택적 노드 동기화
- ✅ 다양한 스타일 속성 지원

## 🛠 고급 사용법

### 특정 컴포넌트만 동기화
```bash
npx figma-sync sync -f FILE_KEY -n NODE_ID1 NODE_ID2
```

### 커스텀 변환 규칙 추가
`packages/figma-sync/src/index.ts`의 `convertFigmaStyleToCSS` 메서드 수정

### MCP 서버 통합
AI 모델과의 통합을 위한 MCP 서버 활용

## 📞 지원

문제가 발생하거나 추가 기능이 필요한 경우:
- GitHub Issues 생성
- 프로젝트 Wiki 참조
- 팀 Slack 채널에 문의

---

Happy Designing! 🎨✨
