import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { 
  Users,
  MessageSquare,
  Settings,
  BarChart3,
  Shield,
  FileText,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Activity,
  Award,
  GraduationCap,
  Home,
  Book,
  Target
} from 'lucide-react';

// 임시 관리자 데이터
const adminStats = {
  totalUsers: 1247,
  activeUsers: 892,
  totalPosts: 3456,
  pendingReports: 12,
  pendingInstructors: 8,
  monthlyGrowth: 15.3
};

const recentUsers = [
  { id: '1', name: '김서예', email: 'seoye@example.com', joinDate: '2024-01-15', status: 'active', posts: 23 },
  { id: '2', name: '이한글', email: 'hangeul@example.com', joinDate: '2024-01-14', status: 'active', posts: 45 },
  { id: '3', name: '박붓털', email: 'brush@example.com', joinDate: '2024-01-13', status: 'inactive', posts: 12 }
];

const pendingInstructors = [
  {
    id: '1',
    name: '최서예가',
    email: 'instructor1@example.com',
    experience: '서예학과 졸업, 10년 교육 경력',
    certificates: '서예지도사 1급, 전국서예대회 금상',
    specialties: ['해서', '행서', '초서'],
    submitDate: '2024-01-10'
  },
  {
    id: '2',
    name: '정서체',
    email: 'instructor2@example.com',
    experience: '한국서예협회 회원, 15년 지도 경력',
    certificates: '서예교육지도사, 문화체육관광부 인증',
    specialties: ['한글서예', '캘리그래피'],
    submitDate: '2024-01-12'
  }
];

const communityPosts = [
  { id: '1', author: '김서예', title: '오늘 연습한 사랑 글씨', content: '붓글씨로 감정을...', likes: 24, comments: 8, reports: 0, status: 'published' },
  { id: '2', author: '이한글', title: '한자 연습 기록', content: '기초 한자들...', likes: 15, comments: 5, reports: 1, status: 'reported' },
  { id: '3', author: '박붓털', title: '새 붓 후기', content: '천원짜리 붓인데...', likes: 31, comments: 12, reports: 0, status: 'published' }
];

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // 네비게이션 메뉴 아이템
  const navigationItems = [
    { id: 'dashboard', label: '대시보드', icon: BarChart3 },
    { id: 'users', label: '사용자 관리', icon: Users },
    { id: 'community', label: '커뮤니티 관리', icon: MessageSquare },
    { id: 'instructors', label: '작가 관리', icon: GraduationCap },
    { id: 'content', label: '콘텐츠 관리', icon: Book },
    { id: 'analytics', label: '통계 분석', icon: TrendingUp },
    { id: 'settings', label: '시스템 설정', icon: Settings }
  ];

  const handleInstructorApproval = (instructorId: string, approved: boolean) => {
    console.log(`Instructor ${instructorId} ${approved ? 'approved' : 'rejected'}`);
    // 실제로는 서버 API 호출
  };

  const DashboardOverview = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-primary mb-2">관리자 대시보드</h2>
        <p className="text-muted-foreground">디지털 서예 코치 시스템 관리</p>
      </div>

      {/* 주요 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">전체 사용자</p>
              <p className="text-3xl font-bold text-primary">{adminStats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
            <span className="text-green-600 font-medium">+{adminStats.monthlyGrowth}%</span>
            <span className="text-muted-foreground ml-2">지난달 대비</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">활성 사용자</p>
              <p className="text-3xl font-bold text-primary">{adminStats.activeUsers.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-muted-foreground">활성률: </span>
            <span className="font-medium ml-1">{((adminStats.activeUsers / adminStats.totalUsers) * 100).toFixed(1)}%</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">커뮤니티 게시글</p>
              <p className="text-3xl font-bold text-primary">{adminStats.totalPosts.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <AlertTriangle className="w-4 h-4 text-orange-500 mr-2" />
            <span className="text-orange-600 font-medium">{adminStats.pendingReports}개 신고</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">작가 승인 대기</p>
              <p className="text-3xl font-bold text-primary">{adminStats.pendingInstructors}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground mr-2" />
            <span className="text-muted-foreground">승인 검토 필요</span>
          </div>
        </Card>
      </div>

      {/* 최근 활동 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">최근 가입 사용자</h3>
          <div className="space-y-4">
            {recentUsers.slice(0, 5).map(user => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-primary">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.joinDate}</p>
                  </div>
                </div>
                <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                  {user.status === 'active' ? '활성' : '비활성'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">작가 승인 대기 목록</h3>
          <div className="space-y-4">
            {pendingInstructors.slice(0, 3).map(instructor => (
              <div key={instructor.id} className="p-4 border border-border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-primary">{instructor.name}</p>
                    <p className="text-sm text-muted-foreground">{instructor.email}</p>
                  </div>
                  <Badge variant="outline" className="text-amber-600 border-amber-200">
                    검토중
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {instructor.specialties.map(specialty => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleInstructorApproval(instructor.id, true)}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    승인
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleInstructorApproval(instructor.id, false)}
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    거절
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const UserManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-primary">사용자 관리</h2>
          <p className="text-muted-foreground">회원 정보 및 활동 관리</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="사용자 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            필터
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>사용자</TableHead>
              <TableHead>가입일</TableHead>
              <TableHead>게시글</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-primary">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.joinDate}</TableCell>
                <TableCell>{user.posts}개</TableCell>
                <TableCell>
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                    {user.status === 'active' ? '활성' : '비활성'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );

  const CommunityManagement = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-primary">커뮤니티 관리</h2>
        <p className="text-muted-foreground">게시글 및 댓글 관리, 신고 처리</p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>게시글</TableHead>
              <TableHead>작성자</TableHead>
              <TableHead>좋아요</TableHead>
              <TableHead>댓글</TableHead>
              <TableHead>신고</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {communityPosts.map(post => (
              <TableRow key={post.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-primary">{post.title}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-xs">{post.content}</p>
                  </div>
                </TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell>{post.likes}</TableCell>
                <TableCell>{post.comments}</TableCell>
                <TableCell>
                  {post.reports > 0 ? (
                    <Badge variant="destructive">{post.reports}개</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={post.status === 'published' ? 'default' : 'destructive'}>
                    {post.status === 'published' ? '게시중' : '신고됨'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    {post.reports > 0 && (
                      <Button variant="ghost" size="sm">
                        <Shield className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );

  const InstructorManagement = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-primary">작가 관리</h2>
        <p className="text-muted-foreground">작가 등록 승인 및 관리</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pendingInstructors.map(instructor => (
          <Card key={instructor.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-amber-100 text-amber-800">
                    {instructor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-primary">{instructor.name}</h3>
                  <p className="text-sm text-muted-foreground">{instructor.email}</p>
                  <p className="text-xs text-muted-foreground">신청일: {instructor.submitDate}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-amber-600 border-amber-200">
                승인 대기
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-primary mb-1">경력 사항</h4>
                <p className="text-sm text-muted-foreground">{instructor.experience}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-primary mb-1">자격증 및 수상</h4>
                <p className="text-sm text-muted-foreground">{instructor.certificates}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-primary mb-2">전문 분야</h4>
                <div className="flex flex-wrap gap-2">
                  {instructor.specialties.map(specialty => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  onClick={() => handleInstructorApproval(instructor.id, true)}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  승인
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleInstructorApproval(instructor.id, false)}
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  거절
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'users':
        return <UserManagement />;
      case 'community':
        return <CommunityManagement />;
      case 'instructors':
        return <InstructorManagement />;
      case 'content':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-primary">콘텐츠 관리</h2>
            <p className="text-muted-foreground">강의 콘텐츠 및 한자 데이터 관리 (개발 예정)</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-primary">통계 분석</h2>
            <p className="text-muted-foreground">사용자 행동 분석 및 플랫폼 통계 (개발 예정)</p>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-primary">시스템 설정</h2>
            <p className="text-muted-foreground">시스템 설정 및 관리자 권한 관리 (개발 예정)</p>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* 사이드바 */}
      <div className="w-64 bg-card border-r border-border flex flex-col">
        {/* 헤더 */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/home')}
              className="w-8 h-8"
            >
              <Home className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold text-primary">서예 코치 관리자</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Admin Dashboard</span>
          </div>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigationItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-primary hover:bg-muted/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* 푸터 */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                관
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-primary">관리자</p>
              <p className="text-xs text-muted-foreground">admin@seoye.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};