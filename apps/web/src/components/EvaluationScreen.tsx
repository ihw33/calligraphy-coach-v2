import { useState, useEffect } from 'react';
import { ArrowLeft, Share, RotateCcw, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { cn } from './ui/utils';
import { EvaluationResult } from '../lib/evaluation/basic-evaluator';

interface EvaluationScreenProps {
  onBack: () => void;
  onRetry: () => void;
  onSave: () => void;
  evaluationResult: EvaluationResult | null;
}

const scoreLabels = {
  margin: '여백',
  angle: '각도',
  center: '중심',
  shape: '형태',
  guide: '가이드',
};

const scoreColors = {
  margin: 'bg-chart-1',
  angle: 'bg-chart-2',
  center: 'bg-chart-3',
  shape: 'bg-chart-4',
  guide: 'bg-chart-5',
};

export function EvaluationScreen({
  onBack,
  onRetry,
  onSave,
  evaluationResult,
}: EvaluationScreenProps) {
  const [showComparison, setShowComparison] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-accent-positive';
    if (score >= 70) return 'text-accent-warning';
    return 'text-accent-error';
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-accent-positive text-white';
    if (grade.startsWith('B')) return 'bg-accent-warning text-white';
    return 'bg-accent-error text-white';
  };

  // 평가 결과가 없을 때
  if (!evaluationResult) {
    return (
      <div className="flex-1 bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">평가할 데이터가 없습니다.</p>
          <Button onClick={onRetry}>다시 그리기</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-16 border-b border-border">
        <Button onClick={onBack} variant="ghost" size="sm">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-bold">평가 결과</h1>
        <Button variant="ghost" size="sm">
          <Share className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4 pb-24 space-y-6">
        {/* Overall Score */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-6 text-center">
            <div className="text-[120px] leading-none font-serif text-ink-strong mb-4">中</div>

            <div className="flex items-center justify-center space-x-4 mb-4">
              <Badge
                className={cn(
                  'text-lg px-4 py-2 rounded-full',
                  getGradeColor(evaluationResult.grade)
                )}
              >
                {evaluationResult.grade}
              </Badge>
              <div className="text-center">
                <div className="text-3xl font-bold text-ink-strong">
                  {evaluationResult.finalScore.toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">점</div>
              </div>
              <Badge
                variant="outline"
                className="text-sm text-accent-positive border-accent-positive"
              >
                {evaluationResult.improvement}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              {evaluationResult.finalScore >= 80
                ? '훌륭한 결과입니다! 계속 연습해보세요.'
                : evaluationResult.finalScore >= 60
                  ? '좋은 시작입니다. 몇 가지 개선점을 확인해보세요.'
                  : '더 연습이 필요합니다. 다시 도전해보세요.'}
            </p>
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">세부 평가</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(evaluationResult.scores).map(([key, score]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-ink-strong">
                    {scoreLabels[key as keyof typeof scoreLabels]}
                  </span>
                  <span className={cn('font-bold', getScoreColor(score as number))}>
                    {score as number}점
                  </span>
                </div>
                <div className="relative">
                  <Progress value={score as number} className="h-2" />
                  <div
                    className={cn(
                      'absolute top-0 left-0 h-2 rounded-full transition-all',
                      scoreColors[key as keyof typeof scoreColors]
                    )}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Feedback Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">개선 제안</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(evaluationResult.tips as any[]).map((tip: any, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-sm text-ink-base">{tip}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Image Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              비교 분석
              <div className="flex space-x-1">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="aspect-square bg-muted rounded-lg mb-2 flex items-center justify-center">
                  <span className="text-4xl font-serif text-muted-foreground">中</span>
                </div>
                <p className="text-sm font-medium">표준 글자</p>
              </div>
              <div className="text-center">
                <div className="aspect-square bg-muted rounded-lg mb-2 flex items-center justify-center">
                  <span className="text-4xl font-serif text-ink-strong">中</span>
                </div>
                <p className="text-sm font-medium">내 글자</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <div className="flex space-x-3">
          <Button onClick={onRetry} variant="outline" className="flex-1">
            <RotateCcw className="h-4 w-4 mr-2" />
            재도전
          </Button>
          <Button onClick={onSave} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            저장
          </Button>
        </div>
      </div>
    </div>
  );
}
