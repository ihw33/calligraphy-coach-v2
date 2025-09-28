import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { 
  ArrowLeft,
  ArrowRight,
  Brush,
  PenTool,
  Droplets,
  FileText,
  Palette,
  CheckCircle2,
  Info,
  Play
} from 'lucide-react';

export const ToolsGuideScreen: React.FC = () => {
  const navigate = useNavigate();
  const { courseType } = useParams<{ courseType: string }>();
  const [selectedMode, setSelectedMode] = useState<'brush' | 'pen'>('brush');

  // 로컬스토리지에서 사용자 설정 가져오기
  const userPreferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
  const initialMode = userPreferences.mode || 'brush';

  React.useEffect(() => {
    setSelectedMode(initialMode);
  }, [initialMode]);

  const brushTools = {
    hangul: {
      title: '한글 붓글씨 도구',
      essential: [
        { name: '붓', description: '중호 붓 (6-8mm)', icon: Brush, tip: '처음에는 중간 크기가 좋아요' },
        { name: '먹', description: '고체 먹 또는 액체 먹', icon: Droplets, tip: '농도 조절이 중요해요' },
        { name: '벼루', description: '돌벼루 또는 플라스틱 벼루', icon: Palette, tip: '먹을 갈 때 사용해요' },
        { name: '한지', description: '연습용 한지 또는 반지', icon: FileText, tip: '흡수성이 좋은 종이를 선택해요' }
      ],
      optional: [
        { name: '문진', description: '종이를 고정하는 도구' },
        { name: '필가름', description: '붓을 보관하는 받침' },
        { name: '물통', description: '붓을 씻을 때 사용' }
      ],
      preparation: [
        '작업 공간을 정리하고 신문지나 매트를 깔아주세요',
        '붓을 물에 적셔 털을 부드럽게 풀어주세요',
        '먹을 적당한 농도로 준비해주세요 (진하지 않게)',
        '한지를 평평하게 펼치고 문진으로 고정해주세요'
      ]
    },
    hanja: {
      title: '한자 붓글씨 도구',
      essential: [
        { name: '붓', description: '소호 붓 (4-6mm)', icon: Brush, tip: '한자는 좀 더 가는 붓이 좋아요' },
        { name: '먹', description: '농묵 (진한 먹)', icon: Droplets, tip: '한자는 진한 먹을 사용해요' },
        { name: '벼루', description: '전통 석벼루 권장', icon: Palette, tip: '먹을 갈 때 소리로 농도를 확인해요' },
        { name: '화선지', description: '전통 화선지', icon: FileText, tip: '한자 전용 화선지가 좋아요' }
      ],
      optional: [
        { name: '문진', description: '사각형 문진 권장' },
        { name: '필가름', description: '죽제 필가름' },
        { name: '인주', description: '낙관용 인주' }
      ],
      preparation: [
        '조용하고 밝은 공간에서 준비해주세요',
        '붓털을 충분히 물에 적셔 부드럽게 만들어주세요',
        '먹을 진하게 갈아주세요 (30회 이상)',
        '화선지를 편평하게 펼치고 무게중심을 잡아주세요'
      ]
    }
  };

  const penTools = {
    hangul: {
      title: '한글 펜글씨 도구',
      essential: [
        { name: '캘리그라피 펜', description: '2.0mm 평촉펜', icon: PenTool, tip: '너무 굵지 않은 것으로 시작해요' },
        { name: '연습지', description: '격자 연습지', icon: FileText, tip: '칸이 있는 종이가 도움돼요' },
        { name: '지우개', description: '부드러운 지우개', icon: Palette, tip: '너무 세게 지우지 마세요' }
      ],
      optional: [
        { name: '자', description: '격자선 그리기용' },
        { name: '연필', description: '밑그림 그리기용' },
        { name: '티슈', description: '펜 닦기용' }
      ],
      preparation: [
        '편안한 자세로 앉을 수 있는 책상을 준비해주세요',
        '조명이 충분한 곳에서 연습해주세요',
        '펜이 잘 나오는지 미리 확인해주세요',
        '연습지를 평평하게 놓고 시작해주세요'
      ]
    },
    hanja: {
      title: '한자 펜글씨 도구',
      essential: [
        { name: '붓펜', description: '중간 굵기 붓펜', icon: PenTool, tip: '한자는 붓펜이 더 적합해요' },
        { name: '격자 연습지', description: '정사각형 격자지', icon: FileText, tip: '한자 비례에 맞는 격자가 중요해요' },
        { name: '지우개', description: '연필용 지우개', icon: Palette, tip: '밑그림 지울 때 사용해요' }
      ],
      optional: [
        { name: '연필', description: '2B 연필 권장' },
        { name: '자', description: '격자선 긋기용' },
        { name: '물티슈', description: '붓펜 관리용' }
      ],
      preparation: [
        '바른 자세로 앉을 수 있도록 의자 높이를 조절해주세요',
        '붓펜의 털 끝이 뭉쳐있지 않은지 확인해주세요',
        '격자지에서 중심점을 확인해주세요',
        '연필로 가볍게 밑그림을 그려도 좋아요'
      ]
    }
  };

  const currentTools = selectedMode === 'brush' ? brushTools : penTools;
  const courseTools = currentTools[courseType as keyof typeof currentTools];

  const handleStart = () => {
    navigate(`/course/${courseType}/curriculum`);
  };

  if (!courseTools) {
    return <div>잘못된 코스입니다.</div>;
  }

  return (
    <div className="h-screen flex flex-col calligraphy-bg">
      {/* 헤더 */}
      <header className="flex-shrink-0 px-6 py-6 organic-header">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/course/${courseType}/info`)}
              className="w-10 h-10 rounded-full bg-muted/40 hover:bg-muted/60 flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="text-center">
              <h1 className="font-medium text-primary ink-splash">도구 준비</h1>
              <p className="text-sm text-muted-foreground">준비물과 세팅 방법</p>
            </div>
            <div className="w-10 h-10" />
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        <div className="max-w-md mx-auto space-y-6">
          
          {/* 모드 선택 */}
          <div className="handmade-card p-6 space-y-4">
            <h3 className="font-medium text-primary text-center mb-4">연습 모드 선택</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedMode('brush')}
                className={`p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                  selectedMode === 'brush'
                    ? 'bg-gradient-to-br from-primary/20 to-primary/10 ring-2 ring-primary/30'
                    : 'bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100'
                }`}
              >
                <div className="text-center space-y-2">
                  <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${
                    selectedMode === 'brush'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-amber-200 text-amber-700'
                  }`}>
                    <Brush className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-medium ${
                      selectedMode === 'brush' ? 'text-primary' : 'text-muted-foreground'
                    }`}>붓글씨</h4>
                    <p className="text-xs text-muted-foreground">전통 서예</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedMode('pen')}
                className={`p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                  selectedMode === 'pen'
                    ? 'bg-gradient-to-br from-primary/20 to-primary/10 ring-2 ring-primary/30'
                    : 'bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100'
                }`}
              >
                <div className="text-center space-y-2">
                  <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${
                    selectedMode === 'pen'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-blue-200 text-blue-700'
                  }`}>
                    <PenTool className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-medium ${
                      selectedMode === 'pen' ? 'text-primary' : 'text-muted-foreground'
                    }`}>펜글씨</h4>
                    <p className="text-xs text-muted-foreground">실용 캘리그라피</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* 필수 도구 */}
          <div className="handmade-card p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-primary">{courseTools.title}</h3>
                <Badge variant="outline" className="text-xs mt-1">필수 도구</Badge>
              </div>
            </div>
            
            <div className="space-y-4">
              {courseTools.essential.map((tool, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-emerald-50/50 to-green-50/50 border border-emerald-100/50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-200 to-emerald-300 flex items-center justify-center flex-shrink-0">
                    <tool.icon className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-primary">{tool.name}</h4>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                    {tool.tip && (
                      <div className="flex items-start gap-2 mt-2 p-2 bg-amber-50 rounded-lg">
                        <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-amber-700">{tool.tip}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 선택 도구 */}
          <div className="handmade-card p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-primary">선택 도구</h3>
                <Badge variant="outline" className="text-xs mt-1">있으면 더 좋은 도구</Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              {courseTools.optional.map((tool, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50/30 to-indigo-50/30">
                  <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0"></div>
                  <div>
                    <span className="text-sm font-medium text-primary">{tool.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">- {tool.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 준비 방법 */}
          <div className="handmade-card p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center">
                <Play className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-primary">준비 단계</h3>
                <Badge variant="outline" className="text-xs mt-1">차례대로 따라해주세요</Badge>
              </div>
            </div>
            
            <div className="space-y-4">
              {courseTools.preparation.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="pt-1">
                    <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 연습 시작 버튼 */}
          <div className="pt-4">
            <Button
              onClick={handleStart}
              className="w-full h-14 text-base rounded-xl ink-button text-primary-foreground hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center gap-3">
                <span>커리큘럼 보기</span>
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};