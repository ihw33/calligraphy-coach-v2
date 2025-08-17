# 서예 코치 v2 - UI 컴포넌트 라이브러리

한국 전통 미학을 반영한 React Native 디자인 시스템 및 컴포넌트 라이브러리입니다.

## 🎨 디자인 원칙

### 한국 전통 미학
- **먹색 계열**: 서예의 핵심 색상인 먹색을 중심으로 한 색상 체계
- **전통 색상**: 솔잎색(녹색), 단청색(적색) 등 한국 전통 색상 활용
- **균형과 조화**: 여백의 미와 균형감을 중시하는 레이아웃

### 현대적 사용성
- **직관적 UI**: 사용자가 쉽게 이해할 수 있는 인터페이스
- **접근성**: WCAG 2.1 AA 기준 준수
- **반응형**: 다양한 화면 크기에 최적화

## 📦 설치

```bash
npm install @calligraphy-coach/ui
```

## 🚀 사용법

### 기본 사용

```typescript
import { Button, Input, Card } from '@calligraphy-coach/ui';
import { theme } from '@calligraphy-coach/ui';

// 컴포넌트 사용
<Button 
  title="시작하기" 
  variant="primary" 
  onPress={() => console.log('pressed')} 
/>

// 테마 사용
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.md,
  },
});
```

### 디자인 토큰 사용

```typescript
import { colors, typography, spacing } from '@calligraphy-coach/ui';

const styles = StyleSheet.create({
  title: {
    ...typography.heading.h1,
    color: colors.ink.black,
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.primary.main,
    padding: spacing.md,
  },
});
```

## 🎯 컴포넌트

### Button
다양한 스타일과 크기를 지원하는 버튼 컴포넌트

```typescript
<Button
  title="확인"
  variant="primary" // primary, secondary, outline, text
  size="medium"     // small, medium, large
  loading={false}
  disabled={false}
  onPress={() => {}}
/>
```

### Input
검증 상태와 힌트를 지원하는 입력 필드

```typescript
<Input
  label="이름"
  placeholder="이름을 입력하세요"
  error="이름은 필수입니다"
  hint="한글 또는 영문으로 입력하세요"
  variant="outlined" // outlined, filled
  required={true}
/>
```

### Card
다양한 변형을 지원하는 카드 컴포넌트

```typescript
<Card
  variant="elevated" // elevated, outlined, filled
  size="medium"      // small, medium, large
  shadow={true}
  pressable={true}
  onPress={() => {}}
>
  <Text>카드 내용</Text>
</Card>
```

### Modal
유연한 설정이 가능한 모달 컴포넌트

```typescript
<Modal
  visible={isVisible}
  onClose={() => setIsVisible(false)}
  title="확인"
  size="medium"        // small, medium, large, fullscreen
  position="center"    // center, bottom, top
  confirmText="확인"
  cancelText="취소"
  onConfirm={() => {}}
>
  <Text>모달 내용</Text>
</Modal>
```

### Loading
로딩 상태를 표시하는 컴포넌트

```typescript
<Loading
  text="로딩 중..."
  size="medium"     // small, medium, large
  overlay={true}    // 전체 화면 오버레이
  visible={true}
/>

<ProgressBar
  progress={0.7}    // 0-1
  height={4}
  rounded={true}
/>
```

## 🎨 디자인 토큰

### 색상 (Colors)

#### 메인 브랜드 색상
```typescript
colors.primary.main    // #2E7D32 (전통 녹색)
colors.primary.light   // #4CAF50
colors.primary.dark    // #1B5E20

colors.secondary.main  // #D32F2F (전통 적색)
colors.secondary.light // #EF5350
colors.secondary.dark  // #B71C1C
```

#### 먹색 계열
```typescript
colors.ink.black   // #212121 (진한 먹색)
colors.ink.dark    // #424242 (중간 먹색)
colors.ink.medium  // #757575 (회색 먹색)
colors.ink.light   // #BDBDBD (연한 먹색)
colors.ink.paper   // #FAFAFA (한지색)
```

#### 기능성 색상
```typescript
colors.semantic.success // #4CAF50 (성공)
colors.semantic.warning // #FF9800 (경고)
colors.semantic.error   // #F44336 (오류)
colors.semantic.info    // #2196F3 (정보)
```

### 타이포그래피 (Typography)

#### 헤딩
```typescript
typography.heading.h1  // 36px, bold
typography.heading.h2  // 30px, semibold
typography.heading.h3  // 24px, semibold
// ... h4, h5, h6
```

#### 본문
```typescript
typography.body.large  // 18px
typography.body.medium // 16px (기본)
typography.body.small  // 14px
```

#### 특수 텍스트
```typescript
typography.special.caption    // 12px (캡션)
typography.special.button     // 16px, medium (버튼)
typography.calligraphy.title  // 24px (서예 제목)
```

### 간격 (Spacing)

#### 기본 간격
```typescript
spacing.xs   // 4px
spacing.sm   // 8px
spacing.md   // 16px (기본)
spacing.lg   // 24px
spacing.xl   // 32px
spacing['2xl'] // 48px
```

#### 컴포넌트별 간격
```typescript
spacing.component.button.paddingVertical   // 12px
spacing.component.card.padding             // 16px
spacing.component.screen.paddingHorizontal // 16px
```

## 🧪 테스트

```bash
npm test              # 테스트 실행
npm run test:watch    # 테스트 감시 모드
npm run test:coverage # 커버리지 리포트
```

## 📚 스토리북

```bash
npm run storybook        # 스토리북 실행
npm run build-storybook  # 스토리북 빌드
```

## 🏗️ 빌드

```bash
npm run build  # TypeScript 빌드
npm run dev    # 개발 모드 (watch)
```

## 📝 라이센스

MIT License

## 🤝 기여하기

1. 이슈 생성
2. 브랜치 생성 (`feat/new-component`)
3. 개발 및 테스트
4. PR 생성

---

### 개발팀

- **Design/QA**: Cursor CLI
- **PM**: Claude Code  
- **Backend**: Gemini CLI
- **Mobile**: Claude CLI
- **Infrastructure**: Codex CLI
