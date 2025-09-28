/**
 * CharacterSelector 컴포넌트 테스트
 * RED 단계 - 구현 전 테스트 작성
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { CharacterSelector } from '../CharacterSelector';
import { characters } from '../../data/characters';

describe('CharacterSelector', () => {
  it('글자 목록을 렌더링한다', () => {
    render(<CharacterSelector onSelect={() => {}} />);
    
    // 한글 자음 확인
    expect(screen.getByText('ㄱ')).toBeTruthy();
    expect(screen.getByText('ㄴ')).toBeTruthy();
    
    // 한글 모음 확인
    expect(screen.getByText('ㅏ')).toBeTruthy();
    expect(screen.getByText('ㅣ')).toBeTruthy();
    
    // 한자 확인
    expect(screen.getByText('一')).toBeTruthy();
    expect(screen.getByText('人')).toBeTruthy();
  });

  it('글자 선택 시 onSelect 콜백을 호출한다', () => {
    const mockOnSelect = jest.fn();
    render(<CharacterSelector onSelect={mockOnSelect} />);
    
    // 첫 번째 글자 선택
    const firstCharacter = screen.getByText('ㄱ');
    fireEvent.press(firstCharacter);
    
    expect(mockOnSelect).toHaveBeenCalledWith(characters[0]);
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it('각 글자에 이름이 표시된다', () => {
    render(<CharacterSelector onSelect={() => {}} />);
    
    // 한글 자음 이름 확인
    expect(screen.getByText('기역')).toBeTruthy();
    expect(screen.getByText('니은')).toBeTruthy();
    
    // 한자 이름 확인
    expect(screen.getByText('일 (하나)')).toBeTruthy();
    expect(screen.getByText('인 (사람)')).toBeTruthy();
  });

  it('스크롤이 가능하다', () => {
    const { getByTestId } = render(<CharacterSelector onSelect={() => {}} />);
    
    const scrollView = getByTestId('character-list');
    expect(scrollView.props.scrollEnabled).toBe(true);
  });
});

// Future: 검색 기능, 필터링, 카테고리별 분류 테스트