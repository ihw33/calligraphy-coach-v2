# 6️⃣ GitHub Actions로 자동화하기

## GitHub Secrets 설정

1. **레포지토리 Settings 접속**
   - https://github.com/your-username/calligraphy-coach-v2/settings
   - "Secrets and variables" → "Actions" 클릭

2. **New repository secret 추가**
   
   ### FIGMA_ACCESS_TOKEN
   - Name: `FIGMA_ACCESS_TOKEN`
   - Value: `figd_여기에_피그마_토큰`
   - "Add secret" 클릭
   
   ### DEFAULT_FIGMA_FILE_KEY
   - Name: `DEFAULT_FIGMA_FILE_KEY`
   - Value: `ABC123xyz789` (기본 Figma 파일 키)
   - "Add secret" 클릭

## GitHub Actions 사용법

### 1. 수동 실행
1. GitHub 레포지토리 → Actions 탭
2. "Figma Design Sync" 워크플로우 선택
3. "Run workflow" 버튼 클릭
4. 필요시 파라미터 입력:
   - `figma_file_key`: 특정 파일 키 (선택사항)
   - `node_ids`: 노드 ID들 (쉼표로 구분)
5. "Run workflow" 실행

### 2. 자동 실행 (스케줄)
- 매일 자정(UTC)에 자동 실행됨
- `.github/workflows/figma-sync.yml`에서 시간 변경 가능:
  ```yaml
  schedule:
    - cron: '0 9 * * *'  # 매일 오전 9시(UTC)
  ```
### 3. PR 라벨로 실행
1. Pull Request에 `figma-sync` 라벨 추가
2. 자동으로 동기화 시작됨

## 생성되는 PR 확인

Actions가 성공하면 자동으로 PR이 생성됩니다:

- **제목**: 🎨 Update components from Figma
- **브랜치**: figma-sync/update-{번호}
- **내용**: 동기화된 컴포넌트 목록

PR 내용 예시:
```markdown
## Figma Design Sync

This PR contains the latest design updates from Figma.

- **File Key**: ABC123xyz789
- **Synced at**: 2024-01-15 09:00:00

### Changes
- Updated React components based on Figma designs
- Synchronized styling and layout

Please review the changes before merging.
```

## 워크플로우 커스터마이징

`.github/workflows/figma-sync.yml` 파일을 수정하여:

- 실행 시간 변경
- 추가 파라미터 설정
- 알림 설정 추가
- 테스트 자동 실행
