import type { Course, LearningRecord, ProgressStats, Achievement } from '../types/course';

const DB_NAME = 'CalligraphyCoachDB';
const DB_VERSION = 1;

// IndexedDB 스토어 이름
const STORES = {
  PROGRESS: 'progress',
  RECORDS: 'records',
  ACHIEVEMENTS: 'achievements',
  COURSES: 'courses'
};

class ProgressStorageService {
  private db: IDBDatabase | null = null;

  // DB 초기화
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 진도 저장소
        if (!db.objectStoreNames.contains(STORES.PROGRESS)) {
          const progressStore = db.createObjectStore(STORES.PROGRESS, { keyPath: 'courseId' });
          progressStore.createIndex('status', 'status', { unique: false });
        }

        // 학습 기록 저장소
        if (!db.objectStoreNames.contains(STORES.RECORDS)) {
          const recordsStore = db.createObjectStore(STORES.RECORDS, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          recordsStore.createIndex('courseId', 'courseId', { unique: false });
          recordsStore.createIndex('lessonId', 'lessonId', { unique: false });
          recordsStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // 성취도 저장소
        if (!db.objectStoreNames.contains(STORES.ACHIEVEMENTS)) {
          const achievementsStore = db.createObjectStore(STORES.ACHIEVEMENTS, { keyPath: 'id' });
          achievementsStore.createIndex('earnedAt', 'earnedAt', { unique: false });
        }

        // 코스 상태 저장소
        if (!db.objectStoreNames.contains(STORES.COURSES)) {
          db.createObjectStore(STORES.COURSES, { keyPath: 'courseId' });
        }
      };
    });
  }

  // 코스 진도 저장
  async saveCourseProgress(courseId: string, progress: Partial<Course>): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction([STORES.COURSES], 'readwrite');
    const store = transaction.objectStore(STORES.COURSES);
    
    const data = {
      courseId,
      ...progress,
      updatedAt: new Date()
    };
    
    return new Promise((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // 코스 진도 조회
  async getCourseProgress(courseId: string): Promise<any> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction([STORES.COURSES], 'readonly');
    const store = transaction.objectStore(STORES.COURSES);
    
    return new Promise((resolve, reject) => {
      const request = store.get(courseId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 전체 진도 조회
  async getAllProgress(): Promise<any[]> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction([STORES.COURSES], 'readonly');
    const store = transaction.objectStore(STORES.COURSES);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 학습 기록 저장
  async saveLearningRecord(record: Omit<LearningRecord, 'id'>): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction([STORES.RECORDS], 'readwrite');
    const store = transaction.objectStore(STORES.RECORDS);
    
    return new Promise((resolve, reject) => {
      const request = store.add({
        ...record,
        timestamp: new Date()
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // 코스별 학습 기록 조회
  async getLearningRecords(courseId: string): Promise<LearningRecord[]> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction([STORES.RECORDS], 'readonly');
    const store = transaction.objectStore(STORES.RECORDS);
    const index = store.index('courseId');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(courseId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 성취도 저장
  async saveAchievement(achievement: Achievement): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction([STORES.ACHIEVEMENTS], 'readwrite');
    const store = transaction.objectStore(STORES.ACHIEVEMENTS);
    
    return new Promise((resolve, reject) => {
      const request = store.add(achievement);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // 전체 성취도 조회
  async getAchievements(): Promise<Achievement[]> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction([STORES.ACHIEVEMENTS], 'readonly');
    const store = transaction.objectStore(STORES.ACHIEVEMENTS);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 통계 계산
  async getProgressStats(): Promise<ProgressStats> {
    if (!this.db) await this.init();
    
    const allProgress = await this.getAllProgress();
    const allRecords = await this.getAllLearningRecords();
    const achievements = await this.getAchievements();
    
    // 통계 계산
    const totalCoursesCompleted = allProgress.filter(p => p.status === 'completed').length;
    const totalLessonsCompleted = allProgress.reduce((sum, p) => sum + (p.completedLessons || 0), 0);
    const totalCharactersPracticed = allRecords.length;
    const totalPracticeTime = allRecords.reduce((sum, r) => sum + (r.duration || 0), 0) / 60;
    
    const scores = allRecords.map(r => r.score).filter(s => s > 0);
    const averageScore = scores.length > 0 
      ? scores.reduce((sum, s) => sum + s, 0) / scores.length 
      : 0;
    
    // 연속 일수 계산
    const dates = allRecords.map(r => new Date(r.timestamp).toDateString());
    const uniqueDates = [...new Set(dates)].sort();
    let streakDays = 0;
    
    if (uniqueDates.length > 0) {
      const today = new Date().toDateString();
      if (uniqueDates[uniqueDates.length - 1] === today) {
        streakDays = 1;
        for (let i = uniqueDates.length - 2; i >= 0; i--) {
          const prevDate = new Date(uniqueDates[i]);
          const currDate = new Date(uniqueDates[i + 1]);
          const diff = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
          if (diff === 1) {
            streakDays++;
          } else {
            break;
          }
        }
      }
    }
    
    const lastPracticeDate = allRecords.length > 0 
      ? new Date(Math.max(...allRecords.map(r => new Date(r.timestamp).getTime())))
      : new Date();
    
    return {
      totalCoursesCompleted,
      totalLessonsCompleted,
      totalCharactersPracticed,
      totalPracticeTime: Math.round(totalPracticeTime),
      averageScore: Math.round(averageScore),
      streakDays,
      lastPracticeDate,
      achievements
    };
  }

  // 전체 학습 기록 조회
  private async getAllLearningRecords(): Promise<LearningRecord[]> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction([STORES.RECORDS], 'readonly');
    const store = transaction.objectStore(STORES.RECORDS);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 레슨 완료 처리
  async completeLessonAndUpdateProgress(
    courseId: string, 
    lessonId: string, 
    score: number,
    evaluation: any,
    canvasData?: string
  ): Promise<void> {
    // 학습 기록 저장
    await this.saveLearningRecord({
      courseId,
      lessonId,
      characterId: '', // 필요시 추가
      score,
      evaluation,
      canvasData,
      timestamp: new Date(),
      duration: 0 // 실제 소요 시간 계산 필요
    });

    // 코스 진도 업데이트
    const currentProgress = await this.getCourseProgress(courseId);
    const updatedProgress = {
      ...currentProgress,
      completedLessons: (currentProgress?.completedLessons || 0) + 1,
      progress: Math.round(((currentProgress?.completedLessons || 0) + 1) / (currentProgress?.totalLessons || 1) * 100)
    };

    await this.saveCourseProgress(courseId, updatedProgress);

    // 성취도 체크 및 저장
    if (score >= 90) {
      await this.saveAchievement({
        id: `high-score-${Date.now()}`,
        title: '완벽한 글씨',
        description: `${score}점의 높은 점수를 획득했습니다`,
        icon: '🏆',
        earnedAt: new Date(),
        type: 'score'
      });
    }
  }
}

export const progressStorage = new ProgressStorageService();