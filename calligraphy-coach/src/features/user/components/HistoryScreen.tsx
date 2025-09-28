import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Calendar } from '../../../components/ui/calendar';
import { Badge } from '../../../components/ui/badge';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  BarChart3, 
  Clock, 
  TrendingUp,
  Star,
  Award,
  Filter,
  ChevronRight
} from 'lucide-react';

export const HistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filterType, setFilterType] = useState<'all' | 'hangeul' | 'hanja'>('all');

  // 임시 통계 데이터
  const statistics = {
    totalPracticeTime: 1250, // 분
    totalCharacters: 85,
    averageScore: 82,
    streakDays: 8,
    weeklyProgress: [65, 72, 78, 85, 88, 82, 87], // 7일간
    monthlyActivity: {
      '2024-12-15': 3,
      '2024-12-16': 2,
      '2024-12-17': 1,
      '2024-12-18': 4,
      '2024-12-19': 2,
      '2024-12-20': 3,
      '2024-12-21': 5
    }
  };

  const recentSessions = [
    {
      id: '1',
      date: '2024-12-21',
      time: '14:30',
      course: '판본체 기초',
      type: 'hangeul',
      characters: ['가', '나', '다'],
      averageScore: 85,
      practiceTime: 25,
      bestCharacter: '다',
      improvementNeeded: '가'
    },
    {
      id: '2',
      date: '2024-12-20',
      time: '19:15',
      course: '기초 한자 100',
      type: 'hanja',
      characters: ['人', '大', '小'],
      averageScore: 78,
      practiceTime: 20,
      bestCharacter: '大',
      improvementNeeded: '人'
    },
    {
      id: '3',
      date: '2024-12-20',
      time: '08:45',
      course: '판본체 기초',
      type: 'hangeul',
      characters: ['라', '마', '바'],
      averageScore: 92,
      practiceTime: 18,
      bestCharacter: '마',
      improvementNeeded: '바'
    },
    {
      id: '4',
      date: '2024-12-19',
      time: '16:20',
      course: '궁서체 입문',
      type: 'hangeul',
      characters: ['사', '아', '자'],
      averageScore: 74,
      practiceTime: 22,
      bestCharacter: '아',
      improvementNeeded: '사'
    }
  ];

  const filteredSessions = recentSessions.filter(session => {
    if (filterType === 'all') return true;
    return session.type === filterType;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="px-6 py-4 border-b bg-card/50">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/home')}
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-medium text-primary">학습 기록</h1>
            <p className="text-sm text-muted-foreground">당신의 서예 여정을 확인하세요</p>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="px-6 py-6 pb-32">
        <div className="max-w-md mx-auto space-y-6">
          {/* 통계 카드들 */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">총 연습시간</p>
              <p className="font-medium text-primary">{formatTime(statistics.totalPracticeTime)}</p>
            </Card>
            
            <Card className="p-4 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">평균 점수</p>
              <p className="font-medium text-primary">{statistics.averageScore}점</p>
            </Card>
            
            <Card className="p-4 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">연속 학습</p>
              <p className="font-medium text-primary">{statistics.streakDays}일</p>
            </Card>
            
            <Card className="p-4 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">완성 글자</p>
              <p className="font-medium text-primary">{statistics.totalCharacters}개</p>
            </Card>
          </div>

          {/* 탭 네비게이션 */}
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="history" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                기록
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                달력
              </TabsTrigger>
            </TabsList>

            {/* 기록 탭 */}
            <TabsContent value="history" className="space-y-4">
              {/* 필터 */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <div className="flex gap-2">
                  <Button
                    variant={filterType === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('all')}
                  >
                    전체
                  </Button>
                  <Button
                    variant={filterType === 'hangeul' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('hangeul')}
                  >
                    한글
                  </Button>
                  <Button
                    variant={filterType === 'hanja' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('hanja')}
                  >
                    한자
                  </Button>
                </div>
              </div>

              {/* 세션 리스트 */}
              <div className="space-y-3">
                {filteredSessions.map((session) => (
                  <Card key={session.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="space-y-3">
                      {/* 헤더 */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-primary">{session.course}</h3>
                          <p className="text-xs text-muted-foreground">
                            {session.date} {session.time} • {session.practiceTime}분
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getScoreColor(session.averageScore)}`}
                          >
                            평균 {session.averageScore}점
                          </Badge>
                        </div>
                      </div>

                      {/* 연습한 글자들 */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">연습 글자:</span>
                        <div className="flex gap-2">
                          {session.characters.map((char, index) => (
                            <span 
                              key={index}
                              className="w-8 h-8 bg-muted/50 rounded flex items-center justify-center text-sm font-medium text-primary"
                            >
                              {char}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 성과 요약 */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-muted-foreground">잘한 글자:</span>
                          <span className="font-medium text-green-700">{session.bestCharacter}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-orange-500" />
                          <span className="text-muted-foreground">개선 필요:</span>
                          <span className="font-medium text-orange-700">{session.improvementNeeded}</span>
                        </div>
                      </div>
                    </div>
                    
                    <ChevronRight className="w-4 h-4 text-muted-foreground absolute top-4 right-4" />
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* 달력 탭 */}
            <TabsContent value="calendar" className="space-y-4">
              <Card className="p-6">
                <h3 className="font-medium text-primary mb-4 text-center">학습 활동 달력</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border w-full"
                />
                <div className="mt-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    색이 진할수록 더 많이 연습한 날입니다
                  </p>
                </div>
              </Card>

              {/* 주간 진도 그래프 */}
              <Card className="p-6">
                <h3 className="font-medium text-primary mb-4">주간 평균 점수</h3>
                <div className="space-y-2">
                  {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
                    <div key={day} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-4">{day}</span>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${statistics.weeklyProgress[index]}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-primary w-8 text-right">
                        {statistics.weeklyProgress[index]}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t px-6 py-3">
        <div className="flex justify-around max-w-md mx-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-col gap-1 text-muted-foreground"
            onClick={() => navigate('/home')}
          >
            <CalendarIcon className="w-5 h-5" />
            <span className="text-xs">홈</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-col gap-1 text-muted-foreground"
            onClick={() => navigate('/learn')}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs">학습</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col gap-1 text-primary">
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs">기록</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-col gap-1 text-muted-foreground"
            onClick={() => navigate('/settings')}
          >
            <Award className="w-5 h-5" />
            <span className="text-xs">설정</span>
          </Button>
        </div>
      </nav>
    </div>
  );
};