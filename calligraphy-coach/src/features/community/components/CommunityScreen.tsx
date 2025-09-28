import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Textarea } from '../../../components/ui/textarea';
import { 
  Heart,
  MessageCircle,
  Share,
  UserPlus,
  UserCheck,
  Camera,
  Plus,
  Bookmark,
  BookmarkCheck,
  MoreHorizontal,
  Search,
  TrendingUp,
  Users,
  Home,
  Calendar,
  Settings,
  Send,
  Image as ImageIcon,
  Images,
  X,
  ChevronLeft,
  ChevronRight,
  Award,
  CheckCircle,
  Star,
  GraduationCap,
  Shield
} from 'lucide-react';

// 임시 사용자 데이터 (로컬 스토리지에서 가져오기)
const getCurrentUser = () => {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  return {
    id: 'user1',
    name: '김서예',
    username: '@seoye_kim',
    avatar: '/api/placeholder/40/40',
    following: ['user2', 'user3'],
    bookmarks: ['post1', 'post3'],
    isInstructor: false
  };
};

const currentUser = getCurrentUser();

// 임시 커뮤니티 포스트 데이터
const samplePosts = [
  {
    id: 'post1',
    user: {
      id: 'user2',
      name: '이한글',
      username: '@hangeul_lee',
      avatar: '/api/placeholder/40/40',
      isFollowing: true,
      isInstructor: true,
      instructorInfo: {
        specialties: ['해서', '행서'],
        verifiedAt: '2024-01-15'
      }
    },
    content: '오늘 연습한 "사랑" 글씨입니다. 붓글씨로 감정을 담아 써보았어요. 피드백 부탁드려요!',
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    tags: ['붓글씨', '감정', '사랑'],
    likes: 24,
    comments: 8,
    shares: 3,
    isLiked: true,
    isBookmarked: false,
    createdAt: '2시간 전',
    character: '사랑',
    instructorComment: {
      user: {
        id: 'instructor1',
        name: '서예대가',
        avatar: '/api/placeholder/40/40',
        isInstructor: true
      },
      content: '감정을 글씨에 담아내려는 시도가 정말 좋습니다! 다만 \'사랑\'의 마지막 획에서 좀 더 여유롭게 끝내시면 더욱 부드러운 느낌을 연출할 수 있을 것 같아요. 붓의 압력을 조금 더 조절해보시길 추천드립니다.',
      likes: 12,
      createdAt: '1시간 전'
    }
  },
  {
    id: 'post2',
    user: {
      id: 'user3',
      name: '박서체',
      username: '@seoche_park',
      avatar: '/api/placeholder/40/40',
      isFollowing: false
    },
    content: '한자능력시험 준비하면서 쓴 기초 한자들이에요. 획순이 정말 중요하다는 걸 느꼈습니다 📝',
    images: ['/api/placeholder/400/300'],
    tags: ['한자', '시험준비', '기초'],
    likes: 15,
    comments: 5,
    shares: 2,
    isLiked: false,
    isBookmarked: true,
    createdAt: '5시간 전',
    character: '一二三'
  },
  {
    id: 'post3',
    user: {
      id: 'user4',
      name: '정붓털',
      username: '@brush_jung',
      avatar: '/api/placeholder/40/40',
      isFollowing: true
    },
    content: '새로 산 붓으로 첫 작품! 문구점에서 천원짜리 붓인데 생각보다 괜찮네요 😊',
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300', '/api/placeholder/400/300'],
    tags: ['붓글씨', '도구리뷰', '신상'],
    likes: 31,
    comments: 12,
    shares: 6,
    isLiked: false,
    isBookmarked: false,
    createdAt: '1일 전',
    character: '新'
  }
];

// 인기 태그 데이터
const trendingTags = [
  { tag: '붓글씨', count: 1234 },
  { tag: '한자연습', count: 856 },
  { tag: '펜글씨', count: 742 },
  { tag: '캘리그라피', count: 621 },
  { tag: '시험준비', count: 445 }
];

// 추천 팔로우
const suggestedUsers = [
  { id: 'user5', name: '최서예가', username: '@choi_calligraphy', avatar: '/api/placeholder/40/40', followers: '1.2k' },
  { id: 'user6', name: '서예마스터', username: '@seoye_master', avatar: '/api/placeholder/40/40', followers: '3.4k' }
];

export const CommunityScreen: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 로컬 스토리지에서 커뮤니티 포스트 가져오기
  const getCommunityPosts = () => {
    const storedPosts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
    return [...storedPosts, ...samplePosts];
  };
  
  const [posts, setPosts] = useState(getCommunityPosts());
  const [activeTab, setActiveTab] = useState<'feed' | 'trending' | 'following'>('feed');
  const [isCreating, setIsCreating] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    images: [] as string[],
    tags: [] as string[]
  });
  const [showMyWritings, setShowMyWritings] = useState(false);
  const [selectedMyWritings, setSelectedMyWritings] = useState<string[]>([]);
  const [showInstructorRegistration, setShowInstructorRegistration] = useState(false);
  const [instructorForm, setInstructorForm] = useState({
    name: '',
    experience: '',
    certificates: '',
    introduction: '',
    specialties: [] as string[]
  });

  // 내 글씨 모음 데이터 가져오기
  const getMyWritings = () => {
    const writings = JSON.parse(localStorage.getItem('myWritings') || '[]');
    return writings;
  };

  const [myWritings] = useState(getMyWritings());

  // 컴포넌트 마운트 시 포스트 새로고침
  React.useEffect(() => {
    setPosts(getCommunityPosts());
  }, []);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleBookmark = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const handleFollow = (userId: string) => {
    setPosts(posts.map(post => 
      post.user.id === userId 
        ? { ...post, user: { ...post.user, isFollowing: !post.user.isFollowing } }
        : post
    ));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setNewPost(prev => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 4) // 최대 4장
      }));
    }
  };

  const handleCreatePost = () => {
    if (newPost.content.trim() || newPost.images.length > 0) {
      const post = {
        id: Date.now().toString(),
        user: {
          id: currentUser.id,
          name: currentUser.name,
          username: currentUser.username,
          avatar: currentUser.avatar,
          isFollowing: false
        },
        content: newPost.content,
        images: newPost.images,
        tags: newPost.tags,
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        isBookmarked: false,
        createdAt: '방금 전',
        character: ''
      };
      
      setPosts([post, ...posts]);
      setNewPost({ content: '', images: [], tags: [] });
      setIsCreating(false);
    }
  };

  const removeImage = (index: number) => {
    setNewPost(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleMyWritingSelect = (imageUrl: string) => {
    setSelectedMyWritings(prev => {
      if (prev.includes(imageUrl)) {
        return prev.filter(url => url !== imageUrl);
      } else {
        return [...prev, imageUrl];
      }
    });
  };

  const addSelectedMyWritings = () => {
    setNewPost(prev => ({
      ...prev,
      images: [...prev.images, ...selectedMyWritings].slice(0, 4) // 최대 4장 제한
    }));
    setSelectedMyWritings([]);
    setShowMyWritings(false);
  };

  // 작가 등록 처리
  const handleInstructorRegistration = () => {
    if (!instructorForm.name.trim() || !instructorForm.experience.trim()) {
      return;
    }

    // 현재 사용자를 작가로 등록
    const updatedUser = {
      ...currentUser,
      isInstructor: true,
      instructorInfo: {
        ...instructorForm,
        verifiedAt: new Date().toISOString(),
        status: 'verified'
      }
    };

    // 로컬 스토리지에 저장 (실제 환경에서는 서버에 저장)
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    setShowInstructorRegistration(false);
    setInstructorForm({
      name: '',
      experience: '',
      certificates: '',
      introduction: '',
      specialties: []
    });

    // 페이지 새로고침으로 업데이트된 사용자 정보 반영
    window.location.reload();
  };

  const toggleSpecialty = (specialty: string) => {
    setInstructorForm(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const PostCard = ({ post }: { post: typeof samplePosts[0] }) => (
    <div className="handmade-card p-6 space-y-4">
      {/* 사용자 정보 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 ring-2 ring-primary/10">
            <AvatarImage src={post.user.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/30 text-primary">
              {post.user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-primary">{post.user.name}</h4>
              {post.user.isInstructor && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200">
                  <Shield className="w-3 h-3 text-amber-700" />
                  <span className="text-xs font-medium text-amber-700">인증작가</span>
                </div>
              )}
              <span className="text-xs text-muted-foreground">{post.user.username}</span>
            </div>
            <p className="text-xs text-muted-foreground">{post.createdAt}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {post.user.id !== currentUser.id && (
            <Button
              variant={post.user.isFollowing ? "secondary" : "default"}
              size="sm"
              onClick={() => handleFollow(post.user.id)}
              className="h-8 px-3"
            >
              {post.user.isFollowing ? (
                <>
                  <UserCheck className="w-3 h-3 mr-1" />
                  팔로잉
                </>
              ) : (
                <>
                  <UserPlus className="w-3 h-3 mr-1" />
                  팔로우
                </>
              )}
            </Button>
          )}
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 글 내용 */}
      <div className="space-y-3">
        <p className="text-sm text-foreground leading-relaxed">{post.content}</p>
        
        {/* 태그 */}
        <div className="flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs px-2 py-1 bg-primary/10 text-primary hover:bg-primary/20">
              #{tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* 이미지 갤러리 */}
      {post.images.length > 0 && (
        <div className={`grid gap-2 rounded-xl overflow-hidden ${
          post.images.length === 1 ? 'grid-cols-1' :
          post.images.length === 2 ? 'grid-cols-2' :
          'grid-cols-2'
        }`}>
          {post.images.slice(0, 4).map((image, index) => (
            <div 
              key={index} 
              className={`relative aspect-square overflow-hidden bg-muted/20 ${
                post.images.length === 3 && index === 0 ? 'row-span-2' : ''
              }`}
            >
              <img 
                src={image} 
                alt={`글씨 작품 ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
              />
              {post.images.length > 4 && index === 3 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-medium">+{post.images.length - 4}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 액션 버튼들 */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleLike(post.id)}
            className={`flex items-center gap-1 transition-colors duration-300 ${
              post.isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{post.likes}</span>
          </button>
          
          <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors duration-300">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{post.comments}</span>
          </button>
          
          <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors duration-300">
            <Share className="w-5 h-5" />
            <span className="text-sm">{post.shares}</span>
          </button>
        </div>
        
        <button
          onClick={() => handleBookmark(post.id)}
          className={`transition-colors duration-300 ${
            post.isBookmarked ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500'
          }`}
        >
          {post.isBookmarked ? <BookmarkCheck className="w-5 h-5 fill-current" /> : <Bookmark className="w-5 h-5" />}
        </button>
      </div>

      {/* 코칭 댓글 (작가가 작성한 경우에만 표시) */}
      {post.instructorComment && (
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8 ring-2 ring-amber-200">
              <AvatarImage src={post.instructorComment.user.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-amber-200 to-orange-200 text-amber-800">
                {post.instructorComment.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-amber-800">{post.instructorComment.user.name}</span>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-200 to-orange-200">
                  <GraduationCap className="w-3 h-3 text-amber-800" />
                  <span className="text-xs font-medium text-amber-800">전문 코칭</span>
                </div>
              </div>
              <p className="text-sm text-amber-900 leading-relaxed">{post.instructorComment.content}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs text-amber-700">{post.instructorComment.createdAt}</span>
                <button className="text-xs text-amber-700 hover:text-amber-900 transition-colors">
                  <Heart className="w-3 h-3 inline mr-1" />
                  {post.instructorComment.likes}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen flex flex-col calligraphy-bg">
      {/* 헤더 */}
      <header className="flex-shrink-0 px-6 py-4 organic-header">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-medium text-primary ink-splash">서예 커뮤니티</h1>
                {currentUser.isInstructor && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200">
                    <Shield className="w-3 h-3 text-amber-700" />
                    <span className="text-xs font-medium text-amber-700">인증작가</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {currentUser.isInstructor ? '전문 코칭을 제공해보세요' : '글씨 작품을 공유해보세요'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
                <Search className="w-4 h-4" />
              </Button>
              {!currentUser.isInstructor && (
                <Button
                  onClick={() => setShowInstructorRegistration(true)}
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 text-amber-700 border-amber-200 hover:bg-amber-50"
                >
                  <GraduationCap className="w-4 h-4 mr-1" />
                  작가등록
                </Button>
              )}
              <Button
                onClick={() => navigate('/settings/my-writing')}
                variant="outline"
                size="sm"
                className="h-9 px-3"
              >
                <Images className="w-4 h-4 mr-1" />
                내 글씨
              </Button>
              <Button
                onClick={() => setIsCreating(true)}
                size="sm"
                className="ink-button h-9 px-3"
              >
                <Plus className="w-4 h-4 mr-1" />
                작성
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 탭 네비게이션 */}
      <div className="flex-shrink-0 px-6 py-3">
        <div className="max-w-md mx-auto">
          <div className="flex bg-muted/30 rounded-xl p-1">
            {(['feed', 'trending', 'following'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 text-sm rounded-lg transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {tab === 'feed' && '피드'}
                {tab === 'trending' && '인기'}
                {tab === 'following' && '팔로잉'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 overflow-y-auto px-6 pb-24">
        <div className="max-w-md mx-auto space-y-4">
          {activeTab === 'feed' && (
            <>
              {/* 빠른 작성 */}
              <div className="handmade-card p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/30 text-primary">
                      {currentUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={() => setIsCreating(true)}
                    className="flex-1 text-left px-4 py-2 bg-muted/30 rounded-full text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
                  >
                    오늘 연습한 글씨를 공유해보세요...
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-9 h-9 p-0"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* 포스트 피드 */}
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </>
          )}

          {activeTab === 'trending' && (
            <div className="space-y-4">
              {/* 인기 태그 */}
              <div className="handmade-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h3 className="font-medium text-primary">인기 태그</h3>
                </div>
                <div className="space-y-3">
                  {trendingTags.map((item, index) => (
                    <div key={item.tag} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-xs flex items-center justify-center text-primary font-medium">
                          {index + 1}
                        </span>
                        <span className="font-medium text-primary">#{item.tag}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{item.count}개</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 인기 포스트들 */}
              {posts.filter(post => post.likes > 20).map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {activeTab === 'following' && (
            <div className="space-y-4">
              {/* 추천 팔로우 */}
              <div className="handmade-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-primary" />
                  <h3 className="font-medium text-primary">추천 팔로우</h3>
                </div>
                <div className="space-y-3">
                  {suggestedUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/30 text-primary">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm text-primary">{user.name}</p>
                          <p className="text-xs text-muted-foreground">팔로워 {user.followers}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="h-8 px-3">
                        <UserPlus className="w-3 h-3 mr-1" />
                        팔로우
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 팔로잉 포스트들 */}
              {posts.filter(post => post.user.isFollowing).map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 작가 등록 모달 */}
      {showInstructorRegistration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowInstructorRegistration(false)}>
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 space-y-6 calligraphy-bg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-medium text-primary">작가 등록</h3>
                  <p className="text-sm text-muted-foreground">서예 코칭 자격을 등록해보세요</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowInstructorRegistration(false)} className="w-8 h-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">성명 *</label>
                <input
                  type="text"
                  value={instructorForm.name}
                  onChange={(e) => setInstructorForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="실명을 입력해주세요"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">경력 사항 *</label>
                <Textarea
                  value={instructorForm.experience}
                  onChange={(e) => setInstructorForm(prev => ({ ...prev, experience: e.target.value }))}
                  placeholder="서예 관련 경력을 자세히 적어주세요 (예: 서예학과 졸업, 서예 교사 경력 5년 등)"
                  className="min-h-20 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">자격증 및 수상 이력</label>
                <Textarea
                  value={instructorForm.certificates}
                  onChange={(e) => setInstructorForm(prev => ({ ...prev, certificates: e.target.value }))}
                  placeholder="관련 자격증이나 대회 수상 이력을 적어주세요"
                  className="min-h-16 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">전문 분야</label>
                <div className="flex flex-wrap gap-2">
                  {['해서', '행서', '초서', '예서', '전서', '한글서예', '캘리그래피'].map((specialty) => (
                    <button
                      key={specialty}
                      onClick={() => toggleSpecialty(specialty)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        instructorForm.specialties.includes(specialty)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background text-muted-foreground border-border hover:border-primary'
                      }`}
                    >
                      {specialty}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">자기 소개</label>
                <Textarea
                  value={instructorForm.introduction}
                  onChange={(e) => setInstructorForm(prev => ({ ...prev, introduction: e.target.value }))}
                  placeholder="학습자들에게 전하고 싶은 메시지나 교육 철학을 적어주세요"
                  className="min-h-20 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowInstructorRegistration(false)}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                onClick={handleInstructorRegistration}
                disabled={!instructorForm.name.trim() || !instructorForm.experience.trim()}
                className="flex-1 ink-button"
              >
                <Award className="w-4 h-4 mr-2" />
                등록하기
              </Button>
            </div>

            <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg">
              <p className="font-medium mb-1">📋 작가 등록 안내</p>
              <p>• 등록된 정보는 검토 후 승인됩니다</p>
              <p>• 작가로 인증되면 댓글에 코칭 뱃지가 표시됩니다</p>
              <p>• 허위 정보 시 등록이 취소될 수 있습니다</p>
            </div>
          </div>
        </div>
      )}

      {/* 포스트 작성 모달 */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="w-full max-w-md bg-white rounded-t-2xl p-6 space-y-4 calligraphy-bg">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-primary">작품 공유하기</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)} className="w-8 h-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/30 text-primary">
                  {currentUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm text-primary">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser.username}</p>
              </div>
            </div>

            <Textarea
              placeholder="오늘 연습한 글씨에 대해 이야기해보세요..."
              value={newPost.content}
              onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              className="min-h-24 resize-none"
            />

            {/* 내 글씨에서 선택하기 */}
            {showMyWritings && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-primary">내 글씨에서 선택</h4>
                  <Button variant="ghost" size="sm" onClick={() => setShowMyWritings(false)} className="w-8 h-8 p-0">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                {myWritings.length > 0 ? (
                  <>
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                      {myWritings.map((writing: any, index: number) => (
                        <div 
                          key={writing.id || index}
                          className={`relative aspect-square rounded-lg overflow-hidden bg-muted/20 cursor-pointer border-2 transition-all duration-200 ${
                            selectedMyWritings.includes(writing.imageUrl) 
                              ? 'border-primary ring-2 ring-primary/20' 
                              : 'border-transparent hover:border-primary/50'
                          }`}
                          onClick={() => handleMyWritingSelect(writing.imageUrl)}
                        >
                          <img 
                            src={writing.imageUrl} 
                            alt={writing.title} 
                            className="w-full h-full object-cover"
                          />
                          {selectedMyWritings.includes(writing.imageUrl) && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                            <p className="text-white text-xs truncate">{writing.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {selectedMyWritings.length > 0 && (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          {selectedMyWritings.length}장 선택됨
                        </p>
                        <Button onClick={addSelectedMyWritings} size="sm" className="ink-button">
                          선택 완료
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Images className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">저장된 글씨 작품이 없습니다</p>
                    <p className="text-xs">내 글씨 모음에서 작품을 추가해보세요</p>
                  </div>
                )}
              </div>
            )}

            {/* 이미지 미리보기 */}
            {newPost.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {newPost.images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted/20">
                    <img src={image} alt={`업로드 이미지 ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-9 h-9 p-0"
                  title="카메라로 촬영"
                >
                  <Camera className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-9 h-9 p-0"
                  onClick={() => setShowMyWritings(true)}
                  title="내 글씨에서 선택"
                >
                  <Images className="w-4 h-4" />
                </Button>
              </div>

              <Button
                onClick={handleCreatePost}
                disabled={!newPost.content.trim() && newPost.images.length === 0}
                className="ink-button"
              >
                <Send className="w-4 h-4 mr-2" />
                공유하기
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageUpload}
        className="hidden"
        multiple
      />

      {/* 하단 네비게이션 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-border/50 px-6 py-3 flowing-nav">
        <div className="max-w-md mx-auto">
          <div className="flex justify-around items-center">
            <button 
              className="flex-col gap-2 text-muted-foreground flex items-center hover:text-primary transition-colors duration-300"
              onClick={() => navigate('/home')}
            >
              <div className="w-8 h-8 rounded-full hover:bg-primary/10 flex items-center justify-center transition-colors duration-300">
                <Home className="w-4 h-4" />
              </div>
              <span className="text-xs">홈</span>
            </button>
            
            <button 
              className="flex-col gap-2 text-muted-foreground flex items-center hover:text-primary transition-colors duration-300"
              onClick={() => navigate('/learn')}
            >
              <div className="w-8 h-8 rounded-full hover:bg-primary/10 flex items-center justify-center transition-colors duration-300">
                <div className="w-4 h-4 rounded-full bg-muted-foreground hover:bg-primary transition-colors duration-300"></div>
              </div>
              <span className="text-xs">📚 학습</span>
            </button>
            
            <button 
              className="flex-col gap-2 text-primary flex items-center transition-colors duration-300"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center transition-colors duration-300">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs">커뮤니티</span>
            </button>
            
            <button 
              className="flex-col gap-2 text-muted-foreground flex items-center hover:text-primary transition-colors duration-300"
              onClick={() => navigate('/history')}
            >
              <div className="w-8 h-8 rounded-full hover:bg-primary/10 flex items-center justify-center transition-colors duration-300">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-xs">기록</span>
            </button>
            
            <button 
              className="flex-col gap-2 text-muted-foreground flex items-center hover:text-primary transition-colors duration-300"
              onClick={() => navigate('/settings')}
            >
              <div className="w-8 h-8 rounded-full hover:bg-primary/10 flex items-center justify-center transition-colors duration-300">
                <Settings className="w-4 h-4" />
              </div>
              <span className="text-xs">설정</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};