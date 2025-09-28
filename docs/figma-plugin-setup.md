# 🚀 Figma 플러그인 설치 가이드

## 1️⃣ Figma Desktop 앱에서 플러그인 개발 모드 활성화

1. **Figma Desktop 앱 열기**
2. **메뉴 → Plugins → Development → New Plugin...**
3. **플러그인 타입 선택**: "Figma design + FigJam"
4. **플러그인 이름**: "Calligraphy Coach MCP Bridge"

## 2️⃣ 플러그인 파일 연결

1. **manifest.json 경로 선택**:
   ```
   /Users/m4_macbook/Projects/calligraphy-coach-v2/figma-plugin/manifest.json
   ```

2. **"Open plugin" 클릭**

## 3️⃣ 플러그인 실행

1. 디자인 파일에서: **Plugins → Development → Calligraphy Coach MCP Bridge**
2. 플러그인 UI가 열리면 성공!

## 4️⃣ MCP 서버 실행

터미널에서:
```bash
cd /Users/m4_macbook/Projects/calligraphy-coach-v2/packages/figma-mcp-server
npm install
npm run build
npm start
```

## 5️⃣ Claude Desktop 설정

Claude Desktop의 설정 파일에 추가:
```json
{
  "mcpServers": {
    "figma-design": {
      "command": "node",
      "args": ["/Users/m4_macbook/Projects/calligraphy-coach-v2/packages/figma-mcp-server/dist/index.js"]
    }
  }
}
```

## 📝 사용 예시

Claude에게:
- "Figma에 파란색 버튼 만들어줘"
- "제목이 '서예 연습'인 카드 생성해줘"
- "48px 크기의 제목 텍스트 추가해줘"

## ✅ 연결 확인

1. 플러그인 UI에서 "✅ MCP 서버 연결됨" 표시
2. http://localhost:3001/status 에서 연결 상태 확인
