export type Mask = number[][]; // 0 또는 1의 2D 배열

/**
 * 2D 마스크 기반 평가 함수
 * 면적, 중심점, 겹침 비율로 0-100점 계산
 */
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

/**
 * 마스크의 중심점 계산
 */
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
