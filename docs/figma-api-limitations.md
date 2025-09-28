# Figma API 가능/불가능 작업 정리

## 🟢 현재 가능한 작업들

### 1. 읽기 작업
```javascript
// ✅ 파일 정보 가져오기
GET /v1/files/{fileKey}

// ✅ 특정 노드 정보
GET /v1/files/{fileKey}/nodes

// ✅ 이미지 내보내기
GET /v1/images/{fileKey}

// ✅ 컴포넌트 목록
GET /v1/files/{fileKey}/components
```

### 2. 자동화 가능한 것들
- Figma 변경 감지 → 코드 업데이트
- 디자인 토큰 추출 → CSS 변수
- 컴포넌트 문서 자동 생성
- 스크린샷 자동 캡처

## 🔴 불가능한 작업들

### 1. 쓰기 작업
```javascript
// ❌ 컴포넌트 생성
POST /v1/files/{fileKey}/components

// ❌ 디자인 수정
PUT /v1/files/{fileKey}/nodes

// ❌ 새 페이지 추가
POST /v1/files/{fileKey}/pages
```

### 2. 실시간 편집
- 여기서 디자인 수정 → Figma 반영 ❌
- 양방향 동기화 ❌
- 실시간 협업 ❌

## 🛠 대안 방법들

### 1. Figma 플러그인 개발
```typescript
// Figma 플러그인 내에서는 가능
figma.createRectangle()
figma.currentPage.appendChild(rect)
```

### 2. 단방향 워크플로우
```
Figma (디자인) → API (읽기) → Code (생성) → GitHub (저장)
     ↑                                              ↓
     └──────── 수동으로 업데이트 ←──────────────────┘
```

### 3. 디자인 시스템 관리
```
1. Figma: 마스터 디자인 소스
2. Code: Figma 기반 자동 생성
3. Storybook: 코드 기반 문서화
4. 변경시: Figma 수정 → 코드 재생성
```
