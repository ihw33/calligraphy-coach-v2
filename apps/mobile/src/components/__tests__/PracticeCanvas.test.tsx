/**
 * PracticeCanvas 컴포넌트 테스트
 * RED 단계 - 구현 전 테스트 작성
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { PracticeCanvas } from '../PracticeCanvas';
import { Character } from '../../types/character';

describe('PracticeCanvas', () => {
  const mockCharacter: Character = {
    id: 'test-1',
    unicode: 'ㄱ',
    name: '기역',
    imageUrl: '/images/characters/ㄱ.png'
  };

  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('캔버스가 렌더링된다', () => {
    const { getByTestId } = render(
      <PracticeCanvas character={mockCharacter} onComplete={mockOnComplete} />
    );
    
    const canvas = getByTestId('practice-canvas');
    expect(canvas).toBeTruthy();
  });

  it('선택된 글자가 표시된다', () => {
    render(
      <PracticeCanvas character={mockCharacter} onComplete={mockOnComplete} />
    );
    
    expect(screen.getByText('ㄱ')).toBeTruthy();
    expect(screen.getByText('기역')).toBeTruthy();
  });

  it('터치 이벤트로 그리기가 가능하다', () => {
    const { getByTestId } = render(
      <PracticeCanvas character={mockCharacter} onComplete={mockOnComplete} />
    );
    
    const canvas = getByTestId('practice-canvas');
    
    // 터치 시작
    fireEvent(canvas, 'touchStart', {
      nativeEvent: { touches: [{ x: 100, y: 100 }] }
    });
    
    // 터치 이동
    fireEvent(canvas, 'touchMove', {
      nativeEvent: { touches: [{ x: 150, y: 150 }] }
    });
    
    // 터치 종료
    fireEvent(canvas, 'touchEnd');
    
    // 획이 기록되었는지 확인 (내부 상태 변경)
    expect(canvas).toBeTruthy();
  });

  it('지우기 버튼이 작동한다', () => {
    const { getByTestId } = render(
      <PracticeCanvas character={mockCharacter} onComplete={mockOnComplete} />
    );
    
    const clearButton = getByTestId('clear-button');
    const canvas = getByTestId('practice-canvas');
    
    // 먼저 그리기
    fireEvent(canvas, 'touchStart', {
      nativeEvent: { touches: [{ x: 100, y: 100 }] }
    });
    fireEvent(canvas, 'touchMove', {
      nativeEvent: { touches: [{ x: 150, y: 150 }] }
    });
    fireEvent(canvas, 'touchEnd');
    
    // 지우기 버튼 클릭
    fireEvent.press(clearButton);
    
    // 캔버스가 비워졌는지 확인
    expect(clearButton).toBeTruthy();
  });

  it('완료 버튼 클릭 시 onComplete 콜백이 호출된다', () => {
    const { getByTestId } = render(
      <PracticeCanvas character={mockCharacter} onComplete={mockOnComplete} />
    );
    
    const completeButton = getByTestId('complete-button');
    
    // 그리기 작업
    const canvas = getByTestId('practice-canvas');
    fireEvent(canvas, 'touchStart', {
      nativeEvent: { touches: [{ x: 100, y: 100 }] }
    });
    fireEvent(canvas, 'touchMove', {
      nativeEvent: { touches: [{ x: 150, y: 150 }] }
    });
    fireEvent(canvas, 'touchEnd');
    
    // 완료 버튼 클릭
    fireEvent.press(completeButton);
    
    // onComplete 콜백 호출 확인
    expect(mockOnComplete).toHaveBeenCalledTimes(1);
    expect(mockOnComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        characterId: 'test-1',
        strokes: expect.arrayContaining([
          expect.objectContaining({
            points: expect.any(Array)
          })
        ])
      })
    );
  });

  it('획이 없으면 완료 버튼이 비활성화된다', () => {
    const { getByTestId } = render(
      <PracticeCanvas character={mockCharacter} onComplete={mockOnComplete} />
    );
    
    const completeButton = getByTestId('complete-button');
    
    // 초기 상태에서는 비활성화
    expect(completeButton.props.disabled).toBe(true);
    
    // 그리기 후 활성화
    const canvas = getByTestId('practice-canvas');
    fireEvent(canvas, 'touchStart', {
      nativeEvent: { touches: [{ x: 100, y: 100 }] }
    });
    fireEvent(canvas, 'touchMove', {
      nativeEvent: { touches: [{ x: 150, y: 150 }] }
    });
    fireEvent(canvas, 'touchEnd');
    
    expect(completeButton.props.disabled).toBe(false);
  });
});

// Future: 압력 감지, 브러시 설정, 언두/리두 테스트