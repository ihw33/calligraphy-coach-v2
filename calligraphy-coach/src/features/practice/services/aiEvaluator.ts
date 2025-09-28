/**
 * AI 평가 서비스
 * Canvas 이미지를 AI로 분석하여 서예 평가 결과 생성
 */
import { evaluationStrategyFactory } from '../strategies/EvaluationStrategyFactory';

export interface AIEvaluationRequest {
  imageBase64: string;
  targetCharacter: string;
  characterType: 'korean' | 'chinese';
  strokeCount: number;
  inputMode: 'digital' | 'physical'; // 입력 모드 추가
  // 황자원 92법 관련 추가 필드
  courseId?: string;
  lessonId?: string; // 레슨 ID (h92-01, h92-02 등)
  lessonType?: string; // 천복자, 지재자, 좌포자, 우포자
  evaluationPoints?: string[]; // 평가 포인트 목록
}

export interface AIEvaluationResponse {
  // 점수 (입력 모드에 따라 다름)
  scores: {
    // 디지털 모드: 정확성(50) + 위치(30) + 매끄러움(20)
    // 실물 모드: 형태(40) + 비례(30) + 필압(20) + 획순(10)
    항목1: { name: string; score: number; maxScore: number };
    항목2: { name: string; score: number; maxScore: number };
    항목3: { name: string; score: number; maxScore: number };
    항목4?: { name: string; score: number; maxScore: number }; // 실물만
  };
  
  // 인식 결과
  recognition: {
    character: string;
    confidence: number;
    isCorrect: boolean;
  };
  
  // AI 생성 총평
  총평: string;
  
  // 체크리스트 항목들
  checklist: {
    형태: {
      정확한인식: boolean;
      기본구조: boolean;
      세부정확도: boolean;
    };
    비례: {
      중심위치: boolean;
      적절한크기: boolean;
      균형비율: boolean;
    };
    굵기: {
      압력기본: boolean;
      일정유지: boolean;
      전문가수준: boolean;
    };
    획순: {
      정확한획수: boolean;
      올바른순서: boolean;
      표준준수: boolean;
    };
  };
  
  // 구체적 피드백
  strengths: string[];
  improvements: string[];
  
  // 원본 AI 응답 (디버깅용)
  rawResponse?: string;
}

/**
 * 한자별 구조 분석 데이터
 */
function getCharStructure(char: string): string {
  const structures: Record<string, string> = {
    '宇': '宀(갓머리) + 于(우) - 갓머리가 于를 완전히 덮어야 함',
    '宙': '宀(갓머리) + 由(유) - 갓머리가 由를 포근히 감싸야 함',
    '宝': '宀(갓머리) + 玉(옥) - 보물을 보호하는 느낌',
    '室': '宀(갓머리) + 至(이를 지) - 방 안에 안전하게 들어있는 형태'
  };
  return structures[char] || '';
}

/**
 * 천복자 구체적 피드백 생성
 */
function getSebeop1Feedback(char: string): Record<string, string[]> {
  const feedback: Record<string, string[]> = {
    '宇': [
      "갓머리(宀)의 첫 번째 점을 좌상단에서 시작하세요",
      "갓머리(宀)의 가로획을 좌우 끝까지 충분히 길게 그으세요",
      "갓머리(宀)의 왼쪽 세로획과 오른쪽 삐침은 대칭이 되도록",
      "于의 가로획이 갓머리 밖으로 나오지 않게 조절하세요",
      "于의 세로획 길이를 갓머리 높이의 2배 정도로"
    ],
    '宙': [
      "갓머리(宀)를 由보다 1.5배 넓게 그리세요",
      "由의 세로획들이 갓머리 안에 완전히 들어가도록",
      "由의 가로획 3개가 균등한 간격을 유지하도록",
      "갓머리의 양쪽 끝이 由의 좌우 끝보다 3-5mm 더 나가도록"
    ],
    '宝': [
      "갓머리(宀)를 보물(玉)을 감싸듯 포근하게",
      "玉의 가로획 3개가 점진적으로 짧아지도록",
      "玉의 점은 정중앙에 작고 단정하게",
      "전체적으로 보물을 보호하는 느낌이 나도록"
    ],
    '室': [
      "갓머리(宀)의 폭을 至보다 충분히 넓게",
      "至의 첫 가로획이 갓머리에 너무 가깝지 않게",
      "至의 土 부분이 갓머리 중앙 아래 정렬되도록",
      "전체 높이의 1/3을 갓머리, 2/3를 至에 배분"
    ]
  };
  return feedback[char] || ["천복자의 기본 원칙에 따라 상단이 하단을 완전히 덮도록 하세요"];
}

/**
 * 황자원 92법 서법 1 (천복자) 전용 프롬프트 - 성능 최적화 버전
 */
function generateHwang92Sebeop1Prompt(targetChar: string, evaluationPoints: string[]): string {
  const charStructure = getCharStructure(targetChar);
  const specificFeedback = getSebeop1Feedback(targetChar);
  
  return `당신은 황자원 92법 전문가입니다. 천복자(天覆字) 구조의 한자를 평가합니다.

【평가 대상】
글자: ${targetChar}
구조: ${charStructure}

【천복자 핵심】
갓머리(宀)가 아래 요소를 완전히 보호하는 구조
- 갓머리의 가로획이 전체 너비의 90% 이상 덮어야 함
- 아래 요소가 갓머리 안에 70-80% 들어가야 함
- 시각적으로 우산/지붕의 보호감이 느껴져야 함

【${targetChar}의 구체적 체크 포인트】
${specificFeedback[targetChar] ? specificFeedback[targetChar].slice(0, 3).map((f, i) => `${i+1}. ${f}`).join('\n') : evaluationPoints.join('\n')}

【평가 기준】
1. 덮개 구조 (40점): 갓머리가 충분히 넓게 덮는가?
2. 보호 관계 (30점): 아래가 안전하게 보호받는가?
3. 공간 비례 (20점): 상하 비율이 1:3 정도인가?
4. 결구 완성도 (10점): 천복자의 특징이 명확한가?

【체크리스트】
${evaluationPoints.map(p => `□ ${p}`).join('\n')}

JSON으로만 답변 (improvements는 다음 예시처럼 구체적으로):
{
  "recognized_character": "${targetChar}",
  "confidence": 0.8-1.0,
  "scores": {
    "덮개구조": 0-40,
    "보호관계": 0-30,
    "공간비례": 0-20,
    "결구완성도": 0-10
  },
  "checklist": {
    "덮개충분": true/false,
    "내부안전": true/false,
    "비례적절": true/false,
    "안정감표현": true/false
  },
  "analysis": "천복자 관점에서 간단한 분석 (1-2문장)",
  "improvements": [
    "${targetChar === '宇' ? '갓머리(宀)의 가로획을 좌우로 5mm 더 연장하세요' : '구체적 개선점 1'}",
    "${targetChar === '宇' ? '于의 세로획을 3mm 짧게 하여 갓머리 안에 넣으세요' : '구체적 개선점 2'}"
  ]
}`;
}

/**
 * 황자원 92법 전용 평가 프롬프트 생성 (기존 함수 - 다른 서법용)
 */
function generateHwang92EvaluationPrompt(targetChar: string, lessonType: string, evaluationPoints: string[]): string {
  // 서법 1(천복자)인 경우 최적화된 프롬프트 사용
  if (lessonType === '천복자') {
    return generateHwang92Sebeop1Prompt(targetChar, evaluationPoints);
  }
  
  // 다른 서법들의 기준 (추후 구현)
  const lessonCriteria: Record<string, string> = {
    '지재자': `지재자(地載字) 평가 기준...`,
    '좌포자': `좌포자(左抱字) 평가 기준...`,
    '우포자': `우포자(右抱字) 평가 기준...`
  };

  const criteria = lessonCriteria[lessonType] || '기본 평가 기준';
  const pointsText = evaluationPoints.map((p, i) => `${i+1}. ${p}`).join('\n');

  return `
당신은 황자원 92법 전문 서예 교사입니다. 
황자원 92법은 서체가 아닌 한자의 결구법(結構法)을 체계화한 것입니다.
제출된 한자를 황자원 92법의 ${lessonType} 기준으로 평가해주세요.

목표 글자: ${targetChar}
서법 유형: ${lessonType}

${criteria}

세부 체크 포인트:
${pointsText}

JSON 형식으로 응답해주세요.`;
}

/**
 * AI 평가 프롬프트 생성
 */
function generateEvaluationPrompt(targetChar: string, strokeCount: number, characterType: string): string {
  return `
당신은 전문 서예 교사입니다. 제출된 서예 이미지를 평가해주세요.

목표 글자: ${targetChar}
글자 유형: ${characterType === 'korean' ? '한글' : '한자'}
작성한 획수: ${strokeCount}개

다음 기준으로 평가해주세요:

1. 형태 (40점 만점)
   - 글자를 정확히 인식할 수 있는가?
   - 기본 구조가 올바른가?
   - 세부 형태가 정확한가?

2. 비례 (30점 만점)
   - 글자가 중심에 위치하는가?
   - 크기가 적절한가?
   - 전체적인 균형이 잡혀있는가?

3. 굵기 (20점 만점)
   - 압력 조절이 되고 있는가?
   - 선의 굵기가 일정한가?
   - 시작과 끝처리가 깔끔한가?

4. 획순 (10점 만점)
   - 획수가 정확한가? (${targetChar}의 표준 획수와 비교)
   - 순서가 올바른가?
   - 표준 획순을 준수하는가?

JSON 형식으로 응답해주세요:
{
  "recognized_character": "인식된 글자",
  "confidence": 0.0-1.0,
  "scores": {
    "형태": 0-40,
    "비례": 0-30,
    "굵기": 0-20,
    "획순": 0-10
  },
  "총평": "학생의 글씨에 대한 종합적이고 따뜻한 평가 (2-3문장)",
  "잘한점": ["구체적인 칭찬 1", "구체적인 칭찬 2", "구체적인 칭찬 3"],
  "개선점": ["구체적인 개선 제안 1", "구체적인 개선 제안 2"]
}`;
}

/**
 * 예상 획수 헬퍼 함수
 */
function getExpectedStrokeCount(char: string): number {
  const strokeCounts: Record<string, number> = {
    // 한글 (초성 + 중성 + 종성)
    '가': 3,  // ㄱ(1) + ㅏ(2)
    '나': 3,  // ㄴ(1) + ㅏ(2)  
    '다': 4,  // ㄷ(2) + ㅏ(2)
    '라': 4,  // ㄹ(3) + ㅏ(2) -> 실제로는 획을 이어서 4획
    '마': 4,  // ㅁ(3) + ㅏ(2) -> 실제로는 획을 이어서 4획
    '바': 5,  // ㅂ(3) + ㅏ(2)
    '작': 6,  // ㅈ(3) + ㅏ(2) + ㄱ(1) = 6획
    '사': 3,  // ㅅ(1) + ㅏ(2)
    '아': 3,  // ㅇ(1) + ㅏ(2)
    '자': 4,  // ㅈ(2) + ㅏ(2)
    '차': 4,  // ㅊ(3) + ㅏ(2) -> 실제로는 4획
    // 한자
    '宇': 6, '宙': 8, '星': 9, '月': 4, '日': 4,
    '人': 2, '大': 3, '天': 4, '太': 4, '夫': 4
  };
  return strokeCounts[char] || 3;
}

/**
 * Canvas 이미지 분석 함수
 */
function analyzeCanvasImage(imageBase64: string): {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  pixelCount: number;
} {
  // Base64를 디코딩하여 실제 이미지 데이터 분석 시뮬레이션
  // 실제로는 Canvas에서 픽셀 데이터를 분석해야 함
  
  // 임시로 이미지 크기를 400x400으로 가정
  const canvasSize = 400;
  const centerCanvas = canvasSize / 2; // 200, 200이 중심
  
  // Base64 길이를 기반으로 글자 크기 추정 (더 많은 데이터 = 더 큰 글자)
  const dataLength = imageBase64.length;
  const estimatedPixelCount = Math.max(100, Math.min(5000, dataLength / 100));
  
  // 글자 크기 추정 (픽셀 수 기반)
  const estimatedSize = Math.sqrt(estimatedPixelCount);
  
  // 위치 분석 시뮬레이션 (실제로는 픽셀 분포를 분석해야 함)
  // 이미지 데이터의 해시값을 기반으로 위치 추정
  const hash = imageBase64.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const centerX = centerCanvas + (hash % 100) - 50; // 중심에서 ±50px 범위
  const centerY = centerCanvas + ((hash >> 8) % 100) - 50;
  
  return {
    centerX,
    centerY,
    width: estimatedSize,
    height: estimatedSize,
    pixelCount: estimatedPixelCount
  };
}

/**
 * Mock AI 평가 (실제 Canvas 분석 포함)
 */
async function mockAIEvaluation(request: AIEvaluationRequest): Promise<AIEvaluationResponse> {
  // 시뮬레이션을 위한 지연
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 실제 Canvas 이미지 분석 (전달받은 분석 데이터 사용)
  const analysis = (request as any).analysis || analyzeCanvasImage(request.imageBase64);
  
  // 획수 기반으로 더 정확한 평가
  const expectedStrokeCount = getExpectedStrokeCount(request.targetCharacter);
  const strokeDiff = Math.abs(expectedStrokeCount - request.strokeCount);
  
  // 목표 글자와 비교하여 인식 정확도 결정
  const isCorrect = strokeDiff <= 1 && Math.random() > 0.2;
  
  let scores: AIEvaluationResponse['scores'];
  let 총점: number;
  
  if (request.inputMode === 'digital') {
    // 🖥️ 디지털 모드 평가 (정확성 중심)
    const 정확성점수 = isCorrect ? 
      Math.min(50, Math.round(40 + Math.random() * 10)) :  // 정확하면 40-50점
      Math.min(50, Math.round(20 + Math.random() * 15));   // 부정확하면 20-35점
    
    // 위치 점수 - 실제 분석 기반
    const canvasCenter = 200; // 400px 캔버스의 중심
    const centerDistance = Math.sqrt(
      Math.pow(analysis.centerX - canvasCenter, 2) + 
      Math.pow(analysis.centerY - canvasCenter, 2)
    );
    
    let 위치점수: number;
    if (centerDistance <= 30) {
      위치점수 = 25 + Math.round(Math.random() * 5); // 중심 근처: 25-30점
    } else if (centerDistance <= 60) {
      위치점수 = 20 + Math.round(Math.random() * 5); // 조금 벗어남: 20-25점
    } else if (centerDistance <= 100) {
      위치점수 = 10 + Math.round(Math.random() * 10); // 많이 벗어남: 10-20점
    } else {
      위치점수 = Math.round(Math.random() * 10); // 매우 벗어남: 0-10점
    }
    
    // 크기 점수 - 적절한 크기인지 평가
    const idealSize = 150; // 이상적인 글자 크기
    const sizeDiff = Math.abs(analysis.width - idealSize);
    let 크기보너스 = 0;
    if (sizeDiff <= 30) {
      크기보너스 = 5; // 적절한 크기면 보너스
    } else if (sizeDiff <= 60) {
      크기보너스 = 2; // 조금 차이나면 약간 보너스
    }
    위치점수 = Math.min(30, 위치점수 + 크기보너스);
    
    const 매끄러움점수 = Math.min(20, Math.round(14 + Math.random() * 6)); // 14-20점 (선의 품질)
    
    // 디지털 모드에서도 획수 기반 간단한 점수 (보조 항목)
    let 획수점수: number;
    if (strokeDiff === 0) {
      획수점수 = 10; // 정확한 획수: 만점
    } else if (strokeDiff === 1) {
      획수점수 = 7; // 1획 차이: 7점
    } else if (strokeDiff === 2) {
      획수점수 = 4; // 2획 차이: 4점
    } else {
      획수점수 = 1; // 3획 이상 차이: 1점
    }
    
    scores = {
      항목1: { name: '정확성', score: 정확성점수, maxScore: 50 },
      항목2: { name: '위치', score: 위치점수, maxScore: 30 },
      항목3: { name: '매끄러움', score: 매끄러움점수, maxScore: 20 },
      항목4: { name: '획수', score: 획수점수, maxScore: 10 } // 디지털에서는 획수만 평가
    };
    
    // 디지털 모드: 110점을 100점으로 정규화
    const rawTotal = 정확성점수 + 위치점수 + 매끄러움점수 + 획수점수;
    총점 = Math.round((rawTotal / 110) * 100);
    
  } else {
    // 🖌️ 실물 모드 평가 (전통 서예 기준)
    const 형태점수 = isCorrect ? 
      Math.min(40, Math.round(30 + Math.random() * 10)) :  // 정확하면 30-40점
      Math.min(40, Math.round(15 + Math.random() * 10));   // 부정확하면 15-25점
    
    const 비례점수 = Math.min(30, Math.round(20 + Math.random() * 10)); // 20-30점
    
    const 필압점수 = Math.min(20, Math.round(10 + Math.random() * 10)); // 10-20점 (실물은 다양)
    
    let 획순점수;
    if (strokeDiff === 0) {
      획순점수 = Math.min(10, Math.round(8 + Math.random() * 2)); // 8-10점
    } else if (strokeDiff === 1) {
      획순점수 = Math.min(10, Math.round(6 + Math.random() * 2)); // 6-8점
    } else {
      획순점수 = Math.min(10, Math.round(3 + Math.random() * 3)); // 3-6점
    }
    
    scores = {
      항목1: { name: '형태', score: 형태점수, maxScore: 40 },
      항목2: { name: '비례', score: 비례점수, maxScore: 30 },
      항목3: { name: '필압', score: 필압점수, maxScore: 20 },
      항목4: { name: '획순', score: 획순점수, maxScore: 10 }
    };
    
    총점 = 형태점수 + 비례점수 + 필압점수 + 획순점수;
  }
  
  // 총점 계산 (입력 모드에 따라 다름)
  // 이미 위에서 총점이 계산되었음
  
  // 점수에 따른 총평 생성 (입력 모드별 맞춤 메시지)
  const digitalTemplates = {
    excellent: [
      `와! 정말 멋진 '${request.targetCharacter}' 글자네요! 🎨 디지털 캔버스에서 이렇게 정확하고 균형잡힌 글씨를 쓰다니, 마치 진짜 붓으로 쓴 것 같아요. 특히 격자 중심을 잘 지키면서도 글자의 고유한 아름다움을 살렸습니다!`,
      `대단합니다! ✨ 마우스(터치)로 이런 완성도 높은 서예를 구사하다니... 정말 인상적이에요! 선의 시작과 끝 처리가 매우 자연스럽고, 전체적인 글자 균형이 마치 서예 전문가의 작품 같습니다.`,
      `놀라워요! 🌟 디지털 환경의 한계를 뛰어넘어 이렇게 아름다운 글씨를 완성하셨네요. 특히 ${request.targetCharacter}의 특징적인 부분들을 정확히 표현했고, 격자 활용도 완벽합니다!`
    ],
    good: [
      `좋은 시도입니다! 👍 '${request.targetCharacter}' 글자의 기본 형태는 잘 잡혔어요. 디지털에서 이 정도면 충분히 좋은 수준이에요! 다음엔 선을 조금 더 부드럽게 이어가보면 어떨까요?`,
      `잘하고 있어요! 💪 격자 안에서의 위치 감각이 좋습니다. 이제 손목의 힘을 조금 더 빼고 자연스럽게 그어보세요. 곧 한 단계 더 발전한 글씨를 볼 수 있을 거예요!`,
      `꽤 안정적인 글씨네요! ☺️ 기본기는 탄탄해 보입니다. 조금 더 자신감을 가지고 시원시원하게 써보세요. 디지털에서도 충분히 멋진 서예가 가능하답니다!`
    ],
    needsWork: [
      `좋은 시작이에요! 🌱 서예는 꾸준한 연습이 핵심이죠. '${request.targetCharacter}' 글자를 표준 형태와 비교해보면서 차근차근 연습해보세요. 격자 가이드가 큰 도움이 될 거예요!`,
      `노력하는 모습이 보여서 좋습니다! 💖 지금은 기본 형태를 익히는 단계인 것 같아요. 천천히, 정확하게 그리는 연습을 반복하면 분명 실력이 늘 거예요. 포기하지 마세요!`,
      `연습 중이시군요! 📚 먼저 글자의 전체적인 구조를 파악하는 게 중요해요. 각 획이 어떻게 연결되는지 천천히 관찰하고, 격자를 적극 활용해보세요!`
    ]
  };
  
  const physicalTemplates = {
    excellent: [
      "정말 훌륭한 글씨입니다! 기본기가 매우 탄탄하며, 특히 획의 시작과 끝 처리가 매우 깔끔합니다. 이 수준을 꾸준히 유지하며 연습한다면 더욱 아름다운 서예를 완성할 수 있을 것입니다.",
      "아주 잘 쓰셨습니다! 전체적인 균형감이 우수하고, 필압 조절이 매우 안정적입니다. 조금 더 자신감을 가지고 쓴다면 더욱 생동감 있는 글씨가 될 것 같습니다.",
      "뛰어난 실력을 보여주셨네요! 글자의 구조를 정확히 이해하고 있으며, 각 획의 비례가 매우 조화롭습니다. 계속 이런 집중력을 유지해주세요."
    ],
    good: [
      "좋은 시도입니다! 기본 형태는 잘 잡혀있으나, 세부적인 부분에서 조금 더 신경 쓰면 완성도가 높아질 것 같습니다. 특히 획의 마무리 부분을 더 정성스럽게 처리해보세요.",
      "전체적으로 안정적인 글씨입니다. 글자의 중심은 잘 잡혀있지만, 획의 굵기 변화를 좀 더 자연스럽게 표현하면 더욱 멋진 글씨가 될 것입니다.",
      "기본기가 갖춰져 있는 좋은 글씨입니다! 조금 더 여유를 가지고 천천히 쓴다면, 각 획의 특징을 더 잘 살릴 수 있을 것 같습니다."
    ],
    needsWork: [
      "꾸준히 연습하고 계시는 모습이 보입니다! 기본 구조는 이해하고 있지만, 획순과 비례에 더 신경 써주세요. 천천히 정확하게 쓰는 연습을 하면 금방 발전할 수 있을 것입니다.",
      "노력하는 모습이 보여서 좋습니다. 먼저 글자의 전체적인 균형을 생각하며 써보세요. 격자 가이드를 적극 활용하면 더 안정적인 글씨를 쓸 수 있습니다.",
      "서예는 꾸준한 연습이 중요합니다! 현재는 기본 형태를 익히는 단계인 것 같습니다. 표준 글자를 자주 관찰하고, 한 획 한 획 정성스럽게 써보세요."
    ]
  };
  
  // 입력 모드에 따른 총평 선택
  const templates = request.inputMode === 'digital' ? digitalTemplates : physicalTemplates;
  
  let 총평Category: 'excellent' | 'good' | 'needsWork';
  if (총점 >= 85) 총평Category = 'excellent';
  else if (총점 >= 65) 총평Category = 'good';
  else 총평Category = 'needsWork';
  
  const 총평 = templates[총평Category][Math.floor(Math.random() * templates[총평Category].length)];
  
  // 체크리스트 생성 (입력 모드별 맞춤)
  let checklist: AIEvaluationResponse['checklist'];
  
  // 황자원 92법인 경우 특별 처리
  if (request.courseId === 'hwang92-sebeop') {
    // 황자원 92법 체크리스트 (랜덤하게 일부 항목 체크)
    checklist = {
      덮개충분: Math.random() > 0.3, // 70% 확률로 체크
      내부안전: Math.random() > 0.4, // 60% 확률로 체크
      비례적절: Math.random() > 0.3, // 70% 확률로 체크
      안정감표현: Math.random() > 0.5, // 50% 확률로 체크
      // 표준 체크리스트도 포함
      형태: {
        정확한인식: isCorrect,
        기본구조: scores.항목1.score >= 20,
        세부정확도: scores.항목1.score >= 30
      },
      비례: {
        중심위치: scores.항목2.score >= 15,
        적절한크기: scores.항목2.score >= 20,
        균형비율: scores.항목2.score >= 25
      },
      굵기: {
        압력기본: scores.항목3.score >= 10,
        일정유지: scores.항목3.score >= 15,
        전문가수준: scores.항목3.score >= 18
      },
      획순: {
        정확한획수: scores.항목4!.score >= 8,
        올바른순서: scores.항목4!.score >= 6,
        표준준수: scores.항목4!.score >= 8
      }
    };
  } else if (request.inputMode === 'digital') {
    // 🖥️ 디지털 모드 체크리스트
    checklist = {
      형태: {
        정확한인식: isCorrect,
        기본구조: scores.항목1.score >= 25, // 정확성 기준 (50점 중 25점)
        세부정확도: scores.항목1.score >= 40 // 정확성 기준 (50점 중 40점)
      },
      비례: {
        중심위치: scores.항목2.score >= 15, // 위치 기준 (30점 중 15점)
        적절한크기: scores.항목2.score >= 20, // 위치 기준 (30점 중 20점)
        균형비율: scores.항목2.score >= 25 // 위치 기준 (30점 중 25점)
      },
      굵기: {
        압력기본: scores.항목3.score >= 10, // 매끄러움 기준 (20점 중 10점)
        일정유지: scores.항목3.score >= 15, // 매끄러움 기준 (20점 중 15점)
        전문가수준: scores.항목3.score >= 18 // 매끄러움 기준 (20점 중 18점)
      },
      획순: {
        정확한획수: scores.항목4!.score >= 10, // 획수 점수 10점 (만점)
        올바른순서: scores.항목4!.score >= 7,  // 획수 점수 7점 이상
        표준준수: scores.항목4!.score >= 10    // 획수 점수 10점 (만점)
      }
    };
  } else {
    // 🖌️ 실물 모드 체크리스트
    checklist = {
      형태: {
        정확한인식: isCorrect,
        기본구조: scores.항목1.score >= 20, // 형태 기준 (40점 중 20점)
        세부정확도: scores.항목1.score >= 30 // 형태 기준 (40점 중 30점)
      },
      비례: {
        중심위치: scores.항목2.score >= 15, // 비례 기준 (30점 중 15점)
        적절한크기: scores.항목2.score >= 20, // 비례 기준 (30점 중 20점)
        균형비율: scores.항목2.score >= 25 // 비례 기준 (30점 중 25점)
      },
      굵기: {
        압력기본: scores.항목3.score >= 10, // 필압 기준 (20점 중 10점)
        일정유지: scores.항목3.score >= 15, // 필압 기준 (20점 중 15점)
        전문가수준: scores.항목3.score >= 18 // 필압 기준 (20점 중 18점)
      },
      획순: {
        정확한획수: scores.항목4!.score >= 8, // 획순 기준 (10점 중 8점)
        올바른순서: scores.항목4!.score >= 6, // 획순 기준 (10점 중 6점)
        표준준수: scores.항목4!.score >= 8 // 획순 기준 (10점 중 8점)
      }
    };
  }
  
  // 장점과 개선점 생성 (입력 모드별 맞춤)
  const strengths: string[] = [];
  const improvements: string[] = [];
  
  if (request.inputMode === 'digital') {
    // 🖥️ 디지털 모드 피드백
    
    // 정확성 관련
    if (checklist.형태.정확한인식) {
      strengths.push("글자가 정확하게 인식되었습니다");
    } else {
      improvements.push("목표 글자의 기본 형태를 더 정확하게 그려보세요");
    }
    
    // 위치 관련
    if (checklist.비례.균형비율) {
      strengths.push("격자 내에서 위치와 크기가 완벽합니다");
    } else if (checklist.비례.중심위치) {
      strengths.push("글자가 중심에 잘 배치되었습니다");
    } else {
      improvements.push("격자 가이드를 참고해서 글자 크기와 위치를 조정해보세요");
    }
    
    // 매끄러움 관련
    if (checklist.굵기.전문가수준) {
      strengths.push("부드러운 곡선 처리가 뛰어납니다");
    } else if (checklist.굵기.일정유지) {
      strengths.push("선의 굵기가 일정하고 안정적입니다");
    } else {
      improvements.push("천천히 부드럽게 그어서 선의 매끄러움을 향상시켜보세요");
    }
    
  } else {
    // 🖌️ 실물 모드 피드백
    
    // 형태 관련
    if (checklist.형태.정확한인식) {
      strengths.push("글자의 형태가 정확하게 표현되었습니다");
    } else {
      improvements.push("글자의 기본 형태를 더 정확하게 관찰하고 써보세요");
    }
    
    // 비례 관련
    if (checklist.비례.균형비율) {
      strengths.push("전체적인 비례와 균형이 매우 우수합니다");
    } else if (checklist.비례.중심위치) {
      strengths.push("글자가 중심에 잘 배치되었습니다");
    } else {
      improvements.push("격자를 활용해 글자의 크기와 위치를 조정해보세요");
    }
    
    // 필압 관련
    if (checklist.굵기.전문가수준) {
      strengths.push("획의 굵기 조절이 전문가 수준입니다");
    } else if (checklist.굵기.일정유지) {
      strengths.push("안정적인 필압으로 일정한 굵기를 유지했습니다");
    } else {
      improvements.push("붓의 압력을 더 일정하게 유지해보세요");
    }
    
    // 획순 관련
    if (checklist.획순.정확한획수) {
      strengths.push("정확한 획수로 글자를 완성했습니다");
    } else {
      improvements.push(`표준 획수(${request.characterType === 'korean' ? '한글' : '한자'})를 확인하고 연습해보세요`);
    }
  }
  
  // 최소 개수 보장
  if (strengths.length === 0) strengths.push("꾸준히 연습하는 자세가 좋습니다");
  if (improvements.length === 0) improvements.push("더욱 자신감 있게 써보세요");
  
  return {
    scores,
    recognition: {
      character: isCorrect ? request.targetCharacter : 
                (request.characterType === 'korean' ? '나' : '人'),
      confidence: isCorrect ? 0.85 + Math.random() * 0.1 : 0.4 + Math.random() * 0.2,
      isCorrect
    },
    총평,
    checklist,
    strengths,
    improvements
  };
}

/**
 * 실제 GPT-4 Vision API 호출
 */
async function callOpenAIAPI(request: AIEvaluationRequest): Promise<AIEvaluationResponse> {
  const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!API_KEY) {
    console.warn('⚠️ OpenAI API 키가 없습니다. Mock 평가로 대체합니다.');
    return mockAIEvaluation(request);
  }

  try {
    const prompt = `당신은 전문 서예 교사입니다. 제출된 서예 이미지를 평가해주세요.

목표 글자: ${request.targetCharacter}
글자 유형: ${request.characterType === 'korean' ? '한글' : '한자'}
입력 모드: ${request.inputMode === 'digital' ? '디지털 (Canvas)' : '실물 (종이)'}
작성한 획수: ${request.strokeCount}개

${request.inputMode === 'digital' ? 
  `디지털 모드 평가 기준:
1. 정확성 (50점): 글자 형태가 목표와 일치하는가?
2. 위치 (30점): 캔버스 중심에 적절히 배치되었는가?
3. 매끄러움 (20점): 선이 부드럽고 깔끔한가?
4. 획수 (10점): 정확한 획수로 작성했는가?` :
  `실물 모드 평가 기준:
1. 형태 (40점): 글자의 기본 구조와 형태
2. 비례 (30점): 글자의 균형과 비례
3. 필압 (20점): 붓의 압력 조절과 굵기 변화
4. 획순 (10점): 정확한 획순과 순서`
}

JSON 형식으로 정확히 응답해주세요:
{
  "scores": {
    "항목1": {"name": "${request.inputMode === 'digital' ? '정확성' : '형태'}", "score": 숫자, "maxScore": ${request.inputMode === 'digital' ? 50 : 40}},
    "항목2": {"name": "${request.inputMode === 'digital' ? '위치' : '비례'}", "score": 숫자, "maxScore": 30},
    "항목3": {"name": "${request.inputMode === 'digital' ? '매끄러움' : '필압'}", "score": 숫자, "maxScore": 20},
    "항목4": {"name": "${request.inputMode === 'digital' ? '획수' : '획순'}", "score": 숫자, "maxScore": 10}
  },
  "recognition": {
    "character": "인식된_글자",
    "confidence": 0.85,
    "isCorrect": true
  },
  "총평": "학생의 글씨에 대한 종합적이고 따뜻한 평가 (2-3문장)",
  "strengths": ["구체적인 칭찬 1", "구체적인 칭찬 2"],
  "improvements": ["구체적인 개선 제안 1", "구체적인 개선 제안 2"]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4-vision-preview",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: [
            { 
              type: "text", 
              text: prompt
            },
            { 
              type: "image_url", 
              image_url: { 
                url: `data:image/png;base64,${request.imageBase64}`,
                detail: "high"
              }
            }
          ]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API 에러: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('🤖 GPT-4 Vision 원본 응답:', content);
    
    // JSON 파싱
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('JSON 형식을 찾을 수 없습니다');
    }
    
    const result = JSON.parse(jsonMatch[0]);
    
    // 체크리스트 생성 (Mock 함수와 동일한 로직 사용)
    const analysis = (request as any).analysis;
    const checklist = generateChecklist(result, request, analysis);
    
    return {
      scores: result.scores,
      recognition: result.recognition,
      총평: result.총평,
      checklist,
      strengths: result.strengths || ["AI가 분석한 장점"],
      improvements: result.improvements || ["AI가 제안한 개선점"]
    };

  } catch (error) {
    console.error('❌ GPT-4 Vision API 호출 실패:', error);
    console.log('🔄 Mock 평가로 대체합니다.');
    return mockAIEvaluation(request);
  }
}

/**
 * Google Gemini Vision API 호출
 */
async function callGeminiAPI(request: AIEvaluationRequest): Promise<AIEvaluationResponse> {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!API_KEY) {
    console.warn('⚠️ Gemini API 키가 없습니다. Mock 평가로 대체합니다.');
    return mockAIEvaluation(request);
  }

  try {
    // Strategy 패턴으로 프롬프트 생성
    let prompt: string;
    
    if (request.courseId && request.lessonId) {
      const strategy = evaluationStrategyFactory.getStrategy(request.courseId, request.lessonId);
      
      // Strategy에 generatePrompt 메서드가 있는지 확인
      if ('generatePrompt' in strategy && typeof strategy.generatePrompt === 'function') {
        prompt = strategy.generatePrompt(request.targetCharacter);
      } else if (request.courseId === 'hwang92-sebeop' && request.lessonType && request.evaluationPoints) {
        // 기존 황자원 92법 프롬프트 (폴백)
        prompt = generateHwang92EvaluationPrompt(
          request.targetCharacter,
          request.lessonType,
          request.evaluationPoints
        );
      } else {
        prompt = `판본체 서예 전문가로서 '${request.targetCharacter}' 글자를 평가해주세요 (${request.strokeCount}획)

📝 평가 기준: 한국 전통 판본체
🎨 판본체 특징:
- 자음과 모음의 균형잡힌 배치
- 획의 시작과 끝이 명확하고 힘이 있음
- 단정하고 격조 있는 형태
- 전통 붓글씨의 우아함과 절제미

JSON만 출력:
{
  "scores": {
    "항목1": {"name": "${request.inputMode === 'digital' ? '정확성' : '형태'}", "score": 숫자, "maxScore": ${request.inputMode === 'digital' ? 50 : 40}},
    "항목2": {"name": "${request.inputMode === 'digital' ? '위치' : '비례'}", "score": 숫자, "maxScore": 30},
    "항목3": {"name": "${request.inputMode === 'digital' ? '매끄러움' : '필압'}", "score": 숫자, "maxScore": 20},
    "항목4": {"name": "${request.inputMode === 'digital' ? '획수' : '획순'}", "score": 숫자, "maxScore": 10}
  },
  "recognition": {"character": "인식글자", "confidence": 0.9, "isCorrect": true},
  "총평": "판본체 기준으로 구체적인 개선 방법을 제공하세요. 예: '판본체 특성상 ㄱ의 가로획을 조금 더 힘있게 그어주고, ㅏ의 세로획과 가로획이 판본체 비율에 맞게 조화를 이루면 더욱 전통적이고 균형잡힌 글씨가 될 것입니다. 판본체는 절제된 아름다움이 특징이므로...'",
  "strengths": ["판본체 관점에서의 장점1", "판본체 관점에서의 장점2"],
  "improvements": ["판본체 기준 구체적인 개선방법1", "판본체 기준 구체적인 개선방법2", "판본체 기준 구체적인 개선방법3"]
}`;
      }
    } else {
      // courseId나 lessonId가 없는 경우 일반 프롬프트 (기본 판본체)
      prompt = `판본체 서예 전문가로서 '${request.targetCharacter}' 글자를 평가해주세요 (${request.strokeCount}획)

📝 평가 기준: 한국 전통 판본체
🎨 판본체 특징:
- 자음과 모음의 균형잡힌 배치
- 획의 시작과 끝이 명확하고 힘이 있음
- 단정하고 격조 있는 형태
- 전통 붓글씨의 우아함과 절제미

JSON만 출력:
{
  "scores": {
    "항목1": {"name": "${request.inputMode === 'digital' ? '정확성' : '형태'}", "score": 숫자, "maxScore": ${request.inputMode === 'digital' ? 50 : 40}},
    "항목2": {"name": "${request.inputMode === 'digital' ? '위치' : '비례'}", "score": 숫자, "maxScore": 30},
    "항목3": {"name": "${request.inputMode === 'digital' ? '매끄러움' : '필압'}", "score": 숫자, "maxScore": 20},
    "항목4": {"name": "${request.inputMode === 'digital' ? '획수' : '획순'}", "score": 숫자, "maxScore": 10}
  },
  "recognition": {"character": "인식글자", "confidence": 0.9, "isCorrect": true},
  "총평": "판본체 기준으로 구체적인 개선 방법을 제공하세요.",
  "strengths": ["판본체 관점에서의 장점1", "판본체 관점에서의 장점2"],
  "improvements": ["판본체 기준 구체적인 개선방법1", "판본체 기준 구체적인 개선방법2"]
}`;
    }
    
    // 입력 모드별 추가 프롬프트
    if (request.inputMode === 'digital') {
      prompt += `\n\n⚡ 디지털 모드 평가 기준:
- Canvas에서 그린 디지털 획의 매끄러움
- 압력 시뮬레이션이 잘 되었는지
- 획의 시작과 끝처리가 깔끔한지
- 디지털 환경에서의 붓터치 재현도`;
    } else {
      prompt += `\n\n📸 실물 모드 평가 기준:
- 실제 붓과 먹의 질감 표현
- 종이에 스며든 먹의 번짐 정도
- 자연스러운 압력 변화
- 전통 서예의 운필감`;
    }

    // Gemini API 엔드포인트 (최신 2.5 Flash 모델 사용)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: prompt
            },
            {
              inline_data: {
                mime_type: "image/png",
                data: request.imageBase64
              }
            }
          ]
        }],
        generationConfig: {
          maxOutputTokens: 4000,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API 에러: ${response.status}`);
    }

    const data = await response.json();
    console.log('🤖 Gemini Vision 전체 응답:', data);
    
    // 토큰 사용량 로그
    if (data.usageMetadata) {
      console.log('💰 토큰 사용량:', {
        promptTokens: data.usageMetadata.promptTokenCount || 0,
        candidatesTokens: data.usageMetadata.candidatesTokenCount || 0,
        totalTokens: data.usageMetadata.totalTokenCount || 0
      });
    }
    
    // 응답 구조 안전하게 확인
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error(`Gemini API 응답에 candidates가 없습니다: ${JSON.stringify(data)}`);
    }
    
    // finishReason 확인
    const candidate = data.candidates[0];
    if (candidate.finishReason === 'MAX_TOKENS') {
      throw new Error('Gemini API 응답이 너무 길어서 잘렸습니다. maxOutputTokens를 늘려주세요.');
    }
    
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      throw new Error(`Gemini API 응답 구조가 예상과 다릅니다: ${JSON.stringify(candidate)}`);
    }
    
    const content = candidate.content.parts[0].text;
    console.log('🤖 Gemini Vision 원본 응답:', content);
    
    // JSON 파싱
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('JSON 형식을 찾을 수 없습니다');
    }
    
    const result = JSON.parse(jsonMatch[0]);
    
    // 황자원 92법 응답 형식 변환
    let convertedResult = result;
    if (request.courseId === 'hwang92-sebeop' && result.scores.덮개구조 !== undefined) {
      // 황자원 92법 형식을 표준 형식으로 변환
      convertedResult = {
        scores: {
          항목1: { name: '덮개구조', score: result.scores.덮개구조, maxScore: 40 },
          항목2: { name: '보호관계', score: result.scores.보호관계, maxScore: 30 },
          항목3: { name: '공간비례', score: result.scores.공간비례, maxScore: 20 },
          항목4: { name: '결구완성도', score: result.scores.결구완성도, maxScore: 10 }
        },
        recognition: result.recognized_character ? {
          character: result.recognized_character,
          confidence: result.confidence || 0.9,
          isCorrect: result.recognized_character === request.targetCharacter
        } : result.recognition,
        총평: result.analysis || result.총평,
        strengths: result.improvements ? [`천복자 구조가 ${result.checklist?.덮개충분 ? '잘' : '부분적으로'} 표현됨`] : result.strengths,
        improvements: result.improvements || []
      };
    }
    
    // 점수 정규화 (100점 초과 시 100점으로 조정)
    const scores = convertedResult.scores || result.scores;
    const totalScore = scores.항목1.score + scores.항목2.score + scores.항목3.score + scores.항목4.score;
    
    let normalizedScores = scores;
    if (totalScore > 100) {
      console.log(`🔧 점수 정규화: ${totalScore}점 → 100점`);
      const scaleFactor = 100 / totalScore;
      
      normalizedScores = {
        항목1: { ...scores.항목1, score: Math.round(scores.항목1.score * scaleFactor) },
        항목2: { ...scores.항목2, score: Math.round(scores.항목2.score * scaleFactor) },
        항목3: { ...scores.항목3, score: Math.round(scores.항목3.score * scaleFactor) },
        항목4: { ...scores.항목4, score: Math.round(scores.항목4.score * scaleFactor) }
      };
    }
    
    // 체크리스트 생성 (정규화된 점수 사용)
    const analysis = (request as any).analysis;
    const resultWithNormalizedScores = { ...convertedResult, scores: normalizedScores };
    
    // 황자원 92법인 경우 원본 체크리스트와 표준 체크리스트를 모두 포함
    let finalChecklist: any;
    if (request.courseId === 'hwang92-sebeop' && result.checklist) {
      // 원본 황자원 체크리스트 보존
      finalChecklist = {
        ...generateHwang92Checklist(result.checklist, normalizedScores),
        // 원본 체크리스트 데이터도 포함
        덮개충분: result.checklist.덮개충분,
        내부안전: result.checklist.내부안전,
        비례적절: result.checklist.비례적절,
        안정감표현: result.checklist.안정감표현
      };
    } else {
      finalChecklist = generateChecklist(resultWithNormalizedScores, request, analysis);
    }
    
    return {
      scores: normalizedScores,
      recognition: convertedResult.recognition || result.recognition,
      총평: convertedResult.총평 || result.총평,
      checklist: finalChecklist,
      strengths: convertedResult.strengths || result.strengths || ["Gemini가 분석한 장점"],
      improvements: convertedResult.improvements || result.improvements || ["Gemini가 제안한 개선점"]
    };

  } catch (error) {
    console.error('❌ Gemini Vision API 호출 실패:', error);
    console.log('🔄 Mock 평가로 대체합니다.');
    return mockAIEvaluation(request);
  }
}

/**
 * 황자원 92법 체크리스트 생성
 */
function generateHwang92Checklist(hwangChecklist: any, scores: any) {
  // 황자원 92법 체크리스트를 표준 형식으로 변환
  return {
    형태: {
      정확한인식: hwangChecklist.덮개충분 && hwangChecklist.내부안전,
      기본구조: scores.항목1.score >= 20, // 덮개구조 점수 기반
      세부정확도: scores.항목1.score >= 30
    },
    비례: {
      중심위치: hwangChecklist.비례적절,
      적절한크기: scores.항목3.score >= 15, // 공간비례 점수 기반
      균형비율: hwangChecklist.안정감표현
    },
    굵기: {
      압력기본: scores.항목2.score >= 15, // 보호관계 점수 기반
      일정유지: scores.항목2.score >= 20,
      전문가수준: scores.항목2.score >= 25
    },
    획순: {
      정확한획수: scores.항목4.score >= 8, // 결구완성도 점수 기반
      올바른순서: scores.항목4.score >= 7,
      표준준수: scores.항목4.score >= 9
    }
  };
}

/**
 * 체크리스트 생성 (공통 함수)
 */
function generateChecklist(scores: any, request: AIEvaluationRequest, analysis: any) {
  // Mock AI에서 사용하던 체크리스트 로직을 재사용
  const strokeDiff = Math.abs(getExpectedStrokeCount(request.targetCharacter) - request.strokeCount);
  
  if (request.inputMode === 'digital') {
    return {
      형태: {
        정확한인식: scores.recognition?.isCorrect || false,
        기본구조: scores.scores.항목1.score >= 25,
        세부정확도: scores.scores.항목1.score >= 40
      },
      비례: {
        중심위치: scores.scores.항목2.score >= 15,
        적절한크기: scores.scores.항목2.score >= 20,
        균형비율: scores.scores.항목2.score >= 25
      },
      굵기: {
        압력기본: scores.scores.항목3.score >= 10,
        일정유지: scores.scores.항목3.score >= 15,
        전문가수준: scores.scores.항목3.score >= 18
      },
      획순: {
        정확한획수: scores.scores.항목4.score >= 10,
        올바른순서: scores.scores.항목4.score >= 7,
        표준준수: scores.scores.항목4.score >= 10
      }
    };
  } else {
    return {
      형태: {
        정확한인식: scores.recognition?.isCorrect || false,
        기본구조: scores.scores.항목1.score >= 20,
        세부정확도: scores.scores.항목1.score >= 30
      },
      비례: {
        중심위치: scores.scores.항목2.score >= 15,
        적절한크기: scores.scores.항목2.score >= 20,
        균형비율: scores.scores.항목2.score >= 25
      },
      굵기: {
        압력기본: scores.scores.항목3.score >= 10,
        일정유지: scores.scores.항목3.score >= 15,
        전문가수준: scores.scores.항목3.score >= 18
      },
      획순: {
        정확한획수: scores.scores.항목4.score >= 8,
        올바른순서: scores.scores.항목4.score >= 6,
        표준준수: scores.scores.항목4.score >= 8
      }
    };
  }
}

/**
 * 실제 AI API 호출 (GPT-4 Vision, Claude, Gemini)
 */
async function callAIAPI(request: AIEvaluationRequest, apiType: 'openai' | 'claude' | 'gemini' = 'gemini'): Promise<AIEvaluationResponse> {
  switch (apiType) {
    case 'openai':
      return callOpenAIAPI(request);
    case 'gemini':
      return callGeminiAPI(request);
    case 'claude':
      // TODO: Claude API 구현
      console.log(`${apiType} API는 아직 구현되지 않았습니다. Mock으로 대체합니다.`);
      return mockAIEvaluation(request);
    default:
      return mockAIEvaluation(request);
  }
}

/**
 * Canvas 실제 픽셀 분석
 */
function analyzeCanvasPixels(canvas: HTMLCanvasElement): {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  pixelCount: number;
} {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { centerX: 200, centerY: 200, width: 50, height: 50, pixelCount: 0 };
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  let minX = canvas.width, maxX = 0, minY = canvas.height, maxY = 0;
  let pixelCount = 0;
  let totalX = 0, totalY = 0;

  // 픽셀 데이터 분석 (검은색 픽셀 찾기)
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const index = (y * canvas.width + x) * 4;
      const alpha = data[index + 3];
      
      // 투명하지 않은 픽셀 (그려진 부분)
      if (alpha > 128) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        pixelCount++;
        totalX += x;
        totalY += y;
      }
    }
  }

  if (pixelCount === 0) {
    return { centerX: 200, centerY: 200, width: 0, height: 0, pixelCount: 0 };
  }

  return {
    centerX: totalX / pixelCount,
    centerY: totalY / pixelCount,
    width: maxX - minX,
    height: maxY - minY,
    pixelCount
  };
}

/**
 * Canvas를 Base64로 변환
 */
export function canvasToBase64(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png').split(',')[1];
}

/**
 * AI 평가 실행
 */
export async function evaluateWithAI(
  canvas: HTMLCanvasElement,
  targetCharacter: string,
  strokeCount: number,
  characterType: 'korean' | 'chinese' = 'korean',
  inputMode: 'digital' | 'physical' = 'digital',
  courseInfo?: {
    courseId: string;
    lessonId?: string; // lessonId 추가
    lessonType?: string;
    evaluationPoints?: string[];
  }
): Promise<AIEvaluationResponse> {
  // 실제 Canvas 픽셀 분석
  const analysis = analyzeCanvasPixels(canvas);
  
  console.log('🔍 Canvas 분석 결과:', {
    중심좌표: `(${Math.round(analysis.centerX)}, ${Math.round(analysis.centerY)})`,
    크기: `${Math.round(analysis.width)}×${Math.round(analysis.height)}`,
    픽셀수: analysis.pixelCount,
    캔버스중심: '(200, 200)',
    중심거리: Math.round(Math.sqrt(
      Math.pow(analysis.centerX - 200, 2) + 
      Math.pow(analysis.centerY - 200, 2)
    ))
  });

  const imageBase64 = canvasToBase64(canvas);
  
  const request: AIEvaluationRequest = {
    imageBase64,
    targetCharacter,
    characterType,
    strokeCount,
    inputMode,
    // 황자원 92법 관련 정보 추가
    ...(courseInfo && {
      courseId: courseInfo.courseId,
      lessonId: courseInfo.lessonId, // lessonId 포함
      lessonType: courseInfo.lessonType,
      evaluationPoints: courseInfo.evaluationPoints
    })
  };
  
  try {
    // 실제 환경에서는 API 선택 로직 추가
    // 분석 데이터를 포함한 요청 전달
    const requestWithAnalysis = { ...request, analysis };
    const response = await callAIAPI(requestWithAnalysis as any);
    console.log('🤖 AI 평가 완료:', response);
    return response;
  } catch (error) {
    console.error('AI 평가 실패:', error);
    // 실패 시 기본 Mock 평가 반환 (분석 데이터 포함)
    return mockAIEvaluation({ ...request, analysis } as any);
  }
}

/**
 * 평가 결과를 자연스러운 문장으로 변환
 */
export function formatEvaluationSummary(result: AIEvaluationResponse): string {
  const totalScore = result.scores.형태 + result.scores.비례 + result.scores.굵기 + result.scores.획순;
  const percentage = Math.round(totalScore);
  
  const intro = result.recognition.isCorrect ? 
    `'${result.recognition.character}' 글자를 정확하게 인식했습니다! ` :
    `목표 글자와 다르게 인식되었지만, 열심히 노력한 모습이 보입니다. `;
  
  const scoreComment = `전체 점수는 ${totalScore}점(${percentage}%)입니다. `;
  
  return intro + scoreComment + result.총평;
}