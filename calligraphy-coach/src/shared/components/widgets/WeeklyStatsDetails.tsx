/**
 * 📊 WeeklyStatsDetails 컴포넌트 - 주간 통계 상세 모달
 * 
 * 📋 주요 기능:
 * - 최근 10일간의 학습 데이터 시각화
 * - 연속 학습 현황 (스트릭 시스템)
 * - 일별 연습시간, 점수 변화, 완성 글자 수 차트
 * - 동기부여 액션 버튼들
 * - 격려 메시지 및 성취 배지
 * 
 * 🎨 디자인: Sheet(바텀 시트) 기반의 모바일 친화적 모달
 * 📈 차트: Recharts 라이브러리 사용
 * 🔗 내비게이션: 각 액션 버튼에서 관련 페이지로 이동
 * 
 * 📅 최종 수정: 2024-12-22
 * 🐛 수정사항: props 인터페이스 수정 (onClose → onOpenChange)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../../../components/ui/sheet';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Clock, Award, Calendar, BookOpen, TrendingUp, Flame, PlayCircle, ArrowRight, Sparkles } from 'lucide-react';

/**
 * 🔧 Props 인터페이스
 * 
 * @param isOpen - 모달 열림/닫힘 상태
 * @param onOpenChange - Sheet 컴포넌트와 호환되는 상태 변경 함수
 * @param stats - 선택적 통계 데이터 (기본값: 내부 모의 데이터 사용)
 */
interface WeeklyStatsDetailsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void; // 🐛 수정: onClose → onOpenChange
  stats?: {
    practiceTime: number;
    averageScore: number;
    streakDays: number;
    completedCharacters: number;
  };
}

export const WeeklyStatsDetails: React.FC<WeeklyStatsDetailsProps> = ({
  isOpen,
  onOpenChange,
  stats
}) => {
  const navigate = useNavigate();
  
  // 📊 최근 10일간의 모의 데이터
  // TODO: 실제 API 연동 시 이 부분을 실제 데이터로 교체
  // 현재는 사용자 경험 테스트를 위한 샘플 데이터
  const dailyData = [
    { date: '12/12', time: 25, score: 78, characters: 2, streak: true },
    { date: '12/13', time: 30, score: 82, characters: 3, streak: true },
    { date: '12/14', time: 0, score: 0, characters: 0, streak: false },
    { date: '12/15', time: 45, score: 88, characters: 4, streak: false },
    { date: '12/16', time: 35, score: 85, characters: 3, streak: true },
    { date: '12/17', time: 40, score: 90, characters: 4, streak: true },
    { date: '12/18', time: 28, score: 83, characters: 2, streak: true },
    { date: '12/19', time: 50, score: 92, characters: 5, streak: true },
    { date: '12/20', time: 35, score: 87, characters: 3, streak: true },
    { date: '12/21', time: 42, score: 89, characters: 4, streak: true },
  ];

  const totalTime = dailyData.reduce((sum, day) => sum + day.time, 0);
  const avgScore = Math.round(dailyData.reduce((sum, day) => sum + day.score, 0) / dailyData.filter(d => d.score > 0).length);
  const totalCharacters = dailyData.reduce((sum, day) => sum + day.characters, 0);
  const currentStreak = dailyData.slice(-5).every(d => d.streak) ? 5 : dailyData.slice(-3).every(d => d.streak) ? 3 : 0;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] p-0 bg-background">
        <div className="h-full overflow-y-auto">
          <SheetHeader className="p-6 pb-4 border-b bg-card/50">
            <SheetTitle className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-medium">나의 성장 여정</h2>
                <p className="text-sm text-muted-foreground">최근 10일간의 학습 분석</p>
              </div>
            </SheetTitle>
            <SheetDescription className="sr-only">
              최근 10일간의 서예 연습 통계와 성장 분석을 확인할 수 있는 상세 화면입니다. 연습시간, 점수 변화, 연속 학습 현황 등을 차트로 시각화하여 보여줍니다.
            </SheetDescription>
          </SheetHeader>

          <div className="px-6 space-y-6 pb-24">
            {/* 연속 학습 현황 */}
            <div className="bg-card rounded-lg border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">연속 학습 현황</h3>
                    <p className="text-xs text-muted-foreground">불타는 열정을 유지해요!</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-2xl">{currentStreak}일</p>
                  <p className="text-xs text-muted-foreground">현재 연속</p>
                </div>
              </div>

              <div className="grid grid-cols-10 gap-1">
                {dailyData.map((day, index) => (
                  <div key={index} className="text-center">
                    <div 
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                        day.streak 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {day.streak ? '🔥' : '😴'}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{day.date.split('/')[1]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 연속 학습 동기부여 액션 */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onOpenChange(false);
                  navigate('/practice/continue');
                }}
                className="flex-1 bg-card rounded-lg border p-4 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                    <Flame className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">수업 이어하기</p>
                    <p className="text-xs text-muted-foreground">불타는 열정을 계속!</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>

            {/* 요약 통계 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card rounded-lg border p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs text-muted-foreground">총 연습시간</span>
                </div>
                <p className="font-bold text-lg">{Math.floor(totalTime / 60)}시간 {totalTime % 60}분</p>
                <p className="text-xs text-muted-foreground mt-1">하루 평균 {Math.round(totalTime / 10)}분</p>
              </div>

              <div className="bg-card rounded-lg border p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Award className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-xs text-muted-foreground">평균 점수</span>
                </div>
                <p className="font-bold text-lg">{avgScore}점</p>
                <p className="text-xs text-muted-foreground mt-1">꾸준히 성장 중!</p>
              </div>
            </div>

            {/* 오늘 연습 시작하기 액션 */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onOpenChange(false);
                  navigate('/learn');
                }}
                className="flex-1 bg-card rounded-lg border p-4 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <PlayCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">오늘도 연습하기</p>
                    <p className="text-xs text-muted-foreground">성장을 멈추지 않아요!</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>

            {/* 일별 연습시간 차트 */}
            <div className="bg-card rounded-lg border p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">일별 연습시간</h3>
                  <p className="text-xs text-muted-foreground">매일 조금씩, 꾸준히 성장해요</p>
                </div>
              </div>
              
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyData}>
                    <defs>
                      <linearGradient id="timeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                      label={{ value: '분', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5E5E5',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value) => [`${value}분`, '연습시간']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="time" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      fill="url(#timeGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 점수 변화 차트 */}
            <div className="bg-card rounded-lg border p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Award className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-medium">점수 변화</h3>
                  <p className="text-xs text-muted-foreground">실력이 계속 향상되고 있어요!</p>
                </div>
              </div>
              
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyData.filter(d => d.score > 0)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(245, 158, 11, 0.1)" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                    />
                    <YAxis 
                      domain={[70, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                      label={{ value: '점수', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5E5E5',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value) => [`${value}점`, '점수']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#F59E0B"
                      strokeWidth={2}
                      dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#D97706' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 완성 글자 수 */}
            <div className="bg-card rounded-lg border p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">일별 완성 글자</h3>
                  <p className="text-xs text-muted-foreground">창작의 흔적들이 쌓이고 있어요</p>
                </div>
              </div>
              
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(147, 51, 234, 0.1)" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                      label={{ value: '글자수', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5E5E5',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value) => [`${value}개`, '완성 글자']}
                    />
                    <Bar 
                      dataKey="characters" 
                      fill="#A855F7"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 실력 향상 계속하기 액션 */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onOpenChange(false);
                  navigate('/learn');
                }}
                className="flex-1 bg-card rounded-lg border p-4 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">실력 향상 계속하기</p>
                    <p className="text-xs text-muted-foreground">더 멋진 작품을 만들어요!</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>

            {/* 격려 메시지 */}
            <div className="bg-card rounded-lg border p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-medium">축하해요! 🎉</h3>
                <div className="space-y-2">
                  <p className="text-base text-muted-foreground">
                    벌써 <span className="font-bold text-foreground">{totalCharacters}개</span>의 글자를 완성하고,
                    <span className="font-bold text-foreground"> {Math.floor(totalTime / 60)}시간</span>을 투자하며 성장했어요!
                  </p>
                  <p className="text-emerald-600 font-medium">
                    🌟 계속해서 멋진 서예가의 길을 걸어가세요! 🌟
                  </p>
                </div>
                {/* 성취 배지들 */}
                <div className="flex justify-center gap-2 mt-4">
                  <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                    열정가 🔥
                  </div>
                  <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                    성장왕 📈
                  </div>
                  <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    창작자 🎨
                  </div>
                </div>
              </div>
            </div>

            {/* 새로운 도전 시작하기 */}
            <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm pt-4">
              <button
                onClick={() => {
                  onOpenChange(false);
                  navigate('/learn');
                }}
                className="w-full bg-primary text-primary-foreground rounded-lg p-4 hover:bg-primary/90 transition-colors"
              >
                <div className="flex items-center justify-center gap-3">
                  <BookOpen className="w-5 h-5" />
                  <span className="font-medium">새로운 도전 시작하기</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};