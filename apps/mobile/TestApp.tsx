import React from 'react';

console.log('TestApp.tsx 로딩됨');

export default function TestApp() {
  console.log('TestApp 렌더링됨');
  
  return (
    <div style={{ 
      backgroundColor: 'red',
      color: 'white',
      fontSize: '24px',
      padding: '20px'
    }}>
      HELLO WORLD - REACT WORKING!
    </div>
  );
}