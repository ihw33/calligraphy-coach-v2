import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  ArrowLeft,
  ArrowRight,
  Play,
  Clock,
  Target,
  CheckCircle2,
  BookOpen,
  Lightbulb,
  Eye,
  PenTool,
  Award
} from 'lucide-react';

export const LessonInfoScreen: React.FC = () => {
  const navigate = useNavigate();
  const { courseType, lessonId } = useParams<{ courseType: string; lessonId: string }>();

  // 레슨 데이터 (실제로는 API에서 가져옴)
  const lessonData: { [key: string]: any } = {
    '14': {
      title: '복합 모음 ㅘ, ㅙ, ㅚ',
      subtitle: '이중 모음의 아름다운 조화',
      type: 'practice',
      difficulty: '중급',
      duration: '20분',
      objectives: [
        'ㅘ, ㅙ, ㅚ의 정확한 형태 익히기',
        '각 모음의 균형잡힌 비례 연습',
        '자음과 결합했을 때의 조화',
        '전체적인 글자의 안정감 표현'
      ],
      description: '이번 레슨에서는 한글의 복합 모음 중 ㅘ, ㅙ, ㅚ를 학습합니다. 이 모음들은 두 개의 기본 모음이 결합된 형태로, 각각의 요소가 조화롭게 어우러지도록 쓰는 것이 중요합니다.',
      characters: ['ㅘ', 'ㅙ', 'ㅚ'],
      examples: [
        { char: '과', meaning: '과일의 과', difficulty: 'easy' },
        { char: '괘', meaning: '괘선의 괘', difficulty: 'medium' },
        { char: '외', meaning: '바깥 외', difficulty: 'easy' },
        { char: '뙈', meaning: '뙈기의 뙈', difficulty: 'hard' },
        { char: '쐐', meaning: '쐐기의 쐐', difficulty: 'hard' },
        { char: '되', meaning: '되돌아가다의 되', difficulty: 'medium' }
      ],
      tips: [
        'ㅘ는 ㅗ와 ㅏ가 자연스럽게 연결되도록 써주세요',
        'ㅙ는 ㅘ에 작은 점이 추가된 형태입니다',
        'ㅚ는 ㅗ와 ㅣ의 균형이 중요합니다',
        '전체적인 글자의 중심을 잃지 않도록 주의하세요'
      ],
      techniques: [
        {
          title: '시작 자세',
          description: '붓을 45도 각도로 기울여 시작합니다'
        },
        {
          title: '획의 순서',
          description: '왼쪽 요소부터 오른쪽 순서로 써나갑니다'
        },
        {
          title: '마무리',
          description: '마지막 획은 힘을 빼며 자연스럽게 마무리합니다'
        }
      ],
      preview: {
        image: '/lesson-preview-14.png',
        video: '/lesson-video-14.mp4'
      },
      previousLesson: 13,
      nextLesson: 15,
      estimatedScore: 85
    }
  };

  const currentLesson = lessonData[lessonId || '14'];

  if (!currentLesson) {
    return (
      <div className="h-screen flex flex-col calligraphy-bg">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-lg font-medium text-primary">레슨을 찾을 수 없습니다</h2>
            <button 
              onClick={() => navigate(`/course/${courseType}/curriculum`)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              커리큘럼으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleStartPractice = () => {
    navigate(`/course/${courseType}/lesson/${lessonId}/practice`);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'practice':
        return 'bg-blue-100 text-blue-800';
      case 'theory':
        return 'bg-purple-100 text-purple-800';
      case 'project':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'hard':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="h-screen flex flex-col calligraphy-bg">
      {/* 헤더 */}
      <header className="flex-shrink-0 px-6 py-6 organic-header">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/course/${courseType}/curriculum`)}
              className="w-10 h-10 rounded-full bg-muted/40 hover:bg-muted/60 flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="text-center">
              <h1 className="font-medium text-primary ink-splash">레슨 {lessonId}</h1>
              <p className="text-sm text-muted-foreground">{currentLesson.title}</p>
            </div>
            <div className="w-10 h-10" />
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        <div className="max-w-md mx-auto space-y-6">
          
          {/* 레슨 개요 */}
          <div className="handmade-card p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`${getTypeColor(currentLesson.type)}`}>
                  {currentLesson.type === 'practice' ? '연습' : currentLesson.type === 'theory' ? '이론' : '프로젝트'}
                </Badge>
                <Badge variant="outline" className="border-primary/30 text-primary">
                  {currentLesson.difficulty}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{currentLesson.duration}</span>
              </div>
            </div>

            <div className="text-center space-y-3">
              <h2 className="text-xl font-medium text-primary ink-splash">{currentLesson.title}</h2>
              <p className="text-sm text-muted-foreground">{currentLesson.subtitle}</p>
              
              {/* 학습할 글자들 */}
              <div className="character-display p-6 text-center">
                <div className="text-3xl text-primary mb-3 font-serif">
                  {currentLesson.characters.join('  ')}
                </div>
                <p className="text-sm text-muted-foreground">오늘 배울 글자들</p>
              </div>
            </div>
          </div>

          {/* 학습 목표 */}
          <div className="handmade-card p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-primary">학습 목표</h3>
                <p className="text-xs text-muted-foreground">이번 레슨에서 달성할 목표</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {currentLesson.objectives.map((objective: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground leading-relaxed">{objective}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 레슨 설명 */}
          <div className="handmade-card p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-primary">레슨 소개</h3>
                <p className="text-xs text-muted-foreground">자세한 설명</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              {currentLesson.description}
            </p>
          </div>

          {/* 연습할 예시 글자 */}
          <div className="handmade-card p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center">
                <PenTool className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-primary">연습 예시</h3>
                <p className="text-xs text-muted-foreground">실제로 연습할 글자들</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {currentLesson.examples.map((example: any, index: number) => (
                <div key={index} className="p-4 rounded-lg bg-gradient-to-br from-muted/30 to-muted/10 text-center">
                  <div className="text-2xl font-serif text-primary mb-2">{example.char}</div>
                  <p className="text-xs text-muted-foreground mb-1">{example.meaning}</p>
                  <span className={`text-xs font-medium ${getDifficultyColor(example.difficulty)}`}>
                    {example.difficulty === 'easy' ? '쉬움' : example.difficulty === 'medium' ? '보통' : '어려움'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 학습 팁 */}
          <div className="handmade-card p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-primary">학습 팁</h3>
                <p className="text-xs text-muted-foreground">더 나은 연습을 위한 조언</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {currentLesson.tips.map((tip: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-amber-800 leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 기법 설명 */}
          <div className="handmade-card p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-500 flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-primary">핵심 기법</h3>
                <p className="text-xs text-muted-foreground">단계별 연습 방법</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {currentLesson.techniques.map((technique: any, index: number) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-primary mb-1">{technique.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{technique.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 예상 성과 */}
          <div className="handmade-card p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-primary">예상 성과</h3>
                <p className="text-xs text-muted-foreground">이번 레슨 완료 후</p>
              </div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-200">
              <div className="text-3xl font-bold text-rose-600 mb-1">{currentLesson.estimatedScore}점</div>
              <p className="text-sm text-rose-700">예상 평균 점수</p>
            </div>
          </div>

          {/* 연습 시작 버튼 */}
          <div className="pt-4">
            <Button
              onClick={handleStartPractice}
              className="w-full h-14 text-base rounded-xl ink-button text-primary-foreground hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center gap-3">
                <Play className="w-5 h-5" />
                <span>연습 시작하기</span>
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};