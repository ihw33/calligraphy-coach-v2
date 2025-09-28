/**
 * AsyncStorage를 이용한 진도 저장
 * 최근 50개 기록만 저장
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Score } from '../types/score';
import { Character } from '../types/character';

const STORAGE_KEY = 'practice_records';
const MAX_RECORDS = 50;

export interface PracticeRecord {
  id: string;
  characterId: string;
  characterUnicode: string;
  characterName: string;
  score: number;
  timestamp: Date;
}

/**
 * 연습 결과 저장
 */
export async function savePracticeRecord(
  character: Character,
  score: Score
): Promise<void> {
  try {
    const record: PracticeRecord = {
      id: `record-${Date.now()}`,
      characterId: character.id,
      characterUnicode: character.unicode,
      characterName: character.name,
      score: score.total,
      timestamp: new Date(),
    };

    // 기존 기록 불러오기
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const records: PracticeRecord[] = existingData ? JSON.parse(existingData) : [];

    // 새 기록 추가 (최신순)
    records.unshift(record);

    // 최대 50개만 유지
    const trimmedRecords = records.slice(0, MAX_RECORDS);

    // 저장
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedRecords));
  } catch (error) {
    console.error('Failed to save practice record:', error);
  }
}

/**
 * 모든 연습 기록 불러오기
 */
export async function getPracticeRecords(): Promise<PracticeRecord[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const records = JSON.parse(data);
    // Date 문자열을 Date 객체로 변환
    return records.map((record: any) => ({
      ...record,
      timestamp: new Date(record.timestamp),
    }));
  } catch (error) {
    console.error('Failed to load practice records:', error);
    return [];
  }
}

/**
 * 특정 글자의 연습 기록 불러오기
 */
export async function getCharacterRecords(
  characterId: string
): Promise<PracticeRecord[]> {
  const allRecords = await getPracticeRecords();
  return allRecords.filter(record => record.characterId === characterId);
}

/**
 * 전체 통계 계산
 */
export async function getStatistics() {
  const records = await getPracticeRecords();
  
  if (records.length === 0) {
    return {
      totalPractices: 0,
      averageScore: 0,
      bestScore: 0,
      recentScore: 0,
      mostPracticedCharacter: null,
    };
  }

  // 총 연습 횟수
  const totalPractices = records.length;

  // 평균 점수
  const averageScore = Math.round(
    records.reduce((sum, r) => sum + r.score, 0) / totalPractices
  );

  // 최고 점수
  const bestScore = Math.max(...records.map(r => r.score));

  // 최근 점수
  const recentScore = records[0]?.score || 0;

  // 가장 많이 연습한 글자
  const characterCounts = records.reduce((acc: any, record) => {
    acc[record.characterId] = (acc[record.characterId] || 0) + 1;
    return acc;
  }, {});

  const mostPracticedId = Object.keys(characterCounts).reduce((a, b) =>
    characterCounts[a] > characterCounts[b] ? a : b
  );

  const mostPracticedRecord = records.find(r => r.characterId === mostPracticedId);

  return {
    totalPractices,
    averageScore,
    bestScore,
    recentScore,
    mostPracticedCharacter: mostPracticedRecord ? {
      id: mostPracticedId,
      unicode: mostPracticedRecord.characterUnicode,
      name: mostPracticedRecord.characterName,
      count: characterCounts[mostPracticedId],
    } : null,
  };
}

/**
 * 오늘의 연습 기록
 */
export async function getTodayRecords(): Promise<PracticeRecord[]> {
  const records = await getPracticeRecords();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return records.filter(record => {
    const recordDate = new Date(record.timestamp);
    recordDate.setHours(0, 0, 0, 0);
    return recordDate.getTime() === today.getTime();
  });
}

/**
 * 모든 기록 삭제
 */
export async function clearAllRecords(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear records:', error);
  }
}

// Future: 복잡한 통계 분석, 서버 동기화, 백업/복원 기능