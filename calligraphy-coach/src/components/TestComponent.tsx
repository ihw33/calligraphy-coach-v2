import React from 'react';

export const TestComponent: React.FC = () => {
  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center">
      <div className="text-center space-y-4 p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-blue-800">🎯 테스트 컴포넌트</h1>
        <p className="text-gray-600">이 페이지가 보인다면 React가 정상 작동 중입니다!</p>
        <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto animate-bounce"></div>
        <div className="text-sm text-gray-500">
          현재 시간: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};