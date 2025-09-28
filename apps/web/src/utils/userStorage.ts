/**
 * User-specific data storage utilities with offline support
 */

import {
  db,
  WritingSession,
  WritingAttempt,
  Progress,
  OfflineSync,
  StorageValidator,
  FontStyle,
} from './storage';

export interface UserExportData {
  userId: string;
  exportDate: Date;
  sessions: WritingSession[];
  attempts: WritingAttempt[];
  progress: Progress[];
}

export interface StorageStats {
  sessionCount: number;
  attemptCount: number;
  estimatedSize: number;
  lastCleanup: Date;
}

export class UserStorage {
  private userId: string;
  private cache: Map<string, any> = new Map();

  constructor(userId: string) {
    this.userId = userId;
  }

  // Session Management
  async saveSession(session: WritingSession): Promise<string> {
    try {
      const result = await db.sessions.add(session);

      // Add to sync queue if offline
      if (!OfflineSync.isOnline()) {
        OfflineSync.addToSyncQueue({
          type: 'create',
          table: 'sessions',
          data: session,
          timestamp: new Date(),
        });
      }

      // Invalidate cache
      this.cache.delete(`sessions-${this.userId}`);

      return result as string;
    } catch (error: any) {
      if (error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded');
      }
      throw error;
    }
  }

  async getSessions(): Promise<WritingSession[]> {
    const cacheKey = `sessions-${this.userId}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const sessions = await db.sessions.where('userId').equals(this.userId).reverse().toArray();

    this.cache.set(cacheKey, sessions);
    return sessions;
  }

  async getSession(sessionId: string): Promise<WritingSession | undefined> {
    const cacheKey = `session-${sessionId}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const session = await db.sessions.get(sessionId);

    if (session) {
      this.cache.set(cacheKey, session);
    }

    return session;
  }

  async updateSession(sessionId: string, updates: Partial<WritingSession>): Promise<void> {
    await db.sessions.update(sessionId, updates);

    // Invalidate cache
    this.cache.delete(`session-${sessionId}`);
    this.cache.delete(`sessions-${this.userId}`);
  }

  async deleteSession(sessionId: string): Promise<void> {
    // Delete related attempts first
    await db.attempts.where('sessionId').equals(sessionId).delete();

    // Delete session
    await db.sessions.delete(sessionId);

    // Invalidate cache
    this.cache.delete(`session-${sessionId}`);
    this.cache.delete(`sessions-${this.userId}`);
  }

  // Attempt Management
  async saveAttempt(attempt: WritingAttempt): Promise<string> {
    // Validate attempt data
    if (!StorageValidator.validateWritingAttempt(attempt)) {
      throw new Error('Invalid writing attempt data');
    }

    const result = await db.attempts.add(attempt);

    // Add to sync queue if offline
    if (!OfflineSync.isOnline()) {
      OfflineSync.addToSyncQueue({
        type: 'create',
        table: 'attempts',
        data: attempt,
        timestamp: new Date(),
      });
    }

    return result as string;
  }

  async getSessionAttempts(sessionId: string): Promise<WritingAttempt[]> {
    return await db.attempts.where('sessionId').equals(sessionId).toArray();
  }

  async getCharacterAttempts(characterId: string): Promise<WritingAttempt[]> {
    return await db.attempts.where('characterId').equals(characterId).toArray();
  }

  // Progress Management
  async saveProgress(progress: Progress): Promise<void> {
    await db.progress.put(progress);
  }

  async getProgress(character: string, fontStyle: FontStyle): Promise<Progress | undefined> {
    return await db.progress
      .where('[userId+character+fontStyle]')
      .equals([this.userId, character, fontStyle])
      .first();
  }

  async getAllProgress(): Promise<Progress[]> {
    return await db.progress.where('userId').equals(this.userId).toArray();
  }

  async updateProgressAfterAttempt(
    character: string,
    fontStyle: FontStyle,
    score: number
  ): Promise<void> {
    const existing = await this.getProgress(character, fontStyle);

    if (existing) {
      const newAttempts = existing.attempts + 1;
      const newAverage = (existing.averageScore * existing.attempts + score) / newAttempts;

      const updatedProgress: Progress = {
        ...existing,
        attempts: newAttempts,
        bestScore: Math.max(existing.bestScore, score),
        averageScore: newAverage,
        lastPracticed: new Date(),
        improvements: [
          ...existing.improvements,
          {
            date: new Date(),
            score,
            component: 'overall',
          },
        ],
      };

      await this.saveProgress(updatedProgress);
    } else {
      const newProgress: Progress = {
        userId: this.userId,
        character,
        fontStyle,
        attempts: 1,
        bestScore: score,
        averageScore: score,
        lastPracticed: new Date(),
        improvements: [
          {
            date: new Date(),
            score,
            component: 'overall',
          },
        ],
      };

      await this.saveProgress(newProgress);
    }
  }

  // Offline Sync Management
  async processSyncQueue(): Promise<void> {
    if (!OfflineSync.isOnline()) {
      return; // Still offline
    }

    const queue = OfflineSync.getSyncQueue();

    for (const operation of queue) {
      try {
        // Process each operation (simplified for now)
        console.log('Processing sync operation:', operation);
        // In a real implementation, this would sync with a server
      } catch (error) {
        console.error('Failed to process sync operation:', error);
        // Continue with other operations
      }
    }

    // Clear the queue after processing
    OfflineSync.clearSyncQueue();
  }

  // Data Export/Import
  async exportUserData(): Promise<UserExportData> {
    const sessions = await this.getSessions();
    const attempts = await db.attempts
      .where('sessionId')
      .anyOf(sessions.map(s => s.id))
      .toArray();
    const progress = await this.getAllProgress();

    return {
      userId: this.userId,
      exportDate: new Date(),
      sessions,
      attempts,
      progress,
    };
  }

  async importUserData(data: UserExportData): Promise<void> {
    if (data.userId !== this.userId) {
      throw new Error('Import data user ID does not match');
    }

    // Import data in transaction-like manner (simplified)
    await db.sessions.bulkAdd(data.sessions);
    await db.attempts.bulkAdd(data.attempts);
    await db.progress.bulkAdd(data.progress);

    // Clear cache
    this.cache.clear();
  }

  // Storage Cleanup
  async cleanupOldData(): Promise<void> {
    const retentionDays = 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    // Delete old sessions and related attempts
    const oldSessions = await db.sessions.where('startTime').below(cutoffDate).toArray();

    for (const session of oldSessions) {
      await this.deleteSession(session.id);
    }

    // Delete old camera captures
    await db.cameraCaptures.where('timestamp').below(cutoffDate).delete();
  }

  async getStorageStats(): Promise<StorageStats> {
    const sessions = await this.getSessions();
    const attempts = await db.attempts
      .where('sessionId')
      .anyOf(sessions.map(s => s.id))
      .toArray();

    // Rough size estimation
    const estimatedSize = sessions.length * 1000 + attempts.length * 5000; // bytes

    return {
      sessionCount: sessions.length,
      attemptCount: attempts.length,
      estimatedSize,
      lastCleanup: new Date(),
    };
  }
}
