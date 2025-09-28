# 3️⃣ Figma File Key 찾기

## Figma 파일 URL 구조 이해하기

Figma URL은 다음과 같은 형식입니다:
```
https://www.figma.com/file/[FILE_KEY]/[FILE_NAME]?node-id=[NODE_ID]
```

## File Key 추출하기

1. **Figma에서 디자인 파일 열기**
   - 동기화하려는 Figma 파일 열기
   - 브라우저 주소창 확인

2. **URL에서 File Key 찾기**
   ```
   예시 URL:
   https://www.figma.com/file/ABC123xyz789/Calligraphy-Coach-Design?node-id=0%3A1
   
   File Key: ABC123xyz789
   ```

3. **Node ID 찾기 (선택사항)**
   - 특정 컴포넌트만 동기화하려는 경우
   - 컴포넌트 선택 → 우클릭 → "Copy link to selection"
   - URL의 node-id 부분 확인 (예: 0:1, 123:456)

## 팁
- File Key는 변하지 않으므로 한 번만 찾으면 됨
- Node ID는 컴포넌트별로 다름
- 전체 파일 동기화시 Node ID는 불필요
