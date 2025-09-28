# ThemeAudit 사용 가이드

- 위치: `apps/web/src/components/ThemeAudit.tsx`
- 접근: 개발 모드에서 DevNav(우하단) → Theme 버튼 클릭

## 목적
- 버튼 변형(default/secondary/outline/destructive/ghost/link)의 텍스트-배경 대비(Contrast Ratio, CR)를 계산하여 WCAG AA(≥ 4.5) 충족 여부를 확인합니다.

## 측정 기준
- CR ≥ 4.5: 일반 텍스트 AA 통과
- 3.0 ≤ CR < 4.5: 대형 텍스트(≥ 18pt) AA는 통과 가능, 일반 텍스트는 미달
- CR < 3.0: 실패. 토큰 조정 필요

## 개선 방법(권장 순서)
1. 디자인 토큰 조정: `packages/ui/design/tokens.css`의 `--color-primary`, `--color-text-*`, `--color-surface` 등을 미세 조정
2. 변형 스타일 조정: hover/ghost/outline의 배경 투명도/테두리 대비 강화
3. 레이아웃/사이즈 고려: 대형 텍스트로 상승 여지 확인(최후 수단)

## 참고
- 전역 토큰 임포트: `apps/web/src/index.css`
- Tailwind 변수 브리지: `apps/web/src/styles/tokens-bridge.css`
- 관련 컴포넌트: `apps/web/src/components/ui/button.tsx`, `.../card.tsx`
