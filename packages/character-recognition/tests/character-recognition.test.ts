import { describe, it, expect, beforeEach } from 'vitest';
import { 
  CharacterRecognition, 
  RecognitionResult, 
  CharacterType,
  KoreanCharacter,
  ChineseCharacter 
} from '../src/index';

describe('CharacterRecognition', () => {
  let recognition: CharacterRecognition;

  beforeEach(() => {
    recognition = new CharacterRecognition({
      language: 'both',
      confidence: 0.7,
      maxCandidates: 3
    });
  });

  describe('TDD - RED Phase', () => {
    it('should initialize with configuration', () => {
      const koreanRecognition = new CharacterRecognition({ language: 'korean' });
      expect(koreanRecognition).toBeDefined();
      expect(koreanRecognition.getLanguage()).toBe('korean');
    });

    it('should recognize Korean consonants', () => {
      const imageData = createMockImageData('ㄱ');
      const result = recognition.recognize(imageData);
      
      expect(result).toBeDefined();
      expect(result.type).toBe('korean');
      expect(result.candidates).toContainEqual(
        expect.objectContaining({ character: 'ㄱ' })
      );
    });

    it('should recognize Korean vowels', () => {
      const imageData = createMockImageData('ㅏ');
      const result = recognition.recognize(imageData);
      
      expect(result.type).toBe('korean');
      expect(result.candidates).toContainEqual(
        expect.objectContaining({ character: 'ㅏ' })
      );
    });

    it('should recognize complete Korean syllables', () => {
      const imageData = createMockImageData('가');
      const result = recognition.recognize(imageData);
      
      expect(result.type).toBe('korean');
      expect(result.topCandidate.character).toBe('가');
      expect(result.topCandidate.confidence).toBeGreaterThan(0);
    });

    it('should recognize Chinese characters', () => {
      const imageData = createMockImageData('人');
      const result = recognition.recognize(imageData);
      
      expect(result.type).toBe('chinese');
      expect(result.topCandidate.character).toBe('人');
    });

    it('should return multiple candidates sorted by confidence', () => {
      const imageData = createMockImageData('가');
      const result = recognition.recognize(imageData);
      
      expect(result.candidates.length).toBeLessThanOrEqual(3);
      expect(result.candidates[0].confidence).toBeGreaterThanOrEqual(
        result.candidates[1]?.confidence ?? 0
      );
    });

    it('should detect stroke order for Korean characters', () => {
      const imageData = createMockImageData('ㅎ');
      const strokes = recognition.detectStrokes(imageData);
      
      expect(strokes).toBeDefined();
      expect(strokes.count).toBe(4); // ㅎ has 4 strokes
      expect(strokes.order).toHaveLength(4);
    });

    it('should detect stroke order for Chinese characters', () => {
      const imageData = createMockImageData('永');
      const strokes = recognition.detectStrokes(imageData);
      
      expect(strokes.count).toBe(5); // 永 has 5 strokes
      expect(strokes.order[0].type).toBe('dot');
    });

    it('should identify character components', () => {
      const korean = recognition.analyzeComponents('한');
      expect(korean.components).toContain('ㅎ');
      expect(korean.components).toContain('ㅏ');
      expect(korean.components).toContain('ㄴ');

      const chinese = recognition.analyzeComponents('明');
      expect(chinese.components).toContain('日');
      expect(chinese.components).toContain('月');
    });

    it('should handle low confidence recognition', () => {
      const poorImageData = createMockImageData('ambiguous');
      const result = recognition.recognize(poorImageData);
      
      expect(result.confidence).toBeLessThan(0.7);
      expect(result.isReliable).toBe(false);
    });

    it('should support batch recognition', () => {
      const batch = [
        createMockImageData('가'),
        createMockImageData('나'),
        createMockImageData('다')
      ];
      
      const results = recognition.recognizeBatch(batch);
      expect(results).toHaveLength(3);
      expect(results.map(r => r.topCandidate.character)).toEqual(['가', '나', '다']);
    });

    it('should export recognition results as JSON', () => {
      const imageData = createMockImageData('가');
      const result = recognition.recognize(imageData);
      const json = recognition.exportResult(result);
      
      const parsed = JSON.parse(json);
      expect(parsed).toHaveProperty('character');
      expect(parsed).toHaveProperty('confidence');
      expect(parsed).toHaveProperty('timestamp');
    });
  });
});

// Helper function to create mock image data
function createMockImageData(character: string): ImageData {
  // Simplified mock - in real implementation would process actual image data
  const canvas = { width: 100, height: 100 };
  const data = new Uint8ClampedArray(canvas.width * canvas.height * 4);
  
  // Mock pattern based on character
  const charCode = character.charCodeAt(0);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = (charCode * i) % 255;     // R
    data[i + 1] = (charCode * i * 2) % 255; // G  
    data[i + 2] = (charCode * i * 3) % 255; // B
    data[i + 3] = 255; // A
  }
  
  return { data, width: canvas.width, height: canvas.height } as ImageData;
}