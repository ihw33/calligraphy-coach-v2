import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { 
  ArrowLeft, 
  Star, 
  TrendingUp, 
  RotateCcw, 
  ArrowRight,
  Award,
  Target,
  Lightbulb
} from 'lucide-react';
import { UnifiedChecklist } from './UnifiedChecklist';
import { evaluationStrategyFactory } from '../strategies/EvaluationStrategyFactory';

// 예상 획수 헬퍼 함수
const getExpectedStrokeCount = (char: string): number => {
  const strokeCounts: Record<string, number> = {
    '가': 3, '나': 3, '다': 4, '라': 4, '마': 4,
    '바': 5, '사': 3, '아': 3, '자': 4, '차': 4, '작': 6,
    '宇': 6, '宙': 8, '星': 9, '月': 4, '日': 4,
    '人': 2, '大': 3, '天': 4, '太': 4, '夫': 4
  };
  return strokeCounts[char] || 3;
};

export const ResultScreen: React.FC = () => {
  const navigate = useNavigate();
  const { attemptId } = useParams();
  const location = useLocation();
  
  // PracticeScreen에서 전달받은 평가 결과
  const receivedData = location.state as {
    evaluationResult?: any;
    targetCharacter?: string;
    strokeCount?: number;
    useAI?: boolean;
    aiEvaluation?: any;
    canvasImage?: string; // 내가 쓴 글자 이미지
    courseId?: string;
    lessonId?: string;
  } | null;

  // 실제 평가 결과가 있으면 사용, 없으면 기본값
  const evaluationData = receivedData?.evaluationResult;
  const targetCharacter = receivedData?.targetCharacter || '가';
  const strokeCount = receivedData?.strokeCount || 0;

  console.log('🎯 ResultScreen 수신 데이터:', { 
    evaluationData,
    aiEvaluation: receivedData?.aiEvaluation,
    checklist: receivedData?.aiEvaluation?.checklist, 
    targetCharacter, 
    strokeCount,
    useAI: receivedData?.useAI,
    aiEvaluation총평: receivedData?.aiEvaluation?.총평,
    aiEvaluationStrengths: receivedData?.aiEvaluation?.strengths,
    aiEvaluationImprovements: receivedData?.aiEvaluation?.improvements
  });
  
  console.log('🔍 피드백 선택 로직:', {
    useAI: receivedData?.useAI,
    hasAIEvaluation: !!receivedData?.aiEvaluation,
    hasAIStrengths: !!(receivedData?.aiEvaluation?.strengths),
    hasAIImprovements: !!(receivedData?.aiEvaluation?.improvements),
    aiStrengthsLength: receivedData?.aiEvaluation?.strengths?.length || 0,
    aiImprovementsLength: receivedData?.aiEvaluation?.improvements?.length || 0,
    actualAIStrengths: receivedData?.aiEvaluation?.strengths,
    actualAIImprovements: receivedData?.aiEvaluation?.improvements
  });

  // 점수 기반 메시지 생성
  const generateMessage = (총점: number) => {
    if (총점 >= 90) return "훌륭해요! 거의 완벽한 글씨입니다. 계속 이 수준을 유지해보세요!";
    if (총점 >= 80) return "잘했어요! 기본기가 탄탄합니다. 조금만 더 연습하면 더욱 아름다운 글씨가 될 것 같습니다.";
    if (총점 >= 70) return "좋은 시도입니다! 전체적인 형태가 잘 잡혀있어요. 세부적인 부분을 조금 더 다듬어보세요.";
    if (총점 >= 60) return "꾸준히 연습하고 있네요! 기본 형태는 알고 있으니 자신감을 가지고 계속 써보세요.";
    return "괜찮아요! 서예는 꾸준한 연습이 가장 중요합니다. 포기하지 말고 계속 도전해보세요!";
  };

  // 점수별 잘한 점과 개선점 생성
  const generateFeedback = (result: any) => {
    const strengths = [];
    const improvements = [];

    if (result?.형태 >= 30) strengths.push("글자의 기본 형태가 아주 잘 잡혀있습니다");
    else if (result?.형태 >= 20) strengths.push("글자 형태가 인식 가능한 수준입니다");
    else improvements.push("글자의 기본 형태를 더 정확하게 써보세요");

    if (result?.비례 >= 25) strengths.push("글자의 중심과 비례감이 우수합니다");
    else if (result?.비례 >= 15) strengths.push("전체적인 균형감이 괜찮습니다");
    else improvements.push("격자 가이드를 참고해서 글자 크기와 위치를 조정해보세요");

    if (result?.굵기 >= 15) strengths.push("획의 굵기가 일정하고 안정적입니다");
    else if (result?.굵기 >= 10) strengths.push("압력 조절이 적절합니다");
    else improvements.push("붓의 압력을 더 일정하게 유지해보세요");

    if (result?.획순 >= 8) strengths.push("획 순서가 정확합니다");
    else if (result?.획순 >= 6) strengths.push("획수가 적절합니다");
    else improvements.push("정확한 획순으로 천천히 써보세요");

    // 기본 피드백이 없으면 추가
    if (strengths.length === 0) strengths.push("꾸준히 연습하고 있어서 좋습니다");
    if (improvements.length === 0) improvements.push("계속 연습해서 더 발전시켜보세요");

    return { strengths, improvements };
  };

  // AI 평가 결과에서 점수 추출 (새로운 구조 대응)
  const extractScores = (data: any) => {
    if (data?.scores) {
      // 새로운 AI 평가 구조
      const totalScore = data.scores.항목1.score + data.scores.항목2.score + data.scores.항목3.score + (data.scores.항목4?.score || 0);
      return {
        총점: totalScore,
        형태: data.scores.항목1.score,
        비례: data.scores.항목2.score,
        굵기: data.scores.항목3.score,
        획순: data.scores.항목4?.score || 0
      };
    } else {
      // 기존 구조 (하위 호환성)
      return {
        총점: data?.총점 || 0,
        형태: data?.형태 || 0,
        비례: data?.비례 || 0,
        굵기: data?.굵기 || 0,
        획순: data?.획순 || 0
      };
    }
  };

  const scores = extractScores(evaluationData);

  const evaluationResult = evaluationData ? {
    id: attemptId,
    character: targetCharacter,
    course: targetCharacter.match(/[가-힣]/) ? '판본체 기초' : '기초 한자',
    overallMessage: evaluationData.총평 || generateMessage(scores.총점),
    score: scores.총점,
    detailedScores: {
      형태: scores.형태,
      비례: scores.비례,
      굵기: scores.굵기,
      획순: scores.획순
    },
    recognition: evaluationData.인식결과 || evaluationData.recognition,
    strokeCount,
    // AI가 제공한 실제 피드백 우선 사용, 없으면 생성된 피드백 사용
    strengths: receivedData?.aiEvaluation?.strengths || 
      evaluationData.strengths || 
      generateFeedback(scores).strengths,
    improvements: receivedData?.aiEvaluation?.improvements || 
      evaluationData.improvements || 
      generateFeedback(scores).improvements,
    currentSession: {
      progress: 2,
      total: 5,
      nextCharacter: '나'
    }
  } : {
    // 기본값 (평가 결과가 없는 경우)
    id: attemptId,
    character: '가',
    course: '판본체 기초',
    overallMessage: "평가 결과를 불러올 수 없습니다. 다시 연습해보세요.",
    score: 0,
    detailedScores: { 형태: 0, 비례: 0, 굵기: 0, 획순: 0 },
    strokeCount: 0,
    strengths: ["다시 시도해보세요"],
    improvements: ["평가를 다시 받아보세요"],
    currentSession: {
      progress: 2,
      total: 5,
      nextCharacter: '나'
    }
  };

  const handleRetry = () => {
    navigate('/practice/session1'); // 현재 세션으로 다시 돌아가기
  };

  const handleNext = () => {
    if (evaluationResult.currentSession.progress < evaluationResult.currentSession.total) {
      navigate('/practice/session1'); // 다음 글자로 진행
    } else {
      navigate('/home'); // 세션 완료
    }
  };

  const handleHome = () => {
    navigate('/home');
  };

  const sessionProgress = (evaluationResult.currentSession.progress / evaluationResult.currentSession.total) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="px-6 py-4 border-b bg-card/50">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleHome}
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-medium text-primary">평가 결과</h1>
            <p className="text-sm text-muted-foreground">{evaluationResult.course}</p>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="px-6 py-6 pb-32">
        <div className="max-w-md mx-auto space-y-6">
          {/* 현재 세션 진행률 */}
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">세션 진행률</span>
                <span className="text-sm font-medium text-primary">
                  {evaluationResult.currentSession.progress}/{evaluationResult.currentSession.total}
                </span>
              </div>
              <Progress value={sessionProgress} className="h-2" />
            </div>
          </Card>

          {/* 작성한 글자 */}
          <Card className="p-6 text-center">
            <h2 className="text-sm text-muted-foreground mb-4">연습한 글자</h2>
            <div className="text-6xl font-medium text-primary mb-4">
              {evaluationResult.character}
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20">
              {evaluationResult.course}
            </Badge>
          </Card>

          {/* 옵션 3: 구체적인 총평 표시 + improvements 별도 표시 */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-primary">
                  {receivedData?.useAI ? '🤖 AI 서예 전문가의 구체적 분석' : 'AI 서예 코치의 평가'}
                </h3>
                {receivedData?.useAI && (
                  <p className="text-xs text-muted-foreground">Google Gemini Vision 기반 상세 피드백</p>
                )}
              </div>
            </div>
            
            {/* 내가 쓴 글자 이미지 */}
            {receivedData?.canvasImage && (
              <div className="flex justify-center my-4">
                <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-sm">
                  <p className="text-xs text-gray-500 text-center mb-2">내가 쓴 글자</p>
                  <img 
                    src={receivedData.canvasImage} 
                    alt="내가 쓴 글자" 
                    className="w-32 h-32 object-contain border rounded"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
              </div>
            )}
            
            <div className="text-muted-foreground leading-relaxed text-base whitespace-pre-line">
              {receivedData?.useAI && receivedData?.aiEvaluation?.총평 ? 
                receivedData.aiEvaluation.총평.replace(/\. /g, '.\n\n') : 
                evaluationResult.overallMessage}
            </div>
            
            {/* AI 평가 신뢰도 표시 */}
            {receivedData?.useAI && receivedData?.aiEvaluation && (
              <div className="flex items-center gap-2 pt-2 border-t">
                <div className="text-xs text-muted-foreground">
                  AI 인식 신뢰도: {Math.round(receivedData.aiEvaluation.recognition.confidence * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">•</div>
                <div className="text-xs text-muted-foreground">
                  평가 모델: Gemini Vision
                </div>
              </div>
            )}
          </Card>

          {/* 상세 점수 (실제 평가가 있는 경우만 표시) */}
          {evaluationData && (
            <Card className="p-6 space-y-4 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-primary">상세 점수</h3>
                  <p className="text-sm text-muted-foreground">총 {evaluationResult.score}점 / 100점</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/70 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">형태</span>
                    <span className="text-lg font-bold text-blue-600">{evaluationResult.detailedScores.형태}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">40점 만점</div>
                  <Progress value={(evaluationResult.detailedScores.형태 / 40) * 100} className="h-2 mt-1" />
                </div>
                
                <div className="p-3 bg-white/70 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">비례</span>
                    <span className="text-lg font-bold text-green-600">{evaluationResult.detailedScores.비례}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">30점 만점</div>
                  <Progress value={(evaluationResult.detailedScores.비례 / 30) * 100} className="h-2 mt-1" />
                </div>
                
                <div className="p-3 bg-white/70 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">굵기</span>
                    <span className="text-lg font-bold text-orange-600">{evaluationResult.detailedScores.굵기}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">20점 만점</div>
                  <Progress value={(evaluationResult.detailedScores.굵기 / 20) * 100} className="h-2 mt-1" />
                </div>
                
                <div className="p-3 bg-white/70 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">획순</span>
                    <span className="text-lg font-bold text-purple-600">{evaluationResult.detailedScores.획순}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">10점 만점</div>
                  <Progress value={(evaluationResult.detailedScores.획순 / 10) * 100} className="h-2 mt-1" />
                </div>
              </div>

              {/* 인식 결과 */}
              {evaluationResult.recognition && (
                <div className="border-t pt-3">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">인식된 글자:</span> 
                    <span className="text-lg font-bold ml-2">{evaluationResult.recognition.topCandidate.character}</span>
                    {evaluationResult.recognition.topCandidate.character === targetCharacter ? 
                      <span className="text-green-600 ml-2 text-xs">✓ 정확</span> : 
                      <span className="text-red-600 ml-2 text-xs">✗ 오인식</span>
                    }
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    신뢰도: {Math.round(evaluationResult.recognition.confidence * 100)}% | 
                    획수: {evaluationResult.strokeCount}개
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* 통합 체크리스트 - 전략 패턴 사용 */}
          {receivedData?.aiEvaluation && receivedData?.courseId && (() => {
            const courseId = receivedData.courseId || 'standard';
            const lessonId = receivedData.lessonId;
            const strategy = evaluationStrategyFactory.getStrategy(courseId, lessonId);
            const scores = evaluationData?.detailedScores || {
              형태: 0,
              비례: 0,
              굵기: 0,
              획순: 0,
              총점: evaluationResult?.score || 0
            };
            
            return (
              <UnifiedChecklist
                strategy={strategy}
                evaluation={receivedData.aiEvaluation}
                scores={scores}
              />
            );
          })()}
          
          {/* 평가 체크리스트 */}
          <Card className="p-6 space-y-4 border-2 border-primary/20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-primary">평가 체크리스트</h3>
                <p className="text-xs text-muted-foreground">각 항목별 달성도를 확인하세요</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {/* 형태 체크리스트 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                  <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-xs">형</div>
                  <span>형태 ({evaluationResult.detailedScores?.형태 || 0}/40점)</span>
                </div>
                <div className="pl-8 space-y-1">
                  <div className="flex items-center gap-2">
                    {evaluationResult.recognition?.topCandidate.character === targetCharacter ? (
                      <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-500 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded border-2 border-red-500"></div>
                    )}
                    <span className="text-xs text-gray-600">정확한 글자 인식</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(evaluationResult.detailedScores?.형태 || 0) >= 20 ? (
                      <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-500 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded border-2 border-gray-400"></div>
                    )}
                    <span className="text-xs text-gray-600">기본 형태 구조 완성</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(evaluationResult.detailedScores?.형태 || 0) >= 30 ? (
                      <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-500 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded border-2 border-gray-400"></div>
                    )}
                    <span className="text-xs text-gray-600">세부 형태 정확도</span>
                  </div>
                </div>
              </div>

              {/* 비례 체크리스트 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                  <div className="w-6 h-6 rounded bg-green-100 flex items-center justify-center text-xs">비</div>
                  <span>비례 ({evaluationResult.detailedScores?.비례 || 0}/30점)</span>
                </div>
                <div className="pl-8 space-y-1">
                  <div className="flex items-center gap-2">
                    {(evaluationResult.detailedScores?.비례 || 0) >= 15 ? (
                      <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-500 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded border-2 border-gray-400"></div>
                    )}
                    <span className="text-xs text-gray-600">격자 중심 위치</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(evaluationResult.detailedScores?.비례 || 0) >= 20 ? (
                      <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-500 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded border-2 border-gray-400"></div>
                    )}
                    <span className="text-xs text-gray-600">적절한 크기</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(evaluationResult.detailedScores?.비례 || 0) >= 25 ? (
                      <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-500 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded border-2 border-gray-400"></div>
                    )}
                    <span className="text-xs text-gray-600">균형잡힌 비율</span>
                  </div>
                </div>
              </div>

              {/* 굵기 체크리스트 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-orange-600">
                  <div className="w-6 h-6 rounded bg-orange-100 flex items-center justify-center text-xs">굵</div>
                  <span>선 품질 ({evaluationResult.detailedScores?.굵기 || 0}/20점)</span>
                </div>
                <div className="pl-8 space-y-1">
                  <div className="flex items-center gap-2">
                    {(evaluationResult.detailedScores?.굵기 || 0) >= 8 ? (
                      <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-500 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded border-2 border-gray-400"></div>
                    )}
                    <span className="text-xs text-gray-600">깔끔한 선 그리기</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(evaluationResult.detailedScores?.굵기 || 0) >= 12 ? (
                      <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-500 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded border-2 border-gray-400"></div>
                    )}
                    <span className="text-xs text-gray-600">일정한 굵기 유지</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(evaluationResult.detailedScores?.굵기 || 0) >= 16 ? (
                      <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-500 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded border-2 border-gray-400"></div>
                    )}
                    <span className="text-xs text-gray-600">부드러운 곡선 처리</span>
                  </div>
                </div>
              </div>

              {/* 획순 체크리스트 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-purple-600">
                  <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center text-xs">획</div>
                  <span>획순 ({evaluationResult.detailedScores?.획순 || 0}/10점)</span>
                </div>
                <div className="pl-8 space-y-1">
                  <div className="flex items-center gap-2">
                    {evaluationResult.strokeCount === getExpectedStrokeCount(targetCharacter) ? (
                      <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-500 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded border-2 border-red-500"></div>
                    )}
                    <span className="text-xs text-gray-600">정확한 획수 ({evaluationResult.strokeCount}/{getExpectedStrokeCount(targetCharacter)}획)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(evaluationResult.detailedScores?.획순 || 0) >= 6 ? (
                      <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-500 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded border-2 border-gray-400"></div>
                    )}
                    <span className="text-xs text-gray-600">올바른 획 순서</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(evaluationResult.detailedScores?.획순 || 0) >= 8 ? (
                      <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-500 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded border-2 border-gray-400"></div>
                    )}
                    <span className="text-xs text-gray-600">표준 획순 준수</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 전체 달성률 */}
            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">전체 달성률</span>
                <span className="text-lg font-bold text-primary">
                  {Math.round(
                    ((evaluationData ? 
                      [
                        evaluationResult.recognition?.topCandidate.character === targetCharacter,
                        (evaluationResult.detailedScores?.형태 || 0) >= 20,
                        (evaluationResult.detailedScores?.비례 || 0) >= 15,
                        (evaluationResult.detailedScores?.굵기 || 0) >= 16, // 디지털 환경에 맞게 상향 조정
                        evaluationResult.strokeCount === getExpectedStrokeCount(targetCharacter)
                      ].filter(Boolean).length : 0
                    ) / 5) * 100
                  )}%
                </span>
              </div>
              <Progress 
                value={
                  ((evaluationData ? 
                    [
                      evaluationResult.recognition?.topCandidate.character === targetCharacter,
                      (evaluationResult.detailedScores?.형태 || 0) >= 20,
                      (evaluationResult.detailedScores?.비례 || 0) >= 15,
                      (evaluationResult.detailedScores?.굵기 || 0) >= 16, // 디지털 환경에 맞게 상향 조정
                      evaluationResult.strokeCount === getExpectedStrokeCount(targetCharacter)
                    ].filter(Boolean).length : 0
                  ) / 5) * 100
                } 
                className="h-2 mt-2" 
              />
            </div>
          </Card>

          {/* 개선할 점 - AI의 구체적인 피드백 */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-medium text-primary">개선할 점</h3>
            </div>
            
            <div className="space-y-2">
              {(receivedData?.aiEvaluation?.improvements || evaluationResult.improvements).map((improvement, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <p className="text-sm text-blue-800">{improvement}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* 학습 팁 */}
          <Card className="p-6 space-y-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              <h3 className="font-medium text-purple-800">학습 팁</h3>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-purple-700">
                • 붓의 각도를 일정하게 유지하며 연습해보세요
              </p>
              <p className="text-sm text-purple-700">
                • 천천히 써서 각 획의 시작과 끝을 의식해보세요
              </p>
              <p className="text-sm text-purple-700">
                • 표준 글자를 자주 보며 형태를 기억해보세요
              </p>
            </div>
          </Card>
        </div>
      </main>

      {/* 하단 액션 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background border-t">
        <div className="max-w-md mx-auto space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline"
              onClick={handleRetry}
              className="h-12 bg-white/80 border-2 border-border hover:bg-white/90 backdrop-blur-sm"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              다시 쓰기
            </Button>
            
            <Button 
              onClick={handleNext}
              className="h-12 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {evaluationResult.currentSession.progress < evaluationResult.currentSession.total ? (
                <>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  다음 글자 ({evaluationResult.currentSession.nextCharacter})
                </>
              ) : (
                <>
                  <Award className="w-4 h-4 mr-2" />
                  완료
                </>
              )}
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={handleHome}
            className="w-full text-muted-foreground hover:text-primary"
          >
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
};