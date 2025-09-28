# 5️⃣ Figma 동기화 실행하기

## 기본 동기화 실행

```bash
# packages/figma-sync 디렉토리에서
npm run sync
```

## CLI 옵션 사용하기

### 1. 특정 파일 동기화
```bash
npx figma-sync sync -f ABC123xyz789
```

### 2. 특정 노드만 동기화
```bash
# 여러 노드 ID 지정
npx figma-sync sync -f ABC123xyz789 -n 0:1 123:456 789:012
```

### 3. 다른 GitHub 브랜치에 푸시
```bash
npx figma-sync sync -b feature/new-design
```

### 4. 모든 옵션 조합
```bash
npx figma-sync sync \
  -f ABC123xyz789 \
  -n 0:1 123:456 \
  -o your-username \
  -r calligraphy-coach-v2 \
  -b develop
```

## 실행 결과 확인

성공시 출력 예시:
```
🚀 Starting Figma to GitHub sync...
📐 Fetching Figma file...
✅ Fetched Figma file: Calligraphy Coach Design
🎨 Fetching Figma nodes...
📤 Pushing to GitHub: src/components/figma/ButtonPrimary.tsx
✅ Successfully pushed src/components/figma/ButtonPrimary.tsx
📤 Pushing to GitHub: src/components/figma/CardHeader.tsx
✅ Successfully pushed src/components/figma/CardHeader.tsx
🎉 Sync completed successfully!
```
