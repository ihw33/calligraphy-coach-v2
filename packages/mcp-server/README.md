# Calligraphy Coach MCP Server

Claude와 Figma/GitHub를 연결하여 UI/UX 작업을 자동화하는 MCP(Model Context Protocol) 서버입니다.

## 🚀 기능

### Figma 통합
- Figma 디자인 데이터 읽기
- 색상/텍스트 스타일 추출
- 디자인을 React Native 컴포넌트로 변환

### GitHub 통합
- 자동 브랜치 생성
- 파일 커밋 및 푸시
- Pull Request 자동 생성

### 파일 시스템
- 프로젝트 파일 읽기/쓰기
- React Native 컴포넌트 템플릿 생성
- TypeScript 타입 정의 생성

## 📦 설치 및 설정

### 1. 의존성 설치
```bash
cd packages/mcp-server
npm install
```

### 2. 환경 변수 설정
```bash
# .env 파일 생성
cp .env.example .env

# 토큰 설정
FIGMA_ACCESS_TOKEN=figd_your_token_here
GITHUB_TOKEN=ghp_your_token_here
DEFAULT_FIGMA_FILE_KEY=your_figma_file_key_here
```

### 3. 빌드
```bash
npm run build
```

## 🔧 Claude Desktop 설정

Claude Desktop의 설정 파일에 MCP 서버를 추가하세요:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "calligraphy-coach": {
      "command": "node",
      "args": ["/path/to/calligraphy-coach-v2/packages/mcp-server/dist/index.js"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "figd_your_token_here",
        "GITHUB_TOKEN": "ghp_your_token_here",
        "DEFAULT_FIGMA_FILE_KEY": "your_figma_file_key_here"
      }
    }
  }
}
```

## 🎨 사용 예시

### Figma 디자인을 React Native로 변환
```
사용자: "Figma의 HomeScreen 디자인을 React Native 컴포넌트로 변환해줘"

Claude: [MCP를 통해 자동으로]
1. Figma에서 HomeScreen 디자인 데이터 가져오기
2. React Native 컴포넌트 코드 생성
3. apps/mobile/src/screens/HomeScreen.tsx 파일 생성
4. GitHub에 브랜치 생성 및 커밋
5. Pull Request 생성
```

### 디자인 토큰 동기화
```
사용자: "Figma의 색상 스타일이 변경되었는지 확인하고 코드에 반영해줘"

Claude: [MCP를 통해 자동으로]
1. Figma 색상 스타일 조회
2. packages/ui/src/tokens/colors.ts와 비교
3. 변경사항 발견시 파일 업데이트
4. 영향받는 컴포넌트 확인 및 수정
5. 변경 로그와 함께 PR 생성
```

## 🛠 개발

### 개발 모드 실행
```bash
npm run dev
```

### 로그 확인
MCP 서버는 stderr로 로그를 출력합니다:
```bash
node dist/index.js 2> server.log
```

## 📋 지원하는 도구들

### Figma 도구
- `figma_get_file`: Figma 파일 데이터 가져오기
- `figma_get_styles`: 색상/텍스트 스타일 가져오기
- `figma_create_component`: 컴포넌트 생성 (분석)

### GitHub 도구
- `github_create_pr`: Pull Request 생성
- `github_commit_files`: 파일 커밋
- `github_create_branch`: 브랜치 생성

### 파일 시스템 도구
- `fs_read_file`: 파일 읽기
- `fs_write_file`: 파일 쓰기
- `convert_figma_to_react_native`: Figma → RN 변환

## 🔒 보안

- API 토큰은 환경 변수로만 관리
- GitHub 토큰은 필요한 최소 권한만 부여 (`repo`, `workflow`)
- Figma 토큰은 읽기 전용으로 사용

## 🐛 문제 해결

### 자주 발생하는 오류

1. **FIGMA_ACCESS_TOKEN 오류**
   - Figma 설정에서 Personal Access Token 생성 확인
   - 토큰이 올바르게 환경 변수에 설정되었는지 확인

2. **GitHub 권한 오류**
   - GitHub 토큰에 `repo`, `workflow` 권한이 있는지 확인
   - 레포지토리에 대한 쓰기 권한이 있는지 확인

3. **파일 경로 오류**
   - 프로젝트 루트에서 MCP 서버가 실행되고 있는지 확인
   - 상대 경로가 올바른지 확인

## 📄 라이선스

MIT License
