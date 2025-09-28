/**
 * Storage utilities for digital calligraphy app
 * Handles IndexedDB for large data and LocalStorage for settings
 */

import Dexie, { Table } from 'dexie';

// Types from data-model.md
export interface WritingSession {
  id: string;
  userId?: string;
  startTime: Date;
  endTime?: Date;
  fontStyle: FontStyle;
  charactersPracticed: string[];
  totalScore?: number;
  device: DeviceInfo;
}

export interface WritingAttempt {
  id: string;
  sessionId: string;
  characterId: string;
  timestamp: Date;
  strokes: Stroke[];
  canvasImage: string;
  evaluation: Evaluation;
  duration: number;
}

export interface Progress {
  userId?: string;
  character: string;
  fontStyle: FontStyle;
  attempts: number;
  bestScore: number;
  averageScore: number;
  lastPracticed: Date;
  improvements: ImprovementTrend[];
}

export interface Character {
  id: string;
  unicode: string;
  type: 'hangul' | 'hanja';
  fontStyles: FontStyleData[];
  strokeOrder: StrokeOrder[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  course?: string;
}

export interface CameraCapture {
  id: string;
  sessionId: string;
  characterId: string;
  originalImage: string;
  processedImage?: string;
  timestamp: Date;
}

export interface CalligraphyArtwork {
  id: string;
  character: string;
  fontStyle: FontStyle;
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
}

// Supporting types
export type FontStyle = 'panbon' | 'gungseo' | 'jeonseo' | 'haeseo';

export interface DeviceInfo {
  type: 'pen' | 'touch' | 'mouse';
  pressureSupported: boolean;
  maxPressure?: number;
}

export interface Stroke {
  points: StrokePoint[];
  order: number;
  timestamp: Date;
}

export interface StrokePoint {
  x: number;
  y: number;
  pressure: number;
  timestamp: number;
}

export interface Evaluation {
  attemptId: string;
  totalScore: number;
  components: EvaluationComponent[];
  recognizedCharacter?: string;
  confidence: number;
}

export interface EvaluationComponent {
  type: 'shape' | 'proportion' | 'thickness' | 'strokeOrder';
  score: number;
  maxScore: number;
  weight: number;
  details?: string;
}

export interface FontStyleData {
  style: FontStyle;
  referenceImage: string;
  strokeWeights: number[];
  proportions: BoundingBox;
}

export interface StrokeOrder {
  order: number;
  path: Point[];
  direction: 'horizontal' | 'vertical' | 'diagonal' | 'curve';
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface ImprovementTrend {
  date: Date;
  score: number;
  component: string;
}

// IndexedDB Database class
export class CalligraphyDB extends Dexie {
  sessions!: Table<WritingSession, string>;
  attempts!: Table<WritingAttempt, string>;
  progress!: Table<Progress>;
  characters!: Table<Character, string>;
  cameraCaptures!: Table<CameraCapture, string>;
  artworks!: Table<CalligraphyArtwork, string>;

  constructor() {
    super('CalligraphyDB');

    this.version(1).stores({
      sessions: 'id, userId, startTime',
      attempts: 'id, sessionId, timestamp',
      progress: '[userId+character+fontStyle], userId, character, fontStyle',
      characters: 'id, unicode, type, difficulty',
      cameraCaptures: 'id, sessionId, timestamp',
      artworks: 'id, character, fontStyle, isActive',
    });

    // Add hooks for date conversion
    this.sessions.hook('reading', obj => {
      obj.startTime = new Date(obj.startTime);
      if (obj.endTime) obj.endTime = new Date(obj.endTime);
      return obj;
    });

    this.attempts.hook('reading', obj => {
      obj.timestamp = new Date(obj.timestamp);
      obj.strokes = obj.strokes.map(stroke => ({
        ...stroke,
        timestamp: new Date(stroke.timestamp),
      }));
      return obj;
    });

    this.progress.hook('reading', obj => {
      obj.lastPracticed = new Date(obj.lastPracticed);
      obj.improvements = obj.improvements.map(improvement => ({
        ...improvement,
        date: new Date(improvement.date),
      }));
      return obj;
    });

    this.cameraCaptures.hook('reading', obj => {
      obj.timestamp = new Date(obj.timestamp);
      return obj;
    });

    this.artworks.hook('reading', obj => {
      obj.createdAt = new Date(obj.createdAt);
      return obj;
    });
  }
}

// Database instance
export const db = new CalligraphyDB();

// LocalStorage utilities for user settings
export interface UserSettings {
  fontStyle: FontStyle;
  showStrokeOrder: boolean;
  showGrid: boolean;
  soundEnabled: boolean;
  leftHanded: boolean;
  brushSize: 'small' | 'medium' | 'large';
  inkDensity: number;
  learningAmount: number; // Number of characters per session (default 10)
  preferredLanguage: 'hangul' | 'hanja';
}

const DEFAULT_SETTINGS: UserSettings = {
  fontStyle: 'panbon',
  showStrokeOrder: true,
  showGrid: true,
  soundEnabled: true,
  leftHanded: false,
  brushSize: 'medium',
  inkDensity: 0.8,
  learningAmount: 10,
  preferredLanguage: 'hangul',
};

export class SettingsStore {
  private static readonly KEY = 'calligraphy-settings';

  static get(): UserSettings {
    try {
      const stored = localStorage.getItem(this.KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error);
    }
    return { ...DEFAULT_SETTINGS };
  }

  static set(settings: Partial<UserSettings>): void {
    try {
      const current = this.get();
      const updated = { ...current, ...settings };
      localStorage.setItem(this.KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error);
    }
  }

  static reset(): void {
    try {
      localStorage.removeItem(this.KEY);
    } catch (error) {
      console.error('Failed to reset settings:', error);
    }
  }
}

// OAuth token storage
export class AuthStore {
  private static readonly TOKEN_KEY = 'calligraphy-auth-token';
  private static readonly USER_KEY = 'calligraphy-user-info';

  private static handleStorageError(operation: string, error: unknown): void {
    console.error(`AuthStore ${operation} failed:`, error);
    // In production, you might want to send this to an error tracking service
  }

  static setToken(token: string): void {
    try {
      if (!token) {
        throw new Error('Token cannot be empty');
      }
      localStorage.setItem(this.TOKEN_KEY, token);
    } catch (error) {
      this.handleStorageError('setToken', error);
      throw error; // Re-throw for caller to handle
    }
  }

  static getToken(): string | null {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      this.handleStorageError('getToken', error);
      return null;
    }
  }

  static setUser(user: { id: string; email: string; name?: string; provider: string }): void {
    try {
      if (!user || !user.id || !user.email) {
        throw new Error('User data is incomplete');
      }
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      this.handleStorageError('setUser', error);
      throw error;
    }
  }

  static getUser(): { id: string; email: string; name?: string; provider: string } | null {
    try {
      const stored = localStorage.getItem(this.USER_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored);

      // Validate user data structure
      if (!parsed.id || !parsed.email) {
        console.warn('Invalid user data found in storage, clearing...');
        this.clear();
        return null;
      }

      return parsed;
    } catch (error) {
      this.handleStorageError('getUser', error);
      // Clear corrupted data
      try {
        localStorage.removeItem(this.USER_KEY);
      } catch {}
      return null;
    }
  }

  static clear(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    } catch (error) {
      this.handleStorageError('clear', error);
      // Don't throw here as clear should always succeed
    }
  }
}

// Offline sync utilities
export class OfflineSync {
  private static readonly SYNC_QUEUE_KEY = 'calligraphy-sync-queue';

  static addToSyncQueue(operation: {
    type: 'create' | 'update' | 'delete';
    table: string;
    data: any;
    timestamp: Date;
  }): void {
    try {
      const queue = this.getSyncQueue();
      queue.push(operation);
      localStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Failed to add to sync queue:', error);
    }
  }

  static getSyncQueue(): Array<{
    type: 'create' | 'update' | 'delete';
    table: string;
    data: any;
    timestamp: Date;
  }> {
    try {
      const stored = localStorage.getItem(this.SYNC_QUEUE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
      }
    } catch (error) {
      console.error('Failed to get sync queue:', error);
    }
    return [];
  }

  static clearSyncQueue(): void {
    try {
      localStorage.removeItem(this.SYNC_QUEUE_KEY);
    } catch (error) {
      console.error('Failed to clear sync queue:', error);
    }
  }

  static isOnline(): boolean {
    return navigator.onLine;
  }
}

// Storage validation utilities
export class StorageValidator {
  static validateWritingAttempt(attempt: WritingAttempt): boolean {
    if (!attempt.strokes || attempt.strokes.length === 0) {
      console.warn('WritingAttempt must have at least 1 stroke');
      return false;
    }

    for (const stroke of attempt.strokes) {
      if (!stroke.points || stroke.points.length < 5) {
        console.warn('Each stroke must have at least 5 points');
        return false;
      }

      for (const point of stroke.points) {
        if (point.pressure < 0 || point.pressure > 1) {
          console.warn('Pressure must be between 0 and 1');
          return false;
        }
      }
    }

    return true;
  }

  static validateEvaluation(evaluation: Evaluation): boolean {
    if (evaluation.totalScore < 0 || evaluation.totalScore > 100) {
      console.warn('Total score must be between 0 and 100');
      return false;
    }

    if (evaluation.confidence < 0 || evaluation.confidence > 1) {
      console.warn('Confidence must be between 0 and 1');
      return false;
    }

    // Validate weighted average
    const weightedSum = evaluation.components.reduce(
      (sum, comp) => sum + (comp.score * comp.weight) / 100,
      0
    );

    if (Math.abs(weightedSum - evaluation.totalScore) > 0.1) {
      console.warn('Component scores do not match total score');
      return false;
    }

    return true;
  }
}

// Export utilities for easy testing
export const storageUtils = {
  db,
  SettingsStore,
  AuthStore,
  OfflineSync,
  StorageValidator,
};
