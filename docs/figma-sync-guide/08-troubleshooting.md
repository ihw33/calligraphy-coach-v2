# 8️⃣ 문제 해결 가이드

## 자주 발생하는 오류와 해결방법

### 1. 401 Unauthorized 오류
```
❌ Error fetching Figma file: 401 Unauthorized
```
**원인**: Figma 토큰이 잘못되었거나 만료됨
**해결**:
- Figma 토큰이 올바른지 확인
- 토큰에 오타가 없는지 확인
- 새 토큰 발급 후 재시도

### 2. 404 Not Found 오류
```
❌ Error fetching Figma file: 404 Not Found
```
**원인**: File Key가 잘못됨
**해결**:
- Figma URL에서 File Key 다시 확인
- 파일 접근 권한 확인

### 3. GitHub Push 실패
```
❌ Error pushing: 422 Unprocessable Entity
```
**원인**: GitHub 토큰 권한 부족 또는 브랜치 보호
**해결**:
- GitHub 토큰에 `repo` 권한 있는지 확인
- 브랜치 보호 규칙 확인
- 레포지토리 이름과 소유자 확인

### 4. Rate Limit 오류
```
❌ Error: API rate limit exceeded
```
**원인**: API 호출 한도 초과
**해결**:
- 잠시 후 재시도
- 동기화 빈도 줄이기
### 5. 빌드 오류
```
Error: Cannot find module '@figma/rest-api-spec'
```
**해결**:
```bash
# 의존성 다시 설치
rm -rf node_modules
npm install
```

### 6. 환경 변수 오류
```
❌ Missing required environment variables
```
**해결**:
```bash
# .env 파일 확인
cat .env

# 환경 변수 로드 확인
node -e "require('dotenv').config(); console.log(process.env)"
```

## 디버깅 팁

### 1. 상세 로그 보기
```bash
# DEBUG 모드로 실행
DEBUG=* npm run sync
```

### 2. 특정 단계만 테스트
```javascript
// test-figma.js 파일 생성
const FigmaGitHubSync = require('./dist/index').default;

const sync = new FigmaGitHubSync(
  { token: process.env.FIGMA_ACCESS_TOKEN, fileKey: 'YOUR_KEY' },
  { token: process.env.GITHUB_TOKEN, owner: 'YOUR_NAME', repo: 'YOUR_REPO', branch: 'main' }
);

// Figma 파일만 테스트
sync.getFigmaFile().then(console.log).catch(console.error);
```

### 3. GitHub Actions 디버깅
- Actions 탭에서 실행 로그 확인
- "Re-run jobs" → "Re-run all jobs" with debug logging
