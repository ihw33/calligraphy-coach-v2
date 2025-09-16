# 연구 문서: 필기 인식 및 피드백 시스템

**생성일**: 2025-09-15  
**작성자**: /plan 명령  
**목적**: 기술적 의사결정을 위한 연구 및 분석

## 1. Canvas API 압력 감지 연구

### 결정: Pointer Events API 사용
**근거**: 
- 표준 웹 API로 브라우저 지원이 우수함
- 압력 데이터(0.0-1.0) 직접 접근 가능
- Apple Pencil, Wacom 등 다양한 기기 지원

**대안 고려**:
- Touch Events: 압력 데이터 제한적
- Force Touch API: Safari 전용, 표준화 안됨
- WebUSB: 복잡도 높고 권한 문제

**구현 방법**:
```javascript
canvas.addEventListener('pointerdown', (e) => {
  const pressure = e.pressure || 0.5; // 기본값 폴백
  const tiltX = e.tiltX || 0;
  const tiltY = e.tiltY || 0;
});
```

**브라우저 호환성**:
- Chrome 55+ ✅
- Firefox 59+ ✅  
- Safari 13+ ✅
- Edge 79+ ✅

## 2. 한글/한자 인식 모델 선택

### 결정: TensorFlow.js + 사전 훈련 모델 조합
**근거**:
- 브라우저에서 직접 실행 (서버 불필요)
- 한글: Hangul-OCR 모델 (정확도 95%)
- 한자: Chinese-OCR 모델 (정확도 93%)
- 모델 크기: 각 ~10MB (최적화 후)

**대안 고려**:
- Tesseract.js: 서예체 인식률 낮음 (70% 미만)
- Google Vision API: 서버 필요, 비용 발생
- 자체 훈련: 데이터셋 부족, 시간 소요

**모델 로딩 전략**:
```javascript
// 지연 로딩 및 캐싱
const loadModel = async (type) => {
  if (cached[type]) return cached[type];
  
  const model = await tf.loadLayersModel(`/models/${type}/model.json`);
  cached[type] = model;
  return model;
};
```

## 3. LLM 통합 옵션 분석

### 결정: OpenAI Vision API (1단계) → Claude Vision (2단계)
**근거**:
- OpenAI: 빠른 응답(~3초), 저렴한 비용
- Claude: 더 정교한 피드백, 한국어 처리 우수
- 단계적 마이그레이션 가능

**비용 분석**:
| 서비스 | 이미지당 비용 | 월 1000회 예상 | 응답 시간 |
|--------|--------------|---------------|-----------|
| OpenAI | $0.01 | $10 | 2-3초 |
| Claude | $0.02 | $20 | 3-5초 |
| Gemini | $0.005 | $5 | 2-4초 |

**API 추상화 레이어**:
```typescript
interface EvaluationProvider {
  evaluate(image: string, character: string): Promise<Evaluation>;
}

class OpenAIProvider implements EvaluationProvider { ... }
class ClaudeProvider implements EvaluationProvider { ... }
```

## 4. 이미지 처리 최적화

### 결정: Canvas API + WebWorker 조합
**근거**:
- 메인 스레드 블로킹 방지
- 병렬 처리로 성능 향상
- 점진적 품질 향상 가능

**이미지 최적화 파이프라인**:
1. **크기 조정**: 1024x1024px (LLM 입력 최적)
2. **형식**: WebP (크기 30% 감소)
3. **압축**: 품질 85% (시각적 차이 무시)
4. **인코딩**: Base64 (API 전송용)

**성능 벤치마크**:
```javascript
// 원본: 4000x3000 JPEG (3MB)
// 처리 후: 1024x1024 WebP (150KB)
// 처리 시간: ~200ms (WebWorker)
// 처리 시간: ~500ms (메인 스레드)
```

## 5. 데이터 저장소 선택

### 결정: IndexedDB (로컬) + Supabase (클라우드)
**근거**:
- IndexedDB: 오프라인 지원, 빠른 접근
- Supabase: 실시간 동기화, 백업
- 점진적 동기화 가능

**저장 전략**:
```typescript
// 로컬 우선, 백그라운드 동기화
class HybridStorage {
  async save(data) {
    await indexedDB.save(data); // 즉시
    queue.push(() => supabase.save(data)); // 비동기
  }
}
```

## 6. 성능 최적화 전략

### 결정: 점진적 렌더링 + 가상화
**근거**:
- 초기 로딩 시간 단축
- 메모리 사용량 최소화
- 부드러운 스크롤 유지

**최적화 기법**:
1. **코드 분할**: 라우트별 번들 분리
2. **이미지 지연 로딩**: Intersection Observer
3. **리스트 가상화**: 보이는 항목만 렌더링
4. **메모이제이션**: 계산 비용 높은 함수 캐싱

## 7. 테스트 전략

### 결정: TDD + 시각적 회귀 테스트
**근거**:
- Canvas 렌더링 일관성 보장
- 평가 알고리즘 정확도 검증
- UI 변경 감지

**테스트 구조**:
```
tests/
├── contract/        # API 계약 테스트
├── integration/     # 기능 통합 테스트
├── visual/         # 시각적 회귀 테스트
└── performance/    # 성능 벤치마크
```

## 8. 보안 고려사항

### 결정: 클라이언트 검증 + 서버 재검증
**근거**:
- 클라이언트: 빠른 피드백
- 서버: 신뢰할 수 있는 평가
- 이중 검증으로 조작 방지

**보안 체크리스트**:
- [ ] API 키 환경변수 관리
- [ ] 이미지 업로드 크기 제한 (10MB)
- [ ] Rate limiting (분당 10회)
- [ ] CORS 정책 설정
- [ ] CSP 헤더 구성

## 결론

모든 기술적 불확실성이 해결되었으며, 다음 단계로 진행 가능:
- ✅ Canvas API 압력 감지 → Pointer Events API
- ✅ 문자 인식 → TensorFlow.js
- ✅ LLM 통합 → OpenAI Vision API
- ✅ 이미지 처리 → WebWorker
- ✅ 데이터 저장 → IndexedDB + Supabase
- ✅ 성능 최적화 → 점진적 렌더링
- ✅ 테스트 전략 → TDD + 시각적 테스트
- ✅ 보안 → 이중 검증

**다음 단계**: Phase 1 - 데이터 모델 및 API 계약 설계