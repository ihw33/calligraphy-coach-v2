# 데이터 모델: 붓글씨 인식 및 피드백 시스템

## MVP 범위 요약 (스코프 고정)

### 핵심 플로우
1. **관리자**: 서예 작품 업로드 → 활성화
2. **사용자**: 카메라로 자신의 글자 촬영 → 활성 작품과 비교 평가

### MVP 포함 엔티티
- **CalligraphyArtwork**: id, character, fontStyle, imageUrl, isActive, createdAt
- **CameraCapture**: id, sessionId, characterId, originalImage, processedImage(선택), timestamp  
- **Admin**: id, email, passwordHash (단일 관리자)
- **기존 엔티티들**: 모두 유지 (WritingSession, Character, WritingAttempt, Evaluation, Feedback, Progress, Course)

### MVP 제외 (POST-MVP 단계)
- per-artwork 커스텀 가중치 (전역 40/30/20/10 고정 사용)
- 세밀한 tolerances, focusAreas, learningObjectives
- 작품 메타데이터 (title, artist, 역사/문화 정보)
- 세부 전처리 로그, 장치/설정 상세 정보
- RBAC 역할/권한 세분화, 활동 로그
- 작품 승인 워크플로, 백업/시스템 관리

## 핵심 엔티티들

### 1. WritingSession (연습세션)
```typescript
/**
 * 사용자의 서예 연습 세션을 나타내는 인터페이스
 * 한 번의 연습 시간 동안 작성한 모든 글자와 설정을 포함
 */
interface WritingSession {
  id: string;                    // 세션의 고유 식별자 (UUID v4)
  userId?: string;               // 사용자 ID (로그인 없이도 사용 가능하므로 옵션)
  startTime: Date;               // 연습 시작 시간
  endTime?: Date;                // 연습 종료 시간 (진행 중일 때는 undefined)
  fontStyle: FontStyle;          // 이번 세션에서 연습하는 서체
  charactersPracticed: string[]; // 이번 세션에서 연습한 글자들의 목록
  totalScore?: number;           // 이번 세션의 평균 점수 (모든 시도의 평균)
  device: DeviceInfo;            // 사용자가 사용하는 입력 장치 정보
}

/**
 * 사용자 입력 장치에 대한 정보
 * 평가 알고리즘에서 장치별 특성을 고려하기 위해 사용
 */
interface DeviceInfo {
  type: 'pen' | 'touch' | 'mouse';  // 입력 방식: 펜 태블릿, 터치, 마우스
  pressureSupported: boolean;       // 압력 감지 지원 여부
  maxPressure?: number;            // 최대 압력값 (압력 지원시에만)
}
```

### 2. Character (글자)
```typescript
/**
 * 연습 대상이 되는 한글/한자 글자의 표준 정보
 * 각 서체별로 다른 표준 형태와 평가 기준을 가짐
 */
interface Character {
  id: string;                     // 글자의 고유 식별자
  unicode: string;                // 글자의 유니코드 문자 (예: "가", "水")
  type: 'hangul' | 'hanja';       // 글자 종류: 한글 또는 한자
  fontStyles: FontStyleData[];    // 지원하는 서체별 표준 데이터 배열
  strokeOrder: StrokeOrder[];     // 올바른 획순 정보 (서체 공통)
  difficulty: 'beginner' | 'intermediate' | 'advanced'; // 난이도 수준
  course?: string;                // 소속 학습 과정 (천자문, 사자소학 등)
}

/**
 * 특정 서체에서의 글자 표준 데이터
 * 평가 시 기준이 되는 정보들을 포함
 */
interface FontStyleData {
  style: FontStyle;               // 해당 서체 (판본체, 궁서체 등)
  referenceImage: string;         // 표준 글자 이미지 (Base64 또는 URL)
  strokeWeights: number[];        // 각 획의 표준 굵기 배열
  proportions: BoundingBox;       // 글자의 표준 비례 (가로세로 비율)
}

/**
 * 획순 정보를 나타내는 인터페이스
 * 각 획이 어떤 순서로 그어져야 하는지 정의
 */
interface StrokeOrder {
  order: number;                  // 획의 순서 (1부터 시작)
  path: Point[];                  // 획의 경로를 나타내는 점들의 배열
  direction: 'horizontal' | 'vertical' | 'diagonal' | 'curve'; // 획의 방향성
}
```

### 3. WritingAttempt (작성시도)
```typescript
/**
 * 사용자가 특정 글자를 쓴 한 번의 시도
 * 실제 사용자 입력 데이터와 그에 대한 평가를 포함
 */
interface WritingAttempt {
  id: string;                     // 시도의 고유 식별자
  sessionId: string;              // 소속 세션 ID (외래키)
  characterId: string;            // 연습한 글자 ID (외래키)
  timestamp: Date;                // 시도 완료 시간
  strokes: Stroke[];              // 사용자가 그린 모든 획들
  canvasImage: string;            // 최종 완성된 글자 이미지 (Base64)
  evaluation: Evaluation;         // 이 시도에 대한 평가 결과
  duration: number;               // 글자 작성에 소요된 시간 (밀리초)
}

/**
 * 사용자가 그린 하나의 획 (펜을 누르고 떼기까지)
 * 붓글씨의 특성상 압력과 속도 정보가 중요
 */
interface Stroke {
  points: StrokePoint[];          // 이 획을 구성하는 모든 점들
  order: number;                  // 사용자가 그린 순서 (획순 평가용)
  timestamp: Date;                // 이 획을 시작한 시간
}

/**
 * 획을 구성하는 개별 점의 정보
 * 붓글씨 특성상 압력과 시간 정보가 핵심
 */
interface StrokePoint {
  x: number;                      // Canvas 상의 X 좌표
  y: number;                      // Canvas 상의 Y 좌표
  pressure: number;               // 압력 (0~1 정규화, 1이 최대 압력)
  timestamp: number;              // 이 점이 기록된 상대 시간 (밀리초)
}
```

### 4. Evaluation (평가)
```typescript
/**
 * 사용자의 글자 작성 시도에 대한 종합 평가
 * 4가지 요소(형태, 비례, 굵기, 획순)로 구성된 100점 만점 평가
 */
interface Evaluation {
  attemptId: string;              // 평가 대상 시도 ID (외래키)
  totalScore: number;             // 총 점수 (0~100점)
  components: EvaluationComponent[]; // 각 평가 요소별 상세 점수
  recognizedCharacter?: string;   // ML이 인식한 글자 (인식 실패시 undefined)
  confidence: number;             // 문자 인식 신뢰도 (0~1, 1이 가장 확실)
}

/**
 * 평가의 개별 구성 요소 (형태, 비례, 굵기, 획순)
 * 각 요소별로 다른 가중치와 세부 피드백을 가짐
 */
interface EvaluationComponent {
  type: 'shape' | 'proportion' | 'thickness' | 'strokeOrder'; // 평가 요소 유형
  score: number;                  // 이 요소에서의 점수
  maxScore: number;               // 이 요소의 최대 점수 (가중치 반영)
  weight: number;                 // 전체 평가에서의 가중치 (퍼센트)
  details?: string;               // 이 요소에 대한 상세 평가 내용
}
```

### 5. Feedback (피드백)
```typescript
/**
 * 평가 결과를 바탕으로 생성된 사용자 피드백
 * 개선 방향과 격려 메시지를 포함
 */
interface Feedback {
  evaluationId: string;           // 피드백 대상 평가 ID (외래키)
  overallFeedback: string;        // 전체적인 평가 메시지
  improvements: Improvement[];    // 구체적인 개선 사항들
  visualGuides: VisualGuide[];    // 시각적 가이드 (오버레이, 애니메이션 등)
  encouragement?: string;         // 격려 메시지 (선택적)
}

/**
 * 특정 평가 요소에 대한 개선 제안
 * 우선순위에 따라 사용자에게 표시 순서 결정
 */
interface Improvement {
  component: 'shape' | 'proportion' | 'thickness' | 'strokeOrder'; // 개선 대상 요소
  issue: string;                  // 발견된 문제점
  suggestion: string;             // 구체적인 개선 방법
  priority: 'high' | 'medium' | 'low'; // 개선의 우선순위
}

/**
 * 사용자에게 제공되는 시각적 학습 도움말
 * 다양한 형태의 시각적 피드백을 지원
 */
interface VisualGuide {
  type: 'overlay' | 'animation' | 'comparison'; // 가이드 유형
  data: string;                   // 가이드 데이터 (SVG, 애니메이션 데이터 등)
  description: string;            // 가이드에 대한 설명
}
```

### 6. Progress (진도)
```typescript
/**
 * 특정 글자에 대한 사용자의 학습 진도
 * 시간에 따른 향상도를 추적하기 위한 데이터
 */
interface Progress {
  userId?: string;                // 사용자 ID (로그인 사용자만)
  character: string;              // 진도를 추적하는 글자
  fontStyle: FontStyle;           // 해당 서체에서의 진도
  attempts: number;               // 총 연습 횟수
  bestScore: number;              // 최고 점수
  averageScore: number;           // 평균 점수
  lastPracticed: Date;            // 마지막 연습 날짜
  improvements: ImprovementTrend[]; // 시간에 따른 향상도 추이
}

/**
 * 시간에 따른 점수 변화 추이
 * 학습 곡선을 시각화하기 위한 데이터
 */
interface ImprovementTrend {
  date: Date;                     // 연습 날짜
  score: number;                  // 해당 날짜의 점수
  component: string;              // 개선된 평가 요소
}
```

### 7. FontStyle (서체)
```typescript
/**
 * 지원하는 서체 목록
 * 각 서체마다 다른 평가 기준과 특성을 가짐
 */
enum FontStyle {
  PANBON = 'panbon',       // 한글 판본체 (가장 기본적인 한글 서체)
  GUNGSEO = 'gungseo',     // 한글 궁서체 (전통적인 한글 서체)
  JEONSEO = 'jeonseo',     // 한자 전서체 (고전적인 한자 서체)
  HAESEO = 'haeseo'        // 한자 해서체 (표준적인 한자 서체)
}

/**
 * 각 서체별 설정과 평가 기준
 * 서체의 특성에 따라 평가 가중치와 특성이 다름
 */
interface FontStyleConfig {
  style: FontStyle;               // 서체 식별자
  evaluationWeights: {            // 서체별 평가 가중치
    shape: number;         // 형태 (기본 40%)
    proportion: number;    // 비례 (기본 30%)
    thickness: number;     // 굵기 (기본 20%)
    strokeOrder: number;   // 획순 (기본 10%)
  };
  characteristics: {              // 서체별 특성
    strokeWidth: { min: number; max: number }; // 획 굵기 범위
    aspectRatio: number;          // 글자의 가로세로 비율
    spacing: number;              // 글자 간격 (향후 문장 연습용)
  };
}
```

### 8. Course (학습과정)
```typescript
/**
 * 체계적인 학습을 위한 교육과정
 * 천자문, 사자소학 등 전통적인 서예 교육과정을 디지털화
 */
interface Course {
  id: string;                     // 과정의 고유 식별자
  name: string;                   // 과정명 (천자문, 사자소학, 기초한자 등)
  type: 'hanja' | 'hangul' | 'mixed'; // 과정 유형: 한자, 한글, 혼합
  level: 'basic600' | 'basic1200' | 'cheonjamun' | 'sajasohak' | 'custom'; // 과정 수준
  characters: CourseCharacter[];  // 과정에 포함된 글자들의 순서
  totalCharacters: number;        // 총 글자 수
  description: string;            // 과정에 대한 설명
}

/**
 * 학습 과정 내의 개별 글자 정보
 * 학습 순서와 추가 정보를 포함
 */
interface CourseCharacter {
  characterId: string;            // 글자 ID (Character 테이블 참조)
  order: number;                  // 과정 내 학습 순서
  meaning?: string;               // 글자의 뜻 (한자의 경우)
  pronunciation?: string;         // 발음 (한자의 경우)
  example?: string;               // 예문 또는 사용 예시
}
```

## 상태 관리

### 전역 상태 (Zustand)
```typescript
/**
 * 애플리케이션의 전역 상태
 * Zustand를 사용한 가벼운 상태 관리
 */
interface AppState {
  // 현재 세션 관련
  currentSession: WritingSession | null;    // 활성 연습 세션
  
  // 연습 관련
  currentCharacter: Character | null;       // 현재 연습 중인 글자
  currentFontStyle: FontStyle;              // 현재 선택된 서체
  attempts: WritingAttempt[];               // 현재 세션의 시도들
  
  // 진도 관리
  userProgress: Map<string, Progress>;      // 사용자의 글자별 진도 (키: characterId)
  
  // 사용자 설정
  settings: UserSettings;                   // 사용자 개인 설정
}

/**
 * 사용자 개인 설정
 * 연습 환경과 UI 설정을 포함
 */
interface UserSettings {
  fontStyle: FontStyle;                     // 기본 연습 서체
  showStrokeOrder: boolean;                 // 획순 가이드 표시 여부
  showGrid: boolean;                        // 격자 가이드 표시 여부
  soundEnabled: boolean;                    // 사운드 효과 활성화 여부
  leftHanded: boolean;                      // 왼손잡이 모드 (UI 배치 변경)
  brushSize: 'small' | 'medium' | 'large';  // 기본 붓 크기
  inkDensity: number;                       // 먹의 진함 정도 (0~1)
}
```

## 유효성 검사 규칙

1. **WritingAttempt 검증**
   - 최소 1개 이상의 stroke 필요
   - 각 stroke는 최소 5개 이상의 point 필요 (의미있는 획이 되려면)
   - pressure 값은 0~1 범위 내여야 함
   - timestamp는 순차적으로 증가해야 함

2. **Evaluation 검증**
   - totalScore는 0~100 범위 내여야 함
   - 모든 component score의 가중 평균이 totalScore와 일치해야 함
   - confidence는 0~1 범위 내여야 함
   - 각 component의 maxScore는 해당 weight와 일치해야 함

3. **Character 검증**
   - unicode는 유효한 한글/한자 문자여야 함
   - strokeOrder의 order는 1부터 연속적이어야 함
   - fontStyles 배열은 최소 1개 이상의 서체 데이터를 포함해야 함

## 상태 전이

### WritingSession 상태 전이
```
생성됨(created) → 활성(active) → 완료됨(completed)
                    ↓
                 취소됨(cancelled)
```

### WritingAttempt 상태 전이
```
시작됨(started) → 그리는중(drawing) → 제출됨(submitted) → 평가됨(evaluated) → 피드백표시(feedback_shown)
                    ↓
                 취소됨(cancelled)
```

## 저장소 스키마 (IndexedDB)

### Object Stores
1. **sessions**: WritingSession[] (연습 세션들)
2. **attempts**: WritingAttempt[] (글자 작성 시도들)
3. **evaluations**: Evaluation[] (평가 결과들)
4. **progress**: Progress[] (학습 진도들)
5. **characters**: Character[] (글자 정보 - 캐시된 참조 데이터)

### 인덱스
- **sessions**: [userId, startTime] - 사용자별, 시간순 조회 최적화
- **attempts**: [sessionId, timestamp] - 세션별 시도 조회 최적화
- **progress**: [userId, character, fontStyle] - 진도 조회 최적화

## MVP 확장 엔티티들

### 9. CalligraphyArtwork (서예 작품) - 관리자 전용
```typescript
/**
 * 서예 작가 작품 (MVP 버전)
 * 사용자 평가의 기준이 되는 표준 작품
 */
interface CalligraphyArtwork {
  id: string;                     // 작품의 고유 식별자
  character: string;              // 작품의 글자 (단일 글자)
  fontStyle: FontStyle;           // 서체 분류
  imageUrl: string;               // 작품 이미지 URL
  isActive: boolean;              // 평가 기준으로 활성화 여부
  createdAt: Date;                // 작품 등록일

  // POST-MVP: 작품 메타데이터, 커스텀 평가 기준
  // title?: string;
  // artist?: ArtistInfo;
  // metadata?: ArtworkMetadata;
  // evaluationCriteria?: ArtworkEvaluationCriteria;
  // updatedAt?: Date;
  // createdBy?: string;
}
```

### 10. CameraCapture (카메라 캡처) - 사용자 전용
```typescript
/**
 * 카메라로 촬영한 사용자 글자 (MVP 버전)
 * 물리적 서예 작품을 디지털로 변환하여 평가
 */
interface CameraCapture {
  id: string;                     // 캡처의 고유 식별자
  sessionId: string;              // 소속 연습 세션 ID
  characterId: string;            // 촬영된 글자 ID
  originalImage: string;          // 원본 촬영 이미지 (Base64)
  processedImage?: string;        // 전처리된 이미지 (선택적, 단순 이진화)
  timestamp: Date;                // 촬영 시간

  // POST-MVP: 세부 전처리 로그, 품질 검사, 장치 정보
  // preprocessing?: ImagePreprocessing;
  // captureSettings?: CaptureSettings;
  // qualityCheck?: ImageQualityCheck;
  // deviceInfo?: CameraDeviceInfo;
}
```

### 11. Admin (관리자) - 단순 버전
```typescript
/**
 * 시스템 관리자 (MVP 버전)
 * 단일 관리자 계정으로 시작
 */
interface Admin {
  id: string;                     // 관리자 고유 식별자 (하드코딩 가능)
  email: string;                  // 이메일 주소
  passwordHash: string;           // 암호화된 비밀번호

  // POST-MVP: 역할/권한 세분화, 활동 로그
  // username?: string;
  // name?: string;
  // role?: AdminRole;
  // permissions?: AdminPermission[];
  // isActive?: boolean;
  // lastLoginAt?: Date;
  // createdAt?: Date;
  // createdBy?: string;
}
```

## 저장소 스키마 업데이트 (IndexedDB)

### Object Stores 추가
6. **artworks**: CalligraphyArtwork[] (관리자가 등록한 표준 작품들)
7. **cameraCaptures**: CameraCapture[] (사용자 카메라 촬영 기록)
8. **admin**: Admin (단일 관리자 정보)

### 인덱스 추가
- **artworks**: [character, fontStyle, isActive] - 활성 작품 조회 최적화
- **cameraCaptures**: [sessionId, timestamp] - 세션별 촬영 기록 조회

## 평가 흐름 확장

### 기존 평가 (Canvas 입력)
1. 사용자가 Canvas에 직접 그리기
2. Stroke 데이터를 기반으로 평가
3. 기본 서체 템플릿과 비교

### 새로운 평가 (작품 기반)
1. 관리자가 서예 작품을 등록하고 활성화
2. 사용자가 카메라로 자신의 글자 촬영
3. **활성 작품**과 **사용자 촬영 이미지**를 비교하여 평가
4. 동일한 100점 평가 체계 적용 (40/30/20/10 고정 가중치)

## 데이터 보존 정책

- **Sessions**: 30일 후 자동 삭제
- **Attempts**: 30일 후 자동 삭제 (연습 기록)
- **Progress**: 영구 보존 (사용자가 삭제하기 전까지)
- **Reference Data** (Characters, Courses): 무기한 캐시 (앱 업데이트시 갱신)
- **Artworks**: 영구 보존 (관리자가 삭제하기 전까지)
- **CameraCaptures**: 30일 후 자동 삭제 (평가용 임시 데이터)