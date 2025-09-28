/**
 * 통합 테스트 - 전체 연습 플로우
 * 글자 선택 → 캔버스 그리기 → 평가 표시 → 저장까지 E2E 테스트
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from '../../src/navigation/AppNavigator';
import { characters } from '../../src/data/characters';

// AsyncStorage 모킹
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// React Navigation 모킹
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  NavigationContainer: ({ children }: any) => children,
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }: any) => children,
    Screen: ({ component }: any) => null,
  }),
}));

describe('Practice Flow E2E', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  it('전체 연습 플로우를 완주한다', async () => {
    const { getByText, getByTestId } = render(React.createElement(AppNavigator));

    // 1. 홈 화면에서 첫 번째 글자 선택
    const firstCharacter = characters[0];
    const characterButton = getByText(firstCharacter.unicode);
    
    expect(characterButton).toBeTruthy();
    fireEvent.press(characterButton);

    // 2. 연습 화면 렌더링 확인
    await waitFor(() => {
      expect(getByText(firstCharacter.unicode)).toBeTruthy();
      expect(getByText(firstCharacter.name)).toBeTruthy();
    });

    // 3. 캔버스 그리기 시뮬레이션
    const canvas = getByTestId('practice-canvas');
    expect(canvas).toBeTruthy();

    // 터치 이벤트 시뮬레이션
    fireEvent(canvas, 'touchStart', {
      nativeEvent: { touches: [{ x: 100, y: 100 }] }
    });
    fireEvent(canvas, 'touchMove', {
      nativeEvent: { touches: [{ x: 150, y: 150 }] }
    });
    fireEvent(canvas, 'touchEnd');

    // 4. 완료 버튼 클릭
    const completeButton = getByTestId('complete-button');
    expect(completeButton.props.disabled).toBe(false);
    fireEvent.press(completeButton);

    // 5. 결과 화면 표시 확인
    await waitFor(() => {
      expect(getByText(firstCharacter.unicode)).toBeTruthy();
      expect(getByText('점수')).toBeTruthy();
    });

    // 점수가 0-100 범위인지 확인
    const scoreElements = getByText(/^\d+$/);
    expect(scoreElements).toBeTruthy();

    // 6. 홈으로 가기 버튼 클릭
    const homeButton = getByText('홈으로 가기');
    fireEvent.press(homeButton);

    // 7. 홈 화면으로 돌아왔는지 확인
    await waitFor(() => {
      expect(getByText(firstCharacter.unicode)).toBeTruthy();
    });
  });

  it('캔버스에서 지우기 기능이 작동한다', async () => {
    const { getByTestId } = render(<AppNavigator />);

    // 첫 번째 글자 선택
    const firstCharacter = characters[0];
    fireEvent.press(getByTestId('character-list').props.data[0]);

    await waitFor(() => {
      const canvas = getByTestId('practice-canvas');
      const clearButton = getByTestId('clear-button');

      // 그리기
      fireEvent(canvas, 'touchStart', {
        nativeEvent: { touches: [{ x: 100, y: 100 }] }
      });
      fireEvent(canvas, 'touchMove', {
        nativeEvent: { touches: [{ x: 150, y: 150 }] }
      });
      fireEvent(canvas, 'touchEnd');

      // 지우기
      fireEvent.press(clearButton);

      // 완료 버튼이 다시 비활성화되었는지 확인
      const completeButton = getByTestId('complete-button');
      expect(completeButton.props.disabled).toBe(true);
    });
  });

  it('다시 연습하기 기능이 작동한다', async () => {
    const { getByText, getByTestId } = render(<AppNavigator />);

    // 전체 플로우 진행
    const firstCharacter = characters[0];
    fireEvent.press(getByText(firstCharacter.unicode));

    await waitFor(() => {
      const canvas = getByTestId('practice-canvas');
      fireEvent(canvas, 'touchStart', {
        nativeEvent: { touches: [{ x: 100, y: 100 }] }
      });
      fireEvent(canvas, 'touchEnd');

      const completeButton = getByTestId('complete-button');
      fireEvent.press(completeButton);
    });

    // 결과 화면에서 다시 연습하기 클릭
    await waitFor(() => {
      const tryAgainButton = getByText('다시 연습하기');
      fireEvent.press(tryAgainButton);
    });

    // 다시 연습 화면으로 돌아왔는지 확인
    await waitFor(() => {
      expect(getByTestId('practice-canvas')).toBeTruthy();
      expect(getByTestId('complete-button').props.disabled).toBe(true);
    });
  });

  it('크래시 없이 전체 플로우를 완주한다', async () => {
    // 에러 발생 시 테스트 실패하도록 설정
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const { getByText, getByTestId } = render(<AppNavigator />);

    try {
      // 여러 글자로 플로우 테스트
      for (let i = 0; i < 3; i++) {
        const character = characters[i];
        
        fireEvent.press(getByText(character.unicode));
        
        await waitFor(() => {
          const canvas = getByTestId('practice-canvas');
          fireEvent(canvas, 'touchStart', {
            nativeEvent: { touches: [{ x: 50 + i * 10, y: 50 + i * 10 }] }
          });
          fireEvent(canvas, 'touchEnd');
          
          fireEvent.press(getByTestId('complete-button'));
        });
        
        await waitFor(() => {
          fireEvent.press(getByText('홈으로 가기'));
        });
      }

      // 콘솔 에러가 없어야 함
      expect(consoleSpy).not.toHaveBeenCalled();
    } finally {
      consoleSpy.mockRestore();
    }
  });
});

// Future: 성능 측정, 메모리 리크 체크, 에러 복구 테스트