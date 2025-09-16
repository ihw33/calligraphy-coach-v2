# 빠른 시작 가이드: 붓글씨 인식 및 피드백 시스템

## 사전 요구사항

- Node.js 18+ 및 npm/pnpm
- Pointer Events API를 지원하는 최신 브라우저 (Chrome 55+, Firefox 59+, Safari 13+)
- 펜 태블릿 또는 터치 장치 (선택사항이지만 권장)

## 설치

```bash
# 저장소 복제
git clone [repository-url]
cd calligraphy-coach-v2

# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm dev
```

## 기본 사용 예시

### 1. 붓글씨 입력을 위한 Canvas 초기화

```typescript
import { StrokeCapture } from '@/lib/stroke-capture';

/**
 * 압력 감지를 지원하는 획 캡처 시스템 초기화
 * 붓글씨 특성상 압력과 속도가 중요한 요소
 */
const canvas = document.getElementById('writing-canvas') as HTMLCanvasElement;
const strokeCapture = new StrokeCapture(canvas, {
  pressureEnabled: true,        // 압력 감지 활성화 (펜 태블릿 필수)
  brushSize: 'medium',          // 기본 붓 크기: small, medium, large
  inkDensity: 0.8              // 먹의 진함 정도 (0: 연한 회색, 1: 진한 검정)
});

/**
 * 획 시작 이벤트 리스너
 * 사용자가 펜을 누르거나 터치를 시작할 때 발생
 */
strokeCapture.on('strokeStart', (point: StrokePoint) => {
  console.log('새로운 획 시작:', {
    position: { x: point.x, y: point.y },
    pressure: point.pressure,
    timestamp: point.timestamp
  });
});

/**
 * 획 완료 이벤트 리스너  
 * 펜을 떼거나 터치를 끝낼 때 발생
 * 완성된 획의 모든 점들을 포함
 */
strokeCapture.on('strokeEnd', (stroke: Stroke) => {
  console.log('획 완료:', {
    pointCount: stroke.points.length,
    duration: stroke.points[stroke.points.length - 1].timestamp - stroke.points[0].timestamp,
    averagePressure: stroke.points.reduce((sum, p) => sum + p.pressure, 0) / stroke.points.length
  });
});
```

### 2. 글자 연습하기

```typescript
import { CalligraphyPractice } from '@/lib/calligraphy-practice';

/**
 * 특정 글자의 연습 세션 생성
 * 서체별로 다른 평가 기준이 적용됨
 */
const practice = new CalligraphyPractice({
  character: '水',              // 연습할 글자 (한글 또는 한자)
  fontStyle: 'haeseo',         // 서체: 'panbon'(판본체), 'gungseo'(궁서체), 'jeonseo'(전서체), 'haeseo'(해서체)
  showStrokeOrder: true        // 획순 가이드 표시 여부
});

/**
 * 참조 글자 로드 (표준 형태)
 * 평가 시 기준이 되는 글자의 표준 이미지와 획순 정보를 가져옴
 */
await practice.loadReference();

/**
 * 사용자가 작성한 글자를 평가용으로 제출
 * strokeData는 StrokeCapture에서 수집된 획 정보들
 */
const attempt = await practice.submitAttempt(strokeData);

/**
 * 평가 결과 확인
 * 100점 만점으로 4가지 요소별 점수 제공
 */
console.log('평가 결과:', {
  totalScore: attempt.evaluation.totalScore,           // 총점 (0-100)
  breakdown: {
    shape: attempt.evaluation.components.find(c => c.type === 'shape')?.score,        // 형태 (40점 만점)
    proportion: attempt.evaluation.components.find(c => c.type === 'proportion')?.score, // 비례 (30점 만점)
    thickness: attempt.evaluation.components.find(c => c.type === 'thickness')?.score,   // 굵기 (20점 만점)
    strokeOrder: attempt.evaluation.components.find(c => c.type === 'strokeOrder')?.score // 획순 (10점 만점)
  }
});
```

### 3. 평가 및 피드백 받기

```typescript
import { CalligraphyEvaluator } from '@/lib/calligraphy-evaluator';

/**
 * 서예 평가 엔진 생성
 * 서체별 특성과 평가 기준을 자동으로 적용
 */
const evaluator = new CalligraphyEvaluator();

/**
 * 사용자의 글자 작성 시도를 종합 평가
 * ML 모델을 통한 문자 인식과 전통적인 서예 평가 기준을 결합
 */
const evaluation = await evaluator.evaluate({
  character: '가',              // 목표 글자
  fontStyle: 'panbon',         // 평가 기준이 되는 서체
  strokes: capturedStrokes,    // 사용자가 그린 획들의 배열
  image: canvasImageData       // Canvas에서 추출한 이미지 데이터
});

/**
 * 평가 결과 상세 출력
 * 각 요소별 점수와 가중치가 적용된 총점
 */
console.log(`총 점수: ${evaluation.totalScore}/100`);
console.log(`형태 점수: ${evaluation.components.find(c => c.type === 'shape')?.score}/40`);
console.log(`비례 점수: ${evaluation.components.find(c => c.type === 'proportion')?.score}/30`);
console.log(`굵기 점수: ${evaluation.components.find(c => c.type === 'thickness')?.score}/20`);
console.log(`획순 점수: ${evaluation.components.find(c => c.type === 'strokeOrder')?.score}/10`);

/**
 * 구체적인 개선 제안 생성
 * 평가 결과를 바탕으로 맞춤형 피드백 제공
 */
const feedback = await evaluator.generateFeedback(evaluation);

/**
 * 우선순위별 개선 사항 출력
 * 가장 중요한 개선점부터 차례대로 표시
 */
feedback.improvements
  .sort((a, b) => {
    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  })
  .forEach(improvement => {
    console.log(`[${improvement.priority.toUpperCase()}] ${improvement.component}: ${improvement.suggestion}`);
  });
```

## 빠른 테스트 시나리오

### 시나리오 1: 기본 한글 연습

```javascript
/**
 * 테스트: 판본체로 '가' 쓰기
 * 기본적인 한글 글자 평가 과정을 검증
 */
test('한글 글자 평가 테스트', async () => {
  // 1. 연습 모드 초기화
  const session = await createSession({ 
    fontStyle: 'panbon',
    device: { type: 'pen', pressureSupported: true }
  });
  
  // 2. 연습할 글자 선택
  const character = await getCharacter('가');
  expect(character.type).toBe('hangul');
  
  // 3. 사용자 입력 시뮬레이션 (실제로는 Canvas에서 획 캡처)
  const strokes = await captureUserInput();
  expect(strokes.length).toBeGreaterThan(0);
  expect(strokes.every(stroke => stroke.points.length >= 5)).toBe(true); // 의미있는 획인지 확인
  
  // 4. 글자 제출 및 평가
  const attempt = await submitAttempt({
    sessionId: session.id,
    characterId: character.id,
    strokes,
    canvasImage: await getCanvasImageData(),
    duration: 5000 // 5초 소요
  });
  
  const evaluation = await evaluateAttempt(attempt.id);
  
  // 5. 평가 결과 검증
  expect(evaluation.totalScore).toBeGreaterThanOrEqual(0);
  expect(evaluation.totalScore).toBeLessThanOrEqual(100);
  expect(evaluation.components).toHaveLength(4);
  expect(evaluation.confidence).toBeGreaterThan(0.7); // 70% 이상 인식 신뢰도
  
  // 각 평가 요소의 가중치 확인
  const shapeComponent = evaluation.components.find(c => c.type === 'shape');
  const proportionComponent = evaluation.components.find(c => c.type === 'proportion');
  const thicknessComponent = evaluation.components.find(c => c.type === 'thickness');
  const strokeOrderComponent = evaluation.components.find(c => c.type === 'strokeOrder');
  
  expect(shapeComponent?.weight).toBe(40);
  expect(proportionComponent?.weight).toBe(30);
  expect(thicknessComponent?.weight).toBe(20);
  expect(strokeOrderComponent?.weight).toBe(10);
});
```

### 시나리오 2: 획순 검증

```javascript
/**
 * 테스트: '水' 글자의 획순 검증
 * 잘못된 획순으로 작성했을 때 감지되는지 확인
 */
test('획순 유효성 검사', async () => {
  const character = await getCharacter('水');
  
  // 정확한 획순: 세로획(1) → 가로획들(2,3,4)
  const correctOrderStrokes = [
    createStroke({ order: 1, direction: 'vertical' }),   // 첫 번째 세로획
    createStroke({ order: 2, direction: 'horizontal' }), // 첫 번째 가로획
    createStroke({ order: 3, direction: 'horizontal' }), // 두 번째 가로획  
    createStroke({ order: 4, direction: 'diagonal' })    // 마지막 삐침
  ];
  
  // 잘못된 획순: 가로획을 먼저 그림
  const wrongOrderStrokes = [
    createStroke({ order: 1, direction: 'horizontal' }), // 잘못: 가로획부터
    createStroke({ order: 2, direction: 'vertical' }),   // 잘못: 세로획을 나중에
    createStroke({ order: 3, direction: 'horizontal' }),
    createStroke({ order: 4, direction: 'diagonal' })
  ];
  
  // 정확한 획순 평가
  const correctEvaluation = await evaluateStrokes(character, correctOrderStrokes);
  const correctStrokeScore = correctEvaluation.components.find(c => c.type === 'strokeOrder');
  expect(correctStrokeScore.score).toBeGreaterThan(8); // 10점 중 8점 이상
  
  // 잘못된 획순 평가
  const wrongEvaluation = await evaluateStrokes(character, wrongOrderStrokes);
  const wrongStrokeScore = wrongEvaluation.components.find(c => c.type === 'strokeOrder');
  expect(wrongStrokeScore.score).toBeLessThan(5); // 10점 중 5점 미만
  
  // 피드백에 획순 개선 제안이 포함되는지 확인
  const feedback = await generateFeedback(wrongEvaluation);
  const strokeOrderFeedback = feedback.improvements.find(i => i.component === 'strokeOrder');
  expect(strokeOrderFeedback).toBeDefined();
  expect(strokeOrderFeedback.priority).toBe('high'); // 획순은 높은 우선순위
});
```

### 시나리오 3: 진도 추적

```javascript
/**
 * 테스트: 반복 연습을 통한 향상도 추적
 * 여러 번 연습할 때 진도가 올바르게 기록되는지 확인
 */
test('학습 진도 추적', async () => {
  const character = '天';
  const attempts = [];
  
  // 5번 연습 시뮬레이션 (점점 향상되는 패턴)
  for (let i = 0; i < 5; i++) {
    // 연습 횟수가 늘어날수록 더 정확한 입력 시뮬레이션
    const practice = await practiceCharacter(character, {
      skillLevel: 0.5 + (i * 0.1), // 50% → 90%로 점진적 향상
      fontStyle: 'haeseo'
    });
    attempts.push(practice);
    
    // 각 시도 사이에 시간 간격
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // 진도 보고서 조회
  const progress = await getProgress({ 
    character,
    fontStyle: 'haeseo'
  });
  
  // 진도 데이터 검증
  expect(progress.attempts).toBe(5);
  expect(progress.improvements).toBeDefined();
  expect(progress.averageScore).toBeDefined();
  expect(progress.improvements.length).toBe(5);
  
  // 향상도 검증: 나중 시도가 더 높은 점수를 가져야 함
  const firstScore = attempts[0].evaluation.totalScore;
  const lastScore = attempts[4].evaluation.totalScore;
  expect(lastScore).toBeGreaterThan(firstScore);
  
  // 학습 곡선이 상승 추세인지 확인
  const scores = attempts.map(a => a.evaluation.totalScore);
  const isImproving = scores.some((score, index) => 
    index > 0 && score > scores[index - 1]
  );
  expect(isImproving).toBe(true);
});
```

## CLI 명령어

```bash
# 획 캡처 라이브러리 CLI 실행
pnpm stroke-capture --help
pnpm stroke-capture capture --output strokes.json --pressure-threshold 0.3

# 문자 인식 실행
pnpm character-recognition recognize \
  --input strokes.json \
  --character "가" \
  --confidence-threshold 0.8

# 서예 평가 실행  
pnpm calligraphy-evaluator evaluate \
  --character "水" \
  --style haeseo \
  --strokes strokes.json \
  --format json \
  --detailed

# 피드백 생성
pnpm feedback-generator generate \
  --evaluation eval.json \
  --lang ko \
  --include-visual-guides
```

## 설정

```javascript
// config/calligraphy.config.js
/**
 * 서예 시스템 전체 설정
 * 평가 기준, 브러시 설정, 인식 설정 등을 포함
 */
export default {
  // 평가 가중치 설정
  evaluation: {
    weights: {
      shape: 40,        // 형태: 글자 모양의 정확성 (40%)
      proportion: 30,   // 비례: 글자의 균형과 비율 (30%)
      thickness: 20,    // 굵기: 획의 굵기 일관성 (20%)
      strokeOrder: 10   // 획순: 올바른 순서로 작성 (10%)
    },
    // 서체별 다른 평가 기준 적용 가능
    fontStyleModifiers: {
      'panbon': { shape: 45, proportion: 25, thickness: 20, strokeOrder: 10 },
      'gungseo': { shape: 35, proportion: 35, thickness: 20, strokeOrder: 10 },
      'jeonseo': { shape: 40, proportion: 30, thickness: 15, strokeOrder: 15 },
      'haeseo': { shape: 40, proportion: 30, thickness: 20, strokeOrder: 10 }
    }
  },
  
  // 브러시 및 캔버스 설정
  brush: {
    minWidth: 1,        // 최소 획 굵기 (픽셀)
    maxWidth: 20,       // 최대 획 굵기 (픽셀)
    smoothing: 0.5,     // 획 부드럽게 처리 정도 (0-1)
    inkFlow: 0.8,       // 먹의 흐름 정도 (0-1)
    pressureSensitivity: 0.7, // 압력 민감도 (0-1)
    // 붓의 모양과 질감
    tipShape: 'round',  // 'round', 'flat', 'pointed'
    texture: true       // 붓 질감 효과 활성화
  },
  
  // 문자 인식 설정
  recognition: {
    modelPath: '/models/hangul-hanja-v1',    // ML 모델 경로
    confidenceThreshold: 0.75,               // 인식 신뢰도 임계값
    preprocessingSteps: [                    // 전처리 단계
      'normalize',      // 크기 정규화
      'center',         // 중앙 정렬
      'denoise'         // 노이즈 제거
    ],
    // 문자별 특별 설정
    characterSpecific: {
      'hangul': { threshold: 0.8 },          // 한글은 높은 정확도 요구
      'hanja': { threshold: 0.75 }           // 한자는 상대적으로 관대
    }
  },
  
  // 저장소 설정
  storage: {
    retentionDays: 30,                       // 데이터 보존 기간
    maxAttempts: 1000,                       // 최대 저장 시도 수
    compressionLevel: 'medium',              // 압축 수준: 'low', 'medium', 'high'
    indexedDBVersion: 1,                     // IndexedDB 스키마 버전
    // 백업 설정
    backup: {
      enabled: false,                        // 클라우드 백업 (향후 기능)
      interval: '1d',                        // 백업 주기
      maxBackups: 7                          // 최대 백업 파일 수
    }
  }
};
```

## 문제 해결

### 문제: 압력이 감지되지 않음
```javascript
/**
 * 압력 감지 지원 여부 확인 및 대체 방안
 * 모든 장치가 압력을 지원하지는 않으므로 fallback 필요
 */
if (!navigator.pointerType || !window.PointerEvent) {
  console.warn('압력 감지가 지원되지 않는 환경입니다.');
  // 속도 기반 굵기 계산으로 대체
  strokeCapture.useFallbackThickness({
    method: 'velocity',     // 속도 기반 굵기 계산
    minSpeed: 10,          // 최소 속도 (픽셀/초)
    maxSpeed: 200,         // 최대 속도 (픽셀/초)
    inverse: true          // 빠를수록 얇게 (붓의 특성)
  });
}

// 터치 장치에서의 압력 시뮬레이션
if (device.type === 'touch') {
  strokeCapture.enableTouchPressureSimulation({
    basePressure: 0.6,     // 기본 압력값
    variation: 0.2         // 랜덤 변화폭
  });
}
```

### 문제: 글자가 인식되지 않음
```javascript
/**
 * 인식 실패시 대응 방안
 * 신뢰도 임계값 조정 및 수동 선택 옵션 제공
 */
try {
  const recognition = await recognizeCharacter(strokeData);
  if (recognition.confidence < 0.7) {
    // 신뢰도가 낮을 때 임계값 낮춰서 재시도
    evaluator.setConfidenceThreshold(0.5);
    const retryRecognition = await recognizeCharacter(strokeData, { retry: true });
    
    if (retryRecognition.confidence < 0.5) {
      // 여전히 낮으면 수동 선택 UI 표시
      const manualChar = await showCharacterSelectionUI(strokeData);
      return manualChar;
    }
  }
} catch (error) {
  console.error('문자 인식 실패:', error);
  // 오류 발생시 사용자에게 재시도 안내
  showRetryMessage('글자를 다시 천천히 써보세요.');
}
```

### 문제: Canvas 렌더링 이슈
```javascript
/**
 * Canvas DPI 및 렌더링 최적화
 * 고해상도 디스플레이에서의 선명도 문제 해결
 */
function setupHighDPICanvas(canvas) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;  // 디바이스 픽셀 비율
  
  // 실제 픽셀 크기 설정
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  // CSS 크기는 원래대로 유지
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  
  // 컨텍스트 스케일 조정
  ctx.scale(dpr, dpr);
  
  // 안티앨리어싱 설정
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
}

// 성능 최적화: 불필요한 리렌더링 방지
function optimizeCanvasPerformance(canvas) {
  const ctx = canvas.getContext('2d');
  
  // 오프스크린 캔버스 사용
  const offscreen = new OffscreenCanvas(canvas.width, canvas.height);
  const offscreenCtx = offscreen.getContext('2d');
  
  // 배치 렌더링으로 성능 향상
  requestAnimationFrame(() => {
    // 오프스크린에서 그리기 작업 수행
    // 완료 후 메인 캔버스에 한 번에 복사
    ctx.drawImage(offscreen, 0, 0);
  });
}
```

## 다음 단계

1. **평가 가중치 맞춤 설정** - 실력 수준별 다른 평가 기준 적용
2. **커스텀 글자 추가** - 연습 세트에 새로운 글자 추가
3. **연습 데이터 내보내기** - 진도 분석을 위한 데이터 추출
4. **학습 관리 시스템 연동** - 교육 기관용 기능 통합
5. **멀티플레이어 연습 세션** - 실시간 협업 연습 기능

## API 참조

상세한 API 문서는 [API 계약서](./contracts/api-contracts.yaml)를 참조하세요.

## 지원

- 문서: `/docs`
- 이슈 보고: [GitHub Issues]
- 커뮤니티: [Discord/Forum]
- 이메일: support@calligraphy-coach.com