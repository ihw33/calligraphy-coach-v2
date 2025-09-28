# 📦 컴포넌트 마이그레이션 매핑

## ✅ 완료된 마이그레이션

### Auth (인증)
- `src/components/Landing.tsx` → `src/features/auth/components/Landing.tsx`
- `src/components/auth/SocialLogin.tsx` → `src/features/auth/components/SocialLogin.tsx`

### Course (코스)
- `src/components/CourseList.tsx` → `src/features/course/components/CourseList.tsx`
- `src/components/CourseDetail.tsx` → `src/features/course/components/CourseDetail.tsx`
- `src/components/CourseSelection.tsx` → `src/features/course/components/CourseSelection.tsx`
- `src/components/CourseInfoScreen.tsx` → `src/features/course/components/CourseInfoScreen.tsx`
- `src/components/CourseCurriculumScreen.tsx` → `src/features/course/components/CourseCurriculumScreen.tsx`
- `src/data/courses/` → `src/features/course/data/courses/`
- `src/types/course.ts` → `src/features/course/types/course.ts`
- `src/services/progressStorage.ts` → `src/features/course/services/progressStorage.ts`

### Practice (연습)
- `src/components/PracticeScreen.tsx` → `src/features/practice/components/PracticeScreen.tsx`
- `src/components/PracticeCanvas.tsx` → `src/features/practice/components/PracticeCanvas.tsx`
- `src/components/ResultScreen.tsx` → `src/features/practice/components/ResultScreen.tsx`
- `src/utils/evaluator.ts` → `src/features/practice/services/evaluator.ts`
- `src/utils/photoEvaluator.ts` → `src/features/practice/services/photoEvaluator.ts`
- `src/utils/panbonReference.ts` → `src/features/practice/services/panbonReference.ts`
- `src/services/aiEvaluator.ts` → `src/features/practice/services/aiEvaluator.ts`

### User (사용자)
- `src/components/Home.tsx` → `src/features/user/components/Home.tsx`
- `src/components/SettingsScreen.tsx` → `src/features/user/components/SettingsScreen.tsx`
- `src/components/HistoryScreen.tsx` → `src/features/user/components/HistoryScreen.tsx`
- `src/components/MyWritingGalleryScreen.tsx` → `src/features/user/components/MyWritingGalleryScreen.tsx`

### Lesson (레슨)
- `src/components/LessonInfoScreen.tsx` → `src/features/lesson/components/LessonInfoScreen.tsx`
- `src/components/HanjaLearnScreen.tsx` → `src/features/lesson/components/HanjaLearnScreen.tsx`

### Guide (가이드)
- `src/components/TutorialScreen.tsx` → `src/features/guide/components/TutorialScreen.tsx`
- `src/components/ToolsGuideScreen.tsx` → `src/features/guide/components/ToolsGuideScreen.tsx`

### Community (커뮤니티)
- `src/components/CommunityScreen.tsx` → `src/features/community/components/CommunityScreen.tsx`

### Admin (관리자)
- `src/components/AdminDashboard.tsx` → `src/features/admin/components/AdminDashboard.tsx`

### Shared (공통)
- `src/components/WeeklyStatsDetails.tsx` → `src/shared/components/widgets/WeeklyStatsDetails.tsx`
- `src/components/figma/` → `src/shared/components/figma/`
- `src/components/ui/` → `src/components/ui/` (유지)

## 🔧 Import 경로 업데이트 필요

### 각 컴포넌트 내부 import 수정 필요
1. UI 컴포넌트: `./ui/` → `../../../components/ui/`
2. 타입: 상대 경로로 변경
3. 서비스: 상대 경로로 변경
4. 유틸리티: 상대 경로로 변경

### Path Alias 사용 예시
```typescript
// Before
import { Button } from '../../../components/ui/button';

// After (with alias)
import { Button } from '@components/ui/button';
```

## 📝 남은 작업

1. **각 컴포넌트 파일 내부 import 경로 수정**
2. **Barrel export 파일 생성**
3. **Vite alias 설정 추가**
4. **중복 코드 제거**
5. **테스트 파일 이동**

## ⚠️ 주의사항

- `TestComponent.tsx`는 임시로 components에 유지
- `ui/` 폴더는 shadcn 관리를 위해 components에 유지
- 모든 import 경로 수정 후 앱 테스트 필수