import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { ArrowLeft, Camera, Check, X, Info, Loader2, Upload, RefreshCw } from 'lucide-react';
import { getCourseById } from '../data/courses';
import { evaluatePhotoMode } from '../../practice/services/photoEvaluator';

export const Hwang92LessonDetail: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const [selectedCharacter, setSelectedCharacter] = useState<number>(0);
  const [uploadedImages, setUploadedImages] = useState<(File | null)[]>([null, null, null, null]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<(string | null)[]>([null, null, null, null]);
  const [isEvaluating, setIsEvaluating] = useState<boolean[]>([false, false, false, false]);
  const [evaluationResults, setEvaluationResults] = useState<(any | null)[]>([null, null, null, null]);
  
  // 카메라 관련 상태
  const [cameraActive, setCameraActive] = useState<number | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null, null, null]);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null]);
  
  const course = courseId ? getCourseById(courseId) : null;
  const lesson = course?.lessons.find(l => l.id === lessonId);

  if (!courseId || !lessonId || !course || !lesson) {
    return <div>수업을 찾을 수 없습니다.</div>;
  }

  // 서법별 평가 포인트
  const getEvaluationPoints = (lessonId: string) => {
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

  // 카메라 시작
  const startCamera = async (index: number) => {
    try {
      // 기존 스트림 정리
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'environment'
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRefs.current[index]) {
        videoRefs.current[index]!.srcObject = stream;
        videoRefs.current[index]!.play();
      }
      
      setCameraActive(index);
      setCameraReady(true);
    } catch (error) {
      console.error('카메라 접근 실패:', error);
      alert('카메라를 사용할 수 없습니다. 카메라 권한을 확인해주세요.');
    }
  };

  // 카메라 중지
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(null);
    setCameraReady(false);
  };

  // 사진 촬영
  const capturePhoto = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    setIsCapturing(true);

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    
    if (context) {
      context.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      const newUrls = [...uploadedImageUrls];
      newUrls[index] = dataUrl;
      setUploadedImageUrls(newUrls);
      
      // Clear previous evaluation result
      const newResults = [...evaluationResults];
      newResults[index] = null;
      setEvaluationResults(newResults);
      
      stopCamera();
    }
    
    setIsCapturing(false);
  };

  const handleImageUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newImages = [...uploadedImages];
      newImages[index] = file;
      setUploadedImages(newImages);
      
      // Create URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const newUrls = [...uploadedImageUrls];
        newUrls[index] = reader.result as string;
        setUploadedImageUrls(newUrls);
      };
      reader.readAsDataURL(file);
      
      // Clear previous evaluation result
      const newResults = [...evaluationResults];
      newResults[index] = null;
      setEvaluationResults(newResults);
      
      stopCamera();
    }
  };

  // 컴포넌트 언마운트 시 카메라 정리
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleAIEvaluation = async (index: number) => {
    const imageUrl = uploadedImageUrls[index];
    if (!imageUrl) {
      alert('먼저 사진을 업로드해주세요.');
      return;
    }

    // Update evaluating state
    const newEvaluating = [...isEvaluating];
    newEvaluating[index] = true;
    setIsEvaluating(newEvaluating);

    try {
      // Call evaluation service
      const character = lesson.characters[index];
      const evaluationResult = await evaluatePhotoMode({
        capturedImage: imageUrl,
        currentCharacter: character.character,
        characterType: 'chinese' // 한자이므로 chinese
      });

      // Store evaluation result
      const newResults = [...evaluationResults];
      newResults[index] = evaluationResult;
      setEvaluationResults(newResults);

      // Navigate to result page with evaluation data
      navigate(`/result/hwang92_${lessonId}_${index}_${Date.now()}`, {
        state: {
          evaluationResult,
          targetCharacter: character.character,
          characterMeaning: character.meaning,
          characterPronunciation: character.pronunciation,
          strokeCount: 0,
          useAI: true,
          aiEvaluation: evaluationResult.aiEvaluation || null,
          canvasImage: imageUrl,
          courseInfo: {
            courseId,
            lessonId,
            lessonTitle: lesson.title,
            evaluationPoints: getEvaluationPoints(lessonId)
          }
        }
      });
    } catch (error) {
      console.error('평가 중 오류 발생:', error);
      alert('평가 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      // Reset evaluating state
      const newEvaluating = [...isEvaluating];
      newEvaluating[index] = false;
      setIsEvaluating(newEvaluating);
    }
  };

  const evaluationPoints = getEvaluationPoints(lessonId);

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
              <ArrowLeft className="h-4 w-4" />
              코스로 돌아가기
            </button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 레슨 정보 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
            <p className="text-lg text-muted-foreground">{lesson.description}</p>
          </div>

          {/* 평가 기준 */}
          <Card className="p-6 mb-8">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-3">이 서법의 평가 포인트</h3>
                <ul className="space-y-2">
                  {evaluationPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5" />
                      <span className="text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* 한자 연습 그리드 */}
          <div className="grid md:grid-cols-2 gap-6">
            {lesson.characters.map((character, index) => (
              <Card key={character.id} className="p-6">
                <div className="space-y-4">
                  {/* 한자 정보 */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-4xl font-bold mb-2">{character.character}</h3>
                      <p className="text-sm text-muted-foreground">{character.meaning}</p>
                      <p className="text-xs text-muted-foreground">음: {character.pronunciation}</p>
                    </div>
                    <Badge variant={index === 0 ? "default" : "outline"}>
                      {index + 1}번째 글자
                    </Badge>
                  </div>

                  {/* 참고 이미지 */}
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-2">참고 이미지</p>
                    <div className="bg-white rounded p-2 flex items-center justify-center h-48">
                      <img 
                        src={character.referenceImage} 
                        alt={`${character.character} 참고`}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-character.png';
                          target.onerror = null;
                        }}
                      />
                    </div>
                  </div>

                  {/* 사진 촬영 / 업로드 */}
                  <div className="space-y-3">
                    <span className="text-sm font-medium">내 작품 촬영</span>
                    
                    {/* 카메라 뷰 또는 캡처된 이미지 */}
                    {cameraActive === index ? (
                      <div className="relative">
                        <video
                          ref={el => videoRefs.current[index] = el}
                          className="w-full h-48 bg-black rounded-lg object-cover"
                          autoPlay
                          playsInline
                        />
                        {!cameraReady && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
                            <div className="text-center space-y-2">
                              <Camera className="h-8 w-8 text-white/60 mx-auto" />
                              <p className="text-sm text-white/80">카메라 준비 중...</p>
                            </div>
                          </div>
                        )}
                        {isCapturing && (
                          <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-lg">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          </div>
                        )}
                      </div>
                    ) : uploadedImageUrls[index] ? (
                      <div className="relative">
                        <img 
                          src={uploadedImageUrls[index]!} 
                          alt="촬영된 작품"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 right-2 bg-green-600 text-white p-1 rounded-full">
                          <Check className="h-4 w-4" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">촬영 대기 중</p>
                        </div>
                      </div>
                    )}
                    
                    {/* 버튼들 */}
                    {cameraActive === index ? (
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          onClick={() => stopCamera()}
                          className="w-full"
                        >
                          <X className="h-4 w-4 mr-2" />
                          취소
                        </Button>
                        <Button
                          onClick={() => capturePhoto(index)}
                          disabled={!cameraReady}
                          className="w-full"
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          촬영하기
                        </Button>
                      </div>
                    ) : uploadedImageUrls[index] ? (
                      <Button
                        variant="outline"
                        onClick={() => {
                          const newUrls = [...uploadedImageUrls];
                          newUrls[index] = null;
                          setUploadedImageUrls(newUrls);
                          startCamera(index);
                        }}
                        className="w-full"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        다시 촬영
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Button
                          onClick={() => startCamera(index)}
                          className="w-full"
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          카메라로 촬영
                        </Button>
                        
                        <input
                          ref={el => fileInputRefs.current[index] = el}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(index, e)}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          onClick={() => fileInputRefs.current[index]?.click()}
                          className="w-full"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          사진 업로드
                        </Button>
                      </div>
                    )}

                    {/* AI 평가 버튼 */}
                    <Button 
                      onClick={() => handleAIEvaluation(index)}
                      disabled={!uploadedImageUrls[index] || isEvaluating[index]}
                      className="w-full"
                    >
                      {isEvaluating[index] ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          평가 중...
                        </>
                      ) : (
                        'AI 평가 받기'
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* 전체 완료 버튼 */}
          <div className="mt-8 flex justify-center">
            <Button 
              size="lg"
              disabled={uploadedImages.every(img => img === null)}
              onClick={() => {
                alert('모든 글자의 평가가 완료되었습니다!');
                navigate(`/course/${courseId}`);
              }}
            >
              레슨 완료하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};