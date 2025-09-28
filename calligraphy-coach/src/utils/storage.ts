/**
 * Storage utilities for digital calligraphy app
 * Handles IndexedDB for large data and LocalStorage for settings
 */

import Dexie, { Table } from 'dexie';
import type { User, WritingSession, WritingAttempt } from '../types/auth';

// Supporting types
export type FontStyle = 'panbon' | 'gungseo' | 'jeonseo' | 'haeseo';

// IndexedDB Database class - Simplified for our needs
export class CalligraphyDB extends Dexie {
  sessions!: Table<WritingSession, string>;
  attempts!: Table<WritingAttempt, string>;

  constructor() {
    super('CalligraphyDB');

    this.version(1).stores({
      sessions: 'id, userId, createdAt, targetCharacter',
      attempts: 'id, sessionId, userId, createdAt',
    });
  }
}

// Database instance
export const db = new CalligraphyDB();
export const calligraphyDB = db; // 호환성을 위한 별칭

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
  }

  static setToken(token: string): void {
    try {
      if (!token) {
        throw new Error('Token cannot be empty');
      }
      localStorage.setItem(this.TOKEN_KEY, token);
    } catch (error) {
      this.handleStorageError('setToken', error);
      throw error;
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

  static setUser(user: User): void {
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

  static getUser(): User | null {
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
    }
  }
}

// Export utilities for easy testing
export const storageUtils = {
  db,
  SettingsStore,
  AuthStore,
};