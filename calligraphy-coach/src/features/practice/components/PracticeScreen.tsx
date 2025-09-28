import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Progress } from '../../../components/ui/progress';
import { Badge } from '../../../components/ui/badge';
import { PracticeCanvas, getCanvasMethods, type Stroke } from './PracticeCanvas';
import { evaluateWithAI, type AIEvaluationResponse } from '../services/aiEvaluator';
import { evaluatePhotoMode } from '../services/photoEvaluator';
import { evaluationEngine } from '../evaluation';
import type { EvaluationRequest, EvaluationResponse } from '../evaluation';
import { Hwang92Checklist } from './Hwang92Checklist';
import { hwang92SebeobCourse } from '../../course/data/courses/hwang92-sebeop';
// Character Recognition 타입들 (임시)
interface RecognitionCandidate {
  character: string;
  confidence: number;
  type: 'korean' | 'chinese' | 'unknown';
}

interface RecognitionResult {
  topCandidate: RecognitionCandidate;
  candidates: RecognitionCandidate[];
  confidence: number;
  isReliable: boolean;
  timestamp: number;
}

interface EvaluationResult {
  형태: number;      // 40점 만점
  비례: number;      // 30점 만점  
  굵기: number;      // 20점 만점
  획순: number;      // 10점 만점
  총점: number;      // 100점 만점
  인식결과: RecognitionResult;
}

const HWANG92_EVALUATION_POINTS: Record<string, string[]> = {
  'h92-01': [
    '상단 횡획이 전체 폭을 덮는가',
    '하부 요소들이 완전히 덮개 안에 들어가는가',
    '덮개와 내부의 비례가 적절한가',
    '보호하는 느낌이 표현되는가',
  ],
  'h92-02': [
    '하단 받침이 충분히 넓은가',
    '상부 요소들이 안정적으로 받쳐지는가',
    '받침의 중심과 상부 중심이 일치하는가',
    '전체적인 안정감이 느껴지는가',
  ],
  'h92-03': [
    '왼쪽 요소가 낮은 위치에 있는가',
    '오른쪽 요소가 상대적으로 높은가',
    '좌우 높이차가 적절한가',
    '시각적 균형이 유지되는가',
  ],
  'h92-04': [
    '오른쪽 요소가 낮은 위치에 있는가',
    '왼쪽 요소가 상대적으로 높은가',
    '좌우 높이차가 자연스러운가',
    '전체 글자의 안정감이 유지되는가',
  ],
};
import { 
  ArrowLeft, 
  RotateCcw, 
  Eraser, 
  Camera, 
  Pen, 
  Eye,
  Play,
  Square,
  Check,
  Upload,
  X,
  RefreshCw
} from 'lucide-react';

export const PracticeScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ courseType?: string; lessonId?: string; sessionId?: string }>();
  const courseType = params.courseType;
  const lessonId = params.lessonId;
  const sessionIdFromParams = params.sessionId;
  
  // URL 파라미터에서 황자원 92 서법 확인
  const isHwang92FromUrl = location.pathname.includes('hwang92-sebeop');

  // location.state에서 데이터 가져오기
  const stateData = location.state as {
    courseId?: string;
    lessonId?: string;
    characters?: any[];
    mode?: 'canvas' | 'photo';
    fontStyle?: string;
    lessonTitle?: string;
    evaluationPoints?: string[];
  } | null;
  
  // 한자능력시험 특별판인 경우 HanjaLearnScreen으로 리다이렉트
  React.useEffect(() => {
    if (courseType?.startsWith('test-hanja-')) {
      navigate(`/hanja/${courseType}-${lessonId}`, { replace: true });
      return;
    }
  }, [courseType, lessonId, navigate]);
  
  // 디버깅: state 데이터 확인
  React.useEffect(() => {
    console.log('📍 PracticeScreen - location.state:', stateData);
    if (stateData?.courseId === 'hwang92-sebeop') {
      console.log('🎯 황자원 92 서법 데이터 감지됨:', {
        lessonId: stateData.lessonId,
        characters: stateData.characters,
        lessonTitle: stateData.lessonTitle
      });
    }
  }, [stateData]);

  // 황자원 92 서법 판별 - URL이나 state에 명시적으로 있을 때만
  const resolvedCourseId = stateData?.courseId || (isHwang92FromUrl ? 'hwang92-sebeop' : courseType);
  const derivedLessonIdFromSession = sessionIdFromParams?.startsWith('hwang92-')
    ? sessionIdFromParams.replace('hwang92-', '').split('-')[0]
    : undefined;
  const resolvedLessonId = stateData?.lessonId || lessonId || derivedLessonIdFromSession;
  const isHwang92 = (resolvedCourseId === 'hwang92-sebeop' || isHwang92FromUrl) && !!resolvedLessonId;
  const hwangLesson = isHwang92
    ? hwang92SebeobCourse.lessons.find((lesson) => lesson.id === resolvedLessonId) || hwang92SebeobCourse.lessons[0]
    : undefined;
  const hwangCharacters = isHwang92
    ? (stateData?.characters?.map((c: any) => c.character) ??
       hwangLesson?.characters.map((c) => c.character) ??
       [])
    : [];
  const hwangEvaluationPoints = isHwang92
    ? (stateData?.evaluationPoints ??
       (hwangLesson ? HWANG92_EVALUATION_POINTS[hwangLesson.id] ?? [] : []))
    : [];
  const hwangLessonTitle = isHwang92
    ? stateData?.lessonTitle ?? hwangLesson?.title ?? '황자원 92 서법'
    : undefined;
  
  // 세션 ID 생성 함수
  const generateSessionId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    if (isHwang92) {
      return `hwang92-${resolvedLessonId}-${timestamp}-${random}`;
    }
    return `practice-${timestamp}-${random}`;
  };
  
  const sessionId = sessionIdFromParams ?? generateSessionId();

  
  // 한자능력시험이면 빈 화면 반환 (리다이렉트 처리 중)
  if (courseType?.startsWith('test-hanja-')) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto animate-pulse">
            <div className="w-6 h-6 rounded-full bg-primary animate-spin"></div>
          </div>
          <p className="text-muted-foreground">학습 페이지로 이동 중...</p>
        </div>
      </div>
    );
  }
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [practiceMode, setPracticeMode] = useState<'digital' | 'photo'>(() => {
    if (stateData?.mode) {
      return stateData.mode;
    }
    // 황자원 92 서법이 명시적으로 확인될 때만 photo 모드로 시작
    return isHwang92 ? 'photo' : 'digital';
  });
  
  // 황자원 92 서법일 때만 photo 모드 강제 (무한 루프 방지)
  useEffect(() => {
    if (isHwang92 && practiceMode === 'digital') {
      setPracticeMode('photo');
    }
  }, [isHwang92]); // practiceMode를 dependency에서 제거하여 무한 루프 방지
  const [showStrokeGuide, setShowStrokeGuide] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [capturedStrokes, setCapturedStrokes] = useState<Stroke[]>([]);
  const [clearTrigger, setClearTrigger] = useState(0);
  const [undoTrigger, setUndoTrigger] = useState(0);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [aiEvaluation, setAiEvaluation] = useState<AIEvaluationResponse | null>(null);
  const [useAI, setUseAI] = useState(true); // AI 평가 사용 여부
  const [showJamoGuide, setShowJamoGuide] = useState(true); // 판본체 자모 가이드 표시

  // 한자/한글 모드 감지
  const isHanjaMode = sessionId?.startsWith('hanja_');

  // 한글 글자를 자모로 분해하는 함수
  const decomposeHangul = (char: string): string[] => {
    if (char === '작') return ['ㅈ', 'ㅏ', 'ㄱ'];
    if (char === '나') return ['ㄴ', 'ㅏ'];
    if (char === '다') return ['ㄷ', 'ㅏ'];
    if (char === '라') return ['ㄹ', 'ㅏ'];
    if (char === '마') return ['ㅁ', 'ㅏ'];
    if (char === '가') return ['ㄱ', 'ㅏ'];
    return [char]; // 분해할 수 없으면 원래 글자 반환
  };
  
  // 연습 데이터 구성
  const practiceSession = (() => {
    // 황자원 92 서법인 경우
    if (isHwang92 && hwangCharacters.length > 0) {
      return {
        id: resolvedLessonId || 'hwang92',
        course: '황자원 92 서법',
        lessonTitle: hwangLessonTitle,
        characters: hwangCharacters,
        currentCharacter: hwangCharacters[0],
        totalCharacters: hwangCharacters.length,
        type: 'hanja' as const,
        evaluationPoints: hwangEvaluationPoints,
      } as const;
    }
    // 기존 한자 모드
    else if (isHanjaMode) {
      return {
        id: sessionId,
        course: '기초 한자',
        characters: ['宇', '宙', '星', '月', '日'],
        currentCharacter: '宇',
        totalCharacters: 5,
        type: 'hanja' as const
      };
    }
    // 기본 한자 모드 (황자원 92 서법이 아닌 일반 한자 연습)
    else {
      return {
        id: sessionId,
        course: '기초 한자',
        characters: ['宇', '宙', '家', '安', '宿'],
        currentCharacter: '宇',
        totalCharacters: 5,
        type: 'hanja' as const
      };
    }
  })();

  const currentCharacter = practiceSession.characters[currentCharacterIndex];
  const progress = ((currentCharacterIndex + 1) / practiceSession.totalCharacters) * 100;

  // 스트로크 완료 콜백
  const handleStrokeComplete = (stroke: Stroke) => {
    setCapturedStrokes(prev => [...prev, stroke]);
    console.log('📝 새로운 스트로크 캡처:', {
      type: stroke.characteristics?.type,
      points: stroke.points.length,
      duration: stroke.duration,
      velocity: stroke.velocity
    });
  };

  // Canvas 제어 함수들
  const clearCanvas = () => {
    setClearTrigger(prev => prev + 1);
    setCapturedStrokes([]);
  };

  const undoLastStroke = () => {
    setUndoTrigger(prev => prev + 1);
    setCapturedStrokes(prev => prev.slice(0, -1));
  };

  // 카메라 시작
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1920 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraReady(true);
      }
    } catch (error) {
      console.error('카메라 접근 실패:', error);
      alert('카메라를 사용할 수 없습니다. 이미지 업로드를 이용해주세요.');
      setCameraReady(true); // UI는 계속 표시
    }
  };

  // 카메라 정지
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // 사진 촬영
  const capturePhoto = () => {
    if (videoRef.current) {
      // Canvas 생성하여 비디오 프레임 캡처
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // 정상 방향으로 저장 (거울 효과 없이)
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        const imageData = canvas.toDataURL('image/png');
        setCapturedImage(imageData);
        stopCamera(); // 카메라 정지
      }
    }
  };

  // 이미지 파일 업로드
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
        stopCamera(); // 카메라 정지
      };
      reader.readAsDataURL(file);
    }
  };

  // 컴포넌트 언마운트 시 카메라 정리
  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // 실물 모드 전환 시 카메라 시작
  React.useEffect(() => {
    if (practiceMode === 'photo' && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [practiceMode, capturedImage]);

  // Canvas에서 이미지 데이터 추출
  const getCanvasImageData = (): ImageData | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  };

  // 개선된 문자 인식 함수 (Canvas 이미지 기반 간단한 분석)
  const recognizeCharacter = (imageData: ImageData): RecognitionResult => {
    const targetChar = currentCharacter;
    
    // Canvas 이미지의 픽셀 데이터 분석 (간소화)
    const { data, width, height } = imageData;
    let blackPixelCount = 0;
    let totalPixels = width * height;
    
    // 검은색/어두운 픽셀 수 계산
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / 3;
      if (brightness < 200) { // 어두운 픽셀
        blackPixelCount++;
      }
    }
    
    // 획이 그려진 비율 계산
    const strokeCoverage = blackPixelCount / totalPixels;
    
    // 획 수와 coverage를 기반으로 인식 정확도 계산
    const expectedStrokeCount = getExpectedStrokeCount(targetChar);
    const actualStrokeCount = capturedStrokes.length;
    const strokeCountDiff = Math.abs(expectedStrokeCount - actualStrokeCount);
    
    // 획수가 비슷하고 적절한 coverage가 있으면 높은 확률로 맞다고 판단
    let recognitionScore = 0.5; // 기본 50%
    
    // 획수가 정확하면 +30%
    if (strokeCountDiff === 0) recognitionScore += 0.3;
    else if (strokeCountDiff === 1) recognitionScore += 0.15;
    
    // Coverage가 적절하면 +20% (너무 적거나 많으면 감점)
    if (strokeCoverage > 0.01 && strokeCoverage < 0.3) {
      recognitionScore += 0.2 * (1 - Math.abs(strokeCoverage - 0.1) / 0.2);
    }
    
    // 랜덤 요소 약간 추가 (±10%)
    recognitionScore += (Math.random() - 0.5) * 0.2;
    recognitionScore = Math.max(0.1, Math.min(0.95, recognitionScore));
    
    const isCorrect = recognitionScore > 0.5;
    
    // 오인식 시 비슷한 글자 선택
    const similarChars = isHanjaMode ? 
      ['人', '大', '天', '太', '夫'] : 
      ['나', '다', '라', '마', '바'];
    const wrongChar = similarChars[Math.floor(Math.random() * similarChars.length)];
    
    const topCandidate: RecognitionCandidate = {
      character: isCorrect ? targetChar : wrongChar,
      confidence: isCorrect ? recognitionScore : (1 - recognitionScore) * 0.7,
      type: isHanjaMode ? 'chinese' : 'korean'
    };

    const candidates: RecognitionCandidate[] = [
      topCandidate,
      {
        character: targetChar,
        confidence: recognitionScore,
        type: isHanjaMode ? 'chinese' : 'korean'
      },
      {
        character: wrongChar,
        confidence: 1 - recognitionScore,
        type: isHanjaMode ? 'chinese' : 'korean'
      }
    ];

    return {
      topCandidate,
      candidates: candidates.sort((a, b) => b.confidence - a.confidence).slice(0, 3),
      confidence: topCandidate.confidence,
      isReliable: topCandidate.confidence >= 0.7,
      timestamp: Date.now()
    };
  };

  // 서예 평가 함수
  const evaluateCalligraphy = (strokes: Stroke[], imageData: ImageData, targetChar: string): EvaluationResult => {
    const recognitionResult = recognizeCharacter(imageData);
    
    // 기본 점수 계산
    let 형태점수 = 20; // 40점 만점의 기본 50%
    let 비례점수 = 15; // 30점 만점의 기본 50% 
    let 굵기점수 = 10; // 20점 만점의 기본 50%
    let 획순점수 = 5;  // 10점 만점의 기본 50%

    // 인식 결과에 따른 형태 점수 조정
    if (recognitionResult.topCandidate.character === targetChar) {
      형태점수 = Math.min(40, 20 + recognitionResult.confidence * 20);
    } else {
      형태점수 = Math.max(5, recognitionResult.confidence * 15);
    }

    // 스트로크 분석으로 비례 점수 조정
    if (strokes.length > 0) {
      const bounds = getStrokeBounds(strokes);
      const 중심벗어남 = Math.abs(bounds.centerX - 200) + Math.abs(bounds.centerY - 200);
      const 크기적절성 = Math.min(bounds.width, bounds.height) / Math.max(bounds.width, bounds.height);
      
      // 중심 점수 (최대 15점): 중심에서 멀어질수록 감점
      const 중심점수 = Math.max(0, 15 - (중심벗어남 / 20));
      
      // 비례 점수 (최대 15점): 정사각형에 가까울수록 높은 점수
      const 비례균형점수 = 크기적절성 * 15;
      
      비례점수 = Math.min(30, Math.max(5, 중심점수 + 비례균형점수));
    }

    // 획 굵기 일관성 평가
    if (strokes.length > 0) {
      const 압력편차 = calculatePressureVariation(strokes);
      // 압력 편차가 낮을수록 높은 점수 (0~0.5 범위로 가정)
      굵기점수 = Math.min(20, Math.max(5, 20 - (압력편차 * 30)));
    }

    // 획순 평가 (단순화)
    const 예상획수 = getExpectedStrokeCount(targetChar);
    const 실제획수 = strokes.length;
    const 획수차이 = Math.abs(예상획수 - 실제획수);
    획순점수 = Math.max(2, 10 - (획수차이 * 2));

    // 각 점수가 최대값을 넘지 않도록 보장
    형태점수 = Math.min(40, Math.max(0, 형태점수));
    비례점수 = Math.min(30, Math.max(0, 비례점수));
    굵기점수 = Math.min(20, Math.max(0, 굵기점수));
    획순점수 = Math.min(10, Math.max(0, 획순점수));

    const 총점 = Math.round(형태점수 + 비례점수 + 굵기점수 + 획순점수);

    return {
      형태: Math.round(형태점수),
      비례: Math.round(비례점수),
      굵기: Math.round(굵기점수),
      획순: Math.round(획순점수),
      총점: Math.min(100, 총점), // 총점도 100점을 넘지 않도록
      인식결과: recognitionResult
    };
  };

  // 헬퍼 함수들
  const getStrokeBounds = (strokes: Stroke[]) => {
    if (strokes.length === 0) return { centerX: 200, centerY: 200, width: 0, height: 0 };
    
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    
    strokes.forEach(stroke => {
      stroke.points.forEach(point => {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);
      });
    });
    
    return {
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2,
      width: maxX - minX,
      height: maxY - minY
    };
  };

  const calculatePressureVariation = (strokes: Stroke[]): number => {
    const pressures: number[] = [];
    strokes.forEach(stroke => {
      stroke.points.forEach(point => {
        if (point.pressure) pressures.push(point.pressure);
      });
    });
    
    if (pressures.length === 0) return 0;
    
    const avg = pressures.reduce((a, b) => a + b, 0) / pressures.length;
    const variance = pressures.reduce((sum, p) => sum + Math.pow(p - avg, 2), 0) / pressures.length;
    return Math.sqrt(variance);
  };

  const getExpectedStrokeCount = (char: string): number => {
    const strokeCounts: Record<string, number> = {
      '가': 3, '나': 3, '다': 4, '라': 4, '마': 4,
      '바': 5, '사': 3, '아': 3, '자': 4, '차': 4, '작': 6,
      '宇': 6, '宙': 8, '星': 9, '月': 4, '日': 4
    };
    return strokeCounts[char] || 3;
  };

  // 실물 모드로 전환시 카메라 초기화
  React.useEffect(() => {
    if (practiceMode === 'photo') {
      setCameraReady(false);
      // 카메라 접근 시도
      setTimeout(() => {
        setCameraReady(true);
      }, 1000);
    }
  }, [practiceMode]);

  const handlePhotoCapture = () => {
    setIsCapturing(true);
    // 실제로는 Camera API 호출
    setTimeout(() => {
      setIsCapturing(false);
      // 촬영 완��� 후 처리
    }, 2000);
  };

  const handleComplete = async () => {
    // 사진 모드에서는 이미지가 있는지 확인
    if (practiceMode === 'photo') {
      if (!capturedImage) {
        alert('사진을 촬영하거나 업로드해주세요!');
        return;
      }
    } else {
      if (capturedStrokes.length === 0) {
        alert('글자를 그려주세요!');
        return;
      }
    }

    setIsEvaluating(true);
    console.log('🅾️ 평가 시작 - 모드:', practiceMode, ', AI 사용:', useAI);
    
    try {
      let finalEvaluation;
      let evalResponse;
      let evalRequest: EvaluationRequest | undefined;
      
      if (useAI) {
        // AI 평가 모드
        console.log('🤖 AI 평가 시작...');
        
        // Photo 모드에서는 Canvas 체크 스킵
        if (practiceMode === 'digital' || practiceMode === 'canvas') {
          const canvas = canvasRef.current;
          if (!canvas) {
            alert('Canvas를 찾을 수 없습니다.');
            setIsEvaluating(false);
            return;
          }
        }
        
        // 새로운 평가 시스템 사용
        let imageBase64;
        if (practiceMode === 'photo' && capturedImage) {
          // 사진 모드: capturedImage 사용
          imageBase64 = capturedImage.split(',')[1];
        } else if (canvas) {
          // Canvas 모드: canvas 사용
          imageBase64 = canvas.toDataURL('image/png').split(',')[1];
        } else {
          console.error('❌ 이미지를 가져올 수 없습니다');
          setIsEvaluating(false);
          return;
        }
        
        // 황자원 92법 서브타입 결정
        let hwang92SubType: '천복자' | '지재자' | '좌포자' | '우포자' | undefined;
        if (isHwang92 && resolvedLessonId) {
          const lessonMap: Record<string, '천복자' | '지재자' | '좌포자' | '우포자'> = {
            'h92-01': '천복자',
            'h92-02': '지재자',
            'h92-03': '좌포자',
            'h92-04': '우포자'
          };
          hwang92SubType = lessonMap[resolvedLessonId];
        }
        
        // fontStyle 명확히 설정
        let finalFontStyle = undefined;
        if (practiceMode === 'photo') {
          // stateData.fontStyle이 있으면 사용
          if (stateData?.fontStyle) {
            finalFontStyle = stateData.fontStyle;
          } else if (isHwang92) {
            // 황자원 92법은 항상 해서체
            finalFontStyle = '해서체';
          } else {
            // 기본값
            finalFontStyle = '해서체';
          }
        }
        
        console.log('🎨 fontStyle 설정:', {
          practiceMode,
          stateData_fontStyle: stateData?.fontStyle,
          isHwang92,
          finalFontStyle
        });
        
        evalRequest = {
          mode: practiceMode === 'photo' ? 'physical' : 'digital',
          courseId: isHwang92 ? 'hwang92-sebeop' : 'standard',
          lessonId: resolvedLessonId,
          targetCharacter: currentCharacter,
          strokeCount: capturedStrokes.length,
          imageBase64,
          fontStyle: finalFontStyle,
          hwang92SubType
        };
        
        console.log('🎯 평가 요청 데이터:', {
          mode: evalRequest.mode,
          courseId: evalRequest.courseId,
          fontStyle: evalRequest.fontStyle,
          hwang92SubType: evalRequest.hwang92SubType,
          practiceMode,
          stateData
        });
        
        evalResponse = await evaluationEngine.evaluate(evalRequest);
        
        // AI 평가 결과를 기존 형식으로 변환 (호환성 유지)
        const aiResult = {
          scores: {
            항목1: { 
              name: Object.keys(evalResponse.scores.breakdown)[0] || '형태', 
              score: Object.values(evalResponse.scores.breakdown)[0] || 0,
              maxScore: practiceMode === 'canvas' ? 50 : 40
            },
            항목2: {
              name: Object.keys(evalResponse.scores.breakdown)[1] || '비례',
              score: Object.values(evalResponse.scores.breakdown)[1] || 0,
              maxScore: 30
            },
            항목3: {
              name: Object.keys(evalResponse.scores.breakdown)[2] || '굵기',
              score: Object.values(evalResponse.scores.breakdown)[2] || 0,
              maxScore: practiceMode === 'canvas' ? 15 : 20
            },
            항목4: {
              name: Object.keys(evalResponse.scores.breakdown)[3] || '획순',
              score: Object.values(evalResponse.scores.breakdown)[3] || 0,
              maxScore: practiceMode === 'canvas' ? 5 : 10
            }
          },
          recognition: {
            character: currentCharacter,
            confidence: evalResponse.scores.total / 100,
            isCorrect: evalResponse.scores.total > 70
          },
          총평: evalResponse.feedback.summary,
          checklist: evalResponse.checklist.hwang92 ? 
            Object.fromEntries(evalResponse.checklist.hwang92.map(item => [item.id, item.checked])) :
            Object.fromEntries(evalResponse.checklist.basic.map(item => [item.id, item.checked])),
          strengths: evalResponse.feedback.strengths,
          improvements: evalResponse.feedback.improvements
        };
        
        setAiEvaluation(aiResult);
        
        finalEvaluation = {
          형태: aiResult.scores.항목1.score,
          비례: aiResult.scores.항목2.score,
          굵기: aiResult.scores.항목3.score,
          획순: aiResult.scores.항목4?.score || 0,
          총점: evalResponse.scores.total,
          인식결과: {
            topCandidate: {
              character: aiResult.recognition.character,
              confidence: aiResult.recognition.confidence,
              type: isHanjaMode ? 'chinese' as const : 'korean' as const
            },
            candidates: [],
            confidence: aiResult.recognition.confidence,
            isReliable: aiResult.recognition.confidence >= 0.7,
            timestamp: Date.now()
          },
          // AI 평가 결과 추가 정보
          aiEvaluation: aiResult,
          // 새로운 평가 시스템 응답 추가 - 필수!
          fullEvaluation: evalResponse
        };
        
        console.log('✅ finalEvaluation.fullEvaluation 존재:', !!finalEvaluation.fullEvaluation);
        
        console.log('🎯 AI 평가 결과:', aiResult);
        
      } else {
        // 기존 Canvas 기반 평가
        const imageData = getCanvasImageData();
        if (!imageData) {
          alert('Canvas 데이터를 가져올 수 없습니다.');
          setIsEvaluating(false);
          return;
        }
        
        const basicEval = evaluateCalligraphy(capturedStrokes, imageData, currentCharacter);
        
        // Canvas 평가를 위한 기본 evalResponse 생성
        const canvas = canvasRef.current;
        const imageBase64 = canvas ? canvas.toDataURL('image/png').split(',')[1] : '';
        
        evalRequest = {
          mode: 'digital',
          courseId: 'standard',
          lessonId: undefined,
          targetCharacter: currentCharacter,
          strokeCount: capturedStrokes.length,
          imageBase64,
          fontStyle: undefined,
          hwang92SubType: undefined
        };
        
        evalResponse = await evaluationEngine.evaluate(evalRequest);
        
        finalEvaluation = {
          ...basicEval,
          fullEvaluation: evalResponse
        };
      }
      
      setEvaluationResult(finalEvaluation);
      
      // 평가 결과와 함께 결과 페이지로 이동
      setTimeout(() => {
        try {
          // 이미지 캡처 (사진 모드 또는 Canvas)
          let canvasImageData;
          if (practiceMode === 'photo' && capturedImage) {
            canvasImageData = capturedImage;
          } else {
            const canvas = canvasRef.current;
            canvasImageData = canvas ? canvas.toDataURL('image/png') : null;
          }
          
          // evaluation 필드가 확실히 있는지 확인
          const evaluationData = finalEvaluation?.fullEvaluation || evalResponse;
          
          if (!evaluationData) {
            console.error('❌ evaluation 데이터가 없습니다!');
            console.log('finalEvaluation:', finalEvaluation);
            console.log('evalResponse:', evalResponse);
          }
          
          const navigationData = {
            // ResultScreenV2를 위한 데이터
            evaluation: evaluationData,
            canvasImage: canvasImageData,
            character: currentCharacter,
            courseId: resolvedCourseId || stateData?.courseId || 'standard',
            fontStyle: evalRequest?.fontStyle || stateData?.fontStyle || (practiceMode === 'photo' ? '해서체' : undefined),
            // 기존 ResultScreen을 위한 데이터 (호환성)
            evaluationResult: finalEvaluation,
            targetCharacter: currentCharacter,
            strokeCount: capturedStrokes.length,
            useAI,
            aiEvaluation: finalEvaluation.aiEvaluation || null,
            lessonId: resolvedLessonId
          };
          
          console.log('🚀 ResultScreenV2로 전달할 데이터:', {
            hasEvaluation: !!navigationData.evaluation,
            evaluation: navigationData.evaluation,
            courseId: navigationData.courseId,
            fontStyle: navigationData.fontStyle,
            practiceMode
          });
          console.log('🔄 ResultScreenV2로 이동 시작...');
          
          navigate(`/result-v2/attempt_${Date.now()}`, {
            state: navigationData
          });
        } catch (navError) {
          console.error('❌ ResultScreen 이동 중 오류:', navError);
          alert('결과 페이지로 이동하는 중 오류가 발생했습니다.');
        }
      }, 1000); // 1초로 단축
      
    } catch (error) {
      console.error('평가 중 오류:', error);
      alert('평가 중 오류가 발생했습니다.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNext = () => {
    if (currentCharacterIndex < practiceSession.characters.length - 1) {
      setCurrentCharacterIndex(prev => prev + 1);
      clearCanvas();
    } else {
      // 세션 완료
      handleComplete();
    }
  };

  const handleExit = () => {
    if (window.confirm('연습을 종료하시겠습니까? 현재 진행 상황이 저장됩니다.')) {
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen calligraphy-bg flex flex-col">
      {/* 상단 바 */}
      <header className="px-6 py-4 organic-header">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(`/learn/${courseType}/curriculum`)}
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 mx-4">
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-primary">
                {currentCharacterIndex + 1}/{practiceSession.totalCharacters}
              </p>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">{practiceSession.course}</p>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 px-6 py-6">
        <div className="max-w-md mx-auto space-y-6 h-full">
          {/* 현재 글자 표시 */}
          <div className="character-display p-8 text-center">
            <h2 className="text-sm text-muted-foreground mb-4">연습할 글자</h2>
            <div className="text-8xl font-medium text-primary mb-6 ink-splash relative">
              {currentCharacter}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full"></div>
            </div>
            
            {/* 황자원 92 서법 평가 포인트 표시 */}
            {isHwang92 && practiceSession.evaluationPoints && practiceSession.evaluationPoints.length > 0 && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h3 className="text-sm font-semibold text-amber-900 mb-2">평가 포인트</h3>
                <ul className="space-y-1">
                  {practiceSession.evaluationPoints.map((point: string, index: number) => (
                    <li key={index} className="flex items-start text-xs text-amber-800">
                      <span className="mr-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* 판본체 자모 가이드 */}
            {!isHanjaMode && showJamoGuide && (
              <div className="space-y-4">
                <h3 className="text-sm text-muted-foreground">판본체 자모 구성</h3>
                <div className="flex justify-center items-center gap-4">
                  {decomposeHangul(currentCharacter).map((jamo, index) => (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 bg-white border-2 border-gray-200 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                        <img 
                          src={`/images/panbon/${jamo}.png`}
                          alt={`판본체 ${jamo}`}
                          className="w-12 h-12 object-contain"
                          onError={(e) => {
                            // 이미지 로드 실패 시 텍스트로 대체
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<span class="text-2xl font-bold text-gray-600">${jamo}</span>`;
                            }
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{jamo}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-center items-center gap-4 mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowStrokeGuide(!showStrokeGuide)}
                className="text-muted-foreground hover:text-primary"
              >
                <Eye className="w-4 h-4 mr-1" />
                {showStrokeGuide ? '획순 숨기기' : '획순 보기'}
              </Button>
              
              {!isHanjaMode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowJamoGuide(!showJamoGuide)}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Square className="w-4 h-4 mr-1" />
                  {showJamoGuide ? '자모 숨기기' : '자모 보기'}
                </Button>
              )}
            </div>
          </div>

          {/* 연습 모드 전환 */}
          <Tabs value={practiceMode} onValueChange={(value) => setPracticeMode(value as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="digital" className="flex items-center gap-2">
                <Pen className="w-4 h-4" />
                디지털
              </TabsTrigger>
              <TabsTrigger value="photo" className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                실물
              </TabsTrigger>
            </TabsList>

            {/* 디지털 모드 */}
            <TabsContent value="digital" className="space-y-6">
              <div className="handmade-card p-6">
                <div className="space-y-6">
                  <div className="relative">
                    <PracticeCanvas
                      ref={canvasRef}
                      size={400}
                      className="w-full canvas-frame"
                      showGrid={true}
                      onStrokeComplete={handleStrokeComplete}
                      onDrawingStart={() => console.log('🎨 드로잉 시작')}
                      onDrawingEnd={() => console.log('✅ 드로잉 종료')}
                      brushSize={10}
                      brushColor="#2C3E50"
                      clearTrigger={clearTrigger}
                      undoTrigger={undoTrigger}
                    />
                    
                    {showStrokeGuide && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="relative">
                          <span 
                            className="text-[16rem] text-gray-300 leading-none"
                            style={{ 
                              fontFamily: 'serif',
                              fontWeight: 'normal',
                              opacity: 0.3
                            }}
                          >
                            {currentCharacter}
                          </span>
                          {/* 한글 획순 가이드 */}
                          {!isHanjaMode && (
                            <>
                              {/* 첫 번째 획 시작점 (ㄱ) */}
                              <div className="absolute top-[15%] left-[10%] w-4 h-4 bg-red-500 rounded-full shadow-lg animate-pulse border-2 border-white">
                                <div className="absolute inset-0 bg-red-400 rounded-full animate-ping"></div>
                              </div>
                              {/* 첫 번째 획 방향 화살표 */}
                              <div className="absolute top-[15%] left-[15%]">
                                <svg width="24" height="12" viewBox="0 0 24 12" className="text-red-500">
                                  <path d="M2 6 L18 6 M15 3 L18 6 L15 9" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                              
                              {/* 두 번째 획 시작점 (ㅏ) */}
                              <div className="absolute top-[15%] right-[25%] w-3 h-3 bg-red-500 rounded-full shadow-lg animate-pulse border-2 border-white">
                                <div className="absolute inset-0 bg-red-400 rounded-full animate-ping"></div>
                              </div>
                            </>
                          )}
                          
                          {/* 한자 획순 가이드 - 宇 */}
                          {isHanjaMode && currentCharacter === '宇' && (
                            <>
                              {/* 첫 번째 획: 갓머리 가로획 */}
                              <div className="absolute top-[18%] left-[20%] w-4 h-4 bg-blue-500 rounded-full shadow-lg animate-pulse border-2 border-white">
                                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping"></div>
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-blue-600 font-bold">1</div>
                              </div>
                              
                              {/* 두 번째 획: 갓머리 세로+가로 */}
                              <div className="absolute top-[25%] left-[35%] w-3 h-3 bg-green-500 rounded-full shadow-lg animate-pulse border-2 border-white">
                                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping"></div>
                                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs text-green-600 font-bold">2</div>
                              </div>
                              
                              {/* 세 번째 획: 가로획 */}
                              <div className="absolute top-[45%] left-[25%] w-3 h-3 bg-orange-500 rounded-full shadow-lg animate-pulse border-2 border-white">
                                <div className="absolute inset-0 bg-orange-400 rounded-full animate-ping"></div>
                                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs text-orange-600 font-bold">3</div>
                              </div>
                              
                              {/* 네 번째 획: 세로획 */}
                              <div className="absolute top-[55%] left-[50%] w-3 h-3 bg-purple-500 rounded-full shadow-lg animate-pulse border-2 border-white">
                                <div className="absolute inset-0 bg-purple-400 rounded-full animate-ping"></div>
                                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs text-purple-600 font-bold">4</div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" size="sm" onClick={clearCanvas}>
                      <Eraser className="w-4 h-4 mr-1" />
                      지우기
                    </Button>
                    <Button variant="outline" size="sm" onClick={undoLastStroke}>
                      <RotateCcw className="w-4 h-4 mr-1" />
                      되돌리기
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 실물 모드 */}
            <TabsContent value="photo" className="space-y-6">
              <div className="handmade-card p-6">
                <div className="space-y-4">
                  {/* 카메라/이미지 표시 영역 */}
                  <div className="aspect-square bg-gray-100 rounded-lg relative overflow-hidden">
                    {!capturedImage ? (
                      <>
                        {/* 카메라 스트림 */}
                        <video 
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                        />
                        
                        {/* 격자 오버레이 */}
                        <div className="absolute inset-0 pointer-events-none z-10">
                          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {/* 3x3 격자 */}
                            <defs>
                              <pattern id="camera-grid" width="33.33" height="33.33" patternUnits="userSpaceOnUse">
                                <path d="M 33.33 0 L 0 0 0 33.33" fill="none" stroke="rgba(59,130,246,0.3)" strokeWidth="0.5"/>
                              </pattern>
                            </defs>
                            <rect width="100" height="100" fill="url(#camera-grid)" />
                            
                            {/* 중앙선 강조 */}
                            <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(59,130,246,0.5)" strokeWidth="1"/>
                            <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(59,130,246,0.5)" strokeWidth="1"/>
                          </svg>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* 촬영/업로드된 이미지 */}
                        <img 
                          src={capturedImage}
                          alt="촬영된 서예"
                          className="w-full h-full object-contain bg-white"
                        />
                        
                        {/* 다시 찍기 버튼 */}
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-4 right-4 z-20"
                          onClick={() => {
                            setCapturedImage(null);
                            startCamera();
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    
                    {/* 가운데 표시점 */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                      <div className="w-4 h-4 bg-white rounded-full shadow-lg border-2 border-black/30">
                        <div className="w-2 h-2 bg-black rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                      </div>
                      {/* 십자선 */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-8 h-0.5 bg-white/80 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="h-8 w-0.5 bg-white/80 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                      </div>
                    </div>
                    
                    {/* 가이드 글자 (반투명) */}
                    {showStrokeGuide && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-15">
                        <span className="text-[16rem] text-white/30 font-black leading-none">
                          {currentCharacter}
                        </span>
                      </div>
                    )}
                    
                    {/* 카메라 로딩 상태 */}
                    {!cameraReady && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30">
                        <div className="text-center space-y-4">
                          <Camera className="w-16 h-16 text-white/60 mx-auto" />
                          <p className="text-sm text-white/80">���메라를 준비하는 중...</p>
                        </div>
                      </div>
                    )}
                    
                    {/* 촬영 중 오버레이 */}
                    {isCapturing && (
                      <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-40">
                        <div className="text-center space-y-4">
                          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                          <p className="text-sm text-primary">촬영 중...</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* 실물 모드 버튼들 */}
                  {!capturedImage ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          variant="outline"
                          onClick={() => setShowStrokeGuide(!showStrokeGuide)}
                          className="h-12"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          {showStrokeGuide ? '가이드 숨기기' : '가이드 보기'}
                        </Button>
                        <Button 
                          onClick={capturePhoto}
                          disabled={!cameraReady}
                          className="h-12"
                        >
                          <Camera className="w-5 h-5 mr-2" />
                          촬영하기
                        </Button>
                      </div>
                      
                      {/* 이미지 업로드 버튼 */}
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <Button 
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-12"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        이미 쓴 글씨 업로드
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setCapturedImage(null);
                          startCamera();
                        }}
                        className="h-12"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        다시 촬영
                      </Button>
                      <Button 
                        onClick={async () => {
                          // 실물 모드 평가
                          if (!capturedImage) {
                            alert('먼저 사진을 촬영하거나 업로드해주세요!');
                            return;
                          }
                          
                          setIsEvaluating(true);
                          
                          try {
                            // handleComplete 함수 호출 (통합 평가 로직)
                            console.log('📸 사진 평가 시작 - fontStyle:', stateData?.fontStyle);
                            await handleComplete();
                            // handleComplete에서 모든 처리를 수행함 (평가 결과 설정, 페이지 이동 등)
                            
                          } catch (error) {
                            console.error('평가 중 오류:', error);
                            alert('평가 중 오류가 발생했습니다.');
                          } finally {
                            setIsEvaluating(false);
                          }
                        }}
                        disabled={isEvaluating}
                        className="h-12 bg-primary text-primary-foreground"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        {isEvaluating ? (
                          <>
                            <div className="flex items-center gap-2">
                              <div className="relative">
                                <svg className="w-5 h-5 text-white animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                                </svg>
                                <div className="absolute -inset-1 bg-white/30 rounded-full animate-ping"></div>
                              </div>
                              <span className="text-sm">AI 분석 중</span>
                            </div>
                          </>
                        ) : 'AI 평가 받기'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* 평가 결과 표시 */}
          {evaluationResult && (
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="space-y-3">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-primary">평가 결과</h3>
                  <div className="text-3xl font-bold text-blue-600 mt-2">
                    {evaluationResult.총점}점
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>{isHwang92 ? '덮개구조' : '형태'} (40점):</span>
                    <span className="font-bold text-blue-600">{evaluationResult.형태}점</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isHwang92 ? '보호관계' : '비례'} (30점):</span>
                    <span className="font-bold text-green-600">{evaluationResult.비례}점</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isHwang92 ? '공간비례' : '굵기'} (20점):</span>
                    <span className="font-bold text-orange-600">{evaluationResult.굵기}점</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isHwang92 ? '결구완성도' : '획순'} (10점):</span>
                    <span className="font-bold text-purple-600">{evaluationResult.획순}점</span>
                  </div>
                </div>
                
                {/* 황자원 92법 체크리스트 표시 */}
                {console.log('🔍 체크리스트 렌더링 조건:', { 
                  isHwang92, 
                  resolvedCourseId,
                  resolvedLessonId,
                  hasAiEval: !!aiEvaluation, 
                  hasEvalResult: !!evaluationResult,
                  currentCharacter
                })}
                {/* 황자원 92법 체크리스트 - 무조건 표시 테스트 */}
                {aiEvaluation && (
                  <div className="mt-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-300 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">체</span>
                      </div>
                      <h4 className="text-sm font-bold text-purple-900">황자원 92법 체크리스트</h4>
                    </div>
                    
                    {/* 강제로 체크리스트 표시 */}
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-purple-800">AI 평가 데이터:</div>
                      <div className="text-xs bg-white p-2 rounded">
                        <div>✅ 덮개충분: {String(aiEvaluation?.checklist?.덮개충분 ?? 'undefined')}</div>
                        <div>✅ 내부안전: {String(aiEvaluation?.checklist?.내부안전 ?? 'undefined')}</div>
                        <div>✅ 비례적절: {String(aiEvaluation?.checklist?.비례적절 ?? 'undefined')}</div>
                        <div>✅ 안정감표현: {String(aiEvaluation?.checklist?.안정감표현 ?? 'undefined')}</div>
                      </div>
                    </div>
                    
                    {/* 전체 체크리스트 객체 디버그 */}
                    <details className="mt-3">
                      <summary className="text-xs font-semibold cursor-pointer text-purple-700">전체 체크리스트 데이터 보기</summary>
                      <div className="mt-2 p-2 bg-white rounded text-xs overflow-auto max-h-40">
                        <pre>{JSON.stringify(aiEvaluation?.checklist ?? {}, null, 2)}</pre>
                      </div>
                    </details>
                    
                    {/* AI 평가 전체 데이터 디버그 */}
                    <details className="mt-2">
                      <summary className="text-xs font-semibold cursor-pointer text-purple-700">AI 평가 전체 데이터 보기</summary>
                      <div className="mt-2 p-2 bg-white rounded text-xs overflow-auto max-h-40">
                        <pre>{JSON.stringify(aiEvaluation, null, 2)}</pre>
                      </div>
                    </details>
                  </div>
                )}
                
                <div className="border-t pt-2">
                  <div className="text-sm text-gray-600">
                    인식된 글자: <span className="font-bold text-lg">{evaluationResult.인식결과.topCandidate.character}</span>
                    {evaluationResult.인식결과.topCandidate.character === currentCharacter ? 
                      <span className="text-green-600 ml-2">✓ 정확</span> : 
                      <span className="text-red-600 ml-2">✗ 오인식</span>
                    }
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    신뢰도: {Math.round(evaluationResult.인식결과.confidence * 100)}%
                  </div>
                </div>
              </div>
            </Card>
          )}
          
          {/* 황자원 92법 체크리스트 - Card 밖에 독립적으로 표시 */}
          {console.log('🎯 체크리스트 렌더링 체크:', { 
            hasAiEval: !!aiEvaluation,
            aiEval: aiEvaluation,
            checklist: aiEvaluation?.checklist 
          })}
          {aiEvaluation && (
            <div className="mt-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-300 rounded-lg" style={{ minHeight: '300px' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">체</span>
                </div>
                <h4 className="text-sm font-bold text-purple-900">황자원 92법 체크리스트</h4>
              </div>
              
              {/* 강제로 체크리스트 표시 */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-purple-800">AI 평가 데이터:</div>
                <div className="text-xs bg-white p-2 rounded">
                  <div>✅ 덮개충분: {String(aiEvaluation?.checklist?.덮개충분 ?? 'undefined')}</div>
                  <div>✅ 내부안전: {String(aiEvaluation?.checklist?.내부안전 ?? 'undefined')}</div>
                  <div>✅ 비례적절: {String(aiEvaluation?.checklist?.비례적절 ?? 'undefined')}</div>
                  <div>✅ 안정감표현: {String(aiEvaluation?.checklist?.안정감표현 ?? 'undefined')}</div>
                </div>
              </div>
              
              {/* 전체 체크리스트 객체 디버그 */}
              <details className="mt-3">
                <summary className="text-xs font-semibold cursor-pointer text-purple-700">전체 체크리스트 데이터 보기</summary>
                <div className="mt-2 p-2 bg-white rounded text-xs overflow-auto max-h-40">
                  <pre>{JSON.stringify(aiEvaluation?.checklist ?? {}, null, 2)}</pre>
                </div>
              </details>
              
              {/* AI 평가 전체 데이터 디버그 */}
              <details className="mt-2">
                <summary className="text-xs font-semibold cursor-pointer text-purple-700">AI 평가 전체 데이터 보기</summary>
                <div className="mt-2 p-2 bg-white rounded text-xs overflow-auto max-h-40">
                  <pre>{JSON.stringify(aiEvaluation, null, 2)}</pre>
                </div>
              </details>
            </div>
          )}

          {/* 완료 버튼 - 디지털 모드에서만 표시 */}
          {practiceMode === 'digital' && (
            <Button 
              onClick={handleComplete}
              className="w-full h-12"
              size="lg"
              disabled={isEvaluating}
            >
            {isEvaluating ? (
              <>
                {/* AI 분석 애니메이션 */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    {/* 뇌 아이콘 */}
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9,2C7.89,2 7,2.89 7,4A3,3 0 0,0 4,7C4,8.11 4.89,9 6,9H7V10A3,3 0 0,0 4,13C4,14.11 4.89,15 6,15H7V16A3,3 0 0,0 4,19C4,20.11 4.89,21 6,21H18A3,3 0 0,0 21,18V16A3,3 0 0,0 18,13H17V12A3,3 0 0,0 20,9C20,7.89 19.11,7 18,7A3,3 0 0,0 15,4C15,2.89 14.11,2 13,2H9M9,4H13A1,1 0 0,1 14,5A1,1 0 0,0 15,6A1,1 0 0,1 16,7A1,1 0 0,0 17,8A1,1 0 0,1 18,9A1,1 0 0,0 19,10A1,1 0 0,1 18,11H17A1,1 0 0,0 16,12V13A1,1 0 0,1 17,14A1,1 0 0,0 18,15A1,1 0 0,1 19,16V18A1,1 0 0,1 18,19H6A1,1 0 0,1 5,18A1,1 0 0,0 6,17A1,1 0 0,1 7,16V15A1,1 0 0,1 6,14A1,1 0 0,0 5,13A1,1 0 0,1 6,12A1,1 0 0,0 7,11V10A1,1 0 0,1 6,9A1,1 0 0,0 5,8A1,1 0 0,1 6,7A1,1 0 0,0 7,6A1,1 0 0,1 8,5A1,1 0 0,0 9,4Z"/>
                    </svg>
                    {/* 펄스 효과 */}
                    <div className="absolute -inset-1 bg-white/30 rounded-full animate-ping"></div>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">🤖 AI 분석 중</span>
                    <span className="text-xs opacity-90">Google Gemini Vision</span>
                  </div>
                  {/* 사고하는 점들 */}
                  <div className="flex gap-1 ml-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Check className="w-5 h-5 mr-2" />
                평가 받기
              </>
            )}
          </Button>
          )}
        </div>
      </main>
    </div>
  );
};
