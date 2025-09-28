/**
 * MVP용 기본 문자 데이터
 * 하드코딩된 데이터로 빠른 개발 진행
 */

import { Character } from '../types/character';

export const characters: Character[] = [
  // 한글 자음 (14개)
  { id: 'kor-01', unicode: 'ㄱ', name: '기역', imageUrl: '/images/characters/ㄱ.png' },
  { id: 'kor-02', unicode: 'ㄴ', name: '니은', imageUrl: '/images/characters/ㄴ.png' },
  { id: 'kor-03', unicode: 'ㄷ', name: '디귿', imageUrl: '/images/characters/ㄷ.png' },
  { id: 'kor-04', unicode: 'ㄹ', name: '리을', imageUrl: '/images/characters/ㄹ.png' },
  { id: 'kor-05', unicode: 'ㅁ', name: '미음', imageUrl: '/images/characters/ㅁ.png' },
  { id: 'kor-06', unicode: 'ㅂ', name: '비읍', imageUrl: '/images/characters/ㅂ.png' },
  { id: 'kor-07', unicode: 'ㅅ', name: '시옷', imageUrl: '/images/characters/ㅅ.png' },
  { id: 'kor-08', unicode: 'ㅇ', name: '이응', imageUrl: '/images/characters/ㅇ.png' },
  { id: 'kor-09', unicode: 'ㅈ', name: '지읒', imageUrl: '/images/characters/ㅈ.png' },
  { id: 'kor-10', unicode: 'ㅊ', name: '치읓', imageUrl: '/images/characters/ㅊ.png' },
  { id: 'kor-11', unicode: 'ㅋ', name: '키읔', imageUrl: '/images/characters/ㅋ.png' },
  { id: 'kor-12', unicode: 'ㅌ', name: '티읕', imageUrl: '/images/characters/ㅌ.png' },
  { id: 'kor-13', unicode: 'ㅍ', name: '피읖', imageUrl: '/images/characters/ㅍ.png' },
  { id: 'kor-14', unicode: 'ㅎ', name: '히읗', imageUrl: '/images/characters/ㅎ.png' },
  
  // 한글 모음 (10개 기본)
  { id: 'kor-15', unicode: 'ㅏ', name: '아', imageUrl: '/images/characters/ㅏ.png' },
  { id: 'kor-16', unicode: 'ㅑ', name: '야', imageUrl: '/images/characters/ㅑ.png' },
  { id: 'kor-17', unicode: 'ㅓ', name: '어', imageUrl: '/images/characters/ㅓ.png' },
  { id: 'kor-18', unicode: 'ㅕ', name: '여', imageUrl: '/images/characters/ㅕ.png' },
  { id: 'kor-19', unicode: 'ㅗ', name: '오', imageUrl: '/images/characters/ㅗ.png' },
  { id: 'kor-20', unicode: 'ㅛ', name: '요', imageUrl: '/images/characters/ㅛ.png' },
  { id: 'kor-21', unicode: 'ㅜ', name: '우', imageUrl: '/images/characters/ㅜ.png' },
  { id: 'kor-22', unicode: 'ㅠ', name: '유', imageUrl: '/images/characters/ㅠ.png' },
  { id: 'kor-23', unicode: 'ㅡ', name: '으', imageUrl: '/images/characters/ㅡ.png' },
  { id: 'kor-24', unicode: 'ㅣ', name: '이', imageUrl: '/images/characters/ㅣ.png' },

  // 기초 한자 10개
  { id: 'char-01', unicode: '一', name: '일 (하나)', imageUrl: '/images/characters/一.png' },
  { id: 'char-02', unicode: '二', name: '이 (둘)', imageUrl: '/images/characters/二.png' },
  { id: 'char-03', unicode: '三', name: '삼 (셋)', imageUrl: '/images/characters/三.png' },
  { id: 'char-04', unicode: '大', name: '대 (크다)', imageUrl: '/images/characters/大.png' },
  { id: 'char-05', unicode: '小', name: '소 (작다)', imageUrl: '/images/characters/小.png' },
  { id: 'char-06', unicode: '人', name: '인 (사람)', imageUrl: '/images/characters/人.png' },
  { id: 'char-07', unicode: '日', name: '일 (날)', imageUrl: '/images/characters/日.png' },
  { id: 'char-08', unicode: '月', name: '월 (달)', imageUrl: '/images/characters/月.png' },
  { id: 'char-09', unicode: '水', name: '수 (물)', imageUrl: '/images/characters/水.png' },
  { id: 'char-10', unicode: '火', name: '화 (불)', imageUrl: '/images/characters/火.png' },
  
  // 중급 한자 10개
  { id: 'char-11', unicode: '山', name: '산 (산)', imageUrl: '/images/characters/山.png' },
  { id: 'char-12', unicode: '川', name: '천 (내)', imageUrl: '/images/characters/川.png' },
  { id: 'char-13', unicode: '木', name: '목 (나무)', imageUrl: '/images/characters/木.png' },
  { id: 'char-14', unicode: '土', name: '토 (흙)', imageUrl: '/images/characters/土.png' },
  { id: 'char-15', unicode: '天', name: '천 (하늘)', imageUrl: '/images/characters/天.png' },
  { id: 'char-16', unicode: '地', name: '지 (땅)', imageUrl: '/images/characters/地.png' },
  { id: 'char-17', unicode: '心', name: '심 (마음)', imageUrl: '/images/characters/心.png' },
  { id: 'char-18', unicode: '手', name: '수 (손)', imageUrl: '/images/characters/手.png' },
  { id: 'char-19', unicode: '目', name: '목 (눈)', imageUrl: '/images/characters/目.png' },
  { id: 'char-20', unicode: '口', name: '구 (입)', imageUrl: '/images/characters/口.png' },
];

// Future: 획순 데이터, 난이도, 카테고리, 상세 설명 등