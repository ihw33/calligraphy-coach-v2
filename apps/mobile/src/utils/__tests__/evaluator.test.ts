/**
 * 평가 유틸 RED 테스트 (2D 마스크 기반)
 * - 구현 전 단계: 테스트는 컴파일되지만 반드시 실패해야 함
 */

import { evaluateMask } from '../evaluator';

type Mask = number[][]; // 0 또는 1의 2D 배열

describe('evaluateMask - 2D 마스크 기반 평가', () => {
  const ref: Mask = [
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ];

  it('유사한 마스크에는 높은 점수를 부여한다(>80)', () => {
    const user: Mask = [
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ];
    const score = evaluateMask(ref, user);
    expect(score).toBeGreaterThan(80);
  });

  it('빈 마스크에는 낮은 점수를 부여한다(<10)', () => {
    const emptyUser: Mask = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const score = evaluateMask(ref, emptyUser);
    expect(score).toBeLessThan(10);
  });

  it('크기 불일치 시 에러를 던진다', () => {
    const badUser: Mask = [
      [0, 1, 1],
      [0, 1, 1],
    ];
    expect(() => evaluateMask(ref, badUser)).toThrow();
  });

  it('작은 이동(1셀)에는 관대하게 중간 이상 점수(>60)', () => {
    const shifted: Mask = [
      [0, 0, 1, 1],
      [0, 0, 1, 1],
      [0, 0, 0, 0],
    ];
    const score = evaluateMask(ref, shifted);
    expect(score).toBeGreaterThan(60);
  });
});

// Future: 다채널 마스크(굵기/압력) 확장, 거리 변환 기반 유사도