import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Progress } from '../../../components/ui/progress';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { BookOpen, Brush, Lock, Trophy, Clock, CheckCircle2 } from 'lucide-react';
import type { Course, CourseType, LanguageCategory } from '../types/course';
import { allCourses, getCoursesByType } from '../data/courses';
import { progressStorage } from '../services/progressStorage';

export const CourseList: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>(allCourses);
  const [selectedType, setSelectedType] = useState<CourseType>('pen');
  const [loading, setLoading] = useState(true);

  // 진도 데이터 로드
  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      const progressData = await progressStorage.getAllProgress();
      
      // 코스 데이터와 진도 데이터 병합
      const updatedCourses = allCourses.map(course => {
        const progress = progressData.find(p => p.courseId === course.id);
        if (progress) {
          return {
            ...course,
            progress: progress.progress || 0,
            completedLessons: progress.completedLessons || 0,
            status: progress.status || course.status
          };
        }
        return course;
      });
      
      setCourses(updatedCourses);
    } catch (error) {
      console.error('진도 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 코스 시작/계속 버튼 클릭
  const handleCourseClick = (course: Course) => {
    if (course.status === 'locked') {
      // 선수 과목 알림
      alert('이전 코스를 먼저 완료해주세요!');
      return;
    }
    
    // 코스 상세 페이지로 이동
    navigate(`/course/${course.id}`);
  };

  // 타입별 필터링된 코스
  const filteredCourses = getCoursesByType(selectedType).map(course => {
    const updatedCourse = courses.find(c => c.id === course.id);
    return updatedCourse || course;
  });

  // 난이도 뱃지 색상
  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case 'beginner': return 'secondary';
      case 'intermediate': return 'default';
      case 'advanced': return 'destructive';
      default: return 'outline';
    }
  };

  // 난이도 텍스트
  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return '초급';
      case 'intermediate': return '중급';
      case 'advanced': return '고급';
      default: return level;
    }
  };

  // 카테고리 아이콘
  const getCategoryIcon = (type: CourseType) => {
    return type === 'pen' ? <BookOpen className="h-4 w-4" /> : <Brush className="h-4 w-4" />;
  };

  // 상태별 버튼 텍스트
  const getButtonText = (course: Course) => {
    if (course.status === 'locked') return '잠김';
    if (course.status === 'completed') return '복습하기';
    if (course.progress > 0) return '계속하기';
    return '시작하기';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">코스 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">학습 코스</h1>
        <p className="text-muted-foreground">
          펜글씨와 붓글씨를 체계적으로 학습해보세요
        </p>
      </div>

      {/* 코스 타입 선택 탭 */}
      <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as CourseType)}>
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="pen" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            펜글씨
          </TabsTrigger>
          <TabsTrigger value="brush" className="flex items-center gap-2">
            <Brush className="h-4 w-4" />
            붓글씨
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedType}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card 
                key={course.id} 
                className={`relative overflow-hidden transition-all hover:shadow-lg ${
                  course.status === 'locked' ? 'opacity-60' : ''
                }`}
              >
                {/* 완료 표시 */}
                {course.status === 'completed' && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      완료
                    </Badge>
                  </div>
                )}

                {/* 잠금 표시 */}
                {course.status === 'locked' && (
                  <div className="absolute inset-0 bg-black/10 z-10 flex items-center justify-center">
                    <Lock className="h-12 w-12 text-gray-400" />
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(course.type)}
                      <Badge variant={getLevelBadgeVariant(course.level)}>
                        {getLevelText(course.level)}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  {/* 진도 표시 */}
                  {course.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">진도율</span>
                        <span className="text-sm font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  )}

                  {/* 코스 정보 */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="h-3 w-3" />
                      <span>{course.totalLessons}개 레슨</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>약 {course.estimatedTime}분</span>
                    </div>
                    {course.completedLessons > 0 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Trophy className="h-3 w-3" />
                        <span>{course.completedLessons}개 레슨 완료</span>
                      </div>
                    )}
                  </div>

                  {/* 시작 버튼 */}
                  <Button 
                    className="w-full"
                    variant={course.status === 'locked' ? 'outline' : 'default'}
                    disabled={course.status === 'locked'}
                    onClick={() => handleCourseClick(course)}
                  >
                    {getButtonText(course)}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};