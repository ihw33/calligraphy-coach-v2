import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Progress } from '../../../components/ui/progress';
import { Badge } from '../../../components/ui/badge';
import { ArrowLeft, Play, Lock, CheckCircle2, Clock, BookOpen, Award } from 'lucide-react';
import type { Course, Lesson } from '../types/course';
import { getCourseById } from '../data/courses';
import { progressStorage } from '../services/progressStorage';

export const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      loadCourseData(courseId);
    }
  }, [courseId]);

  const loadCourseData = async (id: string) => {
    try {
      setLoading(true);
      
      // 기본 코스 데이터 로드
      const courseData = getCourseById(id);
      if (!courseData) {
        console.error('코스를 찾을 수 없습니다');
        navigate('/courses');
        return;
      }

      // 진도 데이터 로드
      const progress = await progressStorage.getCourseProgress(id);
      
      // 데이터 병합
      const updatedCourse = {
        ...courseData,
        ...(progress || {})
      };

      // 레슨 상태 업데이트
      const updatedLessons = courseData.lessons.map((lesson, index) => {
        if (index === 0) {
          // 첫 레슨은 항상 열림
          return { ...lesson, status: 'available' as const };
        } else if (progress?.completedLessons >= index) {
          // 완료된 레슨
          return { ...lesson, status: 'completed' as const };
        } else if (progress?.completedLessons === index - 1) {
          // 다음 레슨
          return { ...lesson, status: 'available' as const };
        } else {
          // 잠긴 레슨
          return { ...lesson, status: 'locked' as const };
        }
      });

      setCourse({
        ...updatedCourse,
        lessons: updatedLessons
      });
    } catch (error) {
      console.error('코스 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 황자원 92 서법 평가 포인트
  const getHwang92EvaluationPoints = (lessonId: string) => {
    const points: Record<string, string[]> = {
      'h92-01': [
        '상단 횡획이 전체 폭을 덮는가',
        '하부 요소들이 완전히 덮개 안에 들어가는가',
        '덮개와 내부의 비례가 적절한가',
        '보호하는 느낌이 표현되는가'
      ],
      'h92-02': [
        '하단 받침이 충분히 넓은가',
        '상부 요소들이 안정적으로 받쳐지는가',
        '받침의 중심과 상부 중심이 일치하는가',
        '전체적인 안정감이 느껴지는가'
      ],
      'h92-03': [
        '왼쪽 요소가 낮은 위치에 있는가',
        '오른쪽 요소가 상대적으로 높은가',
        '좌우 높이차가 적절한가',
        '시각적 균형이 유지되는가'
      ],
      'h92-04': [
        '오른쪽 요소가 낮은 위치에 있는가',
        '왼쪽 요소가 상대적으로 높은가',
        '좌우 높이차가 자연스러운가',
        '전체 글자의 안정감이 유지되는가'
      ]
    };
    return points[lessonId] || [];
  };

  // 레슨 시작
  const handleStartLesson = async (lesson: Lesson) => {
    if (lesson.status === 'locked') {
      alert('이전 레슨을 먼저 완료해주세요!');
      return;
    }

    // 첫 번째 레슨이고 K-Culture 코스인 경우 소개 페이지로
    if (lesson.order === 1 && course?.id === 'pen-hangul-kculture') {
      navigate(`/course/${course.id}/intro`);
      return;
    }

    // 황자원 92 서법 코스인 경우 PracticeScreen으로 (실물 모드)
    if (course?.id === 'hwang92-sebeop') {
      console.log('🎯 황자원 92 서법 레슨 시작:', {
        courseId: course.id,
        lessonId: lesson.id,
        characters: lesson.characters
      });
      
      // URL 파라미터 포함하여 이동
      navigate(`/practice/hwang92-sebeop/${lesson.id}`, {
        state: {
          courseId: course.id,
          lessonId: lesson.id,
          characters: lesson.characters,
          mode: 'photo',
          fontStyle: lesson.fontStyle || 'haeseo',
          lessonTitle: lesson.title,
          evaluationPoints: getHwang92EvaluationPoints(lesson.id)
        }
      });
      return;
    }

    // 코스 타입에 따라 다른 연습 화면으로 이동
    if (course?.type === 'brush') {
      // 붓글씨는 사진 모드로
      navigate('/practice', {
        state: {
          courseId: course.id,
          lessonId: lesson.id,
          characters: lesson.characters,
          mode: 'photo',
          fontStyle: lesson.fontStyle
        }
      });
    } else {
      // 펜글씨는 캔버스 모드로
      navigate('/practice', {
        state: {
          courseId: course.id,
          lessonId: lesson.id,
          characters: lesson.characters,
          mode: 'canvas',
          practiceMode: lesson.practiceMode
        }
      });
    }
  };

  // 레슨 상태 아이콘
  const getLessonStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'available':
        return <Play className="h-5 w-5 text-primary" />;
      case 'locked':
        return <Lock className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };

  // 레슨 카드 스타일
  const getLessonCardStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50/50';
      case 'available':
        return 'border-primary hover:shadow-md cursor-pointer';
      case 'locked':
        return 'opacity-60 cursor-not-allowed';
      default:
        return '';
    }
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

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>코스를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 헤더 */}
      <div className="mb-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/courses')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          코스 목록으로
        </Button>

        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-muted-foreground">{course.description}</p>
            </div>
            <Badge>{course.type === 'pen' ? '펜글씨' : '붓글씨'}</Badge>
          </div>

          {/* 진도 표시 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">전체 진도</span>
              <span className="text-sm font-medium">
                {course.completedLessons || 0} / {course.totalLessons} 레슨 완료
              </span>
            </div>
            <Progress value={course.progress || 0} className="h-3" />
          </div>

          {/* 코스 정보 */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span>{course.totalLessons}개 레슨</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>총 {course.estimatedTime}분</span>
            </div>
            {course.completedLessons === course.totalLessons && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Award className="h-4 w-4" />
                <span>코스 완료!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 레슨 목록 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">레슨 목록</h2>
        
        {course.lessons.map((lesson, index) => (
          <Card
            key={lesson.id}
            className={`transition-all ${getLessonCardStyle(lesson.status)}`}
            onClick={() => handleStartLesson(lesson)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {lesson.title}
                      {getLessonStatusIcon(lesson.status)}
                    </CardTitle>
                    {lesson.description && (
                      <CardDescription className="mt-1">
                        {lesson.description}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{lesson.characters.length}개 문자</span>
                  <span>약 {lesson.duration}분</span>
                  {lesson.fontStyle && (
                    <Badge variant="outline">{lesson.fontStyle}</Badge>
                  )}
                </div>
                
                {lesson.status === 'available' && (
                  <Button size="sm">
                    시작하기
                  </Button>
                )}
                {lesson.status === 'completed' && (
                  <Button size="sm" variant="outline">
                    다시 연습
                  </Button>
                )}
                {lesson.status === 'locked' && (
                  <Lock className="h-4 w-4 text-gray-400" />
                )}
              </div>

              {/* 레슨 진도 */}
              {lesson.progress > 0 && (
                <div className="mt-3">
                  <Progress value={lesson.progress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};