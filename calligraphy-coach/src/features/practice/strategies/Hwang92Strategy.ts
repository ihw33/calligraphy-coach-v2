import type { 
  EvaluationStrategy, 
  EvaluationCriterion, 
  ChecklistItem, 
  DetailedScores, 
  UIConfig 
} from './types';

/**
 * 황자원 92법 평가 전략
 */
export class Hwang92Strategy implements EvaluationStrategy {
  id: string;
  name: string;
  evaluationType: 'hwang92' = 'hwang92';
  
  constructor(private subType: '천복자' | '지재자' | '좌포자' | '우포자', private lessonId: string) {
    this.id = `hwang92-${lessonId}`;
    this.name = `황자원 92법 - ${subType}`;
  }
  
  getCriteria(): EvaluationCriterion[] {
    const criteriaMap = {
      '천복자': [
        { 
          id: '덮개충분', 
          label: '덮개구조', 
          description: '갓머리가 충분히 넓어 아래를 완전히 덮는지',
          weight: 40,
          category: '형태' as const
        },
        { 
          id: '내부안전', 
          label: '보호관계', 
          description: '하부 요소가 갓머리 안에 안전하게 위치하는지',
          weight: 30,
          category: '비례' as const
        },
        { 
          id: '비례적절', 
          label: '공간비례', 
          description: '상하 구조의 비례가 1:3으로 적절한지',
          weight: 20,
          category: '굵기' as const
        },
        { 
          id: '안정감표현', 
          label: '결구완성도', 
          description: '천복자 특징이 명확하게 표현되는지',
          weight: 10,
          category: '획순' as const
        }
      ],
      '지재자': [
        { 
          id: '하부안정', 
          label: '받침구조', 
          description: '하단 받침이 충분히 넓고 안정적인지',
          weight: 40,
          category: '형태' as const
        },
        { 
          id: '중심일치', 
          label: '중심균형', 
          description: '상부와 하부의 중심이 일치하는지',
          weight: 30,
          category: '비례' as const
        },
        { 
          id: '지지안정', 
          label: '지지관계', 
          description: '상부 요소들이 안정적으로 받쳐지는지',
          weight: 20,
          category: '굵기' as const
        },
        { 
          id: '균형유지', 
          label: '전체균형', 
          description: '전체적인 안정감이 느껴지는지',
          weight: 10,
          category: '획순' as const
        }
      ],
      '좌포자': [
        { 
          id: '좌측낮음', 
          label: '좌측위치', 
          description: '왼쪽 요소가 낮은 위치에 있는지',
          weight: 40,
          category: '형태' as const
        },
        { 
          id: '우측높음', 
          label: '우측위치', 
          description: '오른쪽 요소가 상대적으로 높은지',
          weight: 30,
          category: '비례' as const
        },
        { 
          id: '높이차적절', 
          label: '높이비례', 
          description: '좌우 높이차가 적절한지',
          weight: 20,
          category: '굵기' as const
        },
        { 
          id: '시각균형', 
          label: '시각균형', 
          description: '시각적 균형이 유지되는지',
          weight: 10,
          category: '획순' as const
        }
      ],
      '우포자': [
        { 
          id: '우측낮음', 
          label: '우측위치', 
          description: '오른쪽 요소가 낮은 위치에 있는지',
          weight: 40,
          category: '형태' as const
        },
        { 
          id: '좌측높음', 
          label: '좌측위치', 
          description: '왼쪽 요소가 상대적으로 높은지',
          weight: 30,
          category: '비례' as const
        },
        { 
          id: '높이차자연', 
          label: '높이조화', 
          description: '좌우 높이차가 자연스러운지',
          weight: 20,
          category: '굵기' as const
        },
        { 
          id: '안정감유지', 
          label: '전체안정', 
          description: '전체 글자의 안정감이 유지되는지',
          weight: 10,
          category: '획순' as const
        }
      ]
    };
    
    return criteriaMap[this.subType] || criteriaMap['천복자'];
  }
  
  generateChecklist(evaluation: any, scores: DetailedScores): ChecklistItem[] {
    const criteria = this.getCriteria();
    const checklist = evaluation?.checklist || {};
    
    return criteria.map(criterion => {
      // 황자원 92법은 체크리스트 기반이므로, 체크 여부에 따라 점수 부여
      const isChecked = checklist[criterion.id] === true;
      
      // 체크되었으면 해당 항목의 전체 점수를 부여
      const itemScore = isChecked ? criterion.weight : 0;
      
      return {
        id: criterion.id,
        label: criterion.label,
        description: criterion.description,
        checked: isChecked,
        score: itemScore,
        maxScore: criterion.weight
      };
    });
  }
  
  mapScores(aiScores: any): DetailedScores {
    // AI 평가 점수를 표준 형식으로 매핑
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
      theme: 'purple',
      icon: '황',
      title: `황자원 92법 - ${this.subType}`,
      description: this.getSubTypeDescription(),
      accentColor: 'purple-500',
      bgGradient: 'from-purple-50 to-purple-100'
    };
  }
  
  private getSubTypeDescription(): string {
    const descriptions = {
      '천복자': '상단 요소가 하단을 덮는 구조',
      '지재자': '하단 요소가 상단을 받치는 구조',
      '좌포자': '왼쪽이 낮고 오른쪽이 높은 구조',
      '우포자': '오른쪽이 낮고 왼쪽이 높은 구조'
    };
    return descriptions[this.subType];
  }
  
  generatePrompt(targetChar: string): string {
    const criteria = this.getCriteria();
    const points = criteria.map(c => `- ${c.description}`).join('\n');
    
    return `
황자원 92법 ${this.subType} 구조 평가 기준:
${points}

목표 글자: ${targetChar}

위 기준에 따라 평가하고 다음 형식으로 응답하세요:
{
  "checklist": {
    "${criteria[0].id}": true/false,
    "${criteria[1].id}": true/false,
    "${criteria[2].id}": true/false,
    "${criteria[3].id}": true/false
  },
  "analysis": "${this.subType} 관점에서의 분석 (1-2문장)",
  "improvements": ["구체적 개선점 1", "구체적 개선점 2"]
}`;
  }
}