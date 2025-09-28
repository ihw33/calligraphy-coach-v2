import { describe, it, expect, beforeEach } from 'vitest';
import { ImageProcessor } from '../src/image-processor';

describe('ImageProcessor', () => {
  let processor: ImageProcessor;

  // Sample base64 image data for testing (1x1 transparent PNG)
  const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jINpPwAAAABJRU5ErkJggg==';
  
  // Mock ImageData for testing
  const mockImageData = new ImageData(new Uint8ClampedArray([255, 0, 0, 255]), 1, 1);

  beforeEach(() => {
    processor = new ImageProcessor();
  });

  describe('Base64 이미지 디코딩', () => {
    it('should decode base64 image to ImageData', async () => {
      const result = await processor.decodeImage(sampleBase64);
      
      expect(result).toBeInstanceOf(ImageData);
      expect(result.width).toBeGreaterThan(0);
      expect(result.height).toBeGreaterThan(0);
      expect(result.data).toBeInstanceOf(Uint8ClampedArray);
    });

    it('should handle invalid base64 data', async () => {
      const invalidBase64 = 'invalid-base64-data';
      
      await expect(processor.decodeImage(invalidBase64)).rejects.toThrow();
    });

    it('should handle non-image base64 data', async () => {
      const textBase64 = 'data:text/plain;base64,SGVsbG8gV29ybGQ=';
      
      await expect(processor.decodeImage(textBase64)).rejects.toThrow();
    });
  });

  describe('이미지 크기 정규화', () => {
    it('should normalize image size to 320x320', () => {
      const result = processor.normalizeSize(mockImageData, 320, 320);
      
      expect(result.width).toBe(320);
      expect(result.height).toBe(320);
      expect(result.data).toBeInstanceOf(Uint8ClampedArray);
      expect(result.data.length).toBe(320 * 320 * 4); // RGBA
    });

    it('should maintain aspect ratio when specified', () => {
      const wideImage = new ImageData(new Uint8ClampedArray(400 * 200 * 4), 400, 200);
      const result = processor.normalizeSize(wideImage, 320, 320, true);
      
      expect(result.width).toBeLessThanOrEqual(320);
      expect(result.height).toBeLessThanOrEqual(320);
      // Aspect ratio should be preserved
      expect(result.width / result.height).toBeCloseTo(400 / 200, 1);
    });

    it('should handle edge cases with very small images', () => {
      const tinyImage = new ImageData(new Uint8ClampedArray([255, 255, 255, 255]), 1, 1);
      const result = processor.normalizeSize(tinyImage, 320, 320);
      
      expect(result.width).toBe(320);
      expect(result.height).toBe(320);
    });
  });

  describe('그레이스케일 변환', () => {
    it('should convert to grayscale', () => {
      // Create a colorful test image (red pixel)
      const colorData = new Uint8ClampedArray([255, 0, 0, 255]); // Red
      const colorImage = new ImageData(colorData, 1, 1);
      
      const result = processor.toGrayscale(colorImage);
      
      expect(result.width).toBe(1);
      expect(result.height).toBe(1);
      
      // All RGB values should be the same (grayscale)
      const [r, g, b, a] = result.data;
      expect(r).toBe(g);
      expect(g).toBe(b);
      expect(a).toBe(255); // Alpha should remain unchanged
    });

    it('should use proper luminance formula', () => {
      // Test with known color values
      const colorData = new Uint8ClampedArray([255, 128, 0, 255]); // Orange
      const colorImage = new ImageData(colorData, 1, 1);
      
      const result = processor.toGrayscale(colorImage);
      const expectedGray = Math.round(0.299 * 255 + 0.587 * 128 + 0.114 * 0);
      
      expect(result.data[0]).toBe(expectedGray);
      expect(result.data[1]).toBe(expectedGray);
      expect(result.data[2]).toBe(expectedGray);
    });

    it('should handle already grayscale images', () => {
      const grayData = new Uint8ClampedArray([128, 128, 128, 255]);
      const grayImage = new ImageData(grayData, 1, 1);
      
      const result = processor.toGrayscale(grayImage);
      
      expect(result.data[0]).toBe(128);
      expect(result.data[1]).toBe(128);
      expect(result.data[2]).toBe(128);
    });
  });

  describe('이진화 처리', () => {
    it('should apply binary threshold', () => {
      // Create test image with various gray levels
      const grayData = new Uint8ClampedArray([
        100, 100, 100, 255, // Below threshold
        200, 200, 200, 255, // Above threshold
      ]);
      const grayImage = new ImageData(grayData, 2, 1);
      
      const result = processor.binarize(grayImage, 150);
      
      // First pixel should be black (0)
      expect(result.data[0]).toBe(0);
      expect(result.data[1]).toBe(0);
      expect(result.data[2]).toBe(0);
      
      // Second pixel should be white (255)
      expect(result.data[4]).toBe(255);
      expect(result.data[5]).toBe(255);
      expect(result.data[6]).toBe(255);
    });

    it('should auto-calculate threshold using Otsu method when not provided', () => {
      const grayData = new Uint8ClampedArray([
        50, 50, 50, 255,
        100, 100, 100, 255,
        200, 200, 200, 255,
        250, 250, 250, 255,
      ]);
      const grayImage = new ImageData(grayData, 4, 1);
      
      const result = processor.binarize(grayImage); // No threshold provided
      
      // Should produce binary output (only 0 or 255 values)
      for (let i = 0; i < result.data.length; i += 4) {
        const pixel = result.data[i];
        expect(pixel === 0 || pixel === 255).toBe(true);
      }
    });

    it('should handle edge case with uniform image', () => {
      const uniformData = new Uint8ClampedArray([128, 128, 128, 255]);
      const uniformImage = new ImageData(uniformData, 1, 1);
      
      const result = processor.binarize(uniformImage);
      
      // Should not crash and produce valid output
      expect(result.width).toBe(1);
      expect(result.height).toBe(1);
      expect(result.data[3]).toBe(255); // Alpha preserved
    });
  });

  describe('노이즈 제거', () => {
    it('should remove noise from image', () => {
      // Create noisy test image (checkerboard pattern)
      const noisyData = new Uint8ClampedArray([
        0, 0, 0, 255,     255, 255, 255, 255,
        255, 255, 255, 255, 0, 0, 0, 255,
      ]);
      const noisyImage = new ImageData(noisyData, 2, 2);
      
      const result = processor.removeNoise(noisyImage);
      
      expect(result.width).toBe(2);
      expect(result.height).toBe(2);
      // Noise should be reduced (exact values depend on filter implementation)
      expect(result.data).toBeInstanceOf(Uint8ClampedArray);
    });

    it('should preserve alpha channel', () => {
      const testData = new Uint8ClampedArray([100, 100, 100, 128]); // Semi-transparent
      const testImage = new ImageData(testData, 1, 1);
      
      const result = processor.removeNoise(testImage);
      
      expect(result.data[3]).toBe(128); // Alpha should be preserved
    });

    it('should handle single pixel image gracefully', () => {
      const singlePixel = new ImageData(new Uint8ClampedArray([255, 255, 255, 255]), 1, 1);
      
      const result = processor.removeNoise(singlePixel);
      
      expect(result.width).toBe(1);
      expect(result.height).toBe(1);
      // Should not crash
    });
  });

  describe('통합 전처리 파이프라인', () => {
    it('should preprocess image through complete pipeline', async () => {
      const result = await processor.preprocess(sampleBase64);
      
      expect(result).toHaveProperty('imageData');
      expect(result).toHaveProperty('metadata');
      expect(result.imageData).toBeInstanceOf(ImageData);
      
      // Should be normalized to 320x320
      expect(result.imageData.width).toBe(320);
      expect(result.imageData.height).toBe(320);
      
      // Metadata should include processing steps
      expect(result.metadata).toHaveProperty('originalSize');
      expect(result.metadata).toHaveProperty('processedAt');
      expect(result.metadata).toHaveProperty('processingSteps');
    });

    it('should handle processing options', async () => {
      const options = {
        targetSize: { width: 256, height: 256 },
        binarizeThreshold: 128,
        removeNoise: false,
        maintainAspectRatio: true
      };
      
      const result = await processor.preprocess(sampleBase64, options);
      
      expect(result.imageData.width).toBeLessThanOrEqual(256);
      expect(result.imageData.height).toBeLessThanOrEqual(256);
    });

    it('should provide detailed metadata', async () => {
      const result = await processor.preprocess(sampleBase64);
      
      expect(result.metadata.originalSize).toHaveProperty('width');
      expect(result.metadata.originalSize).toHaveProperty('height');
      expect(typeof result.metadata.processedAt).toBe('string');
      expect(Array.isArray(result.metadata.processingSteps)).toBe(true);
      expect(result.metadata.processingSteps.length).toBeGreaterThan(0);
    });

    it('should handle processing errors gracefully', async () => {
      const corruptedBase64 = 'data:image/png;base64,corrupted-data';
      
      await expect(processor.preprocess(corruptedBase64)).rejects.toThrow();
    });
  });

  describe('성능 및 메모리 관리', () => {
    it('should handle large images efficiently', async () => {
      // Create a larger test image (100x100)
      const largeImageSize = 100 * 100 * 4;
      const largeData = new Uint8ClampedArray(largeImageSize);
      largeData.fill(128); // Fill with gray
      
      // This test ensures no memory leaks or performance issues
      const startTime = Date.now();
      
      const grayResult = processor.toGrayscale(new ImageData(largeData, 100, 100));
      const binaryResult = processor.binarize(grayResult);
      const normalizedResult = processor.normalizeSize(binaryResult, 320, 320);
      
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
      expect(normalizedResult.width).toBe(320);
      expect(normalizedResult.height).toBe(320);
    });
  });
});