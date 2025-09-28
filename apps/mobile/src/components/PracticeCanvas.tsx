/**
 * PracticeCanvas 컴포넌트
 * 붓글씨 연습을 위한 캔버스 컴포넌트
 */

import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
// import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { Character } from '../types/character';
import { WritingAttempt, Stroke, Point } from '../types/writing';

interface PracticeCanvasProps {
  character: Character;
  onComplete: (attempt: WritingAttempt) => void;
}

export const PracticeCanvas: React.FC<PracticeCanvasProps> = ({ character, onComplete }) => {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const currentStroke = useRef<Point[]>([]);

  const getEventPosition = (event: any) => {
    if (Platform.OS === 'web') {
      return { x: event.clientX, y: event.clientY };
    } else {
      const touch = event.nativeEvent.touches?.[0] || event.nativeEvent;
      return { x: touch.x, y: touch.y };
    }
  };

  const handleTouchStart = (event: any) => {
    const { x, y } = getEventPosition(event);
    currentStroke.current = [{ x, y }];
    setCurrentPath(`M${x},${y}`);
  };

  const handleTouchMove = (event: any) => {
    if (currentStroke.current.length === 0) return;
    
    const { x, y } = getEventPosition(event);
    currentStroke.current.push({ x, y });
    
    let pathString = `M${currentStroke.current[0].x},${currentStroke.current[0].y}`;
    for (let i = 1; i < currentStroke.current.length; i++) {
      pathString += `L${currentStroke.current[i].x},${currentStroke.current[i].y}`;
    }
    setCurrentPath(pathString);
  };

  const handleTouchEnd = () => {
    if (currentStroke.current.length > 0) {
      const newStroke: Stroke = {
        points: [...currentStroke.current]
      };
      
      setStrokes(prev => [...prev, newStroke]);
      currentStroke.current = [];
      setCurrentPath('');
    }
  };

  const handleClear = () => {
    setStrokes([]);
    setCurrentPath('');
    currentStroke.current = [];
  };

  const handleComplete = () => {
    const attempt: WritingAttempt = {
      id: `attempt-${Date.now()}`,
      characterId: character.id,
      strokes: strokes,
      timestamp: new Date()
    };
    
    onComplete(attempt);
  };

  const hasStrokes = strokes.length > 0 || currentPath !== '';

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* 글자 정보 */}
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold' }}>{character.unicode}</Text>
        <Text style={{ fontSize: 16, color: '#666' }}>{character.name}</Text>
      </View>

      {/* 캔버스 */}
      <View style={{ flex: 1, backgroundColor: '#f9f9f9', borderRadius: 8 }}>
        <View
          testID="practice-canvas"
          style={{ flex: 1, width: '100%', height: 400 }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          // 웹에서 마우스 이벤트도 지원
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
        >
          <svg width="100%" height="100%" style={{ border: '1px solid #ddd' }}>
            {/* 완성된 획들 */}
            {strokes.map((stroke, index) => {
              if (stroke.points.length === 0) return null;
              let pathString = `M${stroke.points[0].x},${stroke.points[0].y}`;
              for (let i = 1; i < stroke.points.length; i++) {
                pathString += `L${stroke.points[i].x},${stroke.points[i].y}`;
              }
              return (
                <path
                  key={index}
                  d={pathString}
                  stroke="black"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              );
            })}
            
            {/* 현재 그리고 있는 획 */}
            {currentPath && (
              <path
                d={currentPath}
                stroke="black"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            )}
          </svg>
        </View>
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
            backgroundColor: hasStrokes ? '#4ecdc4' : '#ccc',
            padding: 12,
            borderRadius: 8,
            flex: 1,
            marginLeft: 8,
            alignItems: 'center'
          }}
          onPress={handleComplete}
          disabled={!hasStrokes}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};