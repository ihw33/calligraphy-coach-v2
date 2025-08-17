import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Input } from '../Input';

describe('Input 컴포넌트', () => {
  it('기본 입력 필드가 올바르게 렌더링된다', () => {
    render(<Input placeholder="테스트 입력" />);
    
    expect(screen.getByPlaceholderText('테스트 입력')).toBeTruthy();
  });

  it('라벨이 올바르게 표시된다', () => {
    render(<Input label="이름" placeholder="이름을 입력하세요" />);
    
    expect(screen.getByText('이름')).toBeTruthy();
  });

  it('필수 입력 표시가 올바르게 작동한다', () => {
    render(<Input label="이메일" required />);
    
    expect(screen.getByText('이메일')).toBeTruthy();
    expect(screen.getByText('*')).toBeTruthy();
  });

  it('에러 메시지가 올바르게 표시된다', () => {
    render(<Input label="비밀번호" error="비밀번호가 너무 짧습니다" />);
    
    expect(screen.getByText('비밀번호가 너무 짧습니다')).toBeTruthy();
  });

  it('힌트 텍스트가 올바르게 표시된다', () => {
    render(<Input label="전화번호" hint="010-1234-5678 형식으로 입력하세요" />);
    
    expect(screen.getByText('010-1234-5678 형식으로 입력하세요')).toBeTruthy();
  });

  it('텍스트 입력이 정상적으로 작동한다', () => {
    const onChangeTextMock = jest.fn();
    render(<Input placeholder="입력 테스트" onChangeText={onChangeTextMock} />);
    
    const input = screen.getByPlaceholderText('입력 테스트');
    fireEvent.changeText(input, '테스트 텍스트');
    
    expect(onChangeTextMock).toHaveBeenCalledWith('테스트 텍스트');
  });

  it('포커스 상태가 올바르게 작동한다', () => {
    const onFocusMock = jest.fn();
    const onBlurMock = jest.fn();
    
    render(
      <Input 
        placeholder="포커스 테스트" 
        onFocus={onFocusMock}
        onBlur={onBlurMock}
      />
    );
    
    const input = screen.getByPlaceholderText('포커스 테스트');
    
    fireEvent(input, 'focus');
    expect(onFocusMock).toHaveBeenCalled();
    
    fireEvent(input, 'blur');
    expect(onBlurMock).toHaveBeenCalled();
  });

  it('비활성화 상태에서는 입력이 되지 않는다', () => {
    render(<Input placeholder="비활성화 입력" disabled />);
    
    const input = screen.getByPlaceholderText('비활성화 입력');
    expect(input.props.editable).toBe(false);
  });
});
