import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Switch } from '../../../components/ui/switch';
import { Slider } from '../../../components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  ArrowLeft, 
  User, 
  Palette, 
  Bell, 
  Database, 
  LogOut, 
  Trash2,
  Moon,
  Sun,
  Volume2,
  Download,
  Upload,
  RefreshCw,
  ChevronRight,
  Edit,
  Settings,
  Brush,
  PenTool,
  Target,
  GraduationCap,
  Camera,
  Images
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // 사용자 초기 설정 가져오기
  const userPreferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');

  // 설정 상태들
  const [settings, setSettings] = useState({
    defaultFont: 'panbon', // 판본체
    showStrokeGuide: true,
    showGrid: true,
    defaultAmount: [10],
    darkMode: false,
    notifications: true,
    sound: true
  });

  // 초기 설정 상태
  const [initialSettings, setInitialSettings] = useState(userPreferences);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logout();
      navigate('/');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      // 계정 삭제 로직
      alert('계정 삭제 기능은 실제 서비스에서 구현됩니다.');
    }
  };

  const handleBackup = () => {
    alert('데이터 백업을 시작합니다. (실제 서비스에서 구현됩니다.)');
  };

  const handleRestore = () => {
    alert('데이터 복원을 시작합니다. (실제 서비스에서 구현됩니다.)');
  };

  const handleClearCache = () => {
    if (window.confirm('캐시를 정리하시겠습니까?')) {
      alert('캐시가 정리되었습니다.');
    }
  };

  const handleEditInitialSettings = () => {
    navigate('/guide/tutorial');
  };

  const getModeLabel = (mode: string) => {
    return mode === 'brush' ? '붓글씨' : mode === 'pen' ? '펜글씨' : '설정 안됨';
  };

  const getLevelLabel = (level: string) => {
    return level === 'beginner' ? '초급' : level === 'intermediate' ? '중급' : '설정 안됨';
  };

  const getGoalLabel = (goal: string) => {
    return goal === 'hobby' ? '취미' : goal === 'education' ? '교육' : goal === 'artistic' ? '예술' : '설정 안됨';
  };

  const fontOptions = [
    { value: 'panbon', label: '판본체', description: '현대적이고 읽기 쉬운 서체' },
    { value: 'gungsuh', label: '궁서체', description: '우아하고 정갈한 전통 서체' },
    { value: 'jeonsuh', label: '전서체', description: '고풍스러운 전통 서체' },
    { value: 'haesuh', label: '해서체', description: '정통 한자 서체' }
  ];

  return (
    <div className="h-screen flex flex-col calligraphy-bg">
      {/* 헤더 */}
      <header className="flex-shrink-0 px-6 py-6 organic-header">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/home')}
              className="w-10 h-10 rounded-full bg-muted/40 hover:bg-muted/60 flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="text-center">
              <h1 className="font-medium text-primary ink-splash">설정</h1>
              <p className="text-sm text-muted-foreground">앱 환경을 개인화하세요</p>
            </div>
            <div className="w-10 h-10" />
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        <div className="max-w-md mx-auto space-y-6">
          {/* 프로필 섹션 */}
          <div className="handmade-card p-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 ring-2 ring-primary/20 ring-offset-2 ring-offset-transparent">
                <AvatarImage src={user?.profileImage} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xl">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-medium text-primary ink-splash">{user?.name}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <div className="flex gap-2 mt-2">
                  <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-primary hover:bg-primary/10">
                    <Edit className="w-3 h-3 mr-1" />
                    프로필 수정
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-0 h-auto text-xs text-rose-600 hover:bg-rose-50"
                    onClick={() => navigate('/settings/my-writing')}
                  >
                    <Images className="w-3 h-3 mr-1" />
                    내 작품
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 내 글씨 모음 - 프로필 바로 다음 위치 */}
          <div className="handmade-card p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-200 to-pink-300 flex items-center justify-center">
                <Images className="w-5 h-5 text-rose-700" />
              </div>
              <div>
                <h3 className="font-medium text-primary">내 글씨 모음</h3>
                <p className="text-xs text-muted-foreground">촬영한 글씨 작품 보관함</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-between rounded-lg hover:bg-rose-50 border-rose-200/60 hover:border-rose-300" 
                onClick={() => navigate('/settings/my-writing')}
              >
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-rose-600" />
                  <span className="text-rose-700">내 글씨 모음 보기</span>
                </div>
                <ChevronRight className="w-4 h-4 text-rose-600" />
              </Button>

              <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <Camera className="w-4 h-4 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-xs text-rose-700 font-medium mb-1">📸 글씨 촬영 팁</p>
                    <ul className="text-xs text-rose-600 space-y-0.5">
                      <li>• 충분한 조명 아래에서 촬영하세요</li>
                      <li>• 글씨가 화면에 꽉 차도록 촬영하세요</li>
                      <li>• 그림자가 생기지 않도록 주의하세요</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 초기 설정 */}
          <div className="handmade-card p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-primary">초기 설정</h3>
                  <p className="text-xs text-muted-foreground">학습 방향과 스타일</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleEditInitialSettings}
                className="text-primary hover:bg-primary/10 rounded-lg"
              >
                <Edit className="w-4 h-4 mr-1" />
                수정
              </Button>
            </div>

            <div className="space-y-4">
              {/* 현재 모드 */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  {initialSettings.mode === 'brush' ? 
                    <Brush className="w-6 h-6 text-amber-600" /> : 
                    <PenTool className="w-6 h-6 text-blue-600" />
                  }
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">선호 도구</p>
                  <p className="text-xs text-muted-foreground">{getModeLabel(initialSettings.mode)}</p>
                </div>
              </div>

              {/* 현재 수준 */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">학습 수준</p>
                  <p className="text-xs text-muted-foreground">{getLevelLabel(initialSettings.level)}</p>
                </div>
              </div>

              {/* 학습 목표 */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">학습 목표</p>
                  <p className="text-xs text-muted-foreground">{getGoalLabel(initialSettings.goal)}</p>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <p className="text-xs text-blue-700">
                  💡 초기 설정을 변경하면 추천 코스와 학습 방법이 달라집니다.
                </p>
              </div>
            </div>
          </div>

          {/* 학습 설정 */}
          <div className="handmade-card p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-primary">학습 설정</h3>
                <p className="text-xs text-muted-foreground">연습 환경 설정</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* 기본 서체 선택 */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-primary">기본 서체</label>
                <Select 
                  value={settings.defaultFont} 
                  onValueChange={(value) => handleSettingChange('defaultFont', value)}
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        <div>
                          <div className="font-medium">{font.label}</div>
                          <div className="text-xs text-muted-foreground">{font.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 획순 가이드 */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div>
                  <label className="text-sm font-medium text-primary">획순 가이드 표시</label>
                  <p className="text-xs text-muted-foreground">연습 시 획순을 보여줍니다</p>
                </div>
                <Switch
                  checked={settings.showStrokeGuide}
                  onCheckedChange={(checked) => handleSettingChange('showStrokeGuide', checked)}
                />
              </div>

              {/* 격자 표시 */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div>
                  <label className="text-sm font-medium text-primary">격자 표시</label>
                  <p className="text-xs text-muted-foreground">글자 균형을 맞추는데 도움이 됩니다</p>
                </div>
                <Switch
                  checked={settings.showGrid}
                  onCheckedChange={(checked) => handleSettingChange('showGrid', checked)}
                />
              </div>

              {/* 기본 학습 분량 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-primary">기본 학습 분량</label>
                  <span className="text-sm font-medium text-primary">{settings.defaultAmount[0]}개</span>
                </div>
                <Slider
                  value={settings.defaultAmount}
                  onValueChange={(value) => handleSettingChange('defaultAmount', value)}
                  max={20}
                  min={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5개 (빠르게)</span>
                  <span>20개 (충분히)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 시스템 설정 */}
          <div className="handmade-card p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-primary">시스템 설정</h3>
                <p className="text-xs text-muted-foreground">앱 동작 설정</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* 다크모드 */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div className="flex items-center gap-3">
                  {settings.darkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                  <div>
                    <label className="text-sm font-medium text-primary">다크모드</label>
                    <p className="text-xs text-muted-foreground">어두운 테마 사용</p>
                  </div>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                />
              </div>

              {/* 알림 */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div>
                  <label className="text-sm font-medium text-primary">알림</label>
                  <p className="text-xs text-muted-foreground">학습 리마인더 및 성취 알림</p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                />
              </div>

              {/* 사운드 */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-primary" />
                  <div>
                    <label className="text-sm font-medium text-primary">사운드 효과</label>
                    <p className="text-xs text-muted-foreground">앱 내 사운드 재생</p>
                  </div>
                </div>
                <Switch
                  checked={settings.sound}
                  onCheckedChange={(checked) => handleSettingChange('sound', checked)}
                />
              </div>
            </div>
          </div>

          {/* 데이터 관리 */}
          <div className="handmade-card p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-primary">데이터 관리</h3>
                <p className="text-xs text-muted-foreground">백업 및 복원</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-between rounded-lg hover:bg-primary/5" onClick={handleBackup}>
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span>데이터 백업</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>

              <Button variant="outline" className="w-full justify-between rounded-lg hover:bg-primary/5" onClick={handleRestore}>
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <span>데이터 복원</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>

              <Button variant="outline" className="w-full justify-between rounded-lg hover:bg-primary/5" onClick={handleClearCache}>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>캐시 정리</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* 계정 관리 */}
          <div className="handmade-card p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-primary">계정</h3>
                <p className="text-xs text-muted-foreground">로그아웃 및 계정 관리</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-between text-red-600 border-red-200 hover:bg-red-50 rounded-lg"
                onClick={handleLogout}
              >
                <div className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  <span>로그아웃</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-between text-red-600 border-red-200 hover:bg-red-50 rounded-lg"
                onClick={handleDeleteAccount}
              >
                <div className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  <span>계정 삭제</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* 앱 정보 */}
          <div className="handmade-card p-6 text-center space-y-3">
            <h3 className="font-medium text-primary ink-splash">서예 코치 v2</h3>
            <p className="text-sm text-muted-foreground">버전 2.0.0</p>
            <div className="flex justify-center gap-4 text-xs text-muted-foreground pt-2">
              <button className="hover:text-primary transition-colors">이용약관</button>
              <button className="hover:text-primary transition-colors">개인정보처리방침</button>
              <button className="hover:text-primary transition-colors">고객지원</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};