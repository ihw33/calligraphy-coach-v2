import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { 
  ArrowLeft,
  ArrowRight,
  Play,
  CheckCircle2,
  Lock,
  Clock,
  Star,
  BookOpen,
  Target,
  Award,
  ChevronRight,
  Info
} from 'lucide-react';

export const CourseCurriculumScreen: React.FC = () => {
  const navigate = useNavigate();
  const { courseType } = useParams<{ courseType: string }>();

  // 코스 타입에서 정보 추출
  const [mode, script, style] = courseType?.split('-') || [];

  const courseData: { [key: string]: any } = {
    'brush-hangul-panbon': {
      title: '판본체 기초 (서예)',
      subtitle: '조선 궁중의 정갈한 판본체',
      totalLessons: 20,
      completedLessons: 13,
      currentLesson: 14,
      progress: 65,
      estimatedWeeks: 4,
      lessons: [
        { id: 1, title: '기본 자음 ㄱ, ㄴ, ㄷ', type: 'practice', status: 'completed', duration: '15분', score: 92 },
        { id: 2, title: '기본 자음 ㄹ, ㅁ, ㅂ', type: 'practice', status: 'completed', duration: '15분', score: 88 },
        { id: 3, title: '기본 자음 ㅅ, ㅇ, ㅈ', type: 'practice', status: 'completed', duration: '15분', score: 94 },
        { id: 4, title: '기본 자음 ㅊ, ㅋ, ㅌ, ㅍ, ㅎ', type: 'practice', status: 'completed', duration: '20분', score: 90 },
        { id: 5, title: '자음 종합 연습', type: 'practice', status: 'completed', duration: '25분', score: 86 },
        { id: 6, title: '기본 모음 ㅏ, ㅑ, ㅓ, ㅕ', type: 'practice', status: 'completed', duration: '15분', score: 91 },
        { id: 7, title: '기본 모음 ㅗ, ㅛ, ㅜ, ㅠ', type: 'practice', status: 'completed', duration: '15분', score: 89 },
        { id: 8, title: '기본 모음 ㅡ, ㅣ', type: 'practice', status: 'completed', duration: '10분', score: 93 },
        { id: 9, title: '모음 종합 연습', type: 'practice', status: 'completed', duration: '20분', score: 87 },
        { id: 10, title: '자음+모음 조합 1', type: 'practice', status: 'completed', duration: '20분', score: 92 },
        { id: 11, title: '자음+모음 조합 2', type: 'practice', status: 'completed', duration: '20분', score: 85 },
        { id: 12, title: '복합 자음 ㄲ, ㄸ, ㅃ, ㅆ, ㅉ', type: 'practice', status: 'completed', duration: '25분', score: 88 },
        { id: 13, title: '복합 모음 ㅐ, ㅒ, ㅔ, ㅖ', type: 'practice', status: 'completed', duration: '20분', score: 90 },
        { id: 14, title: '복합 모음 ㅘ, ㅙ, ㅚ', type: 'practice', status: 'current', duration: '20분' },
        { id: 15, title: '복합 모음 ㅝ, ㅞ, ㅟ, ㅢ', type: 'practice', status: 'locked', duration: '25분' },
        { id: 16, title: '받침 글자 연습 1', type: 'practice', status: 'locked', duration: '30분' },
        { id: 17, title: '받침 글자 연습 2', type: 'practice', status: 'locked', duration: '30분' },
        { id: 18, title: '단어 쓰기 연습', type: 'practice', status: 'locked', duration: '35분' },
        { id: 19, title: '문장 쓰기 연습', type: 'practice', status: 'locked', duration: '40분' },
        { id: 20, title: '최종 작품 제작', type: 'project', status: 'locked', duration: '60분' }
      ]
    },
    'brush-hanja-haeseo': {
      title: '해서체 기초 (서예)',
      subtitle: '한자 서예의 정석',
      totalLessons: 25,
      completedLessons: 8,
      currentLesson: 9,
      progress: 32,
      estimatedWeeks: 6,
      lessons: [
        { id: 1, title: '기본 획법 - 일(一)', type: 'practice', status: 'completed', duration: '20분', score: 94 },
        { id: 2, title: '기본 획법 - 이(二)', type: 'practice', status: 'completed', duration: '20분', score: 90 },
        { id: 3, title: '기본 획법 - 삼(三)', type: 'practice', status: 'completed', duration: '20분', score: 88 },
        { id: 4, title: '수직획 - 중(中)', type: 'practice', status: 'completed', duration: '25분', score: 92 },
        { id: 5, title: '점 획법 - 주(主)', type: 'practice', status: 'completed', duration: '25분', score: 87 },
        { id: 6, title: '굽은획 - 구(九)', type: 'practice', status: 'completed', duration: '25분', score: 89 },
        { id: 7, title: '복합획 - 천(天)', type: 'practice', status: 'completed', duration: '30분', score: 91 },
        { id: 8, title: '부수 학습 - 인변(亻)', type: 'theory', status: 'completed', duration: '15분', score: 95 },
        { id: 9, title: '부수 응용 - 사람 인(人)', type: 'practice', status: 'current', duration: '30분' },
        { id: 10, title: '부수 학습 - 나무 목(木)', type: 'theory', status: 'locked', duration: '15분' }
      ]
    },
    'test-hanja-grade8': {
      title: '한자능력시험 8급',
      subtitle: '기초 한자 50자 완벽 마스터',
      totalLessons: 10,
      completedLessons: 0,
      currentLesson: 1,
      progress: 0,
      estimatedWeeks: 5,
      lessons: [
        // 레슨 1: 숫자 한자 (1~5)
        { id: 1, title: '기초 숫자 (1) - 一, 二, 三, 四, 五', type: 'practice', status: 'current', duration: '25분', characters: ['一', '二', '三', '四', '五'], description: '하나부터 다섯까지의 기초 숫자 한자' },
        
        // 레슨 2: 숫자 한자 (6~10)
        { id: 2, title: '기초 숫자 (2) - 六, 七, 八, 九, 十', type: 'practice', status: 'locked', duration: '25분', characters: ['六', '七', '八', '九', '十'], description: '여섯부터 열까지의 숫자 한자' },
        
        // 레슨 3: 크기와 위치 (1)
        { id: 3, title: '크기와 위치 (1) - 大, 小, 中, 人, 上', type: 'practice', status: 'locked', duration: '25분', characters: ['大', '小', '中', '人', '上'], description: '크기와 기본 위치를 나타내는 한자들' },
        
        // 레슨 4: 방향과 위치 (2)
        { id: 4, title: '방향과 위치 (2) - 下, 左, 右, 前, 後', type: 'practice', status: 'locked', duration: '25분', characters: ['下', '左', '右', '前', '後'], description: '방향과 위치를 나타내는 한자들' },
        
        // 레슨 5: 자연과 땅
        { id: 5, title: '자연과 땅 - 山, 水, 火, 土, 地', type: 'practice', status: 'locked', duration: '25분', characters: ['山', '水', '火', '土', '地'], description: '자연과 땅을 나타내는 한자들' },
        
        // 레슨 6: 나무와 금속
        { id: 6, title: '나무와 금속 - 木, 金, 天, 月, 日', type: 'practice', status: 'locked', duration: '25분', characters: ['木', '金', '天', '月', '日'], description: '나무, 금속, 하늘과 시간 관련 한자' },
        
        // 레슨 7: 시간과 색깔
        { id: 7, title: '시간과 색깔 - 年, 時, 白, 黑, 靑', type: 'practice', status: 'locked', duration: '25분', characters: ['年', '時', '白', '黑', '靑'], description: '시간과 색깔을 나타내는 한자들' },
        
        // 레슨 8: 가족과 사람 (1)
        { id: 8, title: '가족과 사람 (1) - 男, 女, 子, 父, 母', type: 'practice', status: 'locked', duration: '25분', characters: ['男', '女', '子', '父', '母'], description: '가족 관계를 나타내는 기본 한자들' },
        
        // 레슨 9: 가족과 신체
        { id: 9, title: '가족과 신체 - 兄, 弟, 口, 手, 足', type: 'practice', status: 'locked', duration: '25분', characters: ['兄', '弟', '口', '手', '足'], description: '형제와 신체 부위를 나타내는 한자' },
        
        // 레슨 10: 신체와 기타
        { id: 10, title: '신체와 기타 - 目, 耳, 心, 門, 車', type: 'practice', status: 'locked', duration: '25분', characters: ['目', '耳', '心', '門', '車'], description: '눈, 귀, 마음과 일상 사물 한자' }
      ]
    }
  };

  const currentCourse = courseData[courseType || ''] || courseData['brush-hangul-panbon'];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'current':
        return <Play className="w-5 h-5 text-primary" />;
      case 'locked':
        return <Lock className="w-5 h-5 text-muted-foreground" />;
      default:
        return <div className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 border-emerald-200';
      case 'current':
        return 'bg-blue-50 border-blue-200 ring-2 ring-blue-100';
      case 'locked':
        return 'bg-muted/30 border-muted';
      default:
        return 'bg-white border-border';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'practice': return '연습';
      case 'theory': return '이론';
      case 'test': return '시험';
      case 'project': return '프로젝트';
      default: return '기타';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'practice':
        return 'bg-blue-100 text-blue-800';
      case 'theory':
        return 'bg-purple-100 text-purple-800';
      case 'test':
        return 'bg-red-100 text-red-800';
      case 'project':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLessonClick = (lesson: any) => {
    if (lesson.status === 'locked') return;
    
    if (lesson.status === 'completed') {
      // 완료된 레슨 - 복습 모드로 진입
      navigate(`/learn/${courseType}/lesson/${lesson.id}/practice?mode=review`);
    } else {
      // 현재 레슨 - 바로 연습 화면으로 이동
      navigate(`/learn/${courseType}/lesson/${lesson.id}/practice`);
    }
  };

  const handleCourseInfo = () => {
    navigate(`/learn/${courseType}/info`);
  };

  return (
    <div className="h-screen flex flex-col calligraphy-bg">
      {/* 헤더 */}
      <header className="flex-shrink-0 px-6 py-6 organic-header">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/learn`)}
              className="w-10 h-10 rounded-full bg-muted/40 hover:bg-muted/60 flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="text-center">
              <h1 className="font-medium text-primary ink-splash">{currentCourse.title}</h1>
              <p className="text-sm text-muted-foreground">{currentCourse.subtitle}</p>
            </div>
            <button
              onClick={handleCourseInfo}
              className="w-10 h-10 rounded-full bg-muted/40 hover:bg-muted/60 flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <Info className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        <div className="max-w-md mx-auto space-y-6">
          
          {/* 진행 상황 요약 */}
          <div className="handmade-card p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-primary">학습 진행 상황</h3>
                  <p className="text-xs text-muted-foreground">{currentCourse.estimatedWeeks}주 과정</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{currentCourse.progress}%</p>
                <p className="text-xs text-muted-foreground">완료</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">진행률</span>
                <span className="text-primary font-medium">
                  {currentCourse.completedLessons}/{currentCourse.totalLessons} 레슨
                </span>
              </div>
              <Progress value={currentCourse.progress} className="h-3" />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs font-medium text-emerald-800">완료</p>
                <p className="text-sm font-bold text-emerald-700">{currentCourse.completedLessons}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
                <Play className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <p className="text-xs font-medium text-blue-800">현재</p>
                <p className="text-sm font-bold text-blue-700">레슨 {currentCourse.currentLesson}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-gray-50 border border-gray-200">
                <Lock className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                <p className="text-xs font-medium text-gray-800">남은</p>
                <p className="text-sm font-bold text-gray-700">{currentCourse.totalLessons - currentCourse.completedLessons}</p>
              </div>
            </div>
          </div>

          {/* 레슨 목록 */}
          <div className="handmade-card p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-primary">커리큘럼</h3>
                <p className="text-xs text-muted-foreground">레슨을 클릭하여 시작하세요</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {currentCourse.lessons.map((lesson: any, index: number) => (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonClick(lesson)}
                  disabled={lesson.status === 'locked'}
                  className={`w-full p-4 rounded-xl border transition-all duration-300 text-left ${getStatusColor(lesson.status)} ${
                    lesson.status !== 'locked' ? 'hover:scale-102 cursor-pointer' : 'cursor-not-allowed opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(lesson.status)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-medium truncate ${
                          lesson.status === 'locked' ? 'text-muted-foreground' : 'text-primary'
                        }`}>
                          {lesson.id}. {lesson.title}
                        </h4>
                        <Badge variant="outline" className={`text-xs ${getTypeColor(lesson.type)}`}>
                          {getTypeLabel(lesson.type)}
                        </Badge>
                      </div>
                      
                      {lesson.description && (
                        <p className={`text-xs mb-2 ${lesson.status === 'locked' ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                          {lesson.description}
                        </p>
                      )}

                      {/* 한자 미리보기 */}
                      {lesson.characters && lesson.status !== 'locked' && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex gap-1">
                            {lesson.characters.map((char: string, idx: number) => (
                              <span key={idx} className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center text-sm font-medium text-primary">
                                {char}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{lesson.duration}</span>
                        </div>
                        {lesson.score && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            <span>{lesson.score}점</span>
                          </div>
                        )}
                        {lesson.status === 'current' && (
                          <Badge className="bg-blue-500 text-white text-xs px-2 py-0.5">
                            진행중
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {lesson.status !== 'locked' && (
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 성취 배지 */}
          <div className="handmade-card p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-primary">성취 배지</h3>
                <p className="text-xs text-muted-foreground">달성한 목표들</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 text-center">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs font-medium text-emerald-800">첫 레슨 완료</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 text-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs font-medium text-blue-800">10회 연속 연습</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};