/**
 * 🏠 Home 컴포넌트 - 메인 홈 화면
 * 
 * 📋 주요 기능:
 * - 사용자 현재 진도 표시
 * - 빠른 연습 시작 (이어서 하기 / 새로 시작하기)
 * - 이번 주 통계 요약
 * - 최근 연습 기록 (성취 배지 포함)
 * - 최고 기록 위젯 (역대 최고 / 이번 주 최고 / 향상 기록)
 * - WeeklyStatsDetails 팝업 연동
 * - 하단 네비게이션 (5개 탭)
 * 
 * 🎨 디자인: 젠 스타일 미니멀 디자인
 * 📱 반응형: 모바일 우선 (max-w-md)
 * 🔗 연동: WeeklyStatsDetails, AuthContext
 * 
 * 📅 최종 수정: 2024-12-22
 * 🐛 수정사항: WeeklyStatsDetails props 연동 수정
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Progress } from '../../../components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { useAuth } from '../../../contexts/AuthContext';
import { useDataStore } from '../../../store/useDataStore';
import { WeeklyStatsDetails } from '../../../shared/components/widgets/WeeklyStatsDetails';
import { 
  Settings, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Calendar,
  Play,
  RotateCcw,
  Award,
  ChevronRight,
  Trophy,
  Target,
  Crown,
  Sparkles,
  Users,
  PenTool,
  Activity,
  Home as HomeIcon
} from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  
  // 데이터 스토어에서 실제 데이터 가져오기
  const {
    isLoading,
    userProgress,
    recentSessions,
    weeklyStats,
    personalBests,
    loadUserData
  } = useDataStore();

  // 🔧 사용자 설정 확인 (로컬스토리지 기반)
  const userPreferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
  const isFirstTime = !userPreferences.mode;

  // 컴포넌트 마운트 시 사용자 데이터 로드
  useEffect(() => {
    if (user?.id) {
      loadUserData(user.id);
    }
  }, [user?.id, loadUserData]);

  // 로딩 중이거나 데이터가 없을 때 기본값 사용
  const currentUserProgress = userProgress || {
    currentCourse: "판본체 기초",
    progress: 0,
    currentLesson: "기본 자음 연습",
    completedLessons: 0,
    totalLessons: 20
  };

  const currentWeeklyStats = weeklyStats || {
    practiceTime: 0,
    averageScore: 0,
    streakDays: 0,
    completedCharacters: 0
  };

  const currentPersonalBests = personalBests || {
    allTimeHigh: 0,
    allTimeHighCharacter: '',
    allTimeHighDate: '',
    weeklyHigh: 0,
    weeklyHighCharacter: '',
    weeklyHighDate: '',
    improvedCharacter: '',
    improvementPercent: 0
  };

  // 🚀 빠른 시작 핸들러 (현재 진도 이어받기)
  const handleQuickStart = () => {
    navigate('/practice/continue'); // 현재 진도 이어받기
  };

  // 📚 새로운 연습 시작 핸들러
  // 첫 사용자: 튜토리얼 → 기존 사용자: 코스 선택
  const handleNewPractice = () => {
    if (isFirstTime) {
      navigate('/guide/tutorial');
    } else {
      navigate('/learn');
    }
  };

  // 로딩 중일 때 스켈레톤 UI 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center justify-between max-w-md mx-auto px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
              <div className="space-y-1">
                <div className="w-24 h-4 bg-muted rounded animate-pulse" />
                <div className="w-32 h-3 bg-muted rounded animate-pulse" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-9 h-9 bg-muted rounded animate-pulse" />
              <div className="w-9 h-9 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </header>
        <main className="max-w-md mx-auto px-6 py-6 pb-24 space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="space-y-3">
                <div className="w-32 h-5 bg-muted rounded animate-pulse" />
                <div className="w-full h-4 bg-muted rounded animate-pulse" />
                <div className="w-3/4 h-4 bg-muted rounded animate-pulse" />
              </div>
            </Card>
          ))}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 상단 네비게이션 */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-md mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.profileImage} />
              <AvatarFallback className="bg-muted text-foreground">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-medium text-foreground">안녕하세요, {user?.name}님</h1>
              <p className="text-sm text-muted-foreground">오늘도 함께 연습해요</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* 관리자 어드민 버튼 */}
            <Button
              variant="outline"
              size="sm" 
              onClick={() => navigate('/admin')}
              className="w-9 h-9 p-0"
              title="관리자 대시보드"
            >
              <span className="text-xs">관</span>
            </Button>
            
            {/* 설정 버튼 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/settings')}
              className="w-9 h-9 p-0"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-md mx-auto px-6 py-6 pb-24 space-y-6">
        
        {/* 현재 진도 카드 */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium text-foreground">{currentUserProgress.currentCourse}</h2>
              <p className="text-sm text-muted-foreground">{currentUserProgress.currentLesson}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
              <span className="text-lg font-medium">가</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">진행률</span>
              <span className="text-foreground font-medium">{currentUserProgress.progress}%</span>
            </div>
            <Progress value={currentUserProgress.progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {currentUserProgress.completedLessons}/{currentUserProgress.totalLessons} 레슨 완료 • 현재 학습 진도
            </p>
          </div>
        </Card>

        {/* 이어서 연습하기 버튼 */}
        <Button
          onClick={handleQuickStart}
          className="w-full h-16 justify-between text-left"
          size="lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
              <Play className="w-5 h-5" />
            </div>
            <div>
              <div className="font-medium">이어서 연습하기</div>
              <div className="text-sm opacity-80">⚡ 현재 진도에서 바로 시작!</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5" />
        </Button>

        {/* 새로 시작하기 버튼 */}
        <Button
          onClick={handleNewPractice}
          variant="outline"
          className="w-full h-16 justify-between text-left"
          size="lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="font-medium">
                {isFirstTime ? '서예 여정 시작하기' : '새로운 서체 탐험하기'}
              </div>
              <div className="text-sm text-muted-foreground">
                {isFirstTime ? '🎯 맞춤 설정으로 시작해요!' : '✨ 한국 전통 궁체 새로 출시!'}
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5" />
        </Button>

        {/* 테스트 링크 - 황자원 92법 */}
        <Card className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">황자원 92법 3레벨 평가 테스트</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
                onClick={() => {
                  navigate('/practice/hwang92-sebeop/h92-01', {
                    state: {
                      courseId: 'hwang92-sebeop',
                      lessonId: 'h92-01',
                      lessonTitle: '천복자',
                      fontStyle: '해서체',
                      mode: 'photo',
                      characters: [{ character: '宇', type: '천복자' }]
                    }
                  });
                }}
              >
                🖌️ 실물 모드 (해서체)
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
                onClick={() => {
                  navigate('/practice/hwang92-sebeop/h92-01', {
                    state: {
                      courseId: 'hwang92-sebeop',
                      lessonId: 'h92-01',
                      lessonTitle: '천복자',
                      mode: 'canvas',
                      characters: [{ character: '宇', type: '천복자' }]
                    }
                  });
                }}
              >
                📱 디지털 모드
              </Button>
            </div>
          </div>
        </Card>

        {/* 이번 주 통계 */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground">이번 주 통계</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsStatsOpen(true)}
              className="text-sm"
            >
              자세히 →
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>연습 시간</span>
              </div>
              <p className="text-xl font-medium">{Math.floor(currentWeeklyStats.practiceTime / 60)}시간</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Target className="w-4 h-4" />
                <span>평균 점수</span>
              </div>
              <p className="text-xl font-medium">{Math.round(currentWeeklyStats.averageScore)}점</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Activity className="w-4 h-4" />
                <span>연속 연습</span>
              </div>
              <p className="text-xl font-medium">{currentWeeklyStats.streakDays}일</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <PenTool className="w-4 h-4" />
                <span>완성 글자</span>
              </div>
              <p className="text-xl font-medium">{currentWeeklyStats.completedCharacters}개</p>
            </div>
          </div>
        </Card>

        {/* 최근 연습 기록 */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground">최근 연습 기록</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/history')}
              className="text-sm"
            >
              전체보기 →
            </Button>
          </div>
          
          <div className="space-y-3">
            {recentSessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <PenTool className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">아직 연습 기록이 없어요</p>
                <p className="text-xs">첫 연습을 시작해보세요!</p>
              </div>
            ) : (
              recentSessions.map((session) => {
              // 점수에 따른 색상 및 등급 결정
              const getScoreGrade = (score: number) => {
                if (score >= 90) return { grade: 'S', color: 'amber' };
                if (score >= 80) return { grade: 'A', color: 'emerald' };
                if (score >= 70) return { grade: 'B', color: 'blue' };
                return { grade: 'C', color: 'slate' };
              };
              
              const scoreInfo = getScoreGrade(session.score);
              
              return (
                <div 
                  key={session.id} 
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors group"
                  onClick={() => navigate(`/result/${session.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center relative">
                      <span className="font-medium">{session.character}</span>
                      {/* 등급 배지 */}
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-foreground flex items-center justify-center text-xs font-bold text-background">
                        {scoreInfo.grade}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{session.course}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{session.date}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{session.timeSpent}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-sm font-medium">{session.score}점</p>
                      {session.id === '1' && session.score >= 85 && (
                        <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                          <TrendingUp className="w-3 h-3" />
                          <span>Good!</span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/practice/session1');
                      }}
                      className="w-8 h-8 p-0"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            }))}
          </div>
        </Card>

        {/* 최고 기록 */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <h3 className="font-medium text-foreground">최고 기록</h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/history')}
              className="text-sm"
            >
              기록 보기 →
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* 역대 최고 점수 */}
            <div 
              className="p-4 rounded-lg bg-amber-50 border border-amber-200 cursor-pointer hover:bg-amber-100 transition-colors"
              onClick={() => navigate('/history')}
            >
              <div className="text-center space-y-2">
                <Trophy className="w-8 h-8 text-amber-600 mx-auto" />
                <div>
                  <p className="text-xs text-amber-700">역대 최고</p>
                  <p className="text-xl font-bold text-amber-800">{currentPersonalBests.allTimeHigh || 0}점</p>
                  <div className="flex items-center justify-center gap-1 text-xs text-amber-600">
                    <span className="w-6 h-6 rounded bg-amber-100 flex items-center justify-center font-medium text-amber-800">
                      {currentPersonalBests.allTimeHighCharacter || '-'}
                    </span>
                    <span>글자</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 이번 주 최고 점수 */}
            <div 
              className="p-4 rounded-lg bg-rose-50 border border-rose-200 cursor-pointer hover:bg-rose-100 transition-colors"
              onClick={() => navigate('/history')}
            >
              <div className="text-center space-y-2">
                <Sparkles className="w-8 h-8 text-rose-600 mx-auto" />
                <div>
                  <p className="text-xs text-rose-700">이번 주 최고</p>
                  <p className="text-xl font-bold text-rose-800">{currentPersonalBests.weeklyHigh || 0}점</p>
                  <div className="flex items-center justify-center gap-1 text-xs text-rose-600">
                    <span className="w-6 h-6 rounded bg-rose-100 flex items-center justify-center font-medium text-rose-800">
                      {currentPersonalBests.weeklyHighCharacter || '-'}
                    </span>
                    <span>글자</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 향상 기록 */}
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-emerald-800">가장 많이 향상된 글자</p>
                  <p className="text-xs text-emerald-600">{currentPersonalBests.improvementPercent || 0}% 향상</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded bg-emerald-100 flex items-center justify-center">
                <span className="font-medium text-emerald-800">{currentPersonalBests.improvedCharacter || '-'}</span>
              </div>
            </div>
          </div>
        </Card>
      </main>

      {/* 하단 네비게이션 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t">
        <div className="max-w-md mx-auto px-6 py-3">
          <div className="flex items-center justify-around">
            <button 
              onClick={() => navigate('/home')}
              className="flex flex-col items-center gap-1 text-primary p-2"
            >
              <HomeIcon className="w-6 h-6" />
              <span className="text-xs font-medium">홈</span>
            </button>
            
            <button 
              onClick={() => navigate('/learn')}
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors p-2"
            >
              <BookOpen className="w-6 h-6" />
              <span className="text-xs">학습</span>
            </button>
            
            <button 
              onClick={() => navigate('/history')}
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors p-2"
            >
              <Activity className="w-6 h-6" />
              <span className="text-xs">기록</span>
            </button>
            
            <button 
              onClick={() => navigate('/community')}
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors p-2"
            >
              <Users className="w-6 h-6" />
              <span className="text-xs">커뮤니티</span>
            </button>
            
            <button 
              onClick={() => navigate('/settings')}
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors p-2"
            >
              <Settings className="w-6 h-6" />
              <span className="text-xs">설정</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 📈 주간 통계 상세 모달 */}
      {/* 🐛 수정: onClose → onOpenChange로 props 수정 (2024-12-22) */}
      <WeeklyStatsDetails 
        isOpen={isStatsOpen}
        onOpenChange={setIsStatsOpen}
        stats={currentWeeklyStats}
      />
    </div>
  );
};