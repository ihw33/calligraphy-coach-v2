import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Clock, Users, BookOpen, Target, Star, ChevronRight, Lock as LockIcon } from 'lucide-react';
import { getCourseById } from '../data/courses';

export const CourseIntro: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const course = courseId ? getCourseById(courseId) : null;

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">코스를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const handleStartLearning = () => {
    // 첫 번째 레슨으로 이동
    const firstLesson = course.lessons[0];
    if (firstLesson) {
      navigate(`/practice?courseId=${course.id}&lessonId=${firstLesson.id}`);
    }
  };

  // K-Culture 코스인 경우 특별 소개 콘텐츠
  const isKCultureCourse = course.id === 'pen-hangul-kculture';

  // A2A 시스템 시나리오
  const learningScenarios = [
    {
      title: '🎵 K-POP 팬 코스',
      duration: '15분',
      icon: '🎤',
      steps: [
        'ㅂ, ㅌ, ㅅ 빠른 학습 (3분)',
        '"방탄소년단" 따라 쓰기 (5분)',
        '실시간 AI 평가 (3분)',
        '"블랙핑크" 도전 (4분)'
      ]
    },
    {
      title: '🍜 한국 음식 러버',
      duration: '20분',
      icon: '🥢',
      steps: [
        'ㄱ, ㅁ, ㅂ, ㅈ 학습 (5분)',
        '"김치", "김밥" 연습 (5분)',
        '"떡볶이", "치맥" 쓰기 (5분)',
        '작품 평가 (5분)'
      ]
    },
    {
      title: '📺 드라마 덕후',
      duration: '25분',
      icon: '🎬',
      steps: [
        '기초 6개 모음 (5분)',
        '"사랑", "이태원" 단어 (5분)',
        '"오징어게임" 제목 쓰기 (8분)',
        'SNS 공유용 작품 완성 (7분)'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center">
            <button
              onClick={() => navigate(`/course/${courseId}`)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              코스 상세
            </button>
          </div>
        </div>
      </div>

      {/* 히어로 섹션 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Star className="h-4 w-4" />
              {isKCultureCourse ? '가장 인기 있는 코스' : '추천 코스'}
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight">
              {course.title}
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {isKCultureCourse 
                ? '🎯 K-Culture와 실용 한글을 결합한 혁신적인 서예 학습 시스템! 기초부터 K-POP까지 AI 에이전트가 맞춤형 교육을 제공합니다.'
                : course.description}
            </p>

            {/* 통계 */}
            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">
                  <strong>{course.totalLessons}</strong>개 레슨
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">
                  약 <strong>{Math.floor(course.estimatedTime / 60)}시간</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">
                  <strong>입문자</strong> 대상
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* 1. 전체 커리큘럼 - 첫 번째 섹션으로 이동 */}
          <div className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-6">📚 전체 커리큘럼</h2>
            
            {/* K-Culture 코스용 */}
            {isKCultureCourse ? (
              <div className="grid md:grid-cols-2 gap-3">
                {course.lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      navigate('/practice', {
                        state: {
                          courseId: course.id,
                          lessonId: lesson.id,
                          characters: lesson.characters,
                          mode: 'canvas',
                          practiceMode: lesson.practiceMode
                        }
                      });
                    }}
                    className="flex items-center gap-3 p-4 rounded-lg hover:bg-muted/50 transition-colors text-left border"
                    disabled={lesson.status === 'locked'}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{lesson.title}</h3>
                      {lesson.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">{lesson.description}</p>
                      )}
                    </div>
                    {lesson.status === 'locked' && (
                      <LockIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              /* 일반 코스용 */
              <div className="space-y-3">
                {course.lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      navigate('/practice', {
                        state: {
                          courseId: course.id,
                          lessonId: lesson.id,
                          characters: lesson.characters,
                          mode: course.type === 'brush' ? 'photo' : 'canvas',
                          fontStyle: lesson.fontStyle,
                          practiceMode: lesson.practiceMode
                        }
                      });
                    }}
                    className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors text-left"
                    disabled={lesson.status === 'locked'}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-semibold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{lesson.title}</h3>
                      {lesson.description && (
                        <p className="text-sm text-muted-foreground">{lesson.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{lesson.duration}분</span>
                      {lesson.status === 'locked' && (
                        <LockIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. 한글 첫걸음 특별 코스 (K-Culture 코스 전용) */}
          {isKCultureCourse && (
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border p-8">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium">
                  <Star className="h-4 w-4" />
                  특별 추천 코스
                </div>
                
                <h2 className="text-3xl font-bold">🌟 한글 첫걸음 특별 코스</h2>
                
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  완전 초보자를 위한 맞춤형 입문 코스! AI가 당신의 속도에 맞춰 한글의 기초부터 차근차근 가르쳐드립니다.
                </p>

                <div className="bg-white/50 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-lg">이 코스에서 배우는 것들</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="text-left space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span className="text-sm">기본 자음 10개 (ㄱ, ㄴ, ㄷ, ㄹ...)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span className="text-sm">기본 모음 6개 (ㅏ, ㅓ, ㅗ, ㅜ...)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span className="text-sm">올바른 획순과 쓰기 방법</span>
                      </div>
                    </div>
                    <div className="text-left space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span className="text-sm">첫 단어 조합하기</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span className="text-sm">실시간 AI 피드백</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span className="text-sm">개인 맞춤 학습 속도</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleStartLearning}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 justify-center"
                  >
                    <span>지금 바로 시작하기</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      예상 소요시간: <strong>15-20분</strong>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      언제든 중단하고 이어서 할 수 있어요
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. A2A 학습 시나리오 (K-Culture 코스 전용) */}
          {isKCultureCourse && (
            <div className="bg-card rounded-lg border p-8">
              <h2 className="text-2xl font-semibold mb-2">🚀 나만의 학습 시나리오 선택</h2>
              <p className="text-muted-foreground mb-6">관심사에 따라 15-25분 맞춤 코스를 선택하세요!</p>
              
              <div className="grid md:grid-cols-3 gap-6">
                {learningScenarios.map((scenario, index) => (
                  <div key={index} className="bg-muted/50 rounded-lg p-6 space-y-4 hover:bg-muted/70 transition-colors cursor-pointer">
                    <div className="text-center">
                      <div className="text-4xl mb-2">{scenario.icon}</div>
                      <h3 className="font-semibold text-lg">{scenario.title}</h3>
                      <p className="text-sm text-primary">⏱️ {scenario.duration}</p>
                    </div>
                    
                    <div className="space-y-2">
                      {scenario.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start gap-2">
                          <span className="text-xs text-primary font-bold mt-0.5">{stepIndex + 1}</span>
                          <p className="text-sm text-muted-foreground">{step}</p>
                        </div>
                      ))}
                    </div>
                    
                    <button 
                      onClick={() => {
                        // 첫 번째 레슨으로 바로 이동
                        const firstLesson = course.lessons[0];
                        navigate('/practice', {
                          state: {
                            courseId: course.id,
                            lessonId: firstLesson.id,
                            characters: firstLesson.characters,
                            mode: 'canvas',
                            practiceMode: 'single',
                            scenario: scenario.title
                          }
                        });
                      }}
                      className="w-full bg-primary/10 text-primary py-2 rounded-md hover:bg-primary/20 transition-colors text-sm font-medium"
                    >
                      이 시나리오로 시작
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. 학습 목표 */}
          <div className="bg-card rounded-lg border p-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">학습 목표</h2>
            </div>
            
            {isKCultureCourse ? (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-700 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium">🌱 기초 마스터 Agent</h3>
                      <p className="text-sm text-muted-foreground">
                        자음 10개 + 모음 6개 + 기본 글자 조합
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-700 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium">🎵 K-Culture 큐레이터 Agent</h3>
                      <p className="text-sm text-muted-foreground">
                        BTS, 블랙핑크, 오징어게임, 김치 등 트렌드 학습
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-700 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium">💬 일상 단어 전문가 Agent</h3>
                      <p className="text-sm text-muted-foreground">
                        품사별 필수 단어와 실생활 문장 만들기
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-700 font-bold text-sm">4</span>
                    </div>
                    <div>
                      <h3 className="font-medium">🏆 평가 & 진도 Agent</h3>
                      <p className="text-sm text-muted-foreground">
                        실시간 AI 평가와 개인 맞춤 커리큘럼
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>기본 자모음 쓰기 능력 습득</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>올바른 획순과 글자 구조 이해</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>깔끔하고 읽기 쉬운 글씨체 완성</span>
                </li>
              </ul>
            )}
          </div>

          {/* 5. 학습 방법 */}
          <div className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-6">이렇게 학습해요</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                  <span className="text-2xl">✏️</span>
                </div>
                <h3 className="font-medium">따라 쓰기</h3>
                <p className="text-sm text-muted-foreground">
                  화면에 표시되는 글자를 보고 직접 따라 써보세요
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="font-medium">AI 평가</h3>
                <p className="text-sm text-muted-foreground">
                  작성한 글씨를 AI가 실시간으로 평가하고 피드백
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="font-medium">진도 관리</h3>
                <p className="text-sm text-muted-foreground">
                  학습 진도와 성취도를 체계적으로 관리
                </p>
              </div>
            </div>
          </div>

          {/* 6. 레벨 시스템 소개 (K-Culture 코스 전용) */}
          {isKCultureCourse && (
            <div className="bg-card rounded-lg border p-8">
              <h2 className="text-2xl font-semibold mb-6">🎮 레벨 시스템 & 보상</h2>
              
              <div className="grid md:grid-cols-5 gap-4 mb-8">
                <div className="text-center space-y-2">
                  <div className="text-3xl">🌱</div>
                  <h3 className="font-medium text-sm">새싹</h3>
                  <p className="text-xs text-muted-foreground">자음/모음 완성</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl">🌿</div>
                  <h3 className="font-medium text-sm">잎새</h3>
                  <p className="text-xs text-muted-foreground">단어 10개</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl">🌳</div>
                  <h3 className="font-medium text-sm">나무</h3>
                  <p className="text-xs text-muted-foreground">문장 쓰기</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl">🌸</div>
                  <h3 className="font-medium text-sm">꽃</h3>
                  <p className="text-xs text-muted-foreground">K-Culture 마스터</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl">🏆</div>
                  <h3 className="font-medium text-sm">명인</h3>
                  <p className="text-xs text-muted-foreground">창작 서예</p>
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-medium mb-3">🎯 도전 과제</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏃</span>
                    <div>
                      <p className="font-medium text-sm">스피드런</p>
                      <p className="text-xs text-muted-foreground">10개 글자 1분 안에 완성</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <p className="font-medium text-sm">정확도 챔피언</p>
                      <p className="text-xs text-muted-foreground">90% 이상 정확도 5연속</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎨</span>
                    <div>
                      <p className="font-medium text-sm">아티스트</p>
                      <p className="text-xs text-muted-foreground">창작 문구 10개 작성</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌍</span>
                    <div>
                      <p className="font-medium text-sm">글로벌</p>
                      <p className="text-xs text-muted-foreground">5개국 언어로 "안녕하세요"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};