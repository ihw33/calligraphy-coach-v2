/**
 * 간단한 연습 캔버스 (웹 호환)
 */

import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Character } from '../types/character';
import { WritingAttempt, Stroke, Point } from '../types/writing';

interface SimplePracticeCanvasProps {
  character: Character;
  onComplete: (attempt: WritingAttempt) => void;
}

export const SimplePracticeCanvas: React.FC<SimplePracticeCanvasProps> = ({ character, onComplete }) => {
  const [hasDrawn, setHasDrawn] = useState(false);

  const handleDraw = () => {
    setHasDrawn(true);
  };

  const handleClear = () => {
    setHasDrawn(false);
  };

  const handleComplete = () => {
    // 더미 작성 데이터 생성
    const attempt: WritingAttempt = {
      id: `attempt-${Date.now()}`,
      characterId: character.id,
      strokes: hasDrawn ? [
        {
          points: [
            { x: 100, y: 100 },
            { x: 200, y: 200 }
          ]
        }
      ] : [],
      timestamp: new Date()
    };
    
    onComplete(attempt);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* 글자 정보 */}
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ fontSize: 48, fontWeight: 'bold' }}>{character.unicode}</Text>
        <Text style={{ fontSize: 18, color: '#666' }}>{character.name}</Text>
      </View>

      {/* 간단한 캔버스 영역 */}
      <View style={{ 
        flex: 1, 
        backgroundColor: '#f9f9f9', 
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 300,
        borderWidth: 2,
        borderColor: '#ddd',
        borderStyle: 'dashed'
      }}>
        {hasDrawn ? (
          <Text style={{ fontSize: 24, color: '#4ecdc4' }}>✓ 그리기 완료!</Text>
        ) : (
          <TouchableOpacity 
            style={{ 
              padding: 20,
              backgroundColor: '#4ecdc4',
              borderRadius: 8
            }}
            onPress={handleDraw}
          >
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
              그리기 시뮬레이션
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 버튼들 */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
        <TouchableOpacity
          testID="clear-button"
          style={{
            backgroundColor: '#ff6b6b',
            padding: 12,
            borderRadius: 8,
            flex: 1,
            marginRight: 8,
            alignItems: 'center'
          }}
          onPress={handleClear}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>지우기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="complete-button"
          style={{
            backgroundColor: hasDrawn ? '#4ecdc4' : '#ccc',
            padding: 12,
            borderRadius: 8,
            flex: 1,
            marginLeft: 8,
            alignItems: 'center'
          }}
          onPress={handleComplete}
          disabled={!hasDrawn}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};