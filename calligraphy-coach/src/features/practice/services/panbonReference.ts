/**
 * 판본체 표준 이미지 참조 시스템
 * 각 글자의 자모를 분해하고 해당하는 판본체 이미지 URL을 반환
 */

// 한글 글자를 자모로 분해
export function decomposeHangul(char: string): string[] {
  const decomposition: Record<string, string[]> = {
    '가': ['ㄱ', 'ㅏ'],
    '나': ['ㄴ', 'ㅏ'],
    '다': ['ㄷ', 'ㅏ'],
    '라': ['ㄹ', 'ㅏ'],
    '마': ['ㅁ', 'ㅏ'],
    '바': ['ㅂ', 'ㅏ'],
    '사': ['ㅅ', 'ㅏ'],
    '아': ['ㅇ', 'ㅏ'],
    '자': ['ㅈ', 'ㅏ'],
    '차': ['ㅊ', 'ㅏ'],
    '카': ['ㅋ', 'ㅏ'],
    '타': ['ㅌ', 'ㅏ'],
    '파': ['ㅍ', 'ㅏ'],
    '하': ['ㅎ', 'ㅏ'],
    '작': ['ㅈ', 'ㅏ', 'ㄱ'],
    '각': ['ㄱ', 'ㅏ', 'ㄱ'],
    '난': ['ㄴ', 'ㅏ', 'ㄴ'],
    '단': ['ㄷ', 'ㅏ', 'ㄴ'],
    '란': ['ㄹ', 'ㅏ', 'ㄴ'],
    '만': ['ㅁ', 'ㅏ', 'ㄴ'],
    '반': ['ㅂ', 'ㅏ', 'ㄴ'],
    '산': ['ㅅ', 'ㅏ', 'ㄴ'],
    '안': ['ㅇ', 'ㅏ', 'ㄴ'],
    '잔': ['ㅈ', 'ㅏ', 'ㄴ'],
    '찬': ['ㅊ', 'ㅏ', 'ㄴ']
  };
  
  return decomposition[char] || [char];
}

// 판본체 이미지 URL 생성
export function getPanbonImageUrls(char: string): string[] {
  const jamos = decomposeHangul(char);
  return jamos.map(jamo => `/images/panbon/${jamo}.png`);
}

// 판본체 참조 이미지 설명 생성
export function getPanbonReferenceDescription(char: string): string {
  const jamos = decomposeHangul(char);
  
  let description = `'${char}' 글자의 판본체 구성:\n`;
  
  jamos.forEach((jamo, index) => {
    if (index === 0) {
      description += `- 초성 '${jamo}': 판본체 특유의 강한 시작과 절제된 끝맺음\n`;
    } else if (index === 1) {
      description += `- 중성 '${jamo}': 초성과 조화를 이루는 균형잡힌 배치\n`;
    } else if (index === 2) {
      description += `- 종성 '${jamo}': 전체 글자의 안정감을 주는 받침\n`;
    }
  });
  
  description += `\n표준 판본체 이미지들을 참고하여:\n`;
  description += `1. 각 자모의 정확한 형태와 비율을 확인\n`;
  description += `2. 획의 시작과 끝 처리 방식 비교\n`;
  description += `3. 전체적인 균형과 조화 평가\n`;
  
  return description;
}

// 이미지를 Base64로 변환 (브라우저 환경)
export async function imageUrlToBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // data:image/png;base64, 부분 제거
        resolve(base64.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error(`이미지 로드 실패: ${url}`, error);
    return '';
  }
}

// 판본체 참조 이미지들을 Base64로 변환
export async function getPanbonReferenceImages(char: string): Promise<string[]> {
  const urls = getPanbonImageUrls(char);
  const base64Images = await Promise.all(urls.map(url => imageUrlToBase64(url)));
  return base64Images.filter(img => img !== ''); // 로드 실패한 이미지 제외
}