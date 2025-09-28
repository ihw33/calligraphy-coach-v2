import React from 'react';
import { Card } from '../../../components/ui/card';
import { Progress } from '../../../components/ui/progress';
import { Check, X } from 'lucide-react';
import type { EvaluationStrategy, ChecklistItem, DetailedScores } from '../strategies/types';

interface UnifiedChecklistProps {
  strategy: EvaluationStrategy;
  evaluation: any;
  scores: DetailedScores;
  className?: string;
}

/**
 * 통합 체크리스트 컴포넌트
 * 전략 패턴을 사용하여 다양한 평가 기준을 표시
 */
export const UnifiedChecklist: React.FC<UnifiedChecklistProps> = ({
  strategy,
  evaluation,
  scores,
  className = ''
}) => {
  const checklist = strategy.generateChecklist(evaluation, scores);
  const uiConfig = strategy.getUIConfig();
  const achievedItems = checklist.filter(item => item.checked).length;
  const achievementRate = Math.round((achievedItems / checklist.length) * 100);
  
  // 황자원 92법의 경우 체크리스트 점수의 합계를 사용
  const isHwang92 = strategy.evaluationType === 'hwang92';
  const totalChecklistScore = checklist.reduce((sum, item) => sum + item.score, 0);
  const totalPossibleScore = checklist.reduce((sum, item) => sum + item.maxScore, 0);
  const displayScore = isHwang92 ? totalChecklistScore : scores.총점;
  
  return (
    <Card className={`p-6 space-y-4 bg-gradient-to-r ${uiConfig.bgGradient} border-2 border-${uiConfig.theme}-300 ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full bg-${uiConfig.theme}-500 flex items-center justify-center`}>
          <span className="text-white text-sm font-bold">{uiConfig.icon}</span>
        </div>
        <div className="flex-1">
          <h3 className={`font-medium text-${uiConfig.theme}-900`}>{uiConfig.title}</h3>
          <p className={`text-xs text-${uiConfig.theme}-600`}>{uiConfig.description}</p>
        </div>
        <div className="text-right">
          <div className={`text-xs text-${uiConfig.theme}-600`}>달성률</div>
          <div className={`text-lg font-bold text-${uiConfig.theme}-700`}>{achievementRate}%</div>
        </div>
      </div>
      
      {/* 체크리스트 항목들 */}
      <div className="space-y-3">
        {checklist.map((item) => (
          <ChecklistItemComponent key={item.id} item={item} theme={uiConfig.theme} />
        ))}
      </div>
      
      {/* 전체 점수 및 진행률 */}
      <div className={`pt-3 border-t border-${uiConfig.theme}-200`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium text-${uiConfig.theme}-900`}>전체 점수</span>
          <span className={`text-lg font-bold text-${uiConfig.theme}-600`}>
            {displayScore}/{totalPossibleScore || 100}점
          </span>
        </div>
        <Progress 
          value={(displayScore / (totalPossibleScore || 100)) * 100} 
          className="h-2"
          // Tailwind는 동적 클래스를 인식하지 못하므로 style 사용
          style={{
            background: `rgb(${uiConfig.theme === 'purple' ? '233, 213, 255' : '219, 234, 254'})`,
          }}
        />
      </div>
    </Card>
  );
};

/**
 * 체크리스트 개별 항목 컴포넌트
 */
const ChecklistItemComponent: React.FC<{ 
  item: ChecklistItem; 
  theme: string;
}> = ({ item, theme }) => {
  return (
    <div className="flex items-start gap-3">
      {/* 체크박스 */}
      <div className="flex-shrink-0 mt-0.5">
        {item.checked ? (
          <div className={`w-5 h-5 rounded-full bg-green-500 flex items-center justify-center`}>
            <Check className="w-3 h-3 text-white" />
          </div>
        ) : (
          <div className={`w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center`}>
            <X className="w-3 h-3 text-gray-400" />
          </div>
        )}
      </div>
      
      {/* 내용 */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className={`text-sm font-medium ${item.checked ? 'text-gray-700' : 'text-gray-400'}`}>
            {item.label}
          </div>
          <div className={`text-xs ${item.checked ? `text-${theme}-600` : 'text-gray-400'}`}>
            {item.score}/{item.maxScore}점
          </div>
        </div>
        {item.description && (
          <div className={`text-xs mt-0.5 ${item.checked ? 'text-gray-500' : 'text-gray-400'}`}>
            {item.description}
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedChecklist;