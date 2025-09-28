/**
 * 🚀 App.tsx - 디지털 서예 코치 v2 메인 애플리케이션
 * 
 * 📋 주요 구성:
 * - AuthProvider로 전체 앱 인증 상태 관리
 * - React Router 기반 SPA 라우팅
 * - 7개 주요 페이지 + 관리자 시스템
 * - 모바일 우선 PWA 구조
 * 
 * 🎨 디자인: 젠 스타일 미니멀 디자인 시스템
 * 📱 플랫폼: 모바일 우선, 반응형 지원
 * 🔐 인증: AuthContext 기반 보호된 라우트
 * 
 * 📅 최종 수정: 2024-12-22
 * 🏗️ 아키텍처: React 18 + TypeScript + Tailwind v4
 */

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth features
import { Landing } from './features/auth/components/Landing';

// User features
import { Home } from './features/user/components/Home';
import { SettingsScreen } from './features/user/components/SettingsScreen';
import { HistoryScreen } from './features/user/components/HistoryScreen';
import { MyWritingGalleryScreen } from './features/user/components/MyWritingGalleryScreen';

// Course features
import { CourseSelection } from './features/course/components/CourseSelection';
import { CourseInfoScreen } from './features/course/components/CourseInfoScreen';
import { CourseCurriculumScreen } from './features/course/components/CourseCurriculumScreen';
import { CourseList } from './features/course/components/CourseList';
import { CourseDetail } from './features/course/components/CourseDetail';
import { CourseIntro } from './features/course/components/CourseIntro';
import { Hwang92LessonDetail } from './features/course/components/Hwang92LessonDetail';

// Practice features
import { PracticeScreen } from './features/practice/components/PracticeScreen';
import { ResultScreen } from './features/practice/components/ResultScreen';
import { ResultScreenV2 } from './features/practice/components/ResultScreenV2';

// Lesson features
import { LessonInfoScreen } from './features/lesson/components/LessonInfoScreen';
import { HanjaLearnScreen } from './features/lesson/components/HanjaLearnScreen';

// Guide features
import { TutorialScreen } from './features/guide/components/TutorialScreen';
import { ToolsGuideScreen } from './features/guide/components/ToolsGuideScreen';

// Community features
import { CommunityScreen } from './features/community/components/CommunityScreen';

// Admin features
import { AdminDashboard } from './features/admin/components/AdminDashboard';

// Test & Utils
import { TestComponent } from './components/TestComponent';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';

/**
 * 📱 AppContent - 메인 애플리케이션 컨텐츠
 * 
 * 🔐 인증 상태에 따른 라우팅 분기
 * 📊 로딩 상태 관리
 * 🧭 전체 라우팅 구조 정의
 */
const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  console.log('🔐 Authentication status:', { isAuthenticated });

  React.useEffect(() => {
    // 🔄 컴포넌트 로딩 체크 (초기화)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto animate-pulse">
            <div className="w-6 h-6 rounded-full bg-primary animate-spin"></div>
          </div>
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        {/* 메인 컨텐츠 */}
        <div>
          <Routes>
            {/* 🚪 미로그인 사용자 - 랜딩 페이지 */}
            <Route 
              path="/" 
              element={!isAuthenticated ? <Landing /> : <Navigate to="/home" />} 
            />
            
            {/* 🏠 로그인 사용자 - 메인 홈 화면 */}
            {/* ✅ v2 완료: 젠 스타일 디자인, 최고기록 위젯, WeeklyStatsDetails 연동 */}
            <Route 
              path="/home" 
              element={isAuthenticated ? <Home /> : <Navigate to="/" />} 
            />
            
            {/* 📚 학습 플로우 - 간소화된 학습 경로 */}
            {/* ✅ v2 완료: 하단 네비게이션 추가, 젠 스타일 적용 */}
            <Route 
              path="/learn" 
              element={isAuthenticated ? <CourseSelection /> : <Navigate to="/" />} 
            />
            <Route 
              path="/learn/:courseType/curriculum" 
              element={isAuthenticated ? <CourseCurriculumScreen /> : <Navigate to="/" />} 
            />
            <Route 
              path="/learn/:courseType/lesson/:lessonId/practice" 
              element={isAuthenticated ? <PracticeScreen /> : <Navigate to="/" />} 
            />
            
            {/* 📚 새로운 코스 관리 시스템 */}
            <Route 
              path="/courses" 
              element={isAuthenticated ? <CourseList /> : <Navigate to="/" />} 
            />
            <Route 
              path="/course/:courseId" 
              element={isAuthenticated ? <CourseDetail /> : <Navigate to="/" />} 
            />
            <Route 
              path="/course/:courseId/intro" 
              element={isAuthenticated ? <CourseIntro /> : <Navigate to="/" />} 
            />
            <Route 
              path="/course/:courseId/lesson/:lessonId" 
              element={isAuthenticated ? <Hwang92LessonDetail /> : <Navigate to="/" />} 
            />
            
            {/* 🚀 빠른 시작 - 즉시 연습 */}
            <Route 
              path="/practice/quick-start" 
              element={isAuthenticated ? <Navigate to="/practice/hangeul_basic_quickstart" replace /> : <Navigate to="/" />} 
            />
            <Route 
              path="/practice/continue" 
              element={isAuthenticated ? <Navigate to="/practice/hangeul_basic_continue" replace /> : <Navigate to="/" />} 
            />
            {/* 황자원 92 서법 전용 라우트 */}
            <Route 
              path="/practice/hwang92-sebeop/:lessonId" 
              element={isAuthenticated ? <PracticeScreen /> : <Navigate to="/" />} 
            />
            <Route 
              path="/practice/:sessionId" 
              element={isAuthenticated ? <PracticeScreen /> : <Navigate to="/" />} 
            />
            <Route 
              path="/practice" 
              element={isAuthenticated ? <PracticeScreen /> : <Navigate to="/" />} 
            />
            
            {/* 📊 기록 및 결과 */}
            <Route 
              path="/history" 
              element={isAuthenticated ? <HistoryScreen /> : <Navigate to="/" />} 
            />
            <Route 
              path="/result/:attemptId" 
              element={isAuthenticated ? <ResultScreenV2 /> : <Navigate to="/" />} 
            />
            <Route 
              path="/result-v2/:attemptId" 
              element={isAuthenticated ? <ResultScreenV2 /> : <Navigate to="/" />} 
            />
            
            {/* 👥 커뮤니티 - SNS 기능 */}
            {/* 📝 TODO: 작가 등록 시스템, 코칭 댓글 기능 완성 필요 */}
            <Route 
              path="/community" 
              element={isAuthenticated ? <CommunityScreen /> : <Navigate to="/" />} 
            />
            
            {/* 👨‍💼 관리자 어드민 - PC용 관리 시스템 */}
            {/* ✅ 완료: 기본 어드민 대시보드 구현 */}
            <Route 
              path="/admin/*" 
              element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/" />} 
            />
            
            {/* 📖 한자 학습 */}
            <Route 
              path="/hanja/:hanjaId" 
              element={isAuthenticated ? <HanjaLearnScreen /> : <Navigate to="/" />} 
            />
            <Route 
              path="/hanja/:courseType-:lessonId" 
              element={isAuthenticated ? <HanjaLearnScreen /> : <Navigate to="/" />} 
            />
            
            {/* ⚙️ 설정 및 도움말 */}
            <Route 
              path="/settings" 
              element={isAuthenticated ? <SettingsScreen /> : <Navigate to="/" />} 
            />
            <Route 
              path="/settings/my-writing" 
              element={isAuthenticated ? <MyWritingGalleryScreen /> : <Navigate to="/" />} 
            />
            
            {/* 🎓 선택적 가이드 (설정에서 접근) */}
            <Route 
              path="/guide/tutorial" 
              element={isAuthenticated ? <TutorialScreen /> : <Navigate to="/" />} 
            />
            <Route 
              path="/guide/tools" 
              element={isAuthenticated ? <ToolsGuideScreen /> : <Navigate to="/" />} 
            />
            
            {/* 🔍 상세 정보 (필요시에만) */}
            <Route 
              path="/learn/:courseType/info" 
              element={isAuthenticated ? <CourseInfoScreen /> : <Navigate to="/" />} 
            />
            <Route 
              path="/learn/:courseType/lesson/:lessonId/info" 
              element={isAuthenticated ? <LessonInfoScreen /> : <Navigate to="/" />} 
            />
            
            {/* 🧪 테스트 컴포넌트 */}
            <Route 
              path="/test" 
              element={<TestComponent />} 
            />
            
            {/* 🔄 레거시 라우트 리다이렉트 */}
            <Route path="/course" element={<Navigate to="/learn" replace />} />
            <Route path="/course/:courseType/curriculum" element={<Navigate to="/learn/:courseType/curriculum" replace />} />
            <Route path="/tutorial" element={<Navigate to="/guide/tutorial" replace />} />
            
            {/* 🚨 안전 장치 */}
            <Route path="/course/*" element={<Navigate to="/learn" replace />} />
            <Route path="/guide/*" element={<Navigate to="/settings" replace />} />
            
            {/* 기본 리다이렉트 */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/"} replace />} />
          </Routes>
        </div>
        <Toaster />
      </div>
    </Router>
  );
};

/**
 * 🎯 App - 루트 컴포넌트
 * 
 * 🔐 AuthProvider로 전체 앱 인증 상태 관리
 * 📱 모바일 우선 PWA 구조
 * 
 * 🚀 개발팀 인수인계 완료: 2024-12-22
 * ✅ 젠 스타일 미니멀 디자인 시스템 적용
 * ✅ 홈 화면 완전 리뉴얼 (최고기록, 통계 위젯)
 * ✅ 하단 네비게이션 시스템 통합
 * ✅ WeeklyStatsDetails 팝업 완성
 */
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;