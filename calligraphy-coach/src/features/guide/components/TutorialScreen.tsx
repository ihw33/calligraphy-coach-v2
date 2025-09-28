import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { 
  Brush, 
  PenTool, 
  CheckCircle2, 
  ArrowRight,
  Palette,
  BookOpen,
  Timer,
  Users
} from 'lucide-react';

export const TutorialScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<'brush' | 'pen' | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<'hobby' | 'education' | 'artistic' | null>(null);

  const handleComplete = () => {
    // 설정 저장 (실제로는 Context나 localStorage에 저장)
    localStorage.setItem('userPreferences', JSON.stringify({
      mode: selectedMode,
      level: selectedLevel,
      goal: selectedGoal
    }));
    
    navigate('/course');
  };

  const isCompleted = selectedMode && selectedLevel && selectedGoal;

  return (
    <div className="h-screen flex flex-col calligraphy-bg">
      {/* 헤더 */}
      <header className="flex-shrink-0 px-6 py-6 organic-header">
        <div className="max-w-md mx-auto text-center">
          <div className="relative inline-block mb-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 via-primary/15 to-primary/25 flex items-center justify-center mx-auto">
              <Palette className="w-8 h-8 text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">1</span>
            </div>
          </div>
          <h1 className="text-xl font-medium text-primary ink-splash mb-1">서예 여정 시작하기</h1>
          <p className="text-sm text-muted-foreground">당신에게 맞는 설정을 선택해주세요</p>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-md mx-auto space-y-8">
          
          {/* 1. 쓰기 도구 선택 */}
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                STEP 1
              </Badge>
              <h2 className="text-lg font-medium text-primary">선호하는 쓰기 도구는?</h2>
              <p className="text-sm text-muted-foreground">연습 방법이 달라집니다</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* 붓글씨 모드 */}
              <button
                onClick={() => setSelectedMode('brush')}
                className={`handmade-card p-6 space-y-4 text-center transition-all duration-300 hover:scale-105 cursor-pointer group ${
                  selectedMode === 'brush' 
                    ? 'ring-2 ring-primary/50 bg-gradient-to-br from-primary/10 to-primary/5' 
                    : 'hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/2'
                }`}
              >
                <div className={`relative w-14 h-14 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
                  selectedMode === 'brush'
                    ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground scale-110'
                    : 'bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600 group-hover:scale-110'
                }`}>
                  <Brush className="w-7 h-7" />
                  {selectedMode === 'brush' && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className={`font-medium transition-colors duration-300 ${
                    selectedMode === 'brush' ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                  }`}>붓글씨</h3>
                  <p className="text-xs text-muted-foreground mt-1">전통적인 서예<br/>깊이 있는 학습</p>
                </div>
              </button>

              {/* 펜글씨 모드 */}
              <button
                onClick={() => setSelectedMode('pen')}
                className={`handmade-card p-6 space-y-4 text-center transition-all duration-300 hover:scale-105 cursor-pointer group ${
                  selectedMode === 'pen' 
                    ? 'ring-2 ring-primary/50 bg-gradient-to-br from-primary/10 to-primary/5' 
                    : 'hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/2'
                }`}
              >
                <div className={`relative w-14 h-14 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
                  selectedMode === 'pen'
                    ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground scale-110'
                    : 'bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600 group-hover:scale-110'
                }`}>
                  <PenTool className="w-7 h-7" />
                  {selectedMode === 'pen' && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className={`font-medium transition-colors duration-300 ${
                    selectedMode === 'pen' ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                  }`}>펜글씨</h3>
                  <p className="text-xs text-muted-foreground mt-1">실용적인 캘리그라피<br/>일상에서 활용</p>
                </div>
              </button>
            </div>
          </div>

          {/* 2. 수준 선택 */}
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                STEP 2
              </Badge>
              <h2 className="text-lg font-medium text-primary">현재 수준은?</h2>
              <p className="text-sm text-muted-foreground">맞춤 커리큘럼을 제공해요</p>
            </div>
            
            <div className="space-y-3">
              {/* 초급 */}
              <button
                onClick={() => setSelectedLevel('beginner')}
                className={`w-full handmade-card p-4 flex items-center gap-4 transition-all duration-300 hover:scale-102 cursor-pointer group ${
                  selectedLevel === 'beginner' 
                    ? 'ring-2 ring-primary/50 bg-gradient-to-br from-primary/10 to-primary/5' 
                    : 'hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/2'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  selectedLevel === 'beginner'
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white scale-110'
                    : 'bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-600 group-hover:scale-110'
                }`}>
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className={`font-medium transition-colors duration-300 ${
                    selectedLevel === 'beginner' ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                  }`}>처음 시작해요</h3>
                  <p className="text-xs text-muted-foreground">기초부터 차근차근 배우고 싶어요</p>
                </div>
                {selectedLevel === 'beginner' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                )}
              </button>

              {/* 중급 */}
              <button
                onClick={() => setSelectedLevel('intermediate')}
                className={`w-full handmade-card p-4 flex items-center gap-4 transition-all duration-300 hover:scale-102 cursor-pointer group ${
                  selectedLevel === 'intermediate' 
                    ? 'ring-2 ring-primary/50 bg-gradient-to-br from-primary/10 to-primary/5' 
                    : 'hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/2'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  selectedLevel === 'intermediate'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white scale-110'
                    : 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 group-hover:scale-110'
                }`}>
                  <Timer className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className={`font-medium transition-colors duration-300 ${
                    selectedLevel === 'intermediate' ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                  }`}>어느 정도 해봤어요</h3>
                  <p className="text-xs text-muted-foreground">기본은 알고 실력을 늘리고 싶어요</p>
                </div>
                {selectedLevel === 'intermediate' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                )}
              </button>
            </div>
          </div>

          {/* 3. 목표 선택 */}
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                STEP 3
              </Badge>
              <h2 className="text-lg font-medium text-primary">학습 목표는?</h2>
              <p className="text-sm text-muted-foreground">목표에 맞는 콘텐츠를 추천해요</p>
            </div>
            
            <div className="space-y-3">
              {/* 취미 */}
              <button
                onClick={() => setSelectedGoal('hobby')}
                className={`w-full handmade-card p-4 flex items-center gap-4 transition-all duration-300 hover:scale-102 cursor-pointer group ${
                  selectedGoal === 'hobby' 
                    ? 'ring-2 ring-primary/50 bg-gradient-to-br from-primary/10 to-primary/5' 
                    : 'hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/2'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  selectedGoal === 'hobby'
                    ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white scale-110'
                    : 'bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 group-hover:scale-110'
                }`}>
                  <Palette className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className={`font-medium transition-colors duration-300 ${
                    selectedGoal === 'hobby' ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                  }`}>취미로 즐기기</h3>
                  <p className="text-xs text-muted-foreground">마음의 여유와 힐링을 위해</p>
                </div>
                {selectedGoal === 'hobby' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                )}
              </button>

              {/* 교육 */}
              <button
                onClick={() => setSelectedGoal('education')}
                className={`w-full handmade-card p-4 flex items-center gap-4 transition-all duration-300 hover:scale-102 cursor-pointer group ${
                  selectedGoal === 'education' 
                    ? 'ring-2 ring-primary/50 bg-gradient-to-br from-primary/10 to-primary/5' 
                    : 'hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/2'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  selectedGoal === 'education'
                    ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white scale-110'
                    : 'bg-gradient-to-br from-orange-100 to-red-100 text-orange-600 group-hover:scale-110'
                }`}>
                  <Users className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className={`font-medium transition-colors duration-300 ${
                    selectedGoal === 'education' ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                  }`}>아이와 함께</h3>
                  <p className="text-xs text-muted-foreground">초등학생 한자 교육용</p>
                </div>
                {selectedGoal === 'education' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                )}
              </button>

              {/* 예술 */}
              <button
                onClick={() => setSelectedGoal('artistic')}
                className={`w-full handmade-card p-4 flex items-center gap-4 transition-all duration-300 hover:scale-102 cursor-pointer group ${
                  selectedGoal === 'artistic' 
                    ? 'ring-2 ring-primary/50 bg-gradient-to-br from-primary/10 to-primary/5' 
                    : 'hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/2'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  selectedGoal === 'artistic'
                    ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white scale-110'
                    : 'bg-gradient-to-br from-teal-100 to-cyan-100 text-teal-600 group-hover:scale-110'
                }`}>
                  <Brush className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className={`font-medium transition-colors duration-300 ${
                    selectedGoal === 'artistic' ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                  }`}>예술적 표현</h3>
                  <p className="text-xs text-muted-foreground">작품 활동과 창작을 위해</p>
                </div>
                {selectedGoal === 'artistic' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                )}
              </button>
            </div>
          </div>

          {/* 완료 버튼 */}
          <div className="pt-6">
            <Button
              onClick={handleComplete}
              disabled={!isCompleted}
              className={`w-full h-14 text-base rounded-xl transition-all duration-300 ${
                isCompleted
                  ? 'ink-button text-primary-foreground hover:scale-105'
                  : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
              }`}
            >
              <span className="flex items-center gap-3">
                {isCompleted ? (
                  <>
                    <span>서예 여정 시작하기</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                ) : (
                  <span>모든 항목을 선택해주세요</span>
                )}
              </span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};