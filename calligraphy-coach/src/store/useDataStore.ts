/**
 * 📊 데이터 스토어 - Zustand 기반 상태 관리
 * 
 * IndexedDB와 연동하여 사용자의 연습 데이터를 관리합니다.
 * - 연습 세션 데이터
 * - 주간 통계
 * - 개인 최고 기록
 * - 사용자 진도
 */

import { create } from 'zustand';
import { calligraphyDB } from '../utils/storage';
import { initializeSampleDataIfNeeded } from '../utils/testData';
import type { WritingSession, WritingAttempt, User } from '../types/auth';

// 사용자 진도 타입
export interface UserProgress {
  currentCourse: string;
  progress: number;
  currentLesson: string;
  completedLessons: number;
  totalLessons: number;
}

// 주간 통계 타입
export interface WeeklyStats {
  practiceTime: number; // 분
  averageScore: number;
  streakDays: number;
  completedCharacters: number;
}

// 개인 최고 기록 타입
export interface PersonalBests {
  allTimeHigh: number;
  allTimeHighCharacter: string;
  allTimeHighDate: string;
  weeklyHigh: number;
  weeklyHighCharacter: string;
  weeklyHighDate: string;
  improvedCharacter: string;
  improvementPercent: number;
}

// 최근 세션 타입 (UI 표시용)
export interface RecentSession {
  id: string;
  character: string;
  score: number;
  date: string;
  course: string;
  timeSpent: string;
}

interface DataState {
  // 상태
  isLoading: boolean;
  userProgress: UserProgress | null;
  recentSessions: RecentSession[];
  weeklyStats: WeeklyStats | null;
  personalBests: PersonalBests | null;
  
  // 액션
  loadUserData: (userId: string) => Promise<void>;
  addSession: (session: WritingSession) => Promise<void>;
  updateProgress: (progress: Partial<UserProgress>) => Promise<void>;
  refreshStats: (userId: string) => Promise<void>;
}

// 기본값 설정
const defaultProgress: UserProgress = {
  currentCourse: "판본체 기초",
  progress: 0,
  currentLesson: "기본 자음 연습",
  completedLessons: 0,
  totalLessons: 20
};

const defaultWeeklyStats: WeeklyStats = {
  practiceTime: 0,
  averageScore: 0,
  streakDays: 0,
  completedCharacters: 0
};

const defaultPersonalBests: PersonalBests = {
  allTimeHigh: 0,
  allTimeHighCharacter: '',
  allTimeHighDate: '',
  weeklyHigh: 0,
  weeklyHighCharacter: '',
  weeklyHighDate: '',
  improvedCharacter: '',
  improvementPercent: 0
};

export const useDataStore = create<DataState>((set, get) => ({
  // 초기 상태
  isLoading: false,
  userProgress: null,
  recentSessions: [],
  weeklyStats: null,
  personalBests: null,

  // 사용자 데이터 로드 (로그인 후 호출)
  loadUserData: async (userId: string) => {
    set({ isLoading: true });
    
    try {
      // 0. 개발 모드에서 샘플 데이터 초기화
      await initializeSampleDataIfNeeded(userId);

      // 1. 사용자 진도 로드 (localStorage에서)
      const savedProgress = localStorage.getItem(`userProgress_${userId}`);
      const userProgress = savedProgress ? JSON.parse(savedProgress) : defaultProgress;

      // 2. 최근 세션 로드 (최근 5개)
      const sessions = await calligraphyDB.sessions
        .where('userId')
        .equals(userId)
        .reverse()
        .sortBy('createdAt');
      
      const recentSessions = sessions.slice(0, 5).map(session => ({
        id: session.id,
        character: session.targetCharacter,
        score: session.averageScore,
        date: new Date(session.createdAt).toISOString().split('T')[0],
        course: session.course || '판본체 기초',
        timeSpent: `${Math.floor(session.duration / 60000)}분`
      }));

      // 3. 통계 계산
      const { weeklyStats, personalBests } = await calculateStats(userId);

      set({
        userProgress,
        recentSessions,
        weeklyStats,
        personalBests,
        isLoading: false
      });

    } catch (error) {
      console.error('Failed to load user data:', error);
      
      // 실패 시 기본값 설정
      set({
        userProgress: defaultProgress,
        recentSessions: [],
        weeklyStats: defaultWeeklyStats,
        personalBests: defaultPersonalBests,
        isLoading: false
      });
    }
  },

  // 새 세션 추가
  addSession: async (session: WritingSession) => {
    try {
      await calligraphyDB.sessions.add(session);
      
      // 상태 새로고침
      await get().refreshStats(session.userId);
    } catch (error) {
      console.error('Failed to add session:', error);
    }
  },

  // 진도 업데이트
  updateProgress: async (progress: Partial<UserProgress>) => {
    const current = get().userProgress || defaultProgress;
    const updated = { ...current, ...progress };
    
    set({ userProgress: updated });
    
    // localStorage에 저장 (userId는 AuthContext에서 가져와야 함)
    const userId = 'current_user'; // TODO: 실제 userId로 교체
    localStorage.setItem(`userProgress_${userId}`, JSON.stringify(updated));
  },

  // 통계 새로고침
  refreshStats: async (userId: string) => {
    try {
      const { weeklyStats, personalBests } = await calculateStats(userId);
      
      // 최근 세션도 새로고침
      const sessions = await calligraphyDB.sessions
        .where('userId')
        .equals(userId)
        .reverse()
        .sortBy('createdAt');
      
      const recentSessions = sessions.slice(0, 5).map(session => ({
        id: session.id,
        character: session.targetCharacter,
        score: session.averageScore,
        date: new Date(session.createdAt).toISOString().split('T')[0],
        course: session.course || '판본체 기초',
        timeSpent: `${Math.floor(session.duration / 60000)}분`
      }));

      set({ weeklyStats, personalBests, recentSessions });
    } catch (error) {
      console.error('Failed to refresh stats:', error);
    }
  }
}));

// 통계 계산 헬퍼 함수
async function calculateStats(userId: string): Promise<{
  weeklyStats: WeeklyStats;
  personalBests: PersonalBests;
}> {
  const now = new Date();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);

  // 이번 주 세션들
  const weeklySessions = await calligraphyDB.sessions
    .where('userId')
    .equals(userId)
    .and(session => session.createdAt >= weekStart.getTime() && session.createdAt < weekEnd.getTime())
    .toArray();

  // 모든 세션들 (최고 기록용)
  const allSessions = await calligraphyDB.sessions
    .where('userId')
    .equals(userId)
    .toArray();

  // 주간 통계 계산
  const weeklyStats: WeeklyStats = {
    practiceTime: weeklySessions.reduce((total, session) => total + session.duration, 0) / 60000, // 분 단위
    averageScore: weeklySessions.length > 0 
      ? weeklySessions.reduce((total, session) => total + session.averageScore, 0) / weeklySessions.length 
      : 0,
    streakDays: calculateStreakDays(allSessions),
    completedCharacters: new Set(weeklySessions.map(s => s.targetCharacter)).size
  };

  // 개인 최고 기록 계산
  const allTimeHighSession = allSessions.reduce((best, session) => 
    session.averageScore > (best?.averageScore || 0) ? session : best, null as WritingSession | null);
    
  const weeklyHighSession = weeklySessions.reduce((best, session) => 
    session.averageScore > (best?.averageScore || 0) ? session : best, null as WritingSession | null);

  const personalBests: PersonalBests = {
    allTimeHigh: allTimeHighSession?.averageScore || 0,
    allTimeHighCharacter: allTimeHighSession?.targetCharacter || '',
    allTimeHighDate: allTimeHighSession ? new Date(allTimeHighSession.createdAt).toISOString().split('T')[0] : '',
    weeklyHigh: weeklyHighSession?.averageScore || 0,
    weeklyHighCharacter: weeklyHighSession?.targetCharacter || '',
    weeklyHighDate: weeklyHighSession ? new Date(weeklyHighSession.createdAt).toISOString().split('T')[0] : '',
    improvedCharacter: '가', // TODO: 실제 향상 분석 로직 구현
    improvementPercent: 15 // TODO: 실제 향상률 계산
  };

  return { weeklyStats, personalBests };
}

// 연속 연습일 계산
function calculateStreakDays(sessions: WritingSession[]): number {
  if (sessions.length === 0) return 0;

  const sortedSessions = sessions.sort((a, b) => b.createdAt - a.createdAt);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let currentDate = new Date(today);

  for (const session of sortedSessions) {
    const sessionDate = new Date(session.createdAt);
    sessionDate.setHours(0, 0, 0, 0);

    if (sessionDate.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (sessionDate.getTime() < currentDate.getTime()) {
      // 연속성이 깨짐
      break;
    }
  }

  return streak;
}