import React from 'react';
import { Card } from '../../../components/ui/card';
import { ImageWithFallback } from '../../../shared/components/figma/ImageWithFallback';
import { useAuth } from '../../../contexts/AuthContext';
import { SocialLogin } from './SocialLogin';
import { PenTool, Sparkles, Users, Zap } from 'lucide-react';
import type { AuthResult } from '../../../types/auth';

export const Landing: React.FC = () => {
  const { login } = useAuth();
  
  console.log('🏠 Landing component rendered');

  const features = [
    {
      icon: <PenTool className="w-6 h-6" />,
      title: "AI 피드백",
      description: "실시간 평가와 맞춤 조언"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "체계적 학습",
      description: "기초부터 고급까지 단계별"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "모든 연령",
      description: "어린이부터 성인까지"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "즉시 시작",
      description: "복잡한 설정 없이 바로"
    }
  ];

  const handleSocialLoginSuccess = async (authResult: AuthResult) => {
    try {
      await login(authResult.token, authResult.user);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSocialLoginError = (error: Error) => {
    console.error('Social login error:', error);
    // TODO: Show user-friendly error message
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-center max-w-md mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <PenTool className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-medium">서예 코치</h1>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-md mx-auto px-6 py-12 space-y-12">
        
        {/* 히어로 섹션 */}
        <section className="text-center space-y-8">
          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1753552502151-93914d36ecf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx6ZW4lMjBtZWRpdGF0aW9uJTIwd29ya3NwYWNlJTIwbWluaW1hbHxlbnwxfHx8fDE3NTg1NDMzNDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Zen Workspace"
              className="w-64 h-40 object-cover rounded-xl mx-auto shadow-sm"
            />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-medium leading-tight">
              AI와 함께 배우는<br />
              디지털 서예
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              언제 어디서나 쉽고 재미있게<br />
              전통 서예를 배워보세요
            </p>
          </div>
        </section>

        {/* 기능 소개 */}
        <section className="space-y-6">
          <h3 className="text-center font-medium">핵심 기능</h3>
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <Card key={index} className="p-4 text-center space-y-3">
                <div className="w-12 h-12 rounded-lg bg-muted mx-auto flex items-center justify-center">
                  {feature.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-sm">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 로그인 영역 */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="font-medium">지금 시작하기</h3>
            <p className="text-sm text-muted-foreground">
              간편 로그인으로 바로 시작하세요
            </p>
          </div>
          
          <SocialLogin
            onSuccess={handleSocialLoginSuccess}
            onError={handleSocialLoginError}
          />
        </section>

        {/* 푸터 */}
        <footer className="text-center space-y-3 pt-8">
          <p className="text-xs text-muted-foreground">
            © 2024 서예 코치. 모든 권리 보유.
          </p>
          <div className="flex justify-center gap-4 text-xs">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              이용약관
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              개인정보처리방침
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
};