import { type AIEvaluationResponse, type AIEvaluationRequest } from '../services/aiEvaluator';
import { getPanbonReferenceDescription, getPanbonReferenceImages } from './panbonReference';

// callGeminiAPI 함수를 직접 import
async function callGeminiAPI(request: AIEvaluationRequest, referenceImages?: string[]): Promise<AIEvaluationResponse> {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!API_KEY) {
    throw new Error('Gemini API 키가 없습니다');
  }

  // 판본체 참조 설명 추가
  const referenceDescription = getPanbonReferenceDescription(request.targetCharacter);

  const prompt = `판본체 서예 전문가로서 '${request.targetCharacter}' 글자를 평가해주세요 (실물 붓글씨)

📝 평가 기준: 한국 전통 판본체
🎨 판본체 특징:
- 자음과 모음의 균형잡힌 배치
- 획의 시작과 끝이 명확하고 힘이 있음
- 단정하고 격조 있는 형태
- 전통 붓글씨의 우아함과 절제미

📌 표준 판본체 참고:
${referenceDescription}

⚠️ 중요: 제공된 표준 판본체 이미지들과 사용자의 글씨를 비교하여 평가해주세요.

JSON만 출력:
{
  "scores": {
    "항목1": {"name": "형태", "score": 숫자, "maxScore": 40},
    "항목2": {"name": "비례", "score": 숫자, "maxScore": 30},
    "항목3": {"name": "필압", "score": 숫자, "maxScore": 20},
    "항목4": {"name": "획순", "score": 숫자, "maxScore": 10}
  },
  "recognition": {"character": "인식글자", "confidence": 0.9, "isCorrect": true},
  "총평": "판본체 기준으로 구체적인 개선 방법을 제공하세요.",
  "strengths": ["판본체 관점에서의 장점1", "판본체 관점에서의 장점2"],
  "improvements": ["판본체 기준 구체적인 개선방법1", "판본체 기준 구체적인 개선방법2", "판본체 기준 구체적인 개선방법3"]
}`;

  // parts 배열 구성: 프롬프트 + 참조 이미지들 + 사용자 이미지
  const parts: any[] = [{ text: prompt }];
  
  // 판본체 참조 이미지들 추가 (있는 경우)
  if (referenceImages && referenceImages.length > 0) {
    referenceImages.forEach((imageBase64, index) => {
      if (imageBase64) {
        parts.push({
          text: `표준 판본체 자모 ${index + 1}:`
        });
        parts.push({
          inline_data: {
            mime_type: "image/png",
            data: imageBase64
          }
        });
      }
    });
  }
  
  // 사용자가 제출한 이미지 추가
  parts.push({
    text: "사용자가 작성한 글씨:"
  });
  parts.push({
    inline_data: {
      mime_type: "image/png",
      data: request.imageBase64
    }
  });

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts
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
  const content = data.candidates[0].content.parts[0].text;
  
  console.log('🔍 Gemini API 원본 응답:', content);
  
  // JSON 파싱 - 더 안전한 방법
  let result;
  try {
    // 먼저 전체 content가 JSON인지 시도
    result = JSON.parse(content);
  } catch (e) {
    // JSON 블록 찾기 (코드블록 제거)
    const cleanContent = content.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      console.error('JSON 파싱 실패 - 원본:', content);
      throw new Error('JSON 형식을 찾을 수 없습니다');
    }
    
    try {
      result = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
      console.error('파싱 시도한 문자열:', jsonMatch[0]);
      throw new Error(`JSON 파싱 실패: ${parseError.message}`);
    }
  }
  
  return {
    scores: result.scores,
    recognition: result.recognition,
    총평: result.총평,
    checklist: {
      형태: {
        정확한인식: result.recognition.isCorrect,
        기본구조: result.scores.항목1.score >= 20,
        세부정확도: result.scores.항목1.score >= 30
      },
      비례: {
        중심위치: result.scores.항목2.score >= 15,
        적절한크기: result.scores.항목2.score >= 20,
        균형비율: result.scores.항목2.score >= 25
      },
      굵기: {
        압력기본: result.scores.항목3.score >= 8,
        일정유지: result.scores.항목3.score >= 12,
        전문가수준: result.scores.항목3.score >= 16
      },
      획순: {
        정확한획수: result.scores.항목4?.score >= 5,
        올바른순서: result.scores.항목4?.score >= 7,
        표준준수: result.scores.항목4?.score >= 9
      }
    },
    strengths: result.strengths || ["AI가 분석한 장점"],
    improvements: result.improvements || ["AI가 제안한 개선점"]
  };
}

export interface PhotoEvaluationParams {
  capturedImage: string;
  currentCharacter: string;
  characterType: 'korean' | 'chinese';
}

export const evaluatePhotoMode = async (params: PhotoEvaluationParams): Promise<any> => {
  const { capturedImage, currentCharacter, characterType } = params;
  
  // base64 이미지 데이터 추출
  const base64Image = capturedImage.replace(/^data:image\/\w+;base64,/, '');
  
  // 판본체 참조 이미지들 로드 (한글인 경우만)
  let referenceImages: string[] = [];
  if (characterType === 'korean') {
    try {
      console.log(`📚 '${currentCharacter}' 글자의 판본체 참조 이미지 로드 중...`);
      referenceImages = await getPanbonReferenceImages(currentCharacter);
      console.log(`✅ ${referenceImages.length}개의 참조 이미지 로드 완료`);
    } catch (error) {
      console.warn('판본체 참조 이미지 로드 실패:', error);
      // 참조 이미지 없이 진행
    }
  }
  
  // AI 평가 요청 (실물 모드)
  const request: AIEvaluationRequest = {
    imageBase64: base64Image,
    targetCharacter: currentCharacter,
    characterType: characterType === 'chinese' ? 'chinese' : 'korean',
    strokeCount: 0, // 실물은 획수 알 수 없음
    inputMode: 'physical' // 실물 모드
  };
  
  const aiResult = await callGeminiAPI(request, referenceImages);
  
  const finalEvaluation = {
    형태: aiResult.scores.항목1.score,
    비례: aiResult.scores.항목2.score,
    굵기: aiResult.scores.항목3.score,
    획순: aiResult.scores.항목4?.score || 0,
    총점: Math.round(
      aiResult.scores.항목1.score + 
      aiResult.scores.항목2.score + 
      aiResult.scores.항목3.score + 
      (aiResult.scores.항목4?.score || 0)
    ),
    인식결과: {
      topCandidate: {
        character: aiResult.recognition.character,
        confidence: aiResult.recognition.confidence,
        type: characterType === 'chinese' ? 'chinese' as const : 'korean' as const
      },
      candidates: [],
      confidence: aiResult.recognition.confidence,
      isReliable: aiResult.recognition.confidence >= 0.7,
      timestamp: Date.now()
    },
    aiEvaluation: aiResult
  };
  
  return finalEvaluation;
};