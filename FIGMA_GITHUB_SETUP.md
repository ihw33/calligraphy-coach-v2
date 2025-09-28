# Figma-GitHub 통합 설정 가이드

## 🚀 빠른 시작

### 1. 필수 토큰 발급

#### Figma Personal Access Token
1. https://www.figma.com/settings 접속
2. "Personal Access Tokens" 섹션
3. "Create new token" 클릭
4. 토큰 복사 (figd_로 시작)

#### GitHub Personal Access Token  
1. GitHub Settings > Developer settings > Personal access tokens
2. "Generate new token (classic)"
3. 권한 선택: `repo`, `workflow`
4. 토큰 복사 (ghp_로 시작)

### 2. GitHub Secrets 설정

레포지토리 Settings > Secrets and variables > Actions:
- `FIGMA_ACCESS_TOKEN`: Figma 토큰
- `DEFAULT_FIGMA_FILE_KEY`: 기본 Figma 파일 키

### 3. 로컬 개발 환경

```bash
# 패키지 이동
cd packages/figma-sync

# 환경 변수 설정
cp .env.example .env
# .env 파일에 토큰 정보 입력

# 의존성 설치
npm install

# 빌드
npm run build

# 동기화 실행
npm run sync
```

## 📋 사용 방법

### GitHub Actions를 통한 동기화

1. **수동 실행**: Actions 탭 > Figma Design Sync > Run workflow
2. **자동 실행**: 매일 자정 (UTC)
3. **PR 라벨**: `figma-sync` 라벨 추가시 자동 실행

### CLI 명령어

```bash
# 기본 동기화
npm run sync

# 특정 노드만 동기화
npm run sync -- --nodes NODE_ID1 NODE_ID2

# 다른 브랜치 사용
npm run sync -- --branch feature/new-design
```

## 🎨 Figma 파일 구조 권장사항

1. **컴포넌트 네이밍**
   - PascalCase 사용: `ButtonPrimary`, `CardHeader`
   - 특수문자 제거 (자동 처리됨)

2. **레이어 구조**
   - 컴포넌트는 최상위 프레임으로
   - Auto Layout 사용 권장
   - 명확한 계층 구조 유지

3. **스타일 가이드**
   - Color Styles 정의
   - Text Styles 사용
   - Effect Styles 활용

## 🔧 고급 설정

### 커스텀 변환 규칙 추가

`packages/figma-sync/src/index.ts`에서 수정:

```typescript
// 새로운 Figma 속성 추가
convertFigmaStyleToCSS(node: any): string {
  // ... 기존 코드
  
  // 그림자 효과 추가
  if (node.effects) {
    const shadows = node.effects
      .filter(e => e.type === 'DROP_SHADOW')
      .map(e => `${e.offset.x}px ${e.offset.y}px ${e.radius}px ${e.color}`);
    
    if (shadows.length > 0) {
      styles.boxShadow = shadows.join(', ');
    }
  }
}
```

### MCP 서버 통합

MCP (Model Context Protocol)를 사용한 고급 통합:

```typescript
// packages/mcp-server/src/tools/figma-sync.ts
export const figmaSyncTool = {
  name: 'sync_figma_design',
  description: 'Sync Figma design to codebase',
  parameters: {
    fileKey: { type: 'string', required: true },
    nodeIds: { type: 'array', items: { type: 'string' } },
    targetPath: { type: 'string', default: 'src/components/figma' }
  },
  execute: async (params) => {
    // 동기화 로직
  }
};
```

## 📊 모니터링 및 디버깅

### 로그 확인
```bash
# GitHub Actions 로그
# Actions 탭에서 실행 기록 확인

# 로컬 디버깅
DEBUG=figma-sync npm run sync
```

### 일반적인 문제 해결

1. **401 오류**: 토큰 만료 또는 권한 부족
2. **404 오류**: 잘못된 파일 키 또는 노드 ID
3. **422 오류**: GitHub API 제한 또는 잘못된 파일 경로

## 🎯 베스트 프랙티스

1. **버전 관리**
   - Figma 파일에 버전 태그 사용
   - 주요 변경사항은 별도 브랜치로

2. **코드 리뷰**
   - 자동 생성된 PR은 항상 리뷰
   - 수동 수정이 필요한 부분 체크

3. **성능 최적화**
   - 대용량 파일은 부분 동기화 사용
   - 불필요한 노드는 제외

4. **보안**
   - 토큰은 절대 코드에 하드코딩 금지
   - .env 파일은 .gitignore에 추가

## 📚 추가 리소스

- [Figma API 문서](https://www.figma.com/developers/api)
- [GitHub API 문서](https://docs.github.com/en/rest)
- [MCP 프로토콜 가이드](https://modelcontextprotocol.io)

---

문제가 발생하거나 추가 기능이 필요한 경우 이슈를 생성해주세요.
