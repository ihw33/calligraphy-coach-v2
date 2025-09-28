/**
 * 서체별 평가 기준 설정
 * 확장 가능한 구조로 새로운 서체 추가 시 이 파일만 수정
 */

export interface FontEvaluationCriteria {
  fontStyle: string;
  levels: {
    level1: BaseEvaluationCriteria;
    level2?: FontSpecificCriteria;
    level3?: AdvancedTechniqueCriteria;
  };
  scoringWeights: {
    level1Weight: number;
    level2Weight?: number;
    level3Weight?: number;
  };
}

interface BaseEvaluationCriteria {
  name: string;
  criteria: {
    [key: string]: {
      maxScore: number;
      description: string;
      evaluationPoints: string[];
    };
  };
}

interface FontSpecificCriteria {
  name: string;
  criteria: {
    [key: string]: {
      maxScore: number;
      description: string;
      evaluationPoints: string[];
    };
  };
}

interface AdvancedTechniqueCriteria {
  name: string;
  subTypes?: {
    [key: string]: {
      criteria: {
        [key: string]: {
          maxScore: number;
          description: string;
        };
      };
    };
  };
}

// ===================================
// 서체별 평가 기준 정의
// ===================================

export const FONT_EVALUATION_CONFIGS: Record<string, FontEvaluationCriteria> = {
  // 해서체 (정자체)
  '해서체': {
    fontStyle: '해서체',
    levels: {
      level1: {
        name: '기본서예평가',
        criteria: {
          '형태': {
            maxScore: 40,
            description: '글자의 기본 형태와 구조',
            evaluationPoints: [
              '획의 시작과 끝 처리',
              '전체적인 글자 형태',
              '각 획의 정확성'
            ]
          },
          '비례': {
            maxScore: 30,
            description: '글자의 균형과 비례',
            evaluationPoints: [
              '상하좌우 균형',
              '획 간 간격',
              '전체 비례감'
            ]
          },
          '굵기': {
            maxScore: 20,
            description: '붓의 압력과 굵기 변화',
            evaluationPoints: [
              '압력의 일정성',
              '굵기 변화의 자연스러움',
              '먹의 농담'
            ]
          },
          '획순': {
            maxScore: 10,
            description: '올바른 획순',
            evaluationPoints: [
              '표준 획순 준수',
              '획의 연결성'
            ]
          }
        }
      },
      level2: {
        name: '해서체특화평가',
        criteria: {
          '정자구조': {
            maxScore: 10,
            description: '해서체 특유의 정자 구조',
            evaluationPoints: [
              '네모꼴 구조 유지',
              '획의 직선성'
            ]
          },
          '운필법': {
            maxScore: 10,
            description: '해서체 운필 기법',
            evaluationPoints: [
              '기필의 명확성',
              '수필의 정리'
            ]
          },
          '장법': {
            maxScore: 10,
            description: '글자 배치와 공간',
            evaluationPoints: [
              '중심축 유지',
              '여백의 균형'
            ]
          }
        }
      },
      level3: {
        name: '황자원92법',
        subTypes: {
          '천복자': {
            criteria: {
              '덮개구조': {
                maxScore: 12,
                description: '갓머리가 하부를 완전히 덮는지'
              },
              '보호관계': {
                maxScore: 6,
                description: '하부 요소가 안전하게 보호되는지'
              },
              '공간비례': {
                maxScore: 6,
                description: '상하 비례가 적절한지 (1:3)'
              },
              '결구완성도': {
                maxScore: 6,
                description: '천복자 특징이 명확한지'
              }
            }
          },
          '지재자': {
            criteria: {
              '받침구조': {
                maxScore: 12,
                description: '하단 받침이 충분히 넓고 안정적인지'
              },
              '중심균형': {
                maxScore: 6,
                description: '상부와 하부의 중심이 일치하는지'
              },
              '지지관계': {
                maxScore: 6,
                description: '상부 요소들이 안정적으로 받쳐지는지'
              },
              '전체균형': {
                maxScore: 6,
                description: '전체적인 안정감이 느껴지는지'
              }
            }
          },
          '좌포자': {
            criteria: {
              '좌측위치': {
                maxScore: 12,
                description: '왼쪽 요소가 낮은 위치에 있는지'
              },
              '우측위치': {
                maxScore: 6,
                description: '오른쪽 요소가 상대적으로 높은지'
              },
              '높이비례': {
                maxScore: 6,
                description: '좌우 높이차가 적절한지'
              },
              '시각균형': {
                maxScore: 6,
                description: '시각적 균형이 유지되는지'
              }
            }
          },
          '우포자': {
            criteria: {
              '우측위치': {
                maxScore: 12,
                description: '오른쪽 요소가 낮은 위치에 있는지'
              },
              '좌측위치': {
                maxScore: 6,
                description: '왼쪽 요소가 상대적으로 높은지'
              },
              '높이조화': {
                maxScore: 6,
                description: '좌우 높이차가 자연스러운지'
              },
              '전체안정': {
                maxScore: 6,
                description: '전체 글자의 안정감이 유지되는지'
              }
            }
          }
        }
      }
    },
    scoringWeights: {
      level1Weight: 0.7,  // 70%
      level2Weight: 0,    // 해서체 특화는 현재 미사용
      level3Weight: 0.3   // 30% (황자원 92법)
    }
  },

  // 판본체
  '판본체': {
    fontStyle: '판본체',
    levels: {
      level1: {
        name: '기본서예평가',
        criteria: {
          '형태': {
            maxScore: 40,
            description: '글자의 기본 형태와 구조',
            evaluationPoints: [
              '자음과 모음의 조화',
              '전체적인 글자 형태',
              '획의 명확성'
            ]
          },
          '비례': {
            maxScore: 30,
            description: '글자의 균형과 비례',
            evaluationPoints: [
              '초성, 중성, 종성의 비례',
              '획 간 간격',
              '전체 균형감'
            ]
          },
          '굵기': {
            maxScore: 20,
            description: '붓의 압력과 굵기 변화',
            evaluationPoints: [
              '획의 일정한 굵기',
              '시작과 끝의 처리',
              '먹의 농담'
            ]
          },
          '획순': {
            maxScore: 10,
            description: '올바른 획순',
            evaluationPoints: [
              '한글 표준 획순',
              '획의 자연스러운 연결'
            ]
          }
        }
      },
      level2: {
        name: '판본체특화평가',
        criteria: {
          '단정함': {
            maxScore: 10,
            description: '판본체의 단정한 미감',
            evaluationPoints: [
              '획의 절제미',
              '격조있는 표현'
            ]
          },
          '균형미': {
            maxScore: 10,
            description: '판본체의 균형잡힌 구조',
            evaluationPoints: [
              '자모음의 균형',
              '전체적인 안정감'
            ]
          },
          '우아함': {
            maxScore: 10,
            description: '판본체의 우아한 선',
            evaluationPoints: [
              '곡선의 부드러움',
              '전체적인 품격'
            ]
          }
        }
      }
    },
    scoringWeights: {
      level1Weight: 0.7,  // 70%
      level2Weight: 0.3   // 30% (판본체 특화)
    }
  },

  // 궁서체
  '궁서체': {
    fontStyle: '궁서체',
    levels: {
      level1: {
        name: '기본서예평가',
        criteria: {
          '형태': {
            maxScore: 40,
            description: '글자의 기본 형태와 구조',
            evaluationPoints: [
              '곡선의 유려함',
              '전체적인 글자 형태',
              '획의 흐름'
            ]
          },
          '비례': {
            maxScore: 30,
            description: '글자의 균형과 비례',
            evaluationPoints: [
              '곡선과 직선의 비례',
              '획 간 간격',
              '전체 균형감'
            ]
          },
          '굵기': {
            maxScore: 20,
            description: '붓의 압력과 굵기 변화',
            evaluationPoints: [
              '부드러운 굵기 변화',
              '곡선에서의 압력 조절',
              '먹의 농담'
            ]
          },
          '획순': {
            maxScore: 10,
            description: '올바른 획순',
            evaluationPoints: [
              '한글 표준 획순',
              '곡선의 자연스러운 흐름'
            ]
          }
        }
      },
      level2: {
        name: '궁서체특화평가',
        criteria: {
          '곡선미': {
            maxScore: 10,
            description: '궁서체의 유려한 곡선',
            evaluationPoints: [
              '곡선의 부드러움',
              '자연스러운 흐름'
            ]
          },
          '유연성': {
            maxScore: 10,
            description: '궁서체의 유연한 표현',
            evaluationPoints: [
              '획의 탄력성',
              '리듬감있는 운필'
            ]
          },
          '전통미': {
            maxScore: 10,
            description: '궁서체의 전통적 미감',
            evaluationPoints: [
              '궁중 서체의 품격',
              '우아한 선의 표현'
            ]
          }
        }
      }
    },
    scoringWeights: {
      level1Weight: 0.7,  // 70%
      level2Weight: 0.3   // 30% (궁서체 특화)
    }
  },

  // 전서체
  '전서체': {
    fontStyle: '전서체',
    levels: {
      level1: {
        name: '기본서예평가',
        criteria: {
          '형태': {
            maxScore: 40,
            description: '글자의 기본 형태와 구조',
            evaluationPoints: [
              '각진 형태의 정확성',
              '전체적인 글자 형태',
              '획의 균일성'
            ]
          },
          '비례': {
            maxScore: 30,
            description: '글자의 균형과 비례',
            evaluationPoints: [
              '좌우 대칭',
              '획 간 균등한 간격',
              '전체 비례감'
            ]
          },
          '굵기': {
            maxScore: 20,
            description: '붓의 압력과 굵기 변화',
            evaluationPoints: [
              '일정한 굵기 유지',
              '각진 부분의 처리',
              '먹의 농담'
            ]
          },
          '획순': {
            maxScore: 10,
            description: '올바른 획순',
            evaluationPoints: [
              '전서체 표준 획순',
              '인장체의 규칙성'
            ]
          }
        }
      },
      level2: {
        name: '전서체특화평가',
        criteria: {
          '각진미': {
            maxScore: 10,
            description: '전서체의 각진 형태미',
            evaluationPoints: [
              '직각의 정확성',
              '모서리 처리'
            ]
          },
          '균일성': {
            maxScore: 10,
            description: '전서체의 균일한 구조',
            evaluationPoints: [
              '획 굵기의 일정성',
              '간격의 균등함'
            ]
          },
          '고전미': {
            maxScore: 10,
            description: '전서체의 고전적 미감',
            evaluationPoints: [
              '인장체의 위엄',
              '고대 문자의 품격'
            ]
          }
        }
      }
    },
    scoringWeights: {
      level1Weight: 0.7,  // 70%
      level2Weight: 0.3   // 30% (전서체 특화)
    }
  }
};

/**
 * 서체별 평가 설정 가져오기
 */
export function getFontEvaluationConfig(fontStyle: string): FontEvaluationCriteria | null {
  return FONT_EVALUATION_CONFIGS[fontStyle] || null;
}

/**
 * 황자원 92법 서브타입 가져오기
 */
export function getHwang92SubType(lessonId: string): string | null {
  const lessonMap: Record<string, string> = {
    'h92-01': '천복자',
    'h92-02': '지재자',
    'h92-03': '좌포자',
    'h92-04': '우포자'
  };
  return lessonMap[lessonId] || null;
}