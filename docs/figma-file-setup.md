# 🎨 Calligraphy Coach 디자인 파일 생성 가이드

## 1️⃣ Figma 파일 생성

1. **Figma 홈페이지 접속**
   - https://www.figma.com 로그인
   - 또는 Figma 데스크톱 앱 실행

2. **새 파일 생성**
   - "New design file" 클릭
   - 또는 우측 상단 "+" 버튼

3. **파일 이름 설정**
   - 파일명: "Calligraphy Coach V2 Design System"
   - 좌측 상단 "Untitled" 클릭해서 변경

## 2️⃣ 프레임 구조 만들기

### 기본 페이지 구조
```
📁 Calligraphy Coach V2
├── 🎨 Design System
│   ├── Colors
│   ├── Typography  
│   └── Components
├── 📱 Mobile Screens
│   ├── Onboarding
│   ├── Practice Mode
│   └── Progress
└── 💻 Desktop Screens
    ├── Dashboard
    ├── Learning Path
    └── Settings
```

## 3️⃣ 컴포넌트 만들기 (예시)

### 1. 헤더 컴포넌트
- Frame 생성 (F 키)
- 크기: 1440 x 80px
- 이름: "Header/Desktop"

### 2. 버튼 컴포넌트
- Rectangle 생성 (R 키)
- 크기: 120 x 48px
- Border Radius: 8px
- 색상: #4F46E5 (Primary)
- 이름: "Button/Primary"

### 3. 카드 컴포넌트
- Frame 생성
- 크기: 320 x 400px
- 이름: "Card/Practice"

## 4️⃣ 컴포넌트로 변환

1. 요소 선택
2. 우클릭 → "Create component"
3. 또는 단축키: ⌥⌘K (Mac) / Alt+Ctrl+K (Win)
