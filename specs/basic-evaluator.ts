// 기본 평가 알고리즘 - Canvas 데이터 기반 점수 계산

export interface StrokeData {
  points: { x: number; y: number; pressure?: number }[];
  timestamp: number;
}

export interface EvaluationRequest {
  strokeData: StrokeData[];
  referenceCharacter: string;
  canvasWidth: number;
  canvasHeight: number;
  // Optional: precomputed reference mask from an image
  referenceMask?: Mask;
}

export interface EvaluationResult {
  finalScore: number;
  scores: {
    margin: number;
    angle: number;
    center: number;
    shape: number;
    guide: number;
  };
  tips: string[];
  grade: string;
  improvement: string;
}

// 2D 마스크 기반 평가 (기존 evaluator.ts와 연동)
export type Mask = number[][];

export function evaluateMask(ref: Mask, user: Mask): number {
  // 크기 검증
  if (!Array.isArray(ref) || !Array.isArray(user)) throw new Error('invalid');
  if (ref.length === 0 || ref[0].length === 0) return 0;
  if (ref.length !== user.length || ref[0].length !== user[0].length) {
    throw new Error('size mismatch');
  }

  const rows = ref.length;
  const cols = ref[0].length;

  // 각 마스크의 셀 수 계산
  let refCells = 0;
  let userCells = 0;
  let overlapCells = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (ref[i][j] === 1) refCells++;
      if (user[i][j] === 1) userCells++;
      if (ref[i][j] === 1 && user[i][j] === 1) overlapCells++;
    }
  }

  // 빈 마스크 처리
  if (userCells === 0) return 0;
  if (refCells === 0) return userCells === 0 ? 100 : 0;

  // 겹침 비율 (0-1)
  const overlapRatio = overlapCells / Math.max(refCells, userCells);
  
  // 면적 비율 차이 (0-1, 작을수록 좋음)
  const areaDiff = Math.abs(refCells - userCells) / Math.max(refCells, userCells);

  // 중심점 거리 계산
  const refCenter = calculateCenter(ref);
  const userCenter = calculateCenter(user);
  const maxDistance = Math.sqrt(rows * rows + cols * cols);
  const centerDistance = Math.sqrt(
    Math.pow(refCenter.row - userCenter.row, 2) + 
    Math.pow(refCenter.col - userCenter.col, 2)
  );
  const centerScore = 1 - (centerDistance / maxDistance);

  // 가중 점수 계산
  const overlapScore = overlapRatio * 60;      // 겹침 60%
  const areaScore = (1 - areaDiff) * 25;       // 면적 25%
  const centerScoreWeighted = centerScore * 15; // 중심 15%

  const totalScore = overlapScore + areaScore + centerScoreWeighted;
  
  // 유사한 패턴에 보너스 점수 추가
  if (overlapRatio > 0.7 && areaDiff < 0.3) {
    const bonus = 5;
    return Math.round(Math.max(0, Math.min(100, totalScore + bonus)));
  }
  
  return Math.round(Math.max(0, Math.min(100, totalScore)));
}

function calculateCenter(mask: Mask): { row: number; col: number } {
  let totalRow = 0;
  let totalCol = 0;
  let count = 0;

  for (let i = 0; i < mask.length; i++) {
    for (let j = 0; j < mask[0].length; j++) {
      if (mask[i][j] === 1) {
        totalRow += i;
        totalCol += j;
        count++;
      }
    }
  }

  if (count === 0) return { row: 0, col: 0 };
  
  return {
    row: totalRow / count,
    col: totalCol / count
  };
}

// Canvas 데이터를 2D 마스크로 변환
export function canvasToMask(canvas: HTMLCanvasElement): Mask {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const mask: Mask = [];
  
  // 10x10 그리드로 단순화
  const gridSize = 10;
  const cellWidth = canvas.width / gridSize;
  const cellHeight = canvas.height / gridSize;

  for (let row = 0; row < gridSize; row++) {
    mask[row] = [];
    for (let col = 0; col < gridSize; col++) {
      let hasStroke = false;
      
      // 각 셀 내에서 픽셀 확인
      for (let y = Math.floor(row * cellHeight); y < Math.floor((row + 1) * cellHeight); y++) {
        for (let x = Math.floor(col * cellWidth); x < Math.floor((col + 1) * cellWidth); x++) {
          const pixelIndex = (y * canvas.width + x) * 4;
          const alpha = imageData.data[pixelIndex + 3];
          
          if (alpha > 128) { // 반투명 이상이면 선이 있다고 판단
            hasStroke = true;
            break;
          }
        }
        if (hasStroke) break;
      }
      
      mask[row][col] = hasStroke ? 1 : 0;
    }
  }
  
  return mask;
}

// 참조 문자 마스크 생성 (실제 '中' 글자 패턴 기반)
export function generateReferenceMask(character: string): Mask {
  // 동적으로 폰트 렌더링을 통해 참조 마스크 생성
  try {
    const gridSize = 10;
    const width = 320;
    const height = 320;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('no-ctx');

    // 배경 초기화
    ctx.clearRect(0, 0, width, height);

    // UI 가이드와 유사한 폰트 설정 (serif, 중앙 정렬)
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // 캔버스 크기에 비례하는 폰트 크기 (약간의 여백 포함)
    const fontPx = Math.floor(Math.min(width, height) * 0.7);
    ctx.font = `bold ${fontPx}px serif`;

    // 문자 그리기 (중앙)
    ctx.fillText(character, width / 2, height / 2);

    // 10x10 마스크로 샘플링
    const imageData = ctx.getImageData(0, 0, width, height);
    const cellW = width / gridSize;
    const cellH = height / gridSize;
    const mask: Mask = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        let on = 0;
        // 각 셀의 중심 3x3 영역을 샘플링하여 안정성 향상
        const startY = Math.floor(r * cellH + cellH * 0.35);
        const endY = Math.floor(r * cellH + cellH * 0.65);
        const startX = Math.floor(c * cellW + cellW * 0.35);
        const endX = Math.floor(c * cellW + cellW * 0.65);
        for (let y = startY; y <= endY; y++) {
          for (let x = startX; x <= endX; x++) {
            const idx = (y * width + x) * 4;
            // 알파 또는 명도 기준으로 획 존재 판별
            const alpha = imageData.data[idx + 3];
            if (alpha > 32) { on = 1; break; }
          }
          if (on) break;
        }
        mask[r][c] = on;
      }
    }

    return mask;
  } catch (e) {
    // Fallback: '中' 하드코딩 마스크 (브라우저 외 환경 등)
    if (character === '中') {
      return [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
    }
    return Array(10).fill(null).map(() => Array(10).fill(0));
  }
}

// '中' 글자 구조 분석 함수
function analyzeCharacterStructure(strokes: StrokeData[], canvasWidth: number, canvasHeight: number) {
  if (strokes.length === 0) {
    return {
      hasVerticalLine: false,
      hasHorizontalLines: false,
      centerAlignment: 0,
      proportion: 0,
      strokeCount: 0
    };
  }

  // 세로선 분석 (중앙에 있는지)
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  let verticalLineScore = 0;
  let horizontalLineScore = 0;
  let centerAlignmentScore = 0;
  
  // 모든 스트로크 분석
  strokes.forEach(stroke => {
    if (stroke.points.length < 2) return;
    
    const firstPoint = stroke.points[0];
    const lastPoint = stroke.points[stroke.points.length - 1];
    
    // 세로선 감지 (Y축 변화가 X축 변화보다 큰 경우)
    const deltaX = Math.abs(lastPoint.x - firstPoint.x);
    const deltaY = Math.abs(lastPoint.y - firstPoint.y);
    
    if (deltaY > deltaX * 1.5) { // 세로선
      const avgX = (firstPoint.x + lastPoint.x) / 2;
      const distanceFromCenter = Math.abs(avgX - centerX);
      verticalLineScore += Math.max(0, 100 - (distanceFromCenter / centerX) * 100);
    }
    
    // 가로선 감지 (X축 변화가 Y축 변화보다 큰 경우)
    if (deltaX > deltaY * 1.5) { // 가로선
      const avgY = (firstPoint.y + lastPoint.y) / 2;
      const distanceFromCenter = Math.abs(avgY - centerY);
      horizontalLineScore += Math.max(0, 100 - (distanceFromCenter / centerY) * 100);
    }
    
    // 중심 정렬 점수
    const strokeCenterX = stroke.points.reduce((sum, p) => sum + p.x, 0) / stroke.points.length;
    const strokeCenterY = stroke.points.reduce((sum, p) => sum + p.y, 0) / stroke.points.length;
    const distanceFromCenter = Math.sqrt(
      Math.pow(strokeCenterX - centerX, 2) + Math.pow(strokeCenterY - centerY, 2)
    );
    const maxDistance = Math.sqrt(Math.pow(canvasWidth/2, 2) + Math.pow(canvasHeight/2, 2));
    centerAlignmentScore += Math.max(0, 100 - (distanceFromCenter / maxDistance) * 100);
  });

  return {
    hasVerticalLine: verticalLineScore > 50,
    hasHorizontalLines: horizontalLineScore > 50,
    centerAlignment: centerAlignmentScore / strokes.length,
    proportion: strokes.length >= 2 && strokes.length <= 4 ? 100 : Math.max(0, 100 - Math.abs(strokes.length - 3) * 20),
    strokeCount: strokes.length
  };
}

// 메인 평가 함수 (실제 '中' 글자 기준)
export function evaluateCalligraphy(request: EvaluationRequest): EvaluationResult {
  try {
    const { strokeData, referenceCharacter, canvasWidth, canvasHeight } = request;
    
    // Canvas 데이터를 마스크로 변환
    const userMask = request.referenceMask ? generateUserMaskFromStrokes(strokeData, canvasWidth, canvasHeight) : generateUserMaskFromStrokes(strokeData, canvasWidth, canvasHeight);
    const refMask = request.referenceMask ?? generateReferenceMask(referenceCharacter);
    
    // 기본 점수 계산
    const baseScore = evaluateMask(refMask, userMask);
    
    // '中' 글자 구조 분석
    const structure = analyzeCharacterStructure(strokeData, canvasWidth, canvasHeight);
    
    // 세부 점수 계산 (실제 구조 기반)
    const scores = {
      margin: Math.min(100, Math.max(0, baseScore + (structure.centerAlignment - 50) * 0.3)),
      angle: structure.hasVerticalLine ? Math.min(100, baseScore + 10) : Math.max(0, baseScore - 20),
      center: Math.min(100, structure.centerAlignment),
      shape: Math.min(100, baseScore + (structure.proportion - 50) * 0.2),
      guide: Math.min(100, baseScore + (structure.hasHorizontalLines ? 5 : -10)),
    };
    
    // 최종 점수 계산 (가중 평균)
    const finalScore = Math.round(
      scores.margin * 0.2 +
      scores.angle * 0.25 +
      scores.center * 0.25 +
      scores.shape * 0.2 +
      scores.guide * 0.1
    );
    
    // 등급 계산
    const grade = getGrade(finalScore);
    
    // 개선 제안 (구조 분석 기반)
    const tips: string[] = [];
    
    if (!structure.hasVerticalLine) {
      tips.push('중앙의 세로선을 더 명확하게 그려보세요.');
    }
    
    if (!structure.hasHorizontalLines) {
      tips.push('상단과 하단의 가로선을 추가해보세요.');
    }
    
    if (structure.centerAlignment < 70) {
      tips.push('글자를 화면 중앙에 더 정확하게 배치해보세요.');
    }
    
    if (structure.strokeCount < 2) {
      tips.push("'중' 글자는 여러 획으로 구성됩니다. 더 많은 획을 그려보세요.");
    } else if (structure.strokeCount > 5) {
      tips.push('너무 많은 획을 그리지 말고, 간결하게 써보세요.');
    }
    
    if (scores.angle < 70) {
      tips.push('세로선을 더 곧게 그려보세요.');
    }
    
    if (scores.shape < 70) {
      tips.push('글자의 전체적인 균형을 맞춰보세요.');
    }
    
    if (tips.length === 0) {
      tips.push("훌륭합니다! '중' 글자를 정확하게 쓰셨습니다.");
    }
    
    const improvement = calculateImprovement(finalScore);
    
    return {
      finalScore,
      scores: {
        margin: Math.round(scores.margin),
        angle: Math.round(scores.angle),
        center: Math.round(scores.center),
        shape: Math.round(scores.shape),
        guide: Math.round(scores.guide)
      },
      tips,
      grade,
      improvement
    };
  } catch (error) {
    console.error('Evaluation error:', error);
    return getDefaultEvaluation();
  }
}

// 스트로크 데이터를 마스크로 변환 (실제 스트로크 기반)
function generateUserMaskFromStrokes(strokeData: StrokeData[], width: number, height: number): Mask {
  const mask: Mask = Array(10).fill(null).map(() => Array(10).fill(0));
  
  if (strokeData.length === 0) return mask;
  
  // 각 스트로크를 10x10 그리드로 변환
  strokeData.forEach(stroke => {
    stroke.points.forEach(point => {
      const gridX = Math.floor((point.x / width) * 10);
      const gridY = Math.floor((point.y / height) * 10);
      
      if (gridX >= 0 && gridX < 10 && gridY >= 0 && gridY < 10) {
        mask[gridY][gridX] = 1;
      }
    });
  });
  
  return mask;
}

function getGrade(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'A-';
  if (score >= 75) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 65) return 'B-';
  if (score >= 60) return 'C+';
  if (score >= 55) return 'C';
  if (score >= 50) return 'C-';
  return 'D';
}

function generateTips(scores: any): string[] {
  const tips: string[] = [];
  
  if (scores.margin < 70) {
    tips.push('여백을 더 균등하게 맞춰보세요');
  }
  if (scores.angle < 70) {
    tips.push('획의 각도를 조금 더 정확하게 해보세요');
  }
  if (scores.center < 80) {
    tips.push('글자의 중심을 더 정확하게 맞춰보세요');
  }
  if (scores.shape < 70) {
    tips.push('전체적인 형태를 더 정확하게 그려보세요');
  }
  if (scores.guide < 70) {
    tips.push('가이드라인을 더 정확하게 따라해보세요');
  }
  
  if (tips.length === 0) {
    tips.push('전반적으로 잘 그렸습니다!');
  }
  
  return tips;
}

function calculateImprovement(score: number): string {
  const improvement = Math.round((score - 50) / 5);
  return improvement > 0 ? `+${improvement}점` : `${improvement}점`;
}

function getDefaultEvaluation(): EvaluationResult {
  return {
    finalScore: 0,
    scores: {
      margin: 0,
      angle: 0,
      center: 0,
      shape: 0,
      guide: 0
    },
    tips: ['평가할 데이터가 없습니다. 다시 그려보세요.'],
    grade: 'F',
    improvement: '0점'
  };
}
// Build reference mask from an image URL (filters out red guide lines)
export async function generateReferenceMaskFromUrl(url: string, size = 320): Promise<Mask> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  // Draw image scaled to square canvas, preserving aspect ratio by contain
  const scale = Math.min(size / img.width, size / img.height);
  const drawW = Math.round(img.width * scale);
  const drawH = Math.round(img.height * scale);
  const dx = Math.floor((size - drawW) / 2);
  const dy = Math.floor((size - drawH) / 2);
  ctx.clearRect(0, 0, size, size);
  ctx.drawImage(img, dx, dy, drawW, drawH);

  const imageData = ctx.getImageData(0, 0, size, size);
  const gridSize = 10;
  const cellW = size / gridSize;
  const cellH = size / gridSize;
  const mask: Mask = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      let on = 0;
      // sample center area in each cell
      const startY = Math.floor(r * cellH + cellH * 0.2);
      const endY = Math.floor(r * cellH + cellH * 0.8);
      const startX = Math.floor(c * cellW + cellW * 0.2);
      const endX = Math.floor(c * cellW + cellW * 0.8);
      outer: for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
          const idx = (y * size + x) * 4;
          const rpx = imageData.data[idx];
          const gpx = imageData.data[idx + 1];
          const bpx = imageData.data[idx + 2];
          const apx = imageData.data[idx + 3];
          // Ignore transparent/empty
          if (apx < 32) continue;
          // Filter out red guides (strong red, low G/B)
          const isRedGuide = rpx > 180 && gpx < 90 && bpx < 90;
          if (isRedGuide) continue;
          // Treat dark/drawn strokes as ink
          const luminance = 0.2126 * rpx + 0.7152 * gpx + 0.0722 * bpx;
          if (luminance < 180) { on = 1; break outer; }
        }
      }
      mask[r][c] = on;
    }
  }

  return mask;
}
