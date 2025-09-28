# A2A 한자능력시험 시스템 사용 가이드

다른 프로젝트에서 이 A2A 시스템을 활용하는 방법을 안내합니다.

## CLI 클로드코드에서 사용하는 방법

### 1. 기본 지시문

```
클로드야, /Users/m4_macbook/a2a-cli-agent/korean-hanja-complete/ 경로에 있는 A2A 한자능력시험 시스템을 활용해서 [작업내용]을 해줘.

이 시스템은 8급부터 특급까지 총 15개 급수의 한자 데이터와 학습 가이드가 체계적으로 정리되어 있어. levels 폴더에 각 급수별 파일이 있고, guides 폴더에 학습 방법론이 있어.
```

### 2. 구체적 활용 예시

#### A. 특정 급수 데이터 활용
```
/Users/m4_macbook/a2a-cli-agent/korean-hanja-complete/levels/level_05급.md 파일의 한자 데이터를 사용해서 5급 시험 문제를 50문제 만들어줘.
```

#### B. 학습 진도 관리
```
/Users/m4_macbook/a2a-cli-agent/korean-hanja-complete/guides/learning_sequence.md의 학습 단계를 참고해서 초등학생용 한자 학습 계획을 세워줘.
```

#### C. 전체 시스템 활용
```
/Users/m4_macbook/a2a-cli-agent/korean-hanja-complete/ 의 A2A 시스템을 참고해서 우리 프로젝트에 맞는 한자 학습 앱을 설계해줘. 8급부터 5급까지만 사용할 예정이야.
```

### 3. 에이전트별 전문 분야 활용

#### 초급 담당 에이전트 (8급-7급)
```
/Users/m4_macbook/a2a-cli-agent/korean-hanja-complete/levels/level_08급.md와 level_07급.md 파일을 참고해서 초보자용 한자 플래시카드 앱을 만들어줘.
```

#### 중급 담당 에이전트 (6급-5급)
```
/Users/m4_macbook/a2a-cli-agent/korean-hanja-complete/levels/ 의 준6급부터 5급까지 파일들을 분석해서 중학생용 한자 교육과정을 제안해줘.
```

#### 고급 담당 에이전트 (4급 이상)
```
/Users/m4_macbook/a2a-cli-agent/korean-hanja-complete/levels/ 의 고급 급수 파일들(4급-특급)을 활용해서 대학 입시용 한자 문제집을 구성해줘.
```

## 시스템 구조 활용법

### 파일 구조
```
korean-hanja-complete/
├── levels/                 # 급수별 한자 데이터
│   ├── level_08급.md       # 8급 (50자)
│   ├── level_준7급.md      # 준7급 (50자)
│   ├── level_07급.md       # 7급 (50자)
│   └── ... (총 16개 파일)
├── guides/                 # 학습 가이드
│   ├── learning_sequence.md # 단계별 학습법
│   ├── study_methods.md    # 학습 방법론
│   └── exam_strategy.md    # 시험 전략
└── a2a_hanja_system.py     # A2A 시스템 아키텍처
```

### 데이터 형식
각 급수 파일은 다음 형식으로 구성:
```markdown
| 번호 | 한자 | 훈 | 음 | 획수 | 부수 | 예시어 |
|------|------|----|----|------|------|--------|
| 8급-1 | 一 | 하나 | 일 | 1 | 一 | 일등(一等), 일월(一月) |
```

## 활용 시나리오별 지시문

### 1. 한자 학습 앱 개발
```
/Users/m4_macbook/a2a-cli-agent/korean-hanja-complete/ 시스템을 활용해서 다음 기능을 가진 한자 학습 앱을 설계해줘:

1. 급수별 진도 관리
2. 일일 학습량 설정
3. 복습 스케줄링
4. 성취도 평가

기존 A2A 시스템의 학습 가이드와 급수별 데이터를 모두 활용해줘.
```

### 2. 교육과정 개발
```
/Users/m4_macbook/a2a-cli-agent/korean-hanja-complete/guides/learning_sequence.md의 5단계 학습법을 기반으로 6개월 완성 한자 교육과정을 만들어줘. 8급부터 5급까지 목표로 하고, levels 폴더의 해당 데이터를 모두 활용해줘.
```

### 3. 시험 문제 생성
```
/Users/m4_macbook/a2a-cli-agent/korean-hanja-complete/levels/ 의 데이터를 활용해서 다음과 같은 시험 문제를 만들어줘:

- 급수: 6급
- 문항수: 100문제
- 문제 유형: 객관식 50문제, 단답형 30문제, 서술형 20문제

각 문제는 해당 급수 파일의 실제 한자 데이터를 사용해야 해.
```

### 4. 개인 맞춤 학습 계획
```
/Users/m4_macbook/a2a-cli-agent/korean-hanja-complete/ 시스템을 참고해서 다음 조건에 맞는 개인 학습 계획을 세워줘:

- 현재 수준: 7급 통과
- 목표: 5급 합격
- 기간: 4개월
- 일일 학습 시간: 30분

learning_sequence.md의 방법론과 해당 급수 파일들의 데이터를 모두 활용해줘.
```

## 고급 활용법

### 1. 데이터 분석 및 통계
```
/Users/m4_macbook/a2a-cli-agent/korean-hanja-complete/levels/ 의 모든 파일을 분석해서 다음 통계를 만들어줘:

1. 급수별 한자 분포
2. 부수별 빈도 분석
3. 획수별 난이도 분포
4. 학습 진도 예측 모델
```

### 2. 시스템 확장 및 커스터마이징
```
/Users/m4_macbook/a2a-cli-agent/korean-hanja-complete/a2a_hanja_system.py 를 참고해서 우리 프로젝트에 맞는 A2A 시스템을 설계해줘. 

요구사항:
- 영어 단어 학습용
- 난이도 5단계
- 에이전트 3개로 구성
- 진도 추적 기능 포함
```

## 주의사항

1. **경로 정확성**: 반드시 정확한 파일 경로를 지정해야 함
2. **파일 존재 확인**: 작업 전 해당 파일이 존재하는지 확인
3. **데이터 형식 유지**: 기존 테이블 형식을 유지하며 활용
4. **학습 단계 준수**: learning_sequence.md의 단계별 접근법 권장

## 샘플 완전 지시문

```
클로드야, /Users/m4_macbook/a2a-cli-agent/korean-hanja-complete/ 에 있는 A2A 한자능력시험 시스템을 활용해서 초등학생용 한자 학습 게임을 설계해줘.

사용할 데이터:
- levels/level_08급.md (기초)
- levels/level_07급.md (심화)
- guides/learning_sequence.md (학습법)

게임 요구사항:
1. 단계별 진행 (8급→7급)
2. 게임화 요소 (점수, 레벨업)
3. 복습 시스템
4. 학부모 진도 확인 기능

기존 A2A 시스템의 학습 가이드와 데이터 구조를 최대한 활용해서 체계적인 설계를 해줘.
```