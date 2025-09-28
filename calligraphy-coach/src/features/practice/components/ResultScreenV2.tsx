/**
 * ResultScreenV2 - 3레벨 평가 체계 기반 결과 화면
 * 디지털/실물 모드에 따라 적응형 UI 제공
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Progress } from '../../../components/ui/progress';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { 
  ArrowLeft, 
  RefreshCw, 
  Download, 
  Share2, 
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  XCircle
} from 'lucide-react';
import type { EvaluationResponse } from '../evaluation';
import { createResultDisplayModel, type ResultDisplayModel, type SectionItem } from '../evaluation/models/ResultDisplayModel';

// AI 평가 결과를 EvaluationResponse로 변환
function createMockEvaluationFromAI(aiEvaluation: any, courseId?: string, fontStyle?: string): EvaluationResponse {
  const isDigital = !fontStyle || fontStyle === '없음';
  const mode = isDigital ? 'digital' : 'physical';
  
  console.log('🔄 AI 평가 데이터 변환 중:', aiEvaluation);
  
  // AI 평가 결과에서 점수 추출 (실제 구조에 맞게 수정)
  const scores = aiEvaluation?.scores || {};
  let totalScore = 0;
  let breakdown: Record<string, number> = {};
  
  // 디지털 모드 점수 매핑
  if (isDigital) {
    breakdown = {
      '정확성': scores.항목1?.score || scores.accuracy?.score || 35,
      '위치': scores.항목2?.score || scores.position?.score || 20,
      '매끄러움': scores.항목3?.score || scores.smoothness?.score || 10,
      '획수': scores.항목4?.score || scores.strokes?.score || 5
    };
  } else {
    // 실물 모드 점수 매핑
    breakdown = {
      '형태': scores.항목1?.score || scores.shape?.score || 30,
      '비례': scores.항목2?.score || scores.proportion?.score || 22,
      '굵기': scores.항목3?.score || scores.thickness?.score || 15,
      '획순': scores.항목4?.score || scores.strokeOrder?.score || 8
    };
  }
  
  totalScore = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
  
  // 황자원 92법 평가가 있는 경우
  if (courseId === 'hwang92-sebeop' && fontStyle === '해서체') {
    const hwang92Score = aiEvaluation?.hwang92Score || 18; // 예시 점수
    breakdown['황자원평가'] = hwang92Score;
    totalScore += hwang92Score;
  }
  
  return {
    scores: {
      total: totalScore,
      breakdown,
      normalized: courseId === 'hwang92-sebeop' && fontStyle === '해서체'
    },
    checklist: {
      basic: fontStyle === '해서체' ? [
        { id: 'clarity', label: '정자체의 단정함', description: '정확하고 단정한 형태', checked: true, score: 10, maxScore: 10, category: 'basic' },
        { id: 'balance', label: '균형잡힌 결구', description: '안정적인 구조 균형', checked: true, score: 10, maxScore: 10, category: 'basic' },
        { id: 'readability', label: '가독성', description: '명확한 가독성', checked: false, score: 5, maxScore: 10, category: 'basic' }
      ] : Object.entries(aiEvaluation?.checklist || {}).map(([id, checked]) => ({
        id,
        label: id,
        description: '',
        checked: checked as boolean,
        score: checked ? 10 : 0,
        maxScore: 10,
        category: 'basic'
      })),
      // 황자원 92법 체크리스트 추가
      hwang92: courseId === 'hwang92-sebeop' && fontStyle === '해서체' ? [
        { id: 'cover', label: '덮개구조', description: '갓머리가 하부를 완전히 덮는지', checked: true, score: 12, maxScore: 12, category: 'hwang92' },
        { id: 'protection', label: '보호관계', description: '하부 요소가 안전하게 보호되는지', checked: true, score: 6, maxScore: 6, category: 'hwang92' },
        { id: 'proportion', label: '공간비례', description: '상하 비례가 적절한지 (1:3)', checked: false, score: 0, maxScore: 6, category: 'hwang92' },
        { id: 'completion', label: '결구완성도', description: '천복자 특징이 명확한지', checked: false, score: 0, maxScore: 6, category: 'hwang92' }
      ] : undefined
    },
    grade: {
      grade: totalScore >= 85 ? 'A' : totalScore >= 75 ? 'B' : totalScore >= 65 ? 'C' : 'D',
      label: totalScore >= 85 ? '우수' : totalScore >= 75 ? '양호' : totalScore >= 65 ? '보통' : '미흡',
      color: totalScore >= 85 ? 'green' : totalScore >= 75 ? 'blue' : totalScore >= 65 ? 'gray' : 'orange',
      message: aiEvaluation?.총평 || '기초부터 차근차근 연습해보세요.'
    },
    feedback: {
      strengths: aiEvaluation?.strengths || [
        '기본 획의 구성이 명확합니다',
        '글자의 전체적인 균형이 잘 잡혀있습니다'
      ],
      improvements: aiEvaluation?.improvements || [
        '붓의 압력 조절을 더 연습해보세요',
        '획의 시작과 끝을 더 명확하게 표현해보세요'
      ],
      summary: aiEvaluation?.총평 || '전반적으로 좋은 시도입니다. 기초를 더 탄탄히 다지면 더욱 발전할 수 있을 것입니다.'
    },
    meta: {
      evaluatedAt: new Date(),
      mode: mode as any,
      courseId: courseId as any || 'standard',
      fontStyle: fontStyle as any,
      evaluationLevels: [
        'LEVEL1',
        ...(fontStyle && fontStyle !== '없음' ? ['LEVEL2'] : []),
        ...(courseId === 'hwang92-sebeop' && fontStyle === '해서체' ? ['LEVEL3'] : [])
      ],
      aiProvider: 'mock' as any
    }
  };
}

interface LocationState {
  evaluation?: EvaluationResponse;
  evaluationResult?: any; // 기존 호환성
  canvasImage?: string;
  character?: string;
  targetCharacter?: string; // 기존 호환성
  courseId?: string;
  fontStyle?: string;
  aiEvaluation?: any;
}

export const ResultScreenV2: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  // evaluation 또는 evaluationResult.fullEvaluation 사용
  const evaluation = state?.evaluation || state?.evaluationResult?.fullEvaluation;
  const character = state?.character || state?.targetCharacter || '글자';
  const canvasImage = state?.canvasImage;
  const courseId = state?.courseId;
  const fontStyle = state?.fontStyle;
  const aiEvaluation = state?.aiEvaluation;
  
  console.log('🎯 ResultScreenV2 - 받은 데이터:', {
    hasEvaluation: !!evaluation,
    hasEvaluationResult: !!state?.evaluationResult,
    fullEvaluation: state?.evaluationResult?.fullEvaluation,
    character,
    courseId,
    fontStyle,
    hasCanvasImage: !!canvasImage
  });
  
  // evaluation이 없으면 기본 Mock 평가 생성
  const finalEvaluation = evaluation || 
    createMockEvaluationFromAI(aiEvaluation || {}, courseId, fontStyle);
  
  const displayModel = finalEvaluation ? 
    createResultDisplayModel(finalEvaluation, courseId as any || 'standard') : null;
  
  // useEffect로 이동하여 경고 해결
  React.useEffect(() => {
    if (!finalEvaluation && !state?.evaluationResult) {
      console.error('❌ ResultScreenV2: 평가 데이터가 전혀 없습니다');
      console.log('🔍 받은 state:', state);
      // 지연 후 홈으로 이동
      setTimeout(() => navigate('/'), 2000);
    }
  }, []);
  
  if (!displayModel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">평가 데이터를 처리하는 중...</p>
          <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }
  
  console.log('📊 ResultScreenV2 - 표시 모델:', displayModel);
  console.log('📊 ResultScreenV2 - 섹션 개수:', displayModel.sections.length);
  displayModel.sections.forEach((section, idx) => {
    console.log(`  섹션 ${idx + 1}: ${section.title} (${section.level})`, {
      visible: section.visible,
      items: section.items.length,
      summary: section.summary
    });
  });
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 헤더 */}
        <Header displayModel={displayModel} character={character} />
        
        {/* 메인 콘텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 작품 이미지 */}
          <div className="lg:col-span-1">
            <ArtworkCard canvasImage={canvasImage} character={character} />
          </div>
          
          {/* 오른쪽: 평가 결과 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 레벨별 평가 섹션 */}
            {displayModel.sections.map(section => (
              <EvaluationSection key={section.level} section={section} />
            ))}
            
            {/* 피드백 섹션 */}
            <FeedbackCard feedback={displayModel.feedback} />
          </div>
        </div>
        
        {/* 하단 액션 버튼 */}
        <ActionButtons evaluation={evaluation} />
      </div>
    </div>
  );
};

// ===================================
// 헤더 컴포넌트
// ===================================
const Header: React.FC<{ displayModel: ResultDisplayModel; character: string }> = ({ 
  displayModel, 
  character 
}) => {
  const { header } = displayModel;
  const gradeColors: Record<string, string> = {
    'S': 'bg-yellow-500',
    'A': 'bg-green-500',
    'B': 'bg-blue-500',
    'C': 'bg-gray-500',
    'D': 'bg-orange-500',
    'F': 'bg-red-500'
  };
  
  return (
    <Card className="p-6 bg-white shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold">{character}</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{header.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              {header.mode === 'digital' && (
                <Badge variant="secondary">디지털</Badge>
              )}
              {header.fontStyle && header.fontStyle !== '없음' && (
                <Badge variant="outline">{header.fontStyle}</Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-white text-3xl font-bold ${gradeColors[header.grade.grade]}`}>
            {header.grade.grade}
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">{header.totalScore}점</div>
            <div className="text-sm text-gray-600">{header.grade.label}</div>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <Progress value={(header.totalScore / header.maxScore) * 100} className="h-3" />
        <p className="text-sm text-gray-600 mt-2">{header.grade.message}</p>
      </div>
    </Card>
  );
};

// ===================================
// 작품 카드
// ===================================
const ArtworkCard: React.FC<{ canvasImage?: string; character: string }> = ({ 
  canvasImage, 
  character 
}) => {
  return (
    <Card className="p-6 bg-white shadow-lg sticky top-4">
      <h3 className="text-lg font-semibold mb-4">작성한 글자</h3>
      <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
        {canvasImage ? (
          <img src={canvasImage} alt="작성한 글자" className="w-full h-full object-contain" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            이미지 없음
          </div>
        )}
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">목표 글자</p>
        <p className="text-4xl font-bold mt-2">{character}</p>
      </div>
    </Card>
  );
};

// ===================================
// 평가 섹션
// ===================================
const EvaluationSection: React.FC<{ section: ResultDisplayModel['sections'][0] }> = ({ 
  section 
}) => {
  if (!section.visible) return null;
  
  const levelColors = {
    'LEVEL1': 'border-blue-200 bg-blue-50',
    'LEVEL2': 'border-purple-200 bg-purple-50',
    'LEVEL3': 'border-amber-200 bg-amber-50'
  };
  
  return (
    <Card className={`p-6 ${levelColors[section.level]} border-2`}>
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{section.icon}</span>
          <div>
            <h3 className="text-lg font-semibold">{section.title}</h3>
            {section.weight && (
              <span className="text-sm text-gray-600">가중치: {section.weight}</span>
            )}
          </div>
        </div>
        {section.summary && (
          <div className="text-right">
            <div className="text-2xl font-bold">
              {section.summary.score}/{section.summary.maxScore}
            </div>
            <div className="text-sm text-gray-600">{section.summary.percentage}%</div>
          </div>
        )}
      </div>
      
      {/* 평가 항목들 */}
      <div className="space-y-3">
        {section.items.map(item => (
          <EvaluationItem key={item.id} item={item} />
        ))}
      </div>
      
      {/* 전체 진행률 */}
      {section.summary && (
        <div className="mt-4">
          <Progress 
            value={section.summary.percentage} 
            className="h-2"
          />
        </div>
      )}
    </Card>
  );
};

// ===================================
// 평가 항목
// ===================================
const EvaluationItem: React.FC<{ item: SectionItem }> = ({ item }) => {
  const statusIcons = {
    'excellent': <CheckCircle2 className="w-5 h-5 text-green-500" />,
    'good': <CheckCircle2 className="w-5 h-5 text-blue-500" />,
    'needsImprovement': <AlertCircle className="w-5 h-5 text-orange-500" />
  };
  
  const percentage = item.maxScore > 0 ? (item.score / item.maxScore) * 100 : 0;
  
  return (
    <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
      <div className="flex-shrink-0 mt-0.5">
        {statusIcons[item.status]}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">{item.label}</div>
            {item.description && (
              <div className="text-sm text-gray-600">{item.description}</div>
            )}
          </div>
          <div className="text-right">
            <div className="font-semibold">{item.score}/{item.maxScore}점</div>
            <div className="text-xs text-gray-500">{Math.round(percentage)}%</div>
          </div>
        </div>
        {item.details && (
          <div className="text-sm text-gray-700 mt-1">{item.details}</div>
        )}
      </div>
    </div>
  );
};

// ===================================
// 피드백 카드
// ===================================
const FeedbackCard: React.FC<{ feedback: ResultDisplayModel['feedback'] }> = ({ 
  feedback 
}) => {
  return (
    <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        피드백 및 조언
      </h3>
      
      <Tabs defaultValue="strengths" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="strengths">강점</TabsTrigger>
          <TabsTrigger value="improvements">개선점</TabsTrigger>
          {feedback.expertAdvice && feedback.expertAdvice.length > 0 && (
            <TabsTrigger value="expert">전문가 조언</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="strengths" className="mt-4">
          <ul className="space-y-2">
            {feedback.strengths.map((strength, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{strength}</span>
              </li>
            ))}
          </ul>
        </TabsContent>
        
        <TabsContent value="improvements" className="mt-4">
          <ul className="space-y-2">
            {feedback.improvements.map((improvement, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{improvement}</span>
              </li>
            ))}
          </ul>
        </TabsContent>
        
        {feedback.expertAdvice && feedback.expertAdvice.length > 0 && (
          <TabsContent value="expert" className="mt-4">
            <ul className="space-y-2">
              {feedback.expertAdvice.map((advice, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{advice}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
        )}
      </Tabs>
    </Card>
  );
};

// ===================================
// 액션 버튼
// ===================================
const ActionButtons: React.FC<{ evaluation: EvaluationResponse }> = ({ evaluation }) => {
  const navigate = useNavigate();
  
  const handleRetry = () => {
    navigate(-1);
  };
  
  const handleShare = () => {
    // 공유 기능 구현
    console.log('공유하기');
  };
  
  const handleDownload = () => {
    // 다운로드 기능 구현
    console.log('다운로드');
  };
  
  return (
    <Card className="p-4 bg-white shadow-lg">
      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={() => navigate('/')} variant="outline" size="lg">
          <ArrowLeft className="w-4 h-4 mr-2" />
          홈으로
        </Button>
        <Button onClick={handleRetry} variant="outline" size="lg">
          <RefreshCw className="w-4 h-4 mr-2" />
          다시 쓰기
        </Button>
        <Button onClick={handleShare} variant="outline" size="lg">
          <Share2 className="w-4 h-4 mr-2" />
          공유하기
        </Button>
        <Button onClick={handleDownload} variant="default" size="lg">
          <Download className="w-4 h-4 mr-2" />
          결과 저장
        </Button>
      </div>
    </Card>
  );
};

export default ResultScreenV2;