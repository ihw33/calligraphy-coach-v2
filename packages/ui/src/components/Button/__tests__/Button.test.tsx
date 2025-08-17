import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button 컴포넌트', () => {
  it('기본 버튼이 올바르게 렌더링된다', () => {
    render(<Button title="테스트 버튼" />);
    
    expect(screen.getByText('테스트 버튼')).toBeTruthy();
  });

  it('클릭 이벤트가 정상적으로 작동한다', () => {
    const onPressMock = jest.fn();
    render(<Button title="클릭 버튼" onPress={onPressMock} />);
    
    fireEvent.press(screen.getByText('클릭 버튼'));
    
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('비활성화 상태에서는 클릭되지 않는다', () => {
    const onPressMock = jest.fn();
    render(<Button title="비활성 버튼" onPress={onPressMock} disabled />);
    
    fireEvent.press(screen.getByText('비활성 버튼'));
    
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('로딩 상태에서는 ActivityIndicator가 표시된다', () => {
    render(<Button title="로딩 버튼" loading />);
    
    // ActivityIndicator가 모킹되어 있으므로 텍스트가 없어야 함
    expect(screen.queryByText('로딩 버튼')).toBeNull();
  });

  it('다양한 변형이 올바르게 적용된다', () => {
    const { rerender } = render(<Button title="Primary" variant="primary" />);
    expect(screen.getByText('Primary')).toBeTruthy();

    rerender(<Button title="Secondary" variant="secondary" />);
    expect(screen.getByText('Secondary')).toBeTruthy();

    rerender(<Button title="Outline" variant="outline" />);
    expect(screen.getByText('Outline')).toBeTruthy();

    rerender(<Button title="Text" variant="text" />);
    expect(screen.getByText('Text')).toBeTruthy();
  });

  it('다양한 크기가 올바르게 적용된다', () => {
    const { rerender } = render(<Button title="Small" size="small" />);
    expect(screen.getByText('Small')).toBeTruthy();

    rerender(<Button title="Medium" size="medium" />);
    expect(screen.getByText('Medium')).toBeTruthy();

    rerender(<Button title="Large" size="large" />);
    expect(screen.getByText('Large')).toBeTruthy();
  });
});
