# 7️⃣ 생성된 컴포넌트 사용하기

## 파일 위치
동기화된 컴포넌트들은 다음 경로에 생성됩니다:
```
src/components/figma/
├── ButtonPrimary.tsx
├── CardHeader.tsx
├── Navigation.tsx
└── ...
```

## React에서 사용하기

### 1. 컴포넌트 import
```tsx
import ButtonPrimary from '@/components/figma/ButtonPrimary';
import CardHeader from '@/components/figma/CardHeader';
```

### 2. 컴포넌트 사용
```tsx
function MyPage() {
  return (
    <div>
      <CardHeader />
      <ButtonPrimary />
    </div>
  );
}
```

### 3. 스타일 커스터마이징
생성된 컴포넌트는 기본 스타일을 가지고 있지만, 추가로 수정 가능:

```tsx
// 생성된 컴포넌트
const ButtonPrimary = () => {
  return (
    <div 
      className="buttonprimary"
      style={{ width: '120px', height: '48px', backgroundColor: 'rgba(79, 70, 229, 1)' }}
    >
      {/* Generated from Figma: Button/Primary */}
    </div>
  );
};
```
### 4. Props 추가하기
생성된 컴포넌트에 props를 추가하여 재사용성 높이기:

```tsx
// 수정 전
const ButtonPrimary = () => {
  return <div className="buttonprimary">...</div>;
};

// 수정 후
interface ButtonPrimaryProps {
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({ 
  onClick, 
  children, 
  disabled 
}) => {
  return (
    <button 
      className="buttonprimary"
      onClick={onClick}
      disabled={disabled}
    >
      {children || 'Button'}
    </button>
  );
};
```

## 팁
- 생성된 컴포넌트는 시작점으로 사용
- 필요에 따라 로직과 상태 추가
- Figma 업데이트시 기존 수정사항 백업 권장
