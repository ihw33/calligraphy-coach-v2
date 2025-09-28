import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { 
  ArrowLeft,
  ArrowRight,
  Play,
  Volume2,
  Eye,
  PenTool,
  Book,
  BookOpen,
  Star,
  Clock,
  Target,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  TrendingUp,
  Settings
} from 'lucide-react';

// 한자능력시험 8급 한자 데이터
const hanjaData: { [key: string]: any } = {
  '1': [
    { id: '8급-1', hanja: '一', sound: '일', meaning: '하나', strokes: 1, radical: '一', examples: ['일등(一等)', '일월(一月)'] },
    { id: '8급-2', hanja: '二', sound: '이', meaning: '둘', strokes: 2, radical: '二', examples: ['이월(二月)', '이등(二等)'] },
    { id: '8급-3', hanja: '三', sound: '삼', meaning: '셋', strokes: 3, radical: '一', examples: ['삼월(三月)', '삼각(三角)'] },
    { id: '8급-4', hanja: '四', sound: '사', meaning: '넷', strokes: 5, radical: '囗', examples: ['사월(四月)', '사각(四角)'] },
    { id: '8급-5', hanja: '五', sound: '오', meaning: '다섯', strokes: 4, radical: '二', examples: ['오월(五月)', '오전(五前)'] }
  ],
  '2': [
    { id: '8급-6', hanja: '六', sound: '육', meaning: '여섯', strokes: 4, radical: '八', examples: ['육월(六月)', '육지(六地)'] },
    { id: '8급-7', hanja: '七', sound: '칠', meaning: '일곱', strokes: 2, radical: '一', examples: ['칠월(七月)', '칠성(七星)'] },
    { id: '8급-8', hanja: '八', sound: '팔', meaning: '여덟', strokes: 2, radical: '八', examples: ['팔월(八月)', '팔각(八角)'] },
    { id: '8급-9', hanja: '九', sound: '구', meaning: '아홉', strokes: 2, radical: '乙', examples: ['구월(九月)', '구단(九段)'] },
    { id: '8급-10', hanja: '十', sound: '십', meaning: '열', strokes: 2, radical: '十', examples: ['십월(十月)', '십자(十字)'] }
  ],
  '3': [
    { id: '8급-11', hanja: '大', sound: '대', meaning: '클', strokes: 3, radical: '大', examples: ['대학(大學)', '대문(大門)'] },
    { id: '8급-12', hanja: '小', sound: '소', meaning: '작을', strokes: 3, radical: '小', examples: ['소학(小學)', '소문(小門)'] },
    { id: '8급-13', hanja: '中', sound: '중', meaning: '가운데', strokes: 4, radical: '丨', examples: ['중학(中學)', '중간(中間)'] },
    { id: '8급-14', hanja: '人', sound: '인', meaning: '사람', strokes: 2, radical: '人', examples: ['인간(人間)', '인생(人生)'] },
    { id: '8급-15', hanja: '上', sound: '상', meaning: '위', strokes: 3, radical: '一', examples: ['상등(上等)', '상자(上字)'] }
  ],
  '4': [
    { id: '8급-16', hanja: '下', sound: '하', meaning: '아래', strokes: 3, radical: '一', examples: ['하등(下等)', '하나(下나)'] },
    { id: '8급-17', hanja: '左', sound: '좌', meaning: '왼쪽', strokes: 5, radical: '工', examples: ['좌측(左側)', '좌우(左右)'] },
    { id: '8급-18', hanja: '右', sound: '우', meaning: '오른쪽', strokes: 5, radical: '口', examples: ['우측(右側)', '좌우(左右)'] },
    { id: '8급-19', hanja: '前', sound: '전', meaning: '앞', strokes: 9, radical: '刀', examples: ['전후(前後)', '전면(前面)'] },
    { id: '8급-20', hanja: '後', sound: '후', meaning: '뒤', strokes: 9, radical: '彳', examples: ['전후(前後)', '후면(後面)'] }
  ],
  '5': [
    { id: '8급-21', hanja: '山', sound: '산', meaning: '메', strokes: 3, radical: '山', examples: ['산수(山水)', '산림(山林)'] },
    { id: '8급-22', hanja: '水', sound: '수', meaning: '물', strokes: 4, radical: '水', examples: ['수영(水泳)', '산수(山水)'] },
    { id: '8급-23', hanja: '火', sound: '화', meaning: '불', strokes: 4, radical: '火', examples: ['화재(火災)', '화요일(火曜日)'] },
    { id: '8급-24', hanja: '土', sound: '토', meaning: '흙', strokes: 3, radical: '土', examples: ['토지(土地)', '토요일(土曜日)'] },
    { id: '8급-34', hanja: '地', sound: '지', meaning: '땅', strokes: 6, radical: '土', examples: ['지구(地球)', '땅'] }
  ],
  '6': [
    { id: '8급-25', hanja: '木', sound: '목', meaning: '나무', strokes: 4, radical: '木', examples: ['목재(木材)', '목요일(木曜日)'] },
    { id: '8급-26', hanja: '金', sound: '금', meaning: '쇠', strokes: 8, radical: '金', examples: ['금요일(金曜日)', '금속(金屬)'] },
    { id: '8급-34', hanja: '天', sound: '천', meaning: '하늘', strokes: 4, radical: '大', examples: ['천국(天國)', '하늘'] },
    { id: '8급-27', hanja: '月', sound: '월', meaning: '달', strokes: 4, radical: '月', examples: ['월요일(月曜日)', '일월(一月)'] },
    { id: '8급-28', hanja: '日', sound: '일', meaning: '해', strokes: 4, radical: '日', examples: ['일요일(日曜日)', '일출(日出)'] }
  ],
  '7': [
    { id: '8급-29', hanja: '年', sound: '년', meaning: '해', strokes: 6, radical: '干', examples: ['올해(今年)', '작년(作年)'] },
    { id: '8급-30', hanja: '時', sound: '시', meaning: '때', strokes: 10, radical: '日', examples: ['시간(時間)', '시계(時計)'] },
    { id: '8급-31', hanja: '白', sound: '백', meaning: '흰', strokes: 5, radical: '白', examples: ['백색(白色)', '흰색'] },
    { id: '8급-32', hanja: '黑', sound: '흑', meaning: '검을', strokes: 12, radical: '黑', examples: ['흑색(黑色)', '검은색'] },
    { id: '8급-33', hanja: '靑', sound: '청', meaning: '푸를', strokes: 8, radical: '靑', examples: ['청색(靑色)', '푸른색'] }
  ],
  '8': [
    { id: '8급-36', hanja: '男', sound: '남', meaning: '사내', strokes: 7, radical: '田', examples: ['남자(男子)', '사내'] },
    { id: '8급-37', hanja: '女', sound: '여', meaning: '여자', strokes: 3, radical: '女', examples: ['여자(女子)', '여성(女性)'] },
    { id: '8급-38', hanja: '子', sound: '자', meaning: '아들', strokes: 3, radical: '子', examples: ['아들(子)', '자녀(子女)'] },
    { id: '8급-39', hanja: '父', sound: '부', meaning: '아버지', strokes: 4, radical: '父', examples: ['아버지(父)', '부모(父母)'] },
    { id: '8급-40', hanja: '母', sound: '모', meaning: '어머니', strokes: 5, radical: '母', examples: ['어머니(母)', '부모(父母)'] }
  ],
  '9': [
    { id: '8급-41', hanja: '兄', sound: '형', meaning: '형', strokes: 5, radical: '儿', examples: ['형(兄)', '형제(兄弟)'] },
    { id: '8급-42', hanja: '弟', sound: '제', meaning: '아우', strokes: 7, radical: '弓', examples: ['아우(弟)', '형제(兄弟)'] },
    { id: '8급-43', hanja: '口', sound: '구', meaning: '입', strokes: 3, radical: '口', examples: ['입(口)', '구멍(口穴)'] },
    { id: '8급-44', hanja: '手', sound: '수', meaning: '손', strokes: 4, radical: '手', examples: ['손(手)', '수화(手話)'] },
    { id: '8급-45', hanja: '足', sound: '족', meaning: '발', strokes: 7, radical: '足', examples: ['발(足)', '족구(足球)'] }
  ],
  '10': [
    { id: '8급-46', hanja: '目', sound: '목', meaning: '눈', strokes: 5, radical: '目', examples: ['눈(目)', '목표(目標)'] },
    { id: '8급-47', hanja: '耳', sound: '이', meaning: '귀', strokes: 6, radical: '耳', examples: ['귀(耳)', '이비인후과'] },
    { id: '8급-48', hanja: '心', sound: '심', meaning: '마음', strokes: 4, radical: '心', examples: ['마음(心)', '심장(心臟)'] },
    { id: '8급-49', hanja: '門', sound: '문', meaning: '문', strokes: 8, radical: '門', examples: ['문(門)', '대문(大門)'] },
    { id: '8급-50', hanja: '車', sound: '차', meaning: '수레', strokes: 7, radical: '車', examples: ['차(車)', '자동차(自動車)'] }
  ]
};

export const HanjaLearnScreen: React.FC = () => {
  const navigate = useNavigate();
  const { courseType, lessonId } = useParams<{ courseType: string; lessonId: string }>();
  
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(true);
  const [showExamples, setShowExamples] = useState(false);
  const [completedCharacters, setCompletedCharacters] = useState<Set<number>>(new Set());
  
  // 현재 레슨의 한자 데이터 가져오기
  const currentLesson = hanjaData[lessonId || '1'] || hanjaData['1'];
  const currentCharacter = currentLesson[currentCharacterIndex];
  const progress = (completedCharacters.size / currentLesson.length) * 100;

  const handleNext = () => {
    if (currentCharacterIndex < currentLesson.length - 1) {
      setCurrentCharacterIndex(currentCharacterIndex + 1);
      setShowMeaning(true);
      setShowExamples(false);
    }
  };

  const handlePrevious = () => {
    if (currentCharacterIndex > 0) {
      setCurrentCharacterIndex(currentCharacterIndex - 1);
      setShowMeaning(true);
      setShowExamples(false);
    }
  };

  const handleComplete = () => {
    setCompletedCharacters(prev => new Set([...prev, currentCharacterIndex]));
  };

  const handlePlaySound = () => {
    // TTS 기능 시뮬레이션
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentCharacter.sound);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const getStrokesDisplay = (strokes: number) => {
    return Array.from({ length: Math.min(strokes, 15) }, (_, i) => (
      <div key={i} className="w-1 h-1 bg-primary rounded-full"></div>
    ));
  };

  return (
    <div className="h-screen flex flex-col calligraphy-bg">
      {/* 헤더 */}
      <header className="flex-shrink-0 px-6 py-6 organic-header">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/learn/${courseType}/curriculum`)}
              className="w-10 h-10 rounded-full bg-muted/40 hover:bg-muted/60 flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="text-center">
              <h1 className="font-medium text-primary ink-splash">레슨 {lessonId}</h1>
              <p className="text-sm text-muted-foreground">
                {currentCharacterIndex + 1} / {currentLesson.length}
              </p>
            </div>
            <div className="w-10 h-10" />
          </div>
        </div>
      </header>

      {/* 진행 상황 */}
      <div className="px-6 pb-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">학습 진행</span>
            <span className="text-primary font-medium">{completedCharacters.size}/{currentLesson.length} 완료</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 overflow-y-auto px-6 py-6 pb-48">
        <div className="max-w-md mx-auto space-y-6">
          
          {/* 한자 카드 */}
          <div className="handmade-card p-8 text-center space-y-6">
            {/* 한자 표시 */}
            <div className="character-display p-8 mx-auto w-32 h-32 flex items-center justify-center">
              <span className="text-6xl font-normal text-primary">{currentCharacter.hanja}</span>
            </div>

            {/* 기본 정보 */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handlePlaySound}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                >
                  <Volume2 className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800 font-medium">{currentCharacter.sound}</span>
                </button>
                
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl">
                  <span className="text-emerald-800 font-medium">{currentCharacter.meaning}</span>
                </div>
              </div>

              {/* 부수와 획수 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-purple-50 rounded-xl text-center">
                  <p className="text-xs text-purple-600 mb-1">부수</p>
                  <p className="text-lg font-medium text-purple-800">{currentCharacter.radical}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-xl text-center">
                  <p className="text-xs text-orange-600 mb-1">획수</p>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {getStrokesDisplay(currentCharacter.strokes)}
                  </div>
                  <p className="text-sm font-medium text-orange-800">{currentCharacter.strokes}획</p>
                </div>
              </div>
            </div>
          </div>

          {/* 예시어 */}
          <div className="handmade-card p-6 space-y-4">

            
            <div className="grid grid-cols-1 gap-2">
              {currentCharacter.examples.map((example: string, index: number) => (
                <div key={index} className="p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <p className="text-primary font-medium text-sm text-center">{example}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 학습 완료 및 쓰기 연습 버튼 */}


          {/* 한자 목록 미리보기 */}
          <div className="handmade-card p-6">
            <Button
              onClick={() => navigate(`/learn/${courseType}/lesson/${lessonId}/practice?character=${currentCharacter.hanja}`)}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white ink-button"
            >
              <PenTool className="w-5 h-5 mr-2" />
              {currentCharacter.hanja} 쓰기 연습하기
            </Button>
          </div>
        </div>
      </main>

      {/* 하단 한자 네비게이션 */}
      <div className="fixed bottom-20 left-0 right-0 p-4 flowing-nav">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-5 gap-4">
            {currentLesson.map((hanja: any, index: number) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentCharacterIndex(index);
                  setShowMeaning(true);
                  setShowExamples(false);
                  setCompletedCharacters(prev => new Set([...prev, index]));
                }}
                className={`aspect-square rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center relative ${
                  index === currentCharacterIndex
                    ? 'border-primary bg-primary/15 scale-110 shadow-lg'
                    : completedCharacters.has(index)
                    ? 'border-emerald-500 bg-emerald-50 shadow-md'
                    : 'border-muted bg-white hover:border-primary/50 hover:bg-primary/5 hover:scale-105 shadow-sm'
                }`}
              >
                <span className={`text-2xl font-medium mb-1 ${
                  index === currentCharacterIndex
                    ? 'text-primary'
                    : completedCharacters.has(index)
                    ? 'text-emerald-700'
                    : 'text-muted-foreground'
                }`}>
                  {hanja.hanja}
                </span>
                <span className={`text-xs ${
                  index === currentCharacterIndex
                    ? 'text-primary/80'
                    : completedCharacters.has(index)
                    ? 'text-emerald-600'
                    : 'text-muted-foreground'
                }`}>
                  {hanja.sound}
                </span>
                
                {completedCharacters.has(index) && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-white fill-current" />
                  </div>
                )}
                
                {index === currentCharacterIndex && (
                  <div className="absolute inset-0 rounded-xl bg-primary/10 border-2 border-primary/30 animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 하단 네비게이션 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-border/50 px-6 py-3 flowing-nav">
        <div className="max-w-md mx-auto">
          <div className="flex justify-around items-center">
            <button 
              className="flex-col gap-2 text-muted-foreground flex items-center hover:text-primary transition-colors duration-300"
              onClick={() => navigate('/home')}
            >
              <div className="w-8 h-8 rounded-full hover:bg-primary/10 flex items-center justify-center transition-colors duration-300">
                <div className="w-4 h-4 rounded-full bg-muted-foreground hover:bg-primary transition-colors duration-300"></div>
              </div>
              <span className="text-xs">홈</span>
            </button>
            
            <button 
              className="flex-col gap-2 text-primary flex items-center transition-colors duration-300"
              onClick={() => navigate('/learn')}
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center transition-colors duration-300">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs">📚 학습</span>
            </button>
            
            <button 
              className="flex-col gap-2 text-muted-foreground flex items-center hover:text-primary transition-colors duration-300"
              onClick={() => navigate('/history')}
            >
              <div className="w-8 h-8 rounded-full hover:bg-primary/10 flex items-center justify-center transition-colors duration-300">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-xs">기록</span>
            </button>
            
            <button 
              className="flex-col gap-2 text-muted-foreground flex items-center hover:text-primary transition-colors duration-300"
              onClick={() => navigate('/settings')}
            >
              <div className="w-8 h-8 rounded-full hover:bg-primary/10 flex items-center justify-center transition-colors duration-300">
                <Settings className="w-4 h-4" />
              </div>
              <span className="text-xs">설정</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};