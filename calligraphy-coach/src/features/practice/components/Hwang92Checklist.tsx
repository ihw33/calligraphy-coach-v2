import React from 'react';

interface Hwang92ChecklistProps {
  evaluationResult: any;
  aiEvaluation: any;
  currentCharacter: string;
}

export const Hwang92Checklist: React.FC<Hwang92ChecklistProps> = ({
  evaluationResult,
  aiEvaluation,
  currentCharacter
}) => {
  const checklist = (aiEvaluation as any)?.checklist || {};
  
  console.log('📊 Hwang92Checklist 컴포넌트 렌더링:', {
    checklist,
    evaluationResult,
    currentCharacter
  });
  
  return (
    <div className="mt-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg" style={{ minHeight: '200px' }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">평</span>
        </div>
        <h4 className="text-sm font-bold text-purple-900">평가 체크리스트</h4>
        <span className="text-xs text-purple-600">각 항목별 달성도를 확인하세요</span>
      </div>
      
      {/* 평가 항목별 체크리스트 */}
      <div className="space-y-3">
        {/* 덮개구조 섹션 */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-purple-800">
            <span>덮개구조 ({evaluationResult.형태}/40점)</span>
          </div>
          <div className="flex items-center gap-2 pl-4 text-xs">
            {checklist.덮개충분 ? 
              <span className="text-green-600">✅</span> : 
              <span className="text-gray-400">☐</span>}
            <span className={`${checklist.덮개충분 ? 'text-gray-700' : 'text-gray-400'}`}>
              갓머리가 충분히 넓은지
            </span>
          </div>
        </div>
        
        {/* 보호관계 섹션 */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-green-800">
            <span>보호관계 ({evaluationResult.비례}/30점)</span>
          </div>
          <div className="flex items-center gap-2 pl-4 text-xs">
            {checklist.내부안전 ? 
              <span className="text-green-600">✅</span> : 
              <span className="text-gray-400">☐</span>}
            <span className={`${checklist.내부안전 ? 'text-gray-700' : 'text-gray-400'}`}>
              {currentCharacter === '宇' ? '于가' : '아래가'} 갓머리 안에 있는지
            </span>
          </div>
        </div>
        
        {/* 공간비례 섹션 */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-orange-800">
            <span>공간비례 ({evaluationResult.굵기}/20점)</span>
          </div>
          <div className="flex items-center gap-2 pl-4 text-xs">
            {checklist.비례적절 ? 
              <span className="text-green-600">✅</span> : 
              <span className="text-gray-400">☐</span>}
            <span className={`${checklist.비례적절 ? 'text-gray-700' : 'text-gray-400'}`}>
              상하 1:3 비율인지
            </span>
          </div>
        </div>
        
        {/* 결구완성도 섹션 */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-purple-800">
            <span>결구완성도 ({evaluationResult.획순}/10점)</span>
          </div>
          <div className="flex items-center gap-2 pl-4 text-xs">
            {checklist.안정감표현 ? 
              <span className="text-green-600">✅</span> : 
              <span className="text-gray-400">☐</span>}
            <span className={`${checklist.안정감표현 ? 'text-gray-700' : 'text-gray-400'}`}>
              천복자 특징이 나타나는지
            </span>
          </div>
        </div>
      </div>
      
      {/* 전체 달성률 */}
      <div className="mt-4 pt-3 border-t border-purple-200">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-purple-900">전체 달성률</span>
          <span className="font-bold text-lg text-purple-600">
            {evaluationResult.총점}%
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${evaluationResult.총점}%` }}
          />
        </div>
      </div>
    </div>
  );
};