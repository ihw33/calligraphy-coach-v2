# 2️⃣ GitHub Personal Access Token 발급하기

1. **GitHub 설정 페이지 접속**
   - GitHub 로그인
   - 프로필 사진 클릭 → Settings

2. **Developer Settings 이동**
   - 좌측 메뉴 맨 아래 "Developer settings" 클릭
   - "Personal access tokens" → "Tokens (classic)" 선택

3. **새 토큰 생성**
   - "Generate new token" → "Generate new token (classic)" 클릭
   - Note: "Calligraphy Coach Figma Sync" (토큰 용도 설명)
   - Expiration: 90 days (또는 원하는 기간)

4. **권한 선택**
   필수 권한:
   - ✅ **repo** (전체 선택) - 레포지토리 읽기/쓰기
   - ✅ **workflow** - GitHub Actions 실행
   
   선택사항:
   - ✅ **write:packages** - 패키지 배포시 필요
   - ✅ **delete_repo** - 레포 삭제 권한 (주의!)

5. **토큰 생성 및 복사**
   - "Generate token" 클릭
   - 생성된 토큰 복사 (ghp_로 시작하는 문자열)
   - ⚠️ 중요: 이 페이지를 벗어나면 다시 볼 수 없음!
