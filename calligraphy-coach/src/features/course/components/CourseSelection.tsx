/**
 * 📚 CourseSelection 컴포넌트 - 코스 선택 화면
 * 
 * 📋 주요 기능:
 * - 3가지 코스 탭: 서예(붓글씨), 펜글씨, 한자능력시험 특별판
 * - 각 코스별 난이도, 예상시간, 진행률 표시
 * - 학습 분량 설정 (5-20개 글자)
 * - 코스 선택 시 시작 버튼 활성화
 * - 하단 네비게이션 (학습 탭 활성화)
 * 
 * 🎨 디자인: 젠 스타일 미니멀 디자인, 카드 기반 레이아웃
 * 📱 반응형: 모바일 우선 (max-w-md)
 * 🔗 네비게이션: 코스 정보 → 커리큘럼 → 연습 화면 플로우
 * 
 * 📅 최종 수정: 2024-12-22
 * 🆕 추가사항: 하단 네비게이션 바 추가, 학습 탭 활성화
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Slider } from '../../../components/ui/slider';
import { Badge } from '../../../components/ui/badge';
import { ImageWithFallback } from '../../../components/figma/ImageWithFallback';
import { 
  ArrowLeft, 
  Clock, 
  Star, 
  BookOpen, 
  Users,
  Play,
  ChevronRight,
  Brush,
  PenTool,
  GraduationCap,
  Award,
  Target,
  Home as HomeIcon,
  Activity,
  Settings
} from 'lucide-react';

export const CourseSelection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState([10]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  // 🖌️ 서예 (붓글씨) 코스 데이터
  // 전통 한국 서예의 주요 서체들을 체계적으로 학습
  const brushCourses = {
    hangul: [
      {
        id: 'brush-panbon',
        title: '판본체 기초',
        description: '조선 궁중의 정갈한 판본체를 배워보세요',
        difficulty: '초급',
        characterCount: 40,
        estimatedTime: '4주',
        progress: 0,
        isRecommended: true,
        style: '판본체'
      },
      {
        id: 'brush-gungseo',
        title: '궁서체 정통',
        description: '조선 궁중에서 사용된 아름다운 궁서체를 붓과 먹으로 익히는 정통 서예 과정',
        difficulty: '중급',
        characterCount: 70,
        estimatedTime: '11레슨',
        progress: 0,
        isRecommended: false,
        style: '궁서체'
      }
    ],
    hanja: [
      {
        id: 'hwang92-sebeop',
        title: '황자원 92 서법',
        description: '황자원의 간가결구 구십이법으로 배우는 한자 서예의 기본 구조',
        difficulty: '중급',
        characterCount: 16,
        estimatedTime: '4레슨',
        progress: 0,
        isRecommended: true,
        style: '해서체'
      }
    ]
  };

  // 🎓 한자능력시험 코스 데이터 - 준비 중
  const hanjaTestCourses = {
    grade8: []  // 준비 중
  };

  // ✒️ 펜글씨 (캘리그라피) 코스 데이터
  // K-Culture 코스만 활성화
  const penCourses = {
    hangul: [
      {
        id: 'pen-hangul-kculture',
        title: 'K-Culture 한글 쓰기',
        description: 'K-pop, 드라마, 한식 등 인기 한국 문화 단어로 재미있게 한글 배우기',
        difficulty: '초급',
        characterCount: 215,
        estimatedTime: '12 레슨',
        progress: 0,
        isRecommended: true,
        style: 'K-Culture'
      }
    ],
    hanja: []  // 한자 코스는 준비 중
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '초급': return 'bg-green-100 text-green-800 border-green-200';
      case '중급': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case '고급': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStartCourse = () => {
    if (selectedCourse) {
      // CourseDetail 컴포넌트로 직접 이동
      navigate(`/course/${selectedCourse}`);
    }
  };

  const CourseCard = ({ course, isSelected, onSelect, courseType }: any) => (
    <div 
      className={`handmade-card p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
        isSelected 
          ? 'ring-2 ring-primary/50 bg-gradient-to-br from-primary/10 to-primary/5' 
          : 'hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/2'
      }`}
      onClick={() => {
        // 붓글씨 코스는 바로 상세 페이지로 이동
        if (courseType === 'brush') {
          navigate(`/course/${course.id}`);
        } else {
          onSelect(course.id);
        }
      }}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium text-primary ink-splash">{course.title}</h3>
              {course.isRecommended && (
                <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-2 py-1 text-xs rounded-full">
                  추천
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{course.description}</p>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{course.characterCount}글자</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{course.estimatedTime}</span>
              </div>
            </div>

            {/* 서체 스타일 표시 */}
            <div className={`inline-block px-3 py-1 rounded-full ${
              course.style === '시험 대비' 
                ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200'
                : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200'
            }`}>
              <span className={`text-xs font-medium ${
                course.style === '시험 대비' ? 'text-purple-700' : 'text-blue-700'
              }`}>{course.style}</span>
            </div>
          </div>
          
          <Badge 
            variant="outline" 
            className={`text-xs ml-3 ${getDifficultyColor(course.difficulty)}`}
          >
            {course.difficulty}
          </Badge>
        </div>

        {course.progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">진행률</span>
              <span className="text-primary font-medium">{course.progress}%</span>
            </div>
            <div className="w-full bg-muted/50 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        )}

        {course.features && (
          <div className="space-y-2">
            <h4 className="text-xs text-muted-foreground font-medium">포함 내용</h4>
            <div className="flex flex-wrap gap-1">
              {course.features.map((feature: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {isSelected && (
          <div className="flex items-center justify-between pt-3 border-t border-primary/20">
            <span className="text-sm text-primary font-medium">선택됨</span>
            <ChevronRight className="w-4 h-4 text-primary" />
          </div>
        )}
      </div>
    </div>
  );

  const CourseSection = ({ title, courses, icon: Icon, iconColor }: any) => (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${iconColor} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-lg font-medium text-primary ink-splash">{title}</h2>
        </div>
      </div>

      {/* 한글 서법 */}
      {courses.hangul && courses.hangul.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-primary flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            한글 서법
          </h3>
          <div className="space-y-4">
            {courses.hangul.map((course: any) => (
              <CourseCard
                key={course.id}
                course={course}
                isSelected={selectedCourse === course.id}
                onSelect={setSelectedCourse}
                courseType={title === '전통 서예' ? 'brush' : 'pen'}
              />
            ))}
          </div>
        </div>
      )}

      {/* 한자 서법 */}
      {courses.hanja && courses.hanja.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-primary flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            한자 서법
          </h3>
          <div className="space-y-4">
            {courses.hanja.map((course: any) => (
              <CourseCard
                key={course.id}
                course={course}
                isSelected={selectedCourse === course.id}
                onSelect={setSelectedCourse}
                courseType={title === '전통 서예' ? 'brush' : 'pen'}
              />
            ))}
          </div>
        </div>
      )}

      {/* 준비 중 메시지 */}
      {(!courses.hangul || courses.hangul.length === 0) && (!courses.hanja || courses.hanja.length === 0) && (
        <div className="handmade-card p-6 text-center text-muted-foreground">
          <p>코스가 준비 중입니다.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen flex flex-col calligraphy-bg">
      {/* 헤더 */}
      <header className="flex-shrink-0 px-6 py-6 organic-header">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/home')}
              className="w-10 h-10 rounded-full bg-muted/40 hover:bg-muted/60 flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="text-center">
              <h1 className="font-medium text-primary ink-splash">코스 선택</h1>
              <p className="text-sm text-muted-foreground">어떤 서예를 배워볼까요?</p>
            </div>
            <div className="w-10 h-10" />
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 overflow-y-auto px-6 py-6 pb-32">
        <div className="max-w-md mx-auto space-y-6">
          {/* 코스 탭 */}
          <Tabs defaultValue="brush" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/30 p-1 rounded-xl">
              <TabsTrigger 
                value="brush" 
                className="flex items-center gap-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs"
              >
                <Brush className="w-4 h-4" />
                <span>서예</span>
              </TabsTrigger>
              <TabsTrigger 
                value="pen" 
                className="flex items-center gap-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs"
              >
                <PenTool className="w-4 h-4" />
                <span>펜글씨</span>
              </TabsTrigger>
              <TabsTrigger 
                value="test" 
                className="flex items-center gap-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs"
              >
                <GraduationCap className="w-4 h-4" />
                <span>특별판</span>
              </TabsTrigger>
            </TabsList>

            {/* 서예 (붓글씨) 코스 */}
            <TabsContent value="brush" className="space-y-6">
              <CourseSection 
                title="전통 서예"
                courses={brushCourses}
                icon={Brush}
                iconColor="from-amber-500 to-orange-600"
              />
            </TabsContent>

            {/* 펜글씨 코스 */}
            <TabsContent value="pen" className="space-y-6">
              <CourseSection 
                title="모던 캘리그라피"
                courses={penCourses}
                icon={PenTool}
                iconColor="from-blue-500 to-indigo-600"
              />
            </TabsContent>

            {/* 한자능력시험 코스 */}
            <TabsContent value="test" className="space-y-6">
              <div className="space-y-6">
                <div className="text-center space-y-2 mb-6">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-lg font-medium text-primary ink-splash">한자능력시험 특별판</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">체계적인 한자 학습으로 자격증 취득까지!</p>
                </div>

                {/* 준비 중 안내 */}
                <div className="handmade-card p-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-200 to-indigo-200 flex items-center justify-center mx-auto">
                      <Target className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-medium text-primary">한자능력시험 코스 준비 중</h3>
                    <p className="text-sm text-muted-foreground">
                      한자능력시험 8급부터 차근차근 학습할 수 있는 특별 코스를 준비하고 있습니다.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <Award className="w-4 h-4" />
                      <span>2025년 1월 출시 예정</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* 학습 분량 설정 */}
          <div className="handmade-card p-6 space-y-5">
            <h3 className="font-medium text-primary ink-splash">학습 분량 설정</h3>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">연습할 글자 수</span>
                  <span className="text-lg font-medium text-primary">{selectedAmount[0]}개</span>
                </div>
                <Slider
                  value={selectedAmount}
                  onValueChange={setSelectedAmount}
                  max={20}
                  min={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5개 (빠르게)</span>
                  <span>20개 (충분히)</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-blue-700">
                  예상 시간: {Math.ceil(selectedAmount[0] * 2)}분
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 🧭 하단 네비게이션 */}
      {/* 🆕 v2에서 추가: 일관된 UX를 위한 5탭 네비게이션 */}
      {/* 현재 페이지: 학습 (활성화 상태) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t">
        <div className="max-w-md mx-auto px-6 py-3">
          <div className="flex items-center justify-around">
            <button 
              onClick={() => navigate('/home')}
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors p-2"
            >
              <HomeIcon className="w-6 h-6" />
              <span className="text-xs">홈</span>
            </button>
            
            <button 
              onClick={() => navigate('/learn')}
              className="flex flex-col items-center gap-1 text-primary p-2"
            >
              <BookOpen className="w-6 h-6" />
              <span className="text-xs font-medium">학습</span>
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

      {/* 🚀 시작 버튼 (고정) - 하단 네비게이션 위에 표시 */}
      {/* 코스 선택 시에만 표시되는 동적 CTA 버튼 */}
      {selectedCourse && (
        <div className="fixed bottom-20 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent">
          <div className="max-w-md mx-auto">
            <Button 
              onClick={handleStartCourse}
              className="w-full h-14 text-base rounded-xl ink-button text-primary-foreground hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <span className="flex items-center gap-3">
                <Play className="w-5 h-5" />
                <span>학습 시작하기</span>
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};