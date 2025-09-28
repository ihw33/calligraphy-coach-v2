# MCP (Model Context Protocol) 기능 설명

## MCP란?
AI 모델이 외부 시스템과 통신할 수 있게 해주는 표준 프로토콜입니다.

## 핵심 기능

### 1. 🤖 Claude와 직접 대화로 작업 수행
```
사용자: "Figma의 Button 디자인을 코드로 변환해줘"
Claude: [MCP를 통해 자동으로 Figma API 호출 → 코드 생성 → GitHub 푸시]
```

### 2. 🔄 자동화된 워크플로우
- Figma 변경 감지 → 자동 코드 생성 → PR 생성
- 코드 리뷰 → 디자인 시스템 업데이트
- 컴포넌트 문서 자동 생성

### 3. 🛠 도구 통합
MCP를 통해 Claude가 직접 사용할 수 있는 도구들:
- Figma API (디자인 읽기/쓰기)
- GitHub API (코드 푸시/PR 생성)
- 파일 시스템 (로컬 파일 조작)
- 데이터베이스 (정보 저장/조회)

## 실제 사용 예시

### 예시 1: 디자인 → 코드 변환
```
사용자: "Figma의 로그인 화면을 React 컴포넌트로 만들어줘"

Claude (MCP 사용):
1. Figma API로 디자인 데이터 가져오기
2. 디자인 분석 및 코드 생성
3. 테스트 코드 작성
4. GitHub에 PR 생성
```

### 예시 2: 디자인 시스템 관리
```
사용자: "디자인 토큰이 변경되었는지 확인하고 업데이트해줘"

Claude (MCP 사용):
1. Figma의 모든 컬러/타이포그래피 스타일 조회
2. 현재 코드베이스와 비교
3. 변경사항 발견시 자동 업데이트
4. 변경 로그 생성
```

### 예시 3: 컴포넌트 문서화
```
사용자: "새로 만든 컴포넌트들의 문서를 생성해줘"

Claude (MCP 사용):
1. Figma에서 컴포넌트 설명 읽기
2. Props와 사용법 분석
3. Storybook 스토리 생성
4. README 자동 작성
```

## Claude Code에서 사용하기

### 설정 방법
1. MCP 서버 실행
2. Claude Desktop/CLI 설정에 MCP 서버 추가
3. Claude와 대화로 작업 지시

### 설정 파일 예시 (claude_desktop_config.json)
```json
{
  "mcpServers": {
    "figma-github": {
      "command": "node",
      "args": ["/path/to/mcp-server/dist/index.js"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "your-token",
        "GITHUB_TOKEN": "your-token"
      }
    }
  }
}
```

## MCP vs 일반 API 비교

### 일반 API 방식 (현재 구현한 것)
```bash
# 수동으로 명령어 실행
npm run sync
```

### MCP 방식
```
사용자: "Figma 디자인 업데이트해줘"
Claude: "네, 지금 바로 동기화하겠습니다" [자동 실행]
```

## 장점

1. **자연어로 작업 지시**
   - 복잡한 CLI 명령어 불필요
   - "버튼 색상만 업데이트해줘" 같은 구체적 요청 가능

2. **지능적인 처리**
   - 변경사항만 선택적 업데이트
   - 충돌 자동 해결
   - 최적화된 코드 생성

3. **통합된 워크플로우**
   - Figma → 코드 → 테스트 → 배포까지 한번에
   - 여러 도구를 오가지 않아도 됨

## 한계

- MCP 서버가 실행중이어야 함
- Claude Desktop 또는 CLI가 필요
- 초기 설정이 필요함

## 결론

**네, Claude Code에서 피그마 디자인 작업을 시킬 수 있습니다!**

하지만 현재는:
1. 기본 동기화 도구 구현 ✅ (완료)
2. MCP 서버 구현 🚧 (준비됨, 연결 필요)
3. Claude Desktop 설정 📝 (사용자가 해야 함)

원하시면 MCP 서버를 완성해서 Claude와 대화만으로 Figma 작업을 할 수 있게 만들어드릴 수 있습니다!
