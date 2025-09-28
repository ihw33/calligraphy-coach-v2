import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { UserStorage } from '../userStorage';
import { db, WritingSession, WritingAttempt, Progress, OfflineSync } from '../storage';
import type { FontStyle } from '../storage';

// Mock IndexedDB operations
vi.mock('../storage', () => {
  const mockDB = {
    sessions: {
      add: vi.fn(),
      get: vi.fn(),
      where: vi.fn(),
      toArray: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    attempts: {
      add: vi.fn(),
      get: vi.fn(),
      where: vi.fn(),
      toArray: vi.fn(),
      bulkAdd: vi.fn(),
    },
    progress: {
      add: vi.fn(),
      get: vi.fn(),
      where: vi.fn(),
      toArray: vi.fn(),
      put: vi.fn(),
    },
    cameraCaptures: {
      add: vi.fn(),
      where: vi.fn(),
      toArray: vi.fn(),
      delete: vi.fn(),
    },
  };

  return {
    db: mockDB,
    OfflineSync: {
      addToSyncQueue: vi.fn(),
      getSyncQueue: vi.fn(),
      clearSyncQueue: vi.fn(),
      isOnline: vi.fn(),
    },
    StorageValidator: {
      validateWritingAttempt: vi.fn(),
      validateEvaluation: vi.fn(),
    },
  };
});

// Mock data
const mockUserId = 'user-123';
const mockSession: WritingSession = {
  id: 'session-1',
  userId: mockUserId,
  startTime: new Date('2025-09-19T10:00:00Z'),
  endTime: new Date('2025-09-19T11:00:00Z'),
  fontStyle: 'panbon' as FontStyle,
  charactersPracticed: ['가', '나', '다'],
  totalScore: 85,
  device: {
    type: 'touch',
    pressureSupported: false,
  },
};

const mockAttempt: WritingAttempt = {
  id: 'attempt-1',
  sessionId: 'session-1',
  characterId: 'char-가',
  timestamp: new Date('2025-09-19T10:15:00Z'),
  strokes: [
    {
      points: [
        { x: 10, y: 10, pressure: 0.5, timestamp: 0 },
        { x: 20, y: 20, pressure: 0.7, timestamp: 100 },
        { x: 30, y: 30, pressure: 0.3, timestamp: 200 },
      ],
      order: 1,
      timestamp: new Date('2025-09-19T10:15:00Z'),
    },
  ],
  canvasImage:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  evaluation: {
    attemptId: 'attempt-1',
    totalScore: 85,
    components: [
      { type: 'shape', score: 35, maxScore: 40, weight: 40 },
      { type: 'proportion', score: 25, maxScore: 30, weight: 30 },
      { type: 'thickness', score: 17, maxScore: 20, weight: 20 },
      { type: 'strokeOrder', score: 8, maxScore: 10, weight: 10 },
    ],
    confidence: 0.9,
  },
  duration: 15000,
};

const mockProgress: Progress = {
  userId: mockUserId,
  character: '가',
  fontStyle: 'panbon' as FontStyle,
  attempts: 5,
  bestScore: 95,
  averageScore: 82,
  lastPracticed: new Date('2025-09-19T11:00:00Z'),
  improvements: [
    { date: new Date('2025-09-19'), score: 85, component: 'shape' },
    { date: new Date('2025-09-18'), score: 78, component: 'proportion' },
  ],
};

describe('UserStorage', () => {
  let userStorage: UserStorage;

  beforeEach(() => {
    vi.clearAllMocks();
    userStorage = new UserStorage(mockUserId);

    // Default mock implementations
    (OfflineSync.isOnline as any).mockReturnValue(true);
    (db.sessions.where as any).mockReturnValue({
      equals: vi.fn().mockReturnValue({
        toArray: vi.fn().mockResolvedValue([]),
      }),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Session Management', () => {
    it('should save new writing session', async () => {
      (db.sessions.add as any).mockResolvedValue('session-1');

      const result = await userStorage.saveSession(mockSession);

      expect(db.sessions.add).toHaveBeenCalledWith(mockSession);
      expect(result).toBe('session-1');
    });

    it('should retrieve user sessions ordered by start time', async () => {
      const mockSessions = [mockSession];
      (db.sessions.where as any).mockReturnValue({
        equals: vi.fn().mockReturnValue({
          reverse: vi.fn().mockReturnValue({
            toArray: vi.fn().mockResolvedValue(mockSessions),
          }),
        }),
      });

      const sessions = await userStorage.getSessions();

      expect(sessions).toEqual(mockSessions);
      expect(db.sessions.where).toHaveBeenCalledWith('userId');
    });

    it('should get session by ID', async () => {
      (db.sessions.get as any).mockResolvedValue(mockSession);

      const session = await userStorage.getSession('session-1');

      expect(session).toEqual(mockSession);
      expect(db.sessions.get).toHaveBeenCalledWith('session-1');
    });

    it('should update existing session', async () => {
      const updatedSession = { ...mockSession, totalScore: 90 };
      (db.sessions.update as any).mockResolvedValue(1);

      await userStorage.updateSession('session-1', { totalScore: 90 });

      expect(db.sessions.update).toHaveBeenCalledWith('session-1', { totalScore: 90 });
    });

    it('should delete session and related attempts', async () => {
      const mockAttempts = [mockAttempt];
      (db.attempts.where as any).mockReturnValue({
        equals: vi.fn().mockReturnValue({
          toArray: vi.fn().mockResolvedValue(mockAttempts),
        }),
      });
      (db.sessions.delete as any).mockResolvedValue(1);
      (db.attempts.where as any).mockReturnValue({
        equals: vi.fn().mockReturnValue({
          delete: vi.fn().mockResolvedValue(1),
        }),
      });

      await userStorage.deleteSession('session-1');

      expect(db.sessions.delete).toHaveBeenCalledWith('session-1');
    });
  });

  describe('Attempt Management', () => {
    it('should save writing attempt with validation', async () => {
      const { StorageValidator } = await import('../storage');
      (StorageValidator.validateWritingAttempt as any).mockReturnValue(true);
      (db.attempts.add as any).mockResolvedValue('attempt-1');

      const result = await userStorage.saveAttempt(mockAttempt);

      expect(StorageValidator.validateWritingAttempt).toHaveBeenCalledWith(mockAttempt);
      expect(db.attempts.add).toHaveBeenCalledWith(mockAttempt);
      expect(result).toBe('attempt-1');
    });

    it('should reject invalid attempt', async () => {
      const { StorageValidator } = await import('../storage');
      (StorageValidator.validateWritingAttempt as any).mockReturnValue(false);

      await expect(userStorage.saveAttempt(mockAttempt)).rejects.toThrow(
        'Invalid writing attempt data'
      );

      expect(db.attempts.add).not.toHaveBeenCalled();
    });

    it('should get attempts for session', async () => {
      const mockAttempts = [mockAttempt];
      (db.attempts.where as any).mockReturnValue({
        equals: vi.fn().mockReturnValue({
          toArray: vi.fn().mockResolvedValue(mockAttempts),
        }),
      });

      const attempts = await userStorage.getSessionAttempts('session-1');

      expect(attempts).toEqual(mockAttempts);
      expect(db.attempts.where).toHaveBeenCalledWith('sessionId');
    });

    it('should get attempts for specific character', async () => {
      const mockAttempts = [mockAttempt];
      (db.attempts.where as any).mockReturnValue({
        equals: vi.fn().mockReturnValue({
          toArray: vi.fn().mockResolvedValue(mockAttempts),
        }),
      });

      const attempts = await userStorage.getCharacterAttempts('char-가');

      expect(attempts).toEqual(mockAttempts);
      expect(db.attempts.where).toHaveBeenCalledWith('characterId');
    });
  });

  describe('Progress Management', () => {
    it('should save user progress', async () => {
      (db.progress.put as any).mockResolvedValue('progress-key');

      await userStorage.saveProgress(mockProgress);

      expect(db.progress.put).toHaveBeenCalledWith(mockProgress);
    });

    it('should get progress for character and font style', async () => {
      (db.progress.where as any).mockReturnValue({
        equals: vi.fn().mockReturnValue({
          first: vi.fn().mockResolvedValue(mockProgress),
        }),
      });

      const progress = await userStorage.getProgress('가', 'panbon');

      expect(progress).toEqual(mockProgress);
    });

    it('should get all user progress', async () => {
      const mockProgressList = [mockProgress];
      (db.progress.where as any).mockReturnValue({
        equals: vi.fn().mockReturnValue({
          toArray: vi.fn().mockResolvedValue(mockProgressList),
        }),
      });

      const progressList = await userStorage.getAllProgress();

      expect(progressList).toEqual(mockProgressList);
      expect(db.progress.where).toHaveBeenCalledWith('userId');
    });

    it('should update progress statistics after new attempt', async () => {
      const existingProgress = { ...mockProgress, attempts: 4, averageScore: 80 };
      (db.progress.where as any).mockReturnValue({
        equals: vi.fn().mockReturnValue({
          first: vi.fn().mockResolvedValue(existingProgress),
        }),
      });
      (db.progress.put as any).mockResolvedValue('progress-key');

      await userStorage.updateProgressAfterAttempt('가', 'panbon', 90);

      expect(db.progress.put).toHaveBeenCalledWith(
        expect.objectContaining({
          attempts: 5,
          bestScore: 95, // max(95, 90)
          averageScore: expect.any(Number),
        })
      );
    });
  });

  describe('Offline Sync Management', () => {
    it('should add operation to sync queue when offline', async () => {
      (OfflineSync.isOnline as any).mockReturnValue(false);
      (db.sessions.add as any).mockResolvedValue('session-1');

      await userStorage.saveSession(mockSession);

      expect(OfflineSync.addToSyncQueue).toHaveBeenCalledWith({
        type: 'create',
        table: 'sessions',
        data: mockSession,
        timestamp: expect.any(Date),
      });
    });

    it('should process sync queue when coming back online', async () => {
      const mockSyncQueue = [
        {
          type: 'create' as const,
          table: 'sessions',
          data: mockSession,
          timestamp: new Date(),
        },
      ];
      (OfflineSync.getSyncQueue as any).mockReturnValue(mockSyncQueue);
      (OfflineSync.isOnline as any).mockReturnValue(true);

      await userStorage.processSyncQueue();

      expect(OfflineSync.clearSyncQueue).toHaveBeenCalled();
    });

    it('should handle sync queue processing errors', async () => {
      const mockSyncQueue = [
        {
          type: 'create' as const,
          table: 'invalid-table',
          data: {},
          timestamp: new Date(),
        },
      ];
      (OfflineSync.getSyncQueue as any).mockReturnValue(mockSyncQueue);

      // Should not throw error, but handle gracefully
      await expect(userStorage.processSyncQueue()).resolves.not.toThrow();
    });
  });

  describe('Data Export/Import', () => {
    it('should export user data for backup', async () => {
      const mockSessions = [mockSession];
      const mockAttempts = [mockAttempt];
      const mockProgressList = [mockProgress];

      (db.sessions.where as any).mockReturnValue({
        equals: vi.fn().mockReturnValue({
          toArray: vi.fn().mockResolvedValue(mockSessions),
        }),
      });
      (db.attempts.where as any).mockReturnValue({
        equals: vi.fn().mockReturnValue({
          toArray: vi.fn().mockResolvedValue(mockAttempts),
        }),
      });
      (db.progress.where as any).mockReturnValue({
        equals: vi.fn().mockReturnValue({
          toArray: vi.fn().mockResolvedValue(mockProgressList),
        }),
      });

      const exportData = await userStorage.exportUserData();

      expect(exportData).toEqual({
        userId: mockUserId,
        exportDate: expect.any(Date),
        sessions: mockSessions,
        attempts: mockAttempts,
        progress: mockProgressList,
      });
    });

    it('should import user data from backup', async () => {
      const importData = {
        userId: mockUserId,
        exportDate: new Date(),
        sessions: [mockSession],
        attempts: [mockAttempt],
        progress: [mockProgress],
      };

      (db.sessions.bulkAdd as any).mockResolvedValue(['session-1']);
      (db.attempts.bulkAdd as any).mockResolvedValue(['attempt-1']);
      (db.progress.bulkAdd as any).mockResolvedValue(['progress-1']);

      await userStorage.importUserData(importData);

      expect(db.sessions.bulkAdd).toHaveBeenCalledWith(importData.sessions);
      expect(db.attempts.bulkAdd).toHaveBeenCalledWith(importData.attempts);
      expect(db.progress.bulkAdd).toHaveBeenCalledWith(importData.progress);
    });

    it('should validate imported data before saving', async () => {
      const invalidImportData = {
        userId: 'different-user',
        exportDate: new Date(),
        sessions: [],
        attempts: [],
        progress: [],
      };

      await expect(userStorage.importUserData(invalidImportData)).rejects.toThrow(
        'Import data user ID does not match'
      );
    });
  });

  describe('Storage Cleanup', () => {
    it('should clean up old sessions based on retention policy', async () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 31); // 31 days ago

      const oldSession = { ...mockSession, startTime: oldDate };
      const recentSession = { ...mockSession, id: 'session-2' };

      (db.sessions.where as any).mockReturnValue({
        below: vi.fn().mockReturnValue({
          toArray: vi.fn().mockResolvedValue([oldSession]),
        }),
      });

      await userStorage.cleanupOldData();

      expect(db.sessions.where).toHaveBeenCalledWith('startTime');
    });

    it('should get storage usage statistics', async () => {
      const mockSessions = [mockSession];
      const mockAttempts = [mockAttempt];

      (db.sessions.where as any).mockReturnValue({
        equals: vi.fn().mockReturnValue({
          toArray: vi.fn().mockResolvedValue(mockSessions),
        }),
      });
      (db.attempts.where as any).mockReturnValue({
        equals: vi.fn().mockReturnValue({
          toArray: vi.fn().mockResolvedValue(mockAttempts),
        }),
      });

      const stats = await userStorage.getStorageStats();

      expect(stats).toEqual({
        sessionCount: 1,
        attemptCount: 1,
        estimatedSize: expect.any(Number),
        lastCleanup: expect.any(Date),
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle IndexedDB errors gracefully', async () => {
      (db.sessions.add as any).mockRejectedValue(new Error('IndexedDB error'));

      await expect(userStorage.saveSession(mockSession)).rejects.toThrow('IndexedDB error');
    });

    it('should handle quota exceeded errors', async () => {
      const quotaError = new Error('QuotaExceededError');
      quotaError.name = 'QuotaExceededError';
      (db.sessions.add as any).mockRejectedValue(quotaError);

      await expect(userStorage.saveSession(mockSession)).rejects.toThrow('Storage quota exceeded');
    });

    it('should handle network errors during sync', async () => {
      (OfflineSync.isOnline as any).mockReturnValue(false);

      // Should save locally when offline
      await userStorage.saveSession(mockSession);

      expect(OfflineSync.addToSyncQueue).toHaveBeenCalled();
    });
  });

  describe('Cache Management', () => {
    it('should implement LRU cache for frequently accessed data', async () => {
      // Access the same session multiple times
      (db.sessions.get as any).mockResolvedValue(mockSession);

      await userStorage.getSession('session-1');
      await userStorage.getSession('session-1');

      // Should use cache on second call
      expect(db.sessions.get).toHaveBeenCalledTimes(1);
    });

    it('should invalidate cache when data is updated', async () => {
      (db.sessions.get as any).mockResolvedValue(mockSession);
      (db.sessions.update as any).mockResolvedValue(1);

      await userStorage.getSession('session-1');
      await userStorage.updateSession('session-1', { totalScore: 90 });
      await userStorage.getSession('session-1');

      // Should fetch fresh data after update
      expect(db.sessions.get).toHaveBeenCalledTimes(2);
    });
  });
});
