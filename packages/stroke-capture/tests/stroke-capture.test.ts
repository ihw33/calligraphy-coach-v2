import { describe, it, expect, beforeEach } from 'vitest';
import { StrokeCapture, Stroke, Point } from '../src/index';

describe('StrokeCapture', () => {
  let capture: StrokeCapture;

  beforeEach(() => {
    capture = new StrokeCapture({
      samplingRate: 120,
      pressureNormalization: true,
      minPressure: 0.1,
      maxPressure: 1.0
    });
  });

  describe('TDD - RED Phase', () => {
    it('should initialize with default configuration', () => {
      const defaultCapture = new StrokeCapture();
      expect(defaultCapture).toBeDefined();
      expect(defaultCapture.getSamplingRate()).toBe(120);
    });

    it('should start capturing a new stroke', () => {
      const point: Point = { x: 100, y: 100, pressure: 0.5, timestamp: Date.now() };
      capture.startStroke(point);
      expect(capture.isCapturing()).toBe(true);
      expect(capture.getCurrentStroke()).toBeDefined();
    });

    it('should add points to current stroke', () => {
      const startPoint: Point = { x: 100, y: 100, pressure: 0.5, timestamp: Date.now() };
      const movePoint: Point = { x: 150, y: 150, pressure: 0.7, timestamp: Date.now() + 10 };
      
      capture.startStroke(startPoint);
      capture.addPoint(movePoint);
      
      const currentStroke = capture.getCurrentStroke();
      expect(currentStroke?.points).toHaveLength(2);
      expect(currentStroke?.points[1]).toEqual(movePoint);
    });

    it('should end stroke and return completed stroke', () => {
      const startPoint: Point = { x: 100, y: 100, pressure: 0.5, timestamp: Date.now() };
      capture.startStroke(startPoint);
      
      const stroke = capture.endStroke();
      expect(stroke).toBeDefined();
      expect(capture.isCapturing()).toBe(false);
      expect(stroke?.id).toBeDefined();
      expect(stroke?.duration).toBeGreaterThanOrEqual(0);
    });

    it('should calculate stroke velocity', () => {
      const t1 = Date.now();
      const points: Point[] = [
        { x: 100, y: 100, pressure: 0.5, timestamp: t1 },
        { x: 200, y: 100, pressure: 0.7, timestamp: t1 + 100 }
      ];
      
      capture.startStroke(points[0]);
      capture.addPoint(points[1]);
      
      const stroke = capture.endStroke();
      expect(stroke?.velocity).toBeGreaterThan(0);
    });

    it('should normalize pressure values', () => {
      const point: Point = { x: 100, y: 100, pressure: 2.0, timestamp: Date.now() };
      capture.startStroke(point);
      
      const stroke = capture.getCurrentStroke();
      expect(stroke?.points[0].pressure).toBeLessThanOrEqual(1.0);
      expect(stroke?.points[0].pressure).toBeGreaterThanOrEqual(0);
    });

    it('should support pressure-less input (mouse)', () => {
      const mouseCapture = new StrokeCapture({ defaultPressure: 0.5 });
      const point: Point = { x: 100, y: 100, timestamp: Date.now() };
      
      mouseCapture.startStroke(point);
      const stroke = mouseCapture.getCurrentStroke();
      
      expect(stroke?.points[0].pressure).toBe(0.5);
    });

    it('should interpolate points at sampling rate', () => {
      const t1 = Date.now();
      capture.startStroke({ x: 100, y: 100, pressure: 0.5, timestamp: t1 });
      capture.addPoint({ x: 300, y: 300, pressure: 0.7, timestamp: t1 + 100 });
      
      const stroke = capture.endStroke();
      // At 120Hz sampling rate, 100ms should have ~12 interpolated points
      expect(stroke?.points.length).toBeGreaterThan(2);
    });

    it('should detect stroke characteristics', () => {
      const points: Point[] = [
        { x: 100, y: 100, pressure: 0.2, timestamp: Date.now() },
        { x: 150, y: 100, pressure: 0.5, timestamp: Date.now() + 50 },
        { x: 200, y: 100, pressure: 0.8, timestamp: Date.now() + 100 },
        { x: 250, y: 100, pressure: 0.3, timestamp: Date.now() + 150 }
      ];
      
      capture.startStroke(points[0]);
      points.slice(1).forEach(p => capture.addPoint(p));
      
      const stroke = capture.endStroke();
      expect(stroke?.characteristics).toBeDefined();
      expect(stroke?.characteristics?.type).toBe('horizontal');
      expect(stroke?.characteristics?.pressureVariation).toBeGreaterThan(0);
    });

    it('should export stroke data in JSON format', () => {
      capture.startStroke({ x: 100, y: 100, pressure: 0.5, timestamp: Date.now() });
      const stroke = capture.endStroke();
      
      const json = capture.exportStroke(stroke!);
      expect(JSON.parse(json)).toHaveProperty('id');
      expect(JSON.parse(json)).toHaveProperty('points');
      expect(JSON.parse(json)).toHaveProperty('timestamp');
    });
  });
});