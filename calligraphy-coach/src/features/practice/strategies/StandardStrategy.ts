import type { 
  EvaluationStrategy, 
  EvaluationCriterion, 
  ChecklistItem, 
  DetailedScores, 
  UIConfig 
} from './types';

/**
 * 표준 평가 전략 (기본값)
 */
export class StandardStrategy implements EvaluationStrategy {
  id = 'standard';
  name = '표준 평가';
  evaluationType: 'standard' = 'standard';
  
  getCriteria(): EvaluationCriterion[] {
    return [
      { 
        id: '정확한인식', 
        label: '정확한 인식', 
        description: '글자가 정확하게 인식되는지',
        weight: 40,
        category: '형태'
      },
      { 
        id: '중심위치', 
        label: '중심 위치', 
        description: '글자가 격자 중앙에 위치하는지',
        weight: 30,
        category: '비례'
      },
      { 
        id: '일정굵기', 
        label: '일정한 굵기', 
        description: '획의 굵기가 일정하게 유지되는지',
        weight: 20,
        category: '굵기'
      },
      { 
        id: '정확한획순', 
        label: '정확한 획순', 
        description: '올바른 획순으로 작성되었는지',
        weight: 10,
        category: '획순'
      }
    ];
  }
  
  generateChecklist(evaluation: any, scores: DetailedScores): ChecklistItem[] {
    const checklist = evaluation?.checklist || {};
    
    return [
      {
        id: '정확한인식',
        label: '정확한 글자 인식',
        description: '목표 글자와 일치하는지',
        checked: checklist?.형태?.정확한인식 || false,
        score: checklist?.형태?.정확한인식 ? scores.형태 : 0,
        maxScore: 40
      },
      {
        id: '기본구조',
        label: '기본 형태 구조',
        description: '글자의 기본 구조가 올바른지',
        checked: (scores.형태 >= 20),
        score: Math.min(scores.형태, 20),
        maxScore: 20
      },
      {
        id: '중심위치',
        label: '격자 중심 위치',
        description: '글자가 중앙에 위치하는지',
        checked: checklist?.비례?.중심위치 || (scores.비례 >= 15),
        score: Math.min(scores.비례, 15),
        maxScore: 15
      },
      {
        id: '적절한크기',
        label: '적절한 크기',
        description: '글자 크기가 적절한지',
        checked: checklist?.비례?.적절한크기 || (scores.비례 >= 15),
        score: Math.min(scores.비례, 15),
        maxScore: 15
      },
      {
        id: '일정한굵기',
        label: '일정한 굵기 유지',
        description: '획의 굵기가 일정한지',
        checked: checklist?.굵기?.일정유지 || (scores.굵기 >= 10),
        score: Math.min(scores.굵기, 10),
        maxScore: 10
      }
    ];
  }
  
  mapScores(aiScores: any): DetailedScores {
    const scores = aiScores?.scores || aiScores;
    
    return {
      형태: scores?.항목1?.score || scores?.형태 || 0,
      비례: scores?.항목2?.score || scores?.비례 || 0,
      굵기: scores?.항목3?.score || scores?.굵기 || 0,
      획순: scores?.항목4?.score || scores?.획순 || 0,
      총점: (scores?.항목1?.score || 0) + 
            (scores?.항목2?.score || 0) + 
            (scores?.항목3?.score || 0) + 
            (scores?.항목4?.score || 0)
    };
  }
  
  getUIConfig(): UIConfig {
    return {
      theme: 'blue',
      icon: '평',
      title: '표준 평가',
      description: '기본 서예 평가 기준',
      accentColor: 'blue-500',
      bgGradient: 'from-blue-50 to-blue-100'
    };
  }
  
  generatePrompt(targetChar: string): string {
    return `
목표 글자: ${targetChar}

다음 기준으로 평가하세요:
1. 형태 (40점): 글자의 정확성과 인식 가능성
2. 비례 (30점): 위치와 크기의 적절성
3. 굵기 (20점): 획의 일정성과 압력
4. 획순 (10점): 올바른 획순 준수

평가 결과를 JSON 형식으로 응답하세요.`;
  }
}