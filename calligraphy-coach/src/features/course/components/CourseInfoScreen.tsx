/**
 * ℹ️ CourseInfoScreen 컴포넌트 - 코스 상세 정보 화면
 * 
 * 📋 주요 기능:
 * - 선택된 코스의 상세 정보 표시
 * - 서체 특징, 학습 목표, 커리큘럼 미리보기
 * - 학습 시작 버튼 ("학습 시작하기")
 * 
 * 🔗 라우팅: /learn/:courseType/info
 * 📱 반응형: 모바일 우선 디자인
 * 🎨 디자인: 젠 스타일 미니멀 디자인
 * 
 * 📅 최종 수정: 2024-12-22
 * 🐛 수정사항: 버튼 텍스트 "도구 준비하기" → "학습 시작하기"
 */

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { 
  ArrowLeft,
  ArrowRight,
  Clock,
  Star,
  Users,
  BookOpen,
  TrendingUp,
  Award,
  CheckCircle2,
  Brush,
  PenTool
} from 'lucide-react';

export const CourseInfoScreen: React.FC = () => {
  const navigate = useNavigate();
  const { courseType } = useParams<{ courseType: string }>();

  // 코스 타입에서 정보 추출
  const [mode, script, style] = courseType?.split('-') || [];

  const courseData: { [key: string]: any } = {
    'brush-hangul-panbon': {
      title: '판본체 기초 (서예)',
      subtitle: '조선 궁중의 정갈한 판본체',
      description: '조선시대 궁중에서 사용된 아름다운 판본체를 배워보세요. 정제된 글꼴과 균형잡힌 구조로 한글 서예의 기초를 탄탄히 다질 수 있습니다.',
      mode: '서예 (붓글씨)',
      script: '한글',
      style: '판본체',
      difficulty: '초급',
      duration: '4주 과정',
      lessons: 20,
      students: 1250,
      rating: 4.8,
      features: [
        '기본 자음 14개 마스터',
        '기본 모음 10개 완벽 습득',
        '받침이 있는 글자 연습',
        '단어와 문장 쓰기',
        '작품 완성하기'
      ],
      learningPath: [
        { title: '기본 자음', progress: 100, status: 'completed' },
        { title: '기본 모음', progress: 80, status: 'current' },
        { title: '복합 자음', progress: 0, status: 'upcoming' },
        { title: '복합 모음', progress: 0, status: 'upcoming' },
        { title: '받침 글자', progress: 0, status: 'upcoming' }
      ],
      preview: '가나다라마바사아자차카타파하',
      characteristics: [
        { title: '정갈한 구조', desc: '각 글자가 균형잡힌 비례를 가집니다' },
        { title: '우아한 곡선', desc: '부드러운 선이 조화롭게 어우러집니다' },
        { title: '실용성', desc: '일상 글쓰기에도 활용할 수 있습니다' }
      ],
      tools: ['붓 (중호)', '먹', '벼루', '한지']
    },
    'brush-hangul-gungseo': {
      title: '궁서체 입문 (서예)',
      subtitle: '우아하고 품격있는 궁서체',
      description: '조선 왕실의 품격을 담은 궁서체를 배워보세요. 우아한 곡선과 절제된 아름다움으로 한글 서예의 진수를 경험할 수 있습니다.',
      mode: '서예 (붓글씨)',
      script: '한글',
      style: '궁서체',
      difficulty: '중급',
      duration: '6주 과정',
      lessons: 25,
      students: 890,
      rating: 4.9,
      features: [
        '궁서체 특유의 곡선미 익히기',
        '품격있는 글자 간격 조절',
        '전통 서예 예법 습득',
        '고전 문학 작품 쓰기',
        '개인 작품집 제작'
      ],
      learningPath: [
        { title: '기본 획법', progress: 0, status: 'upcoming' },
        { title: '자음 연습', progress: 0, status: 'upcoming' },
        { title: '모음 연습', progress: 0, status: 'upcoming' },
        { title: '조합 연습', progress: 0, status: 'upcoming' },
        { title: '작품 제작', progress: 0, status: 'upcoming' }
      ],
      preview: '가나다라마바사아자차카타파하',
      characteristics: [
        { title: '우아한 곡선', desc: '부드럽고 유려한 선의 흐름' },
        { title: '품격있는 간격', desc: '절제된 아름다움의 여백' },
        { title: '전통미', desc: '조선 왕실의 품격을 담은 서체' }
      ],
      tools: ['붓 (세호)', '농묵', '석벼루', '화선지']
    },
    'brush-hanja-jeonseo': {
      title: '전서체 입문 (서예)',
      subtitle: '고풍스럽고 장엄한 전서체',
      description: '중국 고대 문자의 아름다움을 간직한 전서체를 배워보세요. 장엄하고 고풍스러운 형태로 한자 서예의 깊이를 경험할 수 있습니다.',
      mode: '서예 (붓글씨)',
      script: '한자',
      style: '전서체',
      difficulty: '중급',
      duration: '8주 과정',
      lessons: 30,
      students: 650,
      rating: 4.7,
      features: [
        '전서체 특유의 장중한 형태',
        '고대 문자의 의미 이해',
        '전통 인장 문화 학습',
        '고전 한시 작품 쓰기',
        '개인 인장 제작'
      ],
      learningPath: [
        { title: '기본 형태', progress: 0, status: 'upcoming' },
        { title: '상형 문자', progress: 0, status: 'upcoming' },
        { title: '지사 문자', progress: 0, status: 'upcoming' },
        { title: '회의 문자', progress: 0, status: 'upcoming' },
        { title: '작품 제작', progress: 0, status: 'upcoming' }
      ],
      preview: '一二三四五六七八九十',
      characteristics: [
        { title: '장중한 형태', desc: '고대 문자의 장엄함을 표현' },
        { title: '역사적 가치', desc: '한자 발전사의 중요한 단계' },
        { title: '예술성', desc: '인장과 비석의 아름다운 서체' }
      ],
      tools: ['붓 (대호)', '진묵', '석벼루', '마포지']
    },
    'brush-hanja-haeseo': {
      title: '해서체 기초 (서예)',
      subtitle: '한자 서예의 정석',
      description: '중국 서예의 기본이 되는 해서체를 통해 한자의 아름다움을 경험해보세요. 정확한 획순과 균형잡힌 구조로 한자 서예의 기초를 배웁니다.',
      mode: '서예 (붓글씨)',
      script: '한자',
      style: '해서체',
      difficulty: '초급',
      duration: '6주 과정',
      lessons: 25,
      students: 1100,
      rating: 4.9,
      features: [
        '기본 획법 8가지 마스터',
        '상용한자 100자 학습',
        '부수별 체계적 학습',
        '사자성어 작품 쓰기',
        '전통 서예 예법 익히기'
      ],
      learningPath: [
        { title: '기본 획법', progress: 100, status: 'completed' },
        { title: '기초 한자', progress: 60, status: 'current' },
        { title: '부수 학습', progress: 0, status: 'upcoming' },
        { title: '응용 한자', progress: 0, status: 'upcoming' },
        { title: '작품 제작', progress: 0, status: 'upcoming' }
      ],
      preview: '一二三四五六七八九十',
      characteristics: [
        { title: '정통 서체', desc: '중국 서예 4대 서체 중 하나' },
        { title: '명확한 구조', desc: '각 획이 분명하고 읽기 쉬움' },
        { title: '학습 효과', desc: '한자 구조 이해에 도움' }
      ],
      tools: ['붓 (소호)', '농묵', '석벼루', '화선지']
    },
    'pen-hangul-panbon': {
      title: '판본체 캘리그라피 (펜글씨)',
      subtitle: '펜으로 쓰는 현대적인 판본체',
      description: '펜을 사용하여 현대적으로 해석한 판본체를 배워보세요. 실용적이면서도 아름다운 한글 캘리그라피의 기초를 다질 수 있습니다.',
      mode: '펜글씨 (캘리그라피)',
      script: '한글',
      style: '판본체',
      difficulty: '초급',
      duration: '3주 과정',
      lessons: 15,
      students: 950,
      rating: 4.6,
      features: [
        '펜 판본체 기본 획법',
        '실용적인 글씨체 연습',
        '카드와 편지 쓰기',
        '디지털 캘리그라피 기초',
        '개인 스타일 개발'
      ],
      learningPath: [
        { title: '펜 기본 잡기', progress: 0, status: 'upcoming' },
        { title: '자음 연습', progress: 0, status: 'upcoming' },
        { title: '모음 연습', progress: 0, status: 'upcoming' },
        { title: '조합 연습', progress: 0, status: 'upcoming' },
        { title: '작품 제작', progress: 0, status: 'upcoming' }
      ],
      preview: '가나다라마바사아자차카타파하',
      characteristics: [
        { title: '실용성', desc: '일상에서 바로 활용 가능' },
        { title: '접근성', desc: '누구나 쉽게 시작할 수 있음' },
        { title: '현대적', desc: '모던한 감성의 캘리그라피' }
      ],
      tools: ['캘리그라피 펜', '격자 연습지', '지우개']
    },
    'pen-hanja-haeseo': {
      title: '해서체 캘리그라피 (펜글씨)',
      subtitle: '실용적인 펜 해서체',
      description: '펜으로 쓰는 현대적인 해서체를 배워보세요. 전통의 아름다움을 유지하면서도 실용적인 펜글씨로 한자의 매력을 경험할 수 있습니다.',
      mode: '펜글씨 (캘리그라피)',
      script: '한자',
      style: '해서체',
      difficulty: '초급',
      duration: '4주 과정',
      lessons: 18,
      students: 720,
      rating: 4.5,
      features: [
        '펜 해서체 기본기',
        '실용 한자 50자 학습',
        '이름과 주소 쓰기',
        '축하 문구 캘리그라피',
        '개인 작품 제작'
      ],
      learningPath: [
        { title: '펜 기본 잡기', progress: 0, status: 'upcoming' },
        { title: '기본 한자', progress: 0, status: 'upcoming' },
        { title: '응용 한자', progress: 0, status: 'upcoming' },
        { title: '문구 쓰기', progress: 0, status: 'upcoming' },
        { title: '작품 제작', progress: 0, status: 'upcoming' }
      ],
      preview: '一二三四五六七八九十',
      characteristics: [
        { title: '실용성', desc: '일상 속 한자 쓰기에 활용' },
        { title: '현대적', desc: '펜으로 쓰는 새로운 해서체' },
        { title: '접근성', desc: '부담 없이 시작할 수 있음' }
      ],
      tools: ['붓펜', '격자지', '연필']
    }
  };

  const currentCourse = courseData[courseType || ''];

  // 디버깅용 로그
  console.log('courseType:', courseType);
  console.log('currentCourse:', currentCourse);

  if (!currentCourse) {
    return (
      <div className="h-screen flex flex-col calligraphy-bg">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-lg font-medium text-primary">잘못된 코스입니다</h2>
            <p className="text-sm text-muted-foreground">courseType: {courseType}</p>
            <button 
              onClick={() => navigate('/course')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              코스 선택으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleStartCourse = () => {
    navigate(`/learn/${courseType}/curriculum`);
  };

  const getModeIcon = (mode: string) => {
    return mode.includes('서예') ? Brush : PenTool;
  };

  const getModeColor = (mode: string) => {
    return mode.includes('서예') ? 'from-amber-500 to-orange-600' : 'from-blue-500 to-indigo-600';
  };

  return (
    <div className="h-screen flex flex-col calligraphy-bg">
      {/* 헤더 */}
      <header className="flex-shrink-0 px-6 py-6 organic-header">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/course')}
              className="w-10 h-10 rounded-full bg-muted/40 hover:bg-muted/60 flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="text-center">
              <h1 className="font-medium text-primary ink-splash">{currentCourse.title}</h1>
              <p className="text-sm text-muted-foreground">{currentCourse.subtitle}</p>
            </div>
            <div className="w-10 h-10" />
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        <div className="max-w-md mx-auto space-y-6">
          
          {/* 코스 분류 */}
          <div className="handmade-card p-6 space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${getModeColor(currentCourse.mode)} flex items-center justify-center`}>
                {React.createElement(getModeIcon(currentCourse.mode), { 
                  className: "w-7 h-7 text-white" 
                })}
              </div>
              <div className="text-center">
                <h3 className="font-medium text-primary ink-splash">{currentCourse.mode}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">{currentCourse.script}</Badge>
                  <Badge variant="outline" className="text-xs">{currentCourse.style}</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* 코스 미리보기 */}
          <div className="handmade-card p-6 space-y-4">
            <div className="text-center space-y-3">
              <div className="character-display p-8 text-center">
                <div className="text-2xl text-primary mb-3" style={{ fontFamily: 'serif' }}>
                  {currentCourse.preview}
                </div>
                <p className="text-sm text-muted-foreground">미리보기</p>
              </div>
              
              {/* 코스 통계 */}
              <div className="grid grid-cols-4 gap-4 pt-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-xs text-muted-foreground">{currentCourse.duration}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center mx-auto mb-2">
                    <BookOpen className="w-6 h-6 text-emerald-600" />
                  </div>
                  <p className="text-xs text-muted-foreground">{currentCourse.lessons}개 레슨</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mx-auto mb-2">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-xs text-muted-foreground">{currentCourse.students}명 수강</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mx-auto mb-2">
                    <Star className="w-6 h-6 text-amber-600" />
                  </div>
                  <p className="text-xs text-muted-foreground">{currentCourse.rating}점</p>
                </div>
              </div>
            </div>
          </div>

          {/* 코스 설명 */}
          <div className="handmade-card p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-primary">코스 소개</h3>
                <Badge variant="outline" className="text-xs mt-1">{currentCourse.difficulty}</Badge>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              {currentCourse.description}
            </p>
          </div>

          {/* 서체 특징 */}
          <div className="handmade-card p-6 space-y-4">
            <h3 className="font-medium text-primary flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              서체 특징
            </h3>
            
            <div className="space-y-3">
              {currentCourse.characteristics.map((char: any, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-muted/30 to-muted/10">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-sm font-medium text-primary">{char.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{char.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 필요한 도구 */}
          <div className="handmade-card p-6 space-y-4">
            <h3 className="font-medium text-primary flex items-center gap-2">
              <Award className="w-5 h-5" />
              필요한 도구
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {currentCourse.tools.map((tool: string, index: number) => (
                <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-sm text-blue-800">{tool}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 학습 내용 */}
          <div className="handmade-card p-6 space-y-4">
            <h3 className="font-medium text-primary flex items-center gap-2">
              <Award className="w-5 h-5" />
              학습할 내용
            </h3>
            
            <div className="space-y-3">
              {currentCourse.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 학습 진도 */}
          <div className="handmade-card p-6 space-y-4">
            <h3 className="font-medium text-primary flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              학습 로드맵
            </h3>
            
            <div className="space-y-4">
              {currentCourse.learningPath.map((step: any, index: number) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    step.status === 'completed' 
                      ? 'bg-emerald-500 text-white' 
                      : step.status === 'current'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${
                        step.status === 'upcoming' ? 'text-muted-foreground' : 'text-primary'
                      }`}>{step.title}</span>
                      {step.status !== 'upcoming' && (
                        <span className="text-xs text-muted-foreground">{step.progress}%</span>
                      )}
                    </div>
                    {step.status !== 'upcoming' && (
                      <Progress value={step.progress} className="h-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 시작 버튼 */}
          <div className="pt-4">
            <Button
              onClick={handleStartCourse}
              className="w-full h-14 text-base rounded-xl ink-button text-primary-foreground hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center gap-3">
                <span>학습 시작하기</span>
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};