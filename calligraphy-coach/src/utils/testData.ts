/**
 * 🧪 테스트 데이터 생성 유틸리티
 * 
 * 개발 단계에서 실제 데이터가 없을 때 사용할 수 있는
 * 샘플 데이터를 생성합니다.
 */

import { calligraphyDB } from './storage';
import type { WritingSession, WritingAttempt } from '../types/auth';

// 한글 글자 샘플
const sampleCharacters = [
  '가', '나', '다', '라', '마', '바', '사', '아', '자', '차', 
  '카', '타', '파', '하', '거', '너', '더', '러', '머', '버'
];

// 코스 이름 샘플
const sampleCourses = [
  '판본체 기초',
  '궁서체 입문', 
  '전서체 기초',
  '해서체 연습'
];

/**
 * 샘플 연습 세션 데이터 생성
 */
export async function generateSampleData(userId: string, sessionCount: number = 10): Promise<void> {
  try {
    console.log(`🧪 사용자 ${userId}를 위한 ${sessionCount}개의 샘플 데이터 생성 시작...`);

    const sessions: WritingSession[] = [];
    const attempts: WritingAttempt[] = [];

    // 지난 2주간의 랜덤 날짜들 생성
    const now = Date.now();
    const twoWeeksAgo = now - (14 * 24 * 60 * 60 * 1000);

    for (let i = 0; i < sessionCount; i++) {
      // 랜덤 세션 시간 (지난 2주 내)
      const sessionTime = twoWeeksAgo + Math.random() * (now - twoWeeksAgo);
      
      // 랜덤 연습 시간 (10분~30분)
      const duration = (10 + Math.random() * 20) * 60 * 1000; // ms
      
      // 랜덤 글자와 코스
      const character = sampleCharacters[Math.floor(Math.random() * sampleCharacters.length)];
      const course = sampleCourses[Math.floor(Math.random() * sampleCourses.length)];
      
      // 세션 ID 생성
      const sessionId = `session_${Date.now()}_${i}`;
      
      // 연습 세션 생성
      const session: WritingSession = {
        id: sessionId,
        userId,
        targetCharacter: character,
        course,
        deviceType: 'web',
        inputMethod: 'touch',
        createdAt: sessionTime,
        duration,
        averageScore: 70 + Math.random() * 25, // 70-95점 랜덤
        isCompleted: true
      };

      sessions.push(session);

      // 각 세션마다 3-7개의 시도 생성
      const attemptCount = 3 + Math.floor(Math.random() * 5);
      
      for (let j = 0; j < attemptCount; j++) {
        const attemptId = `attempt_${sessionId}_${j}`;
        
        // 점수가 세션이 진행될수록 향상되는 경향
        const baseScore = session.averageScore;
        const improvementFactor = j * 3; // 시도할수록 향상
        const randomVariation = (Math.random() - 0.5) * 20; // ±10점 변동
        const score = Math.max(0, Math.min(100, baseScore + improvementFactor + randomVariation));

        const attempt: WritingAttempt = {
          id: attemptId,
          sessionId,
          userId,
          targetCharacter: character,
          strokeData: generateMockStrokeData(),
          pressureData: generateMockPressureData(),
          score,
          feedback: generateMockFeedback(score),
          createdAt: sessionTime + (j * 2 * 60 * 1000), // 2분 간격
          duration: 1 + Math.random() * 3 // 1-4분
        };

        attempts.push(attempt);
      }
    }

    // IndexedDB에 저장
    await calligraphyDB.transaction('rw', calligraphyDB.sessions, calligraphyDB.attempts, async () => {
      // 기존 데이터 삭제 (해당 사용자만)
      await calligraphyDB.sessions.where('userId').equals(userId).delete();
      await calligraphyDB.attempts.where('userId').equals(userId).delete();
      
      // 새 데이터 추가
      await calligraphyDB.sessions.bulkAdd(sessions);
      await calligraphyDB.attempts.bulkAdd(attempts);
    });

    console.log(`✅ ${sessions.length}개 세션, ${attempts.length}개 시도 데이터 생성 완료!`);

  } catch (error) {
    console.error('❌ 샘플 데이터 생성 실패:', error);
    throw error;
  }
}

/**
 * 목업 획 데이터 생성
 */
function generateMockStrokeData(): Array<{ x: number; y: number; timestamp: number }> {
  const points = [];
  const pointCount = 20 + Math.floor(Math.random() * 30); // 20-50개 점
  
  for (let i = 0; i < pointCount; i++) {
    points.push({
      x: Math.random() * 300,
      y: Math.random() * 300,
      timestamp: Date.now() + i * 50 // 50ms 간격
    });
  }
  
  return points;
}

/**
 * 목업 압력 데이터 생성
 */
function generateMockPressureData(): number[] {
  const pressures = [];
  const pointCount = 20 + Math.floor(Math.random() * 30);
  
  for (let i = 0; i < pointCount; i++) {
    // 붓 터치의 자연스러운 압력 변화 시뮬레이션
    const basePressure = 0.3 + Math.random() * 0.6; // 0.3-0.9
    const variation = (Math.random() - 0.5) * 0.2; // ±0.1 변동
    pressures.push(Math.max(0, Math.min(1, basePressure + variation)));
  }
  
  return pressures;
}

/**
 * 목업 피드백 생성
 */
function generateMockFeedback(score: number): {
  overall: string;
  shape: string;
  proportion: string;
  thickness: string;
  strokeOrder: string;
} {
  const getRandomFeedback = (positive: string[], negative: string[]) => {
    return score >= 80 
      ? positive[Math.floor(Math.random() * positive.length)]
      : negative[Math.floor(Math.random() * negative.length)];
  };

  return {
    overall: score >= 90 ? '훌륭합니다!' : score >= 80 ? '잘하고 있어요!' : score >= 70 ? '조금 더 연습해보세요' : '기초부터 다시 해봅시다',
    shape: getRandomFeedback(
      ['글자 형태가 균형 잡혀 있어요', '정확한 모양입니다'],
      ['글자 형태를 다시 확인해보세요', '전체적인 균형을 맞춰보세요']
    ),
    proportion: getRandomFeedback(
      ['비례가 잘 맞습니다', '크기가 적절해요'],
      ['글자 크기를 조절해보세요', '부분별 비례를 맞춰보세요']
    ),
    thickness: getRandomFeedback(
      ['선의 굵기가 일정해요', '붓질이 안정적입니다'],
      ['선의 굵기를 일정하게 해보세요', '붓 압력을 조절해보세요']
    ),
    strokeOrder: getRandomFeedback(
      ['획순이 정확합니다', '올바른 순서로 썼어요'],
      ['획순을 다시 확인해보세요', '정확한 순서로 써보세요']
    )
  };
}

/**
 * 개발 모드에서 자동으로 샘플 데이터 생성
 */
export async function initializeSampleDataIfNeeded(userId: string): Promise<void> {
  try {
    // 기존 데이터 확인
    const existingSessions = await calligraphyDB.sessions
      .where('userId')
      .equals(userId)
      .count();

    // 데이터가 없거나 5개 미만이면 샘플 데이터 생성
    if (existingSessions < 5) {
      console.log('📊 기존 데이터가 부족하여 샘플 데이터를 생성합니다...');
      await generateSampleData(userId, 15);
    } else {
      console.log(`📊 기존 데이터 발견: ${existingSessions}개 세션`);
    }
  } catch (error) {
    console.error('샘플 데이터 초기화 실패:', error);
  }
}

/**
 * 개발자 도구에서 사용할 수 있는 전역 함수들
 */
if (typeof window !== 'undefined') {
  (window as any).__calligraphyDevTools = {
    generateSampleData,
    clearUserData: async (userId: string) => {
      await calligraphyDB.sessions.where('userId').equals(userId).delete();
      await calligraphyDB.attempts.where('userId').equals(userId).delete();
      console.log(`🗑️ 사용자 ${userId}의 모든 데이터를 삭제했습니다.`);
    },
    showStats: async (userId: string) => {
      const sessions = await calligraphyDB.sessions.where('userId').equals(userId).count();
      const attempts = await calligraphyDB.attempts.where('userId').equals(userId).count();
      console.log(`📊 사용자 ${userId} 통계: ${sessions}개 세션, ${attempts}개 시도`);
    }
  };
}