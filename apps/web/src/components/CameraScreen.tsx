import { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  RotateCcw,
  Image as ImageIcon,
  Settings,
  HelpCircle,
  Eraser,
  Palette,
} from 'lucide-react';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { cn } from './ui/utils';
import * as StrokeCaptureModule from '@calligraphy-coach/stroke-capture';
const { StrokeCapture } = StrokeCaptureModule;
import {
  StrokeStorage,
  getGlobalStrokeStorage,
  CapturedStroke,
} from '../lib/canvas/stroke-storage';
import { CameraCapture, CameraCaptureHandle } from './CameraCapture';
import {
  evaluateCalligraphy,
  EvaluationResult,
  generateReferenceMaskFromUrl,
} from '../lib/evaluation/basic-evaluator';

interface CameraScreenProps {
  onBack: () => void;
  onEvaluate: (result: EvaluationResult) => void;
}

const alignmentModes = [
  { id: 'center', label: '중심', description: '글자 중심점 정렬' },
  { id: 'frame', label: '테두리', description: '글자 외곽선 정렬' },
  { id: 'auto', label: '자동', description: 'AI 자동 정렬' },
];

export function CameraScreen({ onBack, onEvaluate }: CameraScreenProps) {
  const [guideOpacity, setGuideOpacity] = useState([70]);
  const [alignmentMode, setAlignmentMode] = useState('center');
  const [showTip, setShowTip] = useState(true);
  const [inputMode, setInputMode] = useState<'canvas' | 'camera'>('canvas');

  // Canvas 관련 상태
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captureRef = useRef<
    typeof StrokeCapture extends { new (...args: any[]): infer T } ? T : never
  >(new StrokeCapture());
  const storageRef = useRef<StrokeStorage>(getGlobalStrokeStorage());
  const cameraRef = useRef<CameraCaptureHandle | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(3);
  const [brushColor, setBrushColor] = useState('#000000');
  const [isEraser, setIsEraser] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<any[]>([]);
  const [allStrokes, setAllStrokes] = useState<CapturedStroke[]>([]);

  const isCameraMode = inputMode === 'camera';

  // Canvas 초기화
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      // Canvas 크기는 고정 (320x320)
      canvas.width = 320;
      canvas.height = 320;

      // Canvas 스타일 설정
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.fillStyle = 'transparent';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // 그리기 시작
  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawing(true);

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x =
      (e.type.includes('touch')
        ? (e as React.TouchEvent).touches[0].clientX - rect.left
        : (e as React.MouseEvent).clientX - rect.left) * scaleX;
    const y =
      (e.type.includes('touch')
        ? (e as React.TouchEvent).touches[0].clientY - rect.top
        : (e as React.MouseEvent).clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(x, y);

    // 현재 스트로크 시작
    setCurrentStroke([{ x, y, pressure: 1, timestamp: Date.now() }]);

    // StrokeCapture 시작
    captureRef.current.startStroke({ x, y, pressure: 1, timestamp: Date.now() });
  };

  // 그리기 중
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x =
      (e.type.includes('touch')
        ? (e as React.TouchEvent).touches[0].clientX - rect.left
        : (e as React.MouseEvent).clientX - rect.left) * scaleX;
    const y =
      (e.type.includes('touch')
        ? (e as React.TouchEvent).touches[0].clientY - rect.top
        : (e as React.MouseEvent).clientY - rect.top) * scaleY;

    ctx.lineWidth = brushSize;
    ctx.strokeStyle = isEraser ? 'transparent' : brushColor;
    ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';

    ctx.lineTo(x, y);
    ctx.stroke();

    // 현재 스트로크에 점 추가
    const point = { x, y, pressure: 1, timestamp: Date.now() };
    setCurrentStroke(prev => [...prev, point]);
    // StrokeCapture 포인트 추가
    try {
      captureRef.current.addPoint(point);
    } catch (_) {
      // 안전상 무시 (드물게 start 전에 호출될 수 있음)
    }
  };

  // 그리기 종료
  const stopDrawing = () => {
    setIsDrawing(false);

    // 현재 스트로크를 전체 스트로크에 추가
    if (currentStroke.length > 0) {
      // StrokeCapture 종료 및 저장소에 반영
      const captured = captureRef.current.endStroke();
      if (captured) {
        const stored = StrokeStorage.fromCapturedStroke(captured);
        storageRef.current.addStroke(stored);
        setAllStrokes(prev => [...prev, stored]);
      }
      setCurrentStroke([]);
    }
  };

  // Canvas 지우기 또는 카메라 리셋
  const clearCanvas = () => {
    if (isCameraMode) {
      setHasDrawing(false);
      setAllStrokes([]);
      setCurrentStroke([]);
      cameraRef.current?.restart();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false);
    setAllStrokes([]);
    setCurrentStroke([]);
    // 저장소 초기화
    storageRef.current.clearStrokes();
  };

  // Canvas를 이미지로 변환
  const captureCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    return canvas.toDataURL('image/png');
  };

  const handleShutter = async () => {
    if (isCameraMode) {
      const imageData = await cameraRef.current?.capturePhoto();
      if (imageData) {
        // 카메라 이미지를 평가합니다. 스트로크 데이터가 없으므로,
        // 참조 마스크를 URL로부터 생성하고 이를 활용합니다.
        const referenceMask = await generateReferenceMaskFromUrl('/reference/center-zhong.png');
        const evaluationResult = evaluateCalligraphy({
          strokeData: [], // 카메라 모드에서는 스트로크 데이터가 없음
          referenceCharacter: '中',
          canvasWidth: 320,
          canvasHeight: 320,
          referenceMask: referenceMask, // Pre-computed mask
        });
        onEvaluate(evaluationResult);
      }
      return;
    }

    const imageData = captureCanvas();
    if (imageData) {
      const strokes = storageRef.current.getStrokes();
      const evaluationResult = evaluateCalligraphy({
        strokeData: strokes.map(s => ({ points: s.points, timestamp: s.startTime })),
        referenceCharacter: '中', // 예시 글자
        canvasWidth: 320,
        canvasHeight: 320,
      });
      onEvaluate(evaluationResult);
    }
  };

  return (
    <div className="absolute inset-0 bg-black z-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 pt-12 bg-gradient-to-b from-black/50 to-transparent">
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          aria-label="back"
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Camera Preview Area */}
      <div className="relative flex-1 bg-gray-900 flex items-center justify-center h-full">
        <div className="absolute top-6 left-4 right-4 z-20 flex justify-center">
          <div className="inline-flex rounded-full bg-black/40 p-1 backdrop-blur-sm border border-white/10">
            <button
              onClick={() => setInputMode('canvas')}
              className={cn(
                'px-4 py-1.5 text-xs font-medium rounded-full transition-colors',
                inputMode === 'canvas'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-white/70 hover:text-white'
              )}
            >
              디지털 캔버스
            </button>
            <button
              onClick={() => setInputMode('camera')}
              className={cn(
                'px-4 py-1.5 text-xs font-medium rounded-full transition-colors',
                inputMode === 'camera'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-white/70 hover:text-white'
              )}
            >
              카메라 모드
            </button>
          </div>
        </div>

        <div className="w-full h-full bg-gray-800 relative overflow-hidden">
          {isCameraMode ? (
            <CameraCapture
              ref={cameraRef}
              onCapture={imageData => {
                /* TODO: Implement camera evaluation */
              }}
              showControls={false}
              className="h-full w-full"
            />
          ) : (
            <>
              {/* Canvas for drawing */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full cursor-crosshair z-10"
                width={320}
                height={320}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                style={{ touchAction: 'none' }}
              />
              {/* Reference image overlay (guideline + character) */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ opacity: guideOpacity[0] / 100 }}
              >
                <img
                  src="/reference/center-zhong.png"
                  alt="reference-zhong"
                  className="w-[320px] h-[320px] object-contain pointer-events-none select-none"
                  draggable={false}
                />
              </div>

              {/* Corner markers for paper alignment */}
              <div className="absolute inset-6">
                {/* Top-left corner */}
                <div className="absolute top-0 left-0 w-8 h-8">
                  <div className="w-6 h-1 bg-white/60 absolute top-0 left-0"></div>
                  <div className="w-1 h-6 bg-white/60 absolute top-0 left-0"></div>
                </div>
                {/* Top-right corner */}
                <div className="absolute top-0 right-0 w-8 h-8">
                  <div className="w-6 h-1 bg-white/60 absolute top-0 right-0"></div>
                  <div className="w-1 h-6 bg-white/60 absolute top-0 right-0"></div>
                </div>
                {/* Bottom-left corner */}
                <div className="absolute bottom-0 left-0 w-8 h-8">
                  <div className="w-6 h-1 bg-white/60 absolute bottom-0 left-0"></div>
                  <div className="w-1 h-6 bg-white/60 absolute bottom-0 left-0"></div>
                </div>
                {/* Bottom-right corner */}
                <div className="absolute bottom-0 right-0 w-8 h-8">
                  <div className="w-6 h-1 bg-white/60 absolute bottom-0 right-0"></div>
                  <div className="w-1 h-6 bg-white/60 absolute bottom-0 right-0"></div>
                </div>
              </div>

              {/* Caption */}
              <div className="absolute inset-0 flex items-end justify-center pointer-events-none p-2">
                <p className="text-xs text-white/60 bg-black/40 rounded px-2 py-1">
                  가이드에 맞춰 붓이나 손가락으로 글자를 써보세요
                </p>
              </div>
            </>
          )}
        </div>

        {/* Help Tip */}
        {showTip && (
          <div className="absolute top-24 left-4 right-4">
            <Card className="bg-black/80 border-white/20">
              <CardContent className="p-3">
                <div className="flex items-start space-x-2">
                  <HelpCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-white text-sm">
                    <p>가이드에 화면 또는 종이를 맞춘 후 연습을 시작하세요</p>
                  </div>
                  <Button
                    onClick={() => setShowTip(false)}
                    variant="ghost"
                    size="sm"
                    className="text-white/60 hover:text-white p-0 h-auto ml-auto"
                  >
                    ✕
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Guide Opacity Control */}
      {!isCameraMode && (
        <div className="absolute top-24 left-4 right-4 z-10">
          <div className="bg-black/50 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-sm font-medium">가이드 오버레이 투명도</span>
              <Badge variant="secondary" className="text-xs">
                {guideOpacity[0]}%
              </Badge>
            </div>
            <Slider
              value={guideOpacity}
              onValueChange={setGuideOpacity}
              max={100}
              step={10}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Brush Tools */}
      {!isCameraMode && (
        <div className="absolute top-40 left-4 right-4 z-10">
          <div className="bg-black/50 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-white text-sm font-medium mb-3">디지털 붓 도구</p>
            <div className="flex items-center space-x-3">
              {/* Brush/Eraser Toggle */}
              <div className="flex space-x-1">
                <button
                  onClick={() => setIsEraser(false)}
                  className={cn(
                    'p-2 rounded-lg text-xs transition-colors',
                    !isEraser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  )}
                >
                  <Palette className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsEraser(true)}
                  className={cn(
                    'p-2 rounded-lg text-xs transition-colors',
                    isEraser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  )}
                >
                  <Eraser className="h-4 w-4" />
                </button>
              </div>

              {/* Brush Size */}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-white text-xs">획 굵기</span>
                  <Slider
                    value={[brushSize]}
                    onValueChange={value => setBrushSize(value[0])}
                    max={10}
                    min={1}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-white text-xs w-6">{brushSize}</span>
                </div>
              </div>

              {/* Clear Button */}
              {hasDrawing && (
                <button
                  onClick={clearCanvas}
                  className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Alignment Mode Selector */}
      {!isCameraMode && (
        <div className="absolute top-56 left-4 right-4 z-10">
          <div className="bg-black/50 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-white text-sm font-medium mb-3">정렬 가이드</p>
            <div className="flex space-x-2">
              {alignmentModes.map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setAlignmentMode(mode.id)}
                  className={cn(
                    'flex-1 p-2 rounded-lg text-xs transition-colors',
                    alignmentMode === mode.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  )}
                >
                  <div className="font-medium">{mode.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6 pb-8 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          {/* Retake */}
          <Button
            variant="ghost"
            size="lg"
            onClick={clearCanvas}
            className="text-white hover:bg-white/20 flex flex-col items-center space-y-1"
          >
            <RotateCcw className="h-6 w-6" />
            <span className="text-xs">{isCameraMode ? '다시 시도' : '다시 쓰기'}</span>
          </Button>

          {/* Shutter */}
          <button
            onClick={handleShutter}
            className="w-16 h-16 rounded-full bg-white border-4 border-white shadow-lg hover:scale-105 transition-transform active:scale-95"
            aria-label="촬영"
          >
            <div className="w-full h-full rounded-full bg-red-500" />
          </button>

          {/* Gallery */}
          <Button
            variant="ghost"
            size="lg"
            className="text-white hover:bg-white/20 flex flex-col items-center space-y-1"
          >
            <ImageIcon className="h-6 w-6" />
            <span className="text-xs">연습 기록</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
