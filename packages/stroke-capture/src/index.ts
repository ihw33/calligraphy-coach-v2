export interface Point {
  x: number;
  y: number;
  pressure?: number;
  timestamp: number;
}

export interface StrokeCharacteristics {
  type: 'horizontal' | 'vertical' | 'diagonal' | 'curve';
  pressureVariation: number;
  speedVariation: number;
  smoothness: number;
}

export interface Stroke {
  id: string;
  points: Point[];
  timestamp: number;
  duration: number;
  velocity: number;
  characteristics?: StrokeCharacteristics;
}

export interface StrokeCaptureConfig {
  samplingRate?: number;
  pressureNormalization?: boolean;
  minPressure?: number;
  maxPressure?: number;
  defaultPressure?: number;
  interpolation?: boolean;
}

export class StrokeCapture {
  private config: Required<StrokeCaptureConfig>;
  private currentStroke: Stroke | null = null;
  private isCapturingStroke = false;

  constructor(config: StrokeCaptureConfig = {}) {
    this.config = {
      samplingRate: config.samplingRate ?? 120,
      pressureNormalization: config.pressureNormalization ?? true,
      minPressure: config.minPressure ?? 0,
      maxPressure: config.maxPressure ?? 1,
      defaultPressure: config.defaultPressure ?? 0.5,
      interpolation: config.interpolation ?? true
    };
  }

  getSamplingRate(): number {
    return this.config.samplingRate;
  }

  isCapturing(): boolean {
    return this.isCapturingStroke;
  }

  getCurrentStroke(): Stroke | null {
    return this.currentStroke;
  }

  startStroke(point: Point): void {
    const normalizedPoint = this.normalizePoint(point);
    
    this.currentStroke = {
      id: this.generateStrokeId(),
      points: [normalizedPoint],
      timestamp: Date.now(),
      duration: 0,
      velocity: 0
    };
    
    this.isCapturingStroke = true;
  }

  addPoint(point: Point): void {
    if (!this.isCapturingStroke || !this.currentStroke) {
      throw new Error('No stroke in progress');
    }

    const normalizedPoint = this.normalizePoint(point);
    const lastPoint = this.currentStroke.points[this.currentStroke.points.length - 1];

    if (this.config.interpolation && lastPoint) {
      const interpolatedPoints = this.interpolatePoints(lastPoint, normalizedPoint);
      this.currentStroke.points.push(...interpolatedPoints);
    } else {
      this.currentStroke.points.push(normalizedPoint);
    }
  }

  endStroke(): Stroke | null {
    if (!this.currentStroke) {
      return null;
    }

    const stroke = this.currentStroke;
    stroke.duration = Date.now() - stroke.timestamp;
    stroke.velocity = this.calculateVelocity(stroke);
    stroke.characteristics = this.analyzeCharacteristics(stroke);

    this.currentStroke = null;
    this.isCapturingStroke = false;

    return stroke;
  }

  exportStroke(stroke: Stroke): string {
    return JSON.stringify(stroke, null, 2);
  }

  private normalizePoint(point: Point): Point {
    let pressure = point.pressure ?? this.config.defaultPressure;

    if (this.config.pressureNormalization) {
      pressure = Math.max(this.config.minPressure, 
                 Math.min(this.config.maxPressure, pressure));
      
      // Normalize to 0-1 range
      if (pressure > 1) {
        pressure = 1;
      }
    }

    return {
      x: point.x,
      y: point.y,
      pressure,
      timestamp: point.timestamp
    };
  }

  private interpolatePoints(p1: Point, p2: Point): Point[] {
    const timeDiff = p2.timestamp - p1.timestamp;
    const samplingInterval = 1000 / this.config.samplingRate;
    const numPoints = Math.floor(timeDiff / samplingInterval);

    if (numPoints <= 1) {
      return [p2];
    }

    const points: Point[] = [];
    for (let i = 1; i <= numPoints; i++) {
      const t = i / numPoints;
      points.push({
        x: p1.x + (p2.x - p1.x) * t,
        y: p1.y + (p2.y - p1.y) * t,
        pressure: p1.pressure! + (p2.pressure! - p1.pressure!) * t,
        timestamp: p1.timestamp + (timeDiff * t)
      });
    }

    return points;
  }

  private calculateVelocity(stroke: Stroke): number {
    if (stroke.points.length < 2) {
      return 0;
    }

    let totalDistance = 0;
    for (let i = 1; i < stroke.points.length; i++) {
      const dx = stroke.points[i].x - stroke.points[i - 1].x;
      const dy = stroke.points[i].y - stroke.points[i - 1].y;
      totalDistance += Math.sqrt(dx * dx + dy * dy);
    }

    // Use time difference between first and last point
    const timeDiff = stroke.points[stroke.points.length - 1].timestamp - stroke.points[0].timestamp;
    return timeDiff > 0 ? (totalDistance / timeDiff) * 1000 : 0;
  }

  private analyzeCharacteristics(stroke: Stroke): StrokeCharacteristics {
    const points = stroke.points;
    
    // Determine stroke type
    const deltaX = Math.abs(points[points.length - 1].x - points[0].x);
    const deltaY = Math.abs(points[points.length - 1].y - points[0].y);
    
    let type: StrokeCharacteristics['type'];
    if (deltaX > deltaY * 2) {
      type = 'horizontal';
    } else if (deltaY > deltaX * 2) {
      type = 'vertical';
    } else {
      type = 'diagonal';
    }

    // Calculate pressure variation
    const pressures = points.map(p => p.pressure!);
    const avgPressure = pressures.reduce((a, b) => a + b, 0) / pressures.length;
    const pressureVariation = Math.sqrt(
      pressures.reduce((sum, p) => sum + Math.pow(p - avgPressure, 2), 0) / pressures.length
    );

    // Calculate speed variation (simplified)
    const speeds: number[] = [];
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x;
      const dy = points[i].y - points[i - 1].y;
      const dt = points[i].timestamp - points[i - 1].timestamp;
      if (dt > 0) {
        speeds.push(Math.sqrt(dx * dx + dy * dy) / dt);
      }
    }
    
    const avgSpeed = speeds.reduce((a, b) => a + b, 0) / (speeds.length || 1);
    const speedVariation = speeds.length > 0 
      ? Math.sqrt(speeds.reduce((sum, s) => sum + Math.pow(s - avgSpeed, 2), 0) / speeds.length)
      : 0;

    // Calculate smoothness (simplified - based on angle changes)
    let smoothness = 1.0;
    if (points.length > 2) {
      const angles: number[] = [];
      for (let i = 1; i < points.length - 1; i++) {
        const angle1 = Math.atan2(points[i].y - points[i - 1].y, points[i].x - points[i - 1].x);
        const angle2 = Math.atan2(points[i + 1].y - points[i].y, points[i + 1].x - points[i].x);
        angles.push(Math.abs(angle2 - angle1));
      }
      const avgAngleChange = angles.reduce((a, b) => a + b, 0) / angles.length;
      smoothness = Math.max(0, 1 - avgAngleChange / Math.PI);
    }

    return {
      type,
      pressureVariation,
      speedVariation,
      smoothness
    };
  }

  private generateStrokeId(): string {
    return `stroke_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// CLI support
export function createCLI(): void {
  console.log('Stroke Capture CLI - Capturing brush strokes with pressure sensitivity');
  const capture = new StrokeCapture();
  
  // Simulate stroke capture
  const demoStroke = () => {
    const startTime = Date.now();
    capture.startStroke({ x: 100, y: 100, pressure: 0.3, timestamp: startTime });
    capture.addPoint({ x: 150, y: 120, pressure: 0.5, timestamp: startTime + 50 });
    capture.addPoint({ x: 200, y: 140, pressure: 0.7, timestamp: startTime + 100 });
    capture.addPoint({ x: 250, y: 160, pressure: 0.4, timestamp: startTime + 150 });
    
    const stroke = capture.endStroke();
    if (stroke) {
      console.log('Captured stroke:', capture.exportStroke(stroke));
    }
  };
  
  demoStroke();
}