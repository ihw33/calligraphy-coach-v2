# Team A-B API 계약서

**작성일**: 2025-09-18  
**작성자**: Team A (Claude Code)  
**대상**: Team B (Codex - Frontend App Team)  
**목적**: 핵심 라이브러리와 React 앱 간의 인터페이스 정의

## 1. stroke-capture 라이브러리

### 제공 인터페이스
```typescript
// @calligraphy/stroke-capture
export interface Point {
  x: number;           // 0-1 정규화된 좌표
  y: number;           // 0-1 정규화된 좌표  
  pressure: number;    // 0-1 압력값
  timestamp: number;   // 밀리초
}

export interface StrokeData {
  points: Point[];
  boundingBox: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
  duration: number;    // 총 소요시간 (ms)
  deviceType: 'touch' | 'pen' | 'mouse';
}

// 메인 함수
export function createStrokeCapture(canvas: HTMLCanvasElement): {
  startCapture(): void;
  stopCapture(): StrokeData | null;
  onStroke(callback: (data: StrokeData) => void): void;
  clear(): void;
}
```

### 사용 예시 (Team B)
```typescript
import { createStrokeCapture } from '@calligraphy/stroke-capture';

const PracticeCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const capture = createStrokeCapture(canvasRef.current);
    capture.startCapture();
    
    capture.onStroke((strokeData) => {
      // strokeData를 다른 라이브러리로 전달
      console.log('Captured stroke:', strokeData);
    });
    
    return () => capture.stopCapture();
  }, []);
  
  return <canvas ref={canvasRef} />;
};
```

## 2. character-recognition 라이브러리

### 제공 인터페이스
```typescript
// @calligraphy/character-recognition
export interface RecognitionResult {
  character: string;      // 인식된 글자
  confidence: number;     // 0-1 신뢰도
  alternatives: Array<{
    character: string;
    confidence: number;
  }>;
  language: 'korean' | 'chinese';
}

export interface RecognitionOptions {
  language?: 'korean' | 'chinese' | 'auto';
  modelType?: 'fast' | 'accurate';
}

// 메인 함수
export async function recognizeCharacter(
  strokeData: StrokeData,
  options?: RecognitionOptions
): Promise<RecognitionResult>;

// 초기화 (모델 로드)
export async function initializeRecognition(): Promise<void>;
```

### 사용 예시 (Team B)
```typescript
import { recognizeCharacter, initializeRecognition } from '@calligraphy/character-recognition';
import { StrokeData } from '@calligraphy/stroke-capture';

// 앱 시작 시 초기화
await initializeRecognition();

// 획 데이터 인식
const handleStrokeComplete = async (strokeData: StrokeData) => {
  const result = await recognizeCharacter(strokeData, {
    language: 'korean',
    modelType: 'accurate'
  });
  
  console.log(`인식된 글자: ${result.character} (신뢰도: ${result.confidence})`);
};
```

## 3. calligraphy-evaluator 라이브러리

### 제공 인터페이스
```typescript
// @calligraphy/calligraphy-evaluator
export interface EvaluationScore {
  total: number;        // 0-100 총점
  breakdown: {
    form: number;       // 0-40 형태 점수
    proportion: number; // 0-30 비례 점수
    thickness: number;  // 0-20 굵기 점수
    strokeOrder: number;// 0-10 획순 점수
  };
  details: {
    formAccuracy: number;        // 형태 정확도 %
    proportionBalance: number;   // 비례 균형도 %
    thicknessConsistency: number; // 굵기 일관성 %
    strokeOrderCorrect: boolean; // 획순 정확 여부
  };
}

export interface ReferenceData {
  character: string;
  strokes: StrokeData[];
  metadata?: {
    style: 'panbon' | 'gungseo' | 'jeonseo' | 'haeseo';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  };
}

// 메인 함수
export function evaluateCalligraphy(
  userStroke: StrokeData | StrokeData[],
  reference: ReferenceData
): EvaluationScore;

// 참조 데이터 로드
export async function loadReferenceData(
  character: string,
  style?: string
): Promise<ReferenceData>;
```

### 사용 예시 (Team B)
```typescript
import { evaluateCalligraphy, loadReferenceData } from '@calligraphy/calligraphy-evaluator';

const handleEvaluation = async (userStrokes: StrokeData[], character: string) => {
  // 표준 참조 데이터 로드
  const reference = await loadReferenceData(character, 'panbon');
  
  // 평가 수행
  const score = evaluateCalligraphy(userStrokes, reference);
  
  // UI 업데이트
  setScore(score.total);
  setBreakdown(score.breakdown);
};
```

## 4. feedback-generator 라이브러리

### 제공 인터페이스
```typescript
// @calligraphy/feedback-generator
export interface Feedback {
  summary: string;           // 한 줄 요약
  strengths: string[];       // 잘한 점들
  improvements: string[];    // 개선 필요 사항
  suggestions: {
    text: string;           // 제안 내용
    priority: 'high' | 'medium' | 'low';
    category: 'form' | 'proportion' | 'thickness' | 'strokeOrder';
  }[];
  visualGuides?: {
    type: 'overlay' | 'comparison' | 'animation';
    data: any;              // 시각적 가이드 데이터
  }[];
}

export interface FeedbackOptions {
  language?: 'ko' | 'en' | 'zh';
  verbosity?: 'brief' | 'normal' | 'detailed';
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
}

// 메인 함수
export function generateFeedback(
  evaluation: EvaluationScore,
  strokeData: StrokeData[],
  reference: ReferenceData,
  options?: FeedbackOptions
): Feedback;

// LLM 기반 고급 피드백 (옵션)
export async function generateAdvancedFeedback(
  imageData: string,  // base64 이미지
  evaluation: EvaluationScore,
  options?: FeedbackOptions
): Promise<Feedback>;
```

### 사용 예시 (Team B)
```typescript
import { generateFeedback, generateAdvancedFeedback } from '@calligraphy/feedback-generator';

const handleFeedbackGeneration = async (
  evaluation: EvaluationScore,
  strokes: StrokeData[],
  reference: ReferenceData
) => {
  // 기본 피드백 생성
  const feedback = generateFeedback(evaluation, strokes, reference, {
    language: 'ko',
    verbosity: 'normal',
    skillLevel: 'beginner'
  });
  
  // UI에 표시
  setFeedback(feedback);
  
  // 선택적: LLM 기반 고급 피드백
  if (useLLM) {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL('image/png');
    const advancedFeedback = await generateAdvancedFeedback(
      imageData, 
      evaluation
    );
    setAdvancedFeedback(advancedFeedback);
  }
};
```

## 5. 통합 사용 플로우

### Team B의 전체 통합 예시
```typescript
// PracticeScreen.tsx
import { createStrokeCapture } from '@calligraphy/stroke-capture';
import { recognizeCharacter } from '@calligraphy/character-recognition';
import { evaluateCalligraphy, loadReferenceData } from '@calligraphy/calligraphy-evaluator';
import { generateFeedback } from '@calligraphy/feedback-generator';

const PracticeScreen = () => {
  const [currentCharacter, setCurrentCharacter] = useState('가');
  const [strokes, setStrokes] = useState<StrokeData[]>([]);
  
  const handlePracticeComplete = async () => {
    // 1. 문자 인식
    const recognition = await recognizeCharacter(strokes[strokes.length - 1]);
    
    // 2. 참조 데이터 로드
    const reference = await loadReferenceData(currentCharacter);
    
    // 3. 평가 수행
    const evaluation = evaluateCalligraphy(strokes, reference);
    
    // 4. 피드백 생성
    const feedback = generateFeedback(evaluation, strokes, reference);
    
    // 5. 결과 화면으로 이동
    navigation.navigate('Result', {
      recognition,
      evaluation,
      feedback
    });
  };
  
  // ... UI 렌더링
};
```

## 6. 에러 처리

### 공통 에러 타입
```typescript
export class StrokeCaptureError extends Error {
  constructor(message: string, public code: string) {
    super(message);
  }
}

export class RecognitionError extends Error {
  constructor(message: string, public code: string) {
    super(message);
  }
}

export class EvaluationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
  }
}
```

### 에러 코드
- `CANVAS_NOT_SUPPORTED`: Canvas API 미지원
- `MODEL_NOT_LOADED`: AI 모델 로드 실패
- `INVALID_STROKE_DATA`: 잘못된 획 데이터
- `REFERENCE_NOT_FOUND`: 참조 데이터 없음
- `NETWORK_ERROR`: 네트워크 오류 (LLM 연동 시)

## 7. 성능 지표

### 목표 성능
- `createStrokeCapture`: 초기화 <10ms
- `recognizeCharacter`: <500ms
- `evaluateCalligraphy`: <200ms
- `generateFeedback`: <100ms
- `generateAdvancedFeedback`: <3000ms (LLM 포함)

### 메모리 사용
- 각 라이브러리: <50MB
- TensorFlow.js 모델: <100MB
- 전체 앱: <200MB

## 8. 테스트 지원

### Mock 데이터 제공
```typescript
// @calligraphy/test-utils
export const mockStrokeData: StrokeData;
export const mockRecognitionResult: RecognitionResult;
export const mockEvaluationScore: EvaluationScore;
export const mockFeedback: Feedback;
```

## 9. 버전 관리

### 시맨틱 버저닝
- 모든 패키지는 독립적 버전 관리
- Breaking changes는 major 버전 업데이트
- 초기 버전: 0.1.0

### 의존성
```json
{
  "@calligraphy/stroke-capture": "^0.1.0",
  "@calligraphy/character-recognition": "^0.1.0",
  "@calligraphy/calligraphy-evaluator": "^0.1.0",
  "@calligraphy/feedback-generator": "^0.1.0"
}
```

## 10. 개발 일정

### Team A 제공 일정
- Week 1: stroke-capture 인터페이스 정의 + mock 구현
- Week 2: character-recognition 인터페이스 정의 + mock 구현
- Week 3: calligraphy-evaluator 인터페이스 정의 + mock 구현
- Week 4: feedback-generator 인터페이스 정의 + mock 구현
- Week 5-8: 실제 구현 및 최적화

### Team B 병행 개발
- Mock 데이터로 UI 개발 가능
- 실제 구현 완료 시 교체만 하면 됨

---

**문의사항**: Team A (Claude Code)  
**수정 요청**: GitHub Issue 또는 specs/contracts/ 폴더에 PR