import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ResultScreenV2 } from '../ResultScreenV2';

// Mock useLocation hook
const mockLocationState = {
  character: '宇',
  courseId: 'hwang92-sebeop', 
  fontStyle: '해서체',
  aiEvaluation: {
    scores: {
      항목1: { name: '형태', score: 30 },
      항목2: { name: '비례', score: 22 },
      항목3: { name: '굵기', score: 15 },
      항목4: { name: '획순', score: 8 }
    },
    hwang92Score: 18,
    strengths: [
      '덮개구조가 잘 표현되었습니다',
      '하부 보호가 안정적입니다'
    ],
    improvements: [
      '상하 비례를 1:3으로 조정해보세요',
      '천복자 특징을 더 명확하게 표현해보세요'
    ],
    총평: '황자원 92법의 기본 원리를 잘 이해하고 있습니다.'
  }
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    state: mockLocationState
  })
}));

describe('ResultScreenV2', () => {
  it('평가 점수가 0이 아닌 실제 값으로 표시되어야 함', () => {
    render(
      <BrowserRouter>
        <ResultScreenV2 />
      </BrowserRouter>
    );

    // 기본서예평가 섹션 확인
    expect(screen.getByText('기본서예평가')).toBeInTheDocument();
    
    // 점수가 0이 아닌지 확인
    // 형태 점수 30점
    expect(screen.queryByText('30/40점')).toBeInTheDocument();
    
    // 비례 점수 22점
    expect(screen.queryByText('22/30점')).toBeInTheDocument();
    
    // 굵기 점수 15점  
    expect(screen.queryByText('15/20점')).toBeInTheDocument();
    
    // 획순 점수 8점
    expect(screen.queryByText('8/10점')).toBeInTheDocument();
  });

  it('황자원 92법 평가가 표시되어야 함', () => {
    render(
      <BrowserRouter>
        <ResultScreenV2 />
      </BrowserRouter>
    );

    // 황자원 92법 섹션 확인
    expect(screen.getByText('황자원 92법')).toBeInTheDocument();
    
    // 황자원 평가 점수 확인 (18/30점)
    expect(screen.queryByText('18/30')).toBeInTheDocument();
    
    // 개별 항목 확인
    expect(screen.getByText('덮개구조')).toBeInTheDocument();
    expect(screen.getByText('보호관계')).toBeInTheDocument();
    expect(screen.getByText('공간비례')).toBeInTheDocument();
    expect(screen.getByText('결구완성도')).toBeInTheDocument();
  });

  it('피드백이 표시되어야 함', () => {
    render(
      <BrowserRouter>
        <ResultScreenV2 />
      </BrowserRouter>
    );

    // 피드백 섹션 확인
    expect(screen.getByText('피드백 및 조언')).toBeInTheDocument();
    
    // 강점 탭 클릭 후 내용 확인
    const strengthsTab = screen.getByRole('tab', { name: /강점/i });
    strengthsTab.click();
    expect(screen.getByText('덮개구조가 잘 표현되었습니다')).toBeInTheDocument();
    
    // 개선점 탭 클릭 후 내용 확인
    const improvementsTab = screen.getByRole('tab', { name: /개선점/i });
    improvementsTab.click();
    expect(screen.getByText('상하 비례를 1:3으로 조정해보세요')).toBeInTheDocument();
  });

  it('전체 점수와 등급이 올바르게 계산되어야 함', () => {
    render(
      <BrowserRouter>
        <ResultScreenV2 />
      </BrowserRouter>
    );

    // 총점: 75(기본) + 18(황자원) = 93점
    expect(screen.getByText(/93\/100/)).toBeInTheDocument();
    
    // A등급 (85점 이상)
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('우수')).toBeInTheDocument();
  });
});