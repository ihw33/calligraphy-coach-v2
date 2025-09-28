# 황자원 92 서법 location.state 데이터 구조 명세

## 1. 데이터 구조 (모든 서법 공통)

```typescript
interface Hwang92LocationState {
  courseId: 'hwang92-sebeop';  // 고정값
  lessonId: string;             // 'h92-01' ~ 'h92-92'
  characters: Character[];      // 4개 한자 배열
  mode: 'photo';               // 고정값 (실물 모드)
  fontStyle: 'haeseo';         // 고정값 (해서체)
  lessonTitle: string;         // 서법 제목
  evaluationPoints: string[];  // 4개 평가 포인트
}

interface Character {
  id: string;                 // 고유 ID
  character: string;          // 한자
  type: 'chinese';           // 고정값
  meaning: string;           // 한글 뜻
  pronunciation: string;     // 한글 음
  referenceImage: string;    // 참고 이미지 경로
}
```

## 2. 서법별 실제 데이터

### 서법 1: 천복자범화개모어기하 (天覆者凡畫皆冒於其下)
**원리**: 상단 횡획이 전체를 덮는 구조

```javascript
{
  courseId: 'hwang92-sebeop',
  lessonId: 'h92-01',
  characters: [
    { id: 'h92c001', character: '宇', type: 'chinese', meaning: '집 우', pronunciation: 'woo', 
      referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images-sample/서법-01-01-宇.png' },
    { id: 'h92c002', character: '宙', type: 'chinese', meaning: '집 주', pronunciation: 'joo',
      referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images-sample/서법-01-02-宙.gif' },
    { id: 'h92c003', character: '定', type: 'chinese', meaning: '정할 정', pronunciation: 'jeong',
      referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images-sample/서법-01-03-定.gif' },
    { id: 'h92c004', character: '甯', type: 'chinese', meaning: '편안할 녕', pronunciation: 'nyeong',
      referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images-sample/서법-01-04-甯.gif' }
  ],
  mode: 'photo',
  fontStyle: 'haeseo',
  lessonTitle: '서법 1: 천복자범화개모어기하 (天覆者凡畫皆冒於其下)',
  evaluationPoints: [
    '상단 횡획이 전체 폭을 덮는가',
    '하부 요소들이 완전히 덮개 안에 들어가는가',
    '덮개와 내부의 비례가 적절한가',
    '보호하는 느낌이 표현되는가'
  ]
}
```

### 서법 2: 지재자유화개탁어기상 (地載者有畫皆託於其上)
**원리**: 하단 횡획이 모든 것을 받치는 구조

```javascript
{
  courseId: 'hwang92-sebeop',
  lessonId: 'h92-02',
  characters: [
    { id: 'h92c005', character: '至', type: 'chinese', meaning: '이를 지', pronunciation: 'ji',
      referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images-sample/서법-02-01-至.gif' },
    { id: 'h92c006', character: '聖', type: 'chinese', meaning: '성스러울 성', pronunciation: 'seong',
      referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images-sample/서법-02-02-聖.gif' },
    { id: 'h92c007', character: '孟', type: 'chinese', meaning: '맏 맹', pronunciation: 'maeng',
      referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images-sample/서법-02-03-孟.gif' },
    { id: 'h92c008', character: '蓋', type: 'chinese', meaning: '덮을 개', pronunciation: 'gae',
      referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images-sample/서법-02-04-蓋.gif' }
  ],
  mode: 'photo',
  fontStyle: 'haeseo',
  lessonTitle: '서법 2: 지재자유화개탁어기상 (地載者有畫皆託於其上)',
  evaluationPoints: [
    '하단 받침이 충분히 넓은가',
    '상부 요소들이 안정적으로 받쳐지는가',
    '받침의 중심과 상부 중심이 일치하는가',
    '전체적인 안정감이 느껴지는가'
  ]
}
```

### 서법 3: 양좌자우앙 (讓左者右昂)
**원리**: 왼쪽에 양보하는 자 - 오른쪽이 높아지는 구조

```javascript
{
  courseId: 'hwang92-sebeop',
  lessonId: 'h92-03',
  characters: [
    { id: 'h92c009', character: '來', type: 'chinese', meaning: '올 래', pronunciation: 'rae',
      referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images-sample/서법-03-01-來.gif' },
    { id: 'h92c010', character: '部', type: 'chinese', meaning: '떼 부', pronunciation: 'bu',
      referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images-sample/서법-03-02-部.gif' },
    { id: 'h92c011', character: '勿', type: 'chinese', meaning: '말 물', pronunciation: 'mul',
      referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images-sample/서법-03-03-勿.gif' },
    { id: 'h92c012', character: '即', type: 'chinese', meaning: '곧 즉', pronunciation: 'jeuk',
      referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images-sample/서법-03-04-即.gif' }
  ],
  mode: 'photo',
  fontStyle: 'haeseo',
  lessonTitle: '서법 3: 양좌자우앙 (讓左者右昂)',
  evaluationPoints: [
    '왼쪽 요소가 낮은 위치에 있는가',
    '오른쪽 요소가 상대적으로 높은가',
    '좌우 높이차가 적절한가',
    '시각적 균형이 유지되는가'
  ]
}
```

### 서법 4: 양우자좌고 (讓右者左高)
**원리**: 오른쪽에 양보하는 자 - 왼쪽이 높아지는 구조

```javascript
{
  courseId: 'hwang92-sebeop',
  lessonId: 'h92-04',
  characters: [
    { id: 'h92c013', character: '貝', type: 'chinese', meaning: '조개 패', pronunciation: 'pae',
      referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images-sample/서법-04-01-貝.gif' },
    { id: 'h92c014', character: '東', type: 'chinese', meaning: '동녘 동', pronunciation: 'dong',
      referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images-sample/서법-04-02-東.gif' },
    { id: 'h92c015', character: '議', type: 'chinese', meaning: '의논할 의', pronunciation: 'ui',
      referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images-sample/서법-04-03-議.gif' },
    { id: 'h92c016', character: '責', type: 'chinese', meaning: '꾸짖을 책', pronunciation: 'chaek',
      referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images-sample/서법-04-04-責.gif' }
  ],
  mode: 'photo',
  fontStyle: 'haeseo',
  lessonTitle: '서법 4: 양우자좌고 (讓右者左高)',
  evaluationPoints: [
    '오른쪽 요소가 낮은 위치에 있는가',
    '왼쪽 요소가 상대적으로 높은가',
    '좌우 높이차가 자연스러운가',
    '전체 글자의 안정감이 유지되는가'
  ]
}
```

## 3. 데이터 전달 흐름

### 3.1 CourseDetail.tsx → PracticeScreen.tsx
```javascript
// CourseDetail.tsx의 handleStartLesson 함수에서
navigate('/practice', {
  state: { /* 위의 서법별 데이터 */ }
});
```

### 3.2 PracticeScreen.tsx에서 수신
```javascript
const location = useLocation();
const stateData = location.state as Hwang92LocationState;

// 데이터 활용
const currentCharacter = stateData.characters[0];
const evaluationPoints = stateData.evaluationPoints;
```

## 4. 주의사항

### 고정값 (변경하지 않음)
- `courseId`: 항상 'hwang92-sebeop'
- `mode`: 항상 'photo' (실물 모드)
- `fontStyle`: 항상 'haeseo' (해서체)
- `type`: 항상 'chinese' (한자)

### 변경되는 값 (서법별로 다름)
- `lessonId`: h92-01, h92-02, h92-03, h92-04 ...
- `characters`: 각 서법의 4개 한자
- `lessonTitle`: 서법 이름과 한문
- `evaluationPoints`: 각 서법의 평가 기준 4개

### 데이터 소스
- `/src/features/course/data/courses/hwang92-sebeop.ts`
- `/reference/황자원_92_서법/` 폴더의 이미지들

## 5. 향후 확장 (서법 5-92)
- 동일한 구조 유지
- lessonId: h92-05 ~ h92-92
- 각 서법별 4개 한자와 평가 포인트 추가

---

*이 문서는 황자원 92 서법 구현의 핵심 데이터 구조를 정의합니다.*
*CourseDetail과 PracticeScreen 간의 데이터 전달 계약입니다.*