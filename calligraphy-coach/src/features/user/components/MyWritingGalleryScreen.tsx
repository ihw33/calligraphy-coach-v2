import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { 
  ArrowLeft,
  Camera,
  Upload,
  Trash2,
  Eye,
  Plus,
  Grid3X3,
  List,
  Download,
  Share,
  Calendar,
  Tag,
  Users,
  Heart,
  MessageCircle
} from 'lucide-react';

// 임시 데이터 - 실제로는 LocalStorage나 백엔드에서 관리
const sampleWritings = [
  {
    id: '1',
    imageUrl: '/api/placeholder/300/400',
    title: '한자 연습 - 一二三',
    date: '2024-12-21',
    tags: ['한자', '기초'],
    description: '한자능력시험 8급 기초 연습'
  },
  {
    id: '2', 
    imageUrl: '/api/placeholder/300/400',
    title: '붓글씨 - 사랑',
    date: '2024-12-20',
    tags: ['붓글씨', '감정'],
    description: '감정을 담은 붓글씨 연습'
  },
  {
    id: '3',
    imageUrl: '/api/placeholder/300/400', 
    title: '펜글씨 - 시',
    date: '2024-12-19',
    tags: ['펜글씨', '시'],
    description: '좋아하는 시 필사하기'
  },
  {
    id: '4',
    imageUrl: '/api/placeholder/300/400',
    title: '한글 서예',
    date: '2024-12-18', 
    tags: ['한글', '서예'],
    description: '한글 궁체 연습'
  },
  {
    id: '5',
    imageUrl: '/api/placeholder/300/400',
    title: '일상 글씨',
    date: '2024-12-17',
    tags: ['일상', '메모'],
    description: '평소 글씨체 점검'
  },
  {
    id: '6',
    imageUrl: '/api/placeholder/300/400',
    title: '캘리그라피',
    date: '2024-12-16',
    tags: ['캘리그라피', '창작'],
    description: '창작 캘리그라피 작품'
  }
];

export const MyWritingGalleryScreen: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [writings, setWritings] = useState(sampleWritings);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedWriting, setSelectedWriting] = useState<string | null>(null);

  // 모든 태그 추출
  const allTags = [...new Set(writings.flatMap(w => w.tags))];
  
  // 필터링된 글씨 목록
  const filteredWritings = selectedTag 
    ? writings.filter(w => w.tags.includes(selectedTag))
    : writings;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // 실제로는 파일 업로드 로직 구현
      console.log('파일 업로드:', files[0]);
      
      // 임시로 새 항목 추가
      const newWriting = {
        id: Date.now().toString(),
        imageUrl: URL.createObjectURL(files[0]),
        title: `새 글씨 작품 ${writings.length + 1}`,
        date: new Date().toISOString().split('T')[0],
        tags: ['새작품'],
        description: '새로 업로드한 글씨'
      };
      
      setWritings([newWriting, ...writings]);
    }
  };

  const handleDelete = (id: string) => {
    setWritings(writings.filter(w => w.id !== id));
  };

  const handleShare = (writing: any) => {
    if (navigator.share) {
      navigator.share({
        title: writing.title,
        text: writing.description,
        url: writing.imageUrl
      });
    } else {
      // 폴백: 클립보드에 복사
      navigator.clipboard.writeText(`${writing.title} - ${writing.description}`);
      // 토스트 메시지 표시
    }
  };

  const handleShareToCommunity = (writing: any) => {
    // 커뮤니티로 공유하는 로직
    // 실제로는 로컬 스토리지나 상태 관리를 통해 커뮤니티 포스트로 추가
    const communityPost = {
      id: Date.now().toString(),
      user: {
        id: 'user1',
        name: '김서예',
        username: '@seoye_kim',
        avatar: '/api/placeholder/40/40',
        isFollowing: false
      },
      content: `${writing.title} - ${writing.description}`,
      images: [writing.imageUrl],
      tags: writing.tags,
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isBookmarked: false,
      createdAt: '방금 전',
      character: writing.title.includes('한자') ? '一' : '사'
    };
    
    // 임시로 로컬 스토리지에 저장 (실제로는 API 호출)
    const existingPosts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
    localStorage.setItem('communityPosts', JSON.stringify([communityPost, ...existingPosts]));
    
    // 성공 메시지
    alert('커뮤니티에 공유되었습니다! 🎉');
  };

  return (
    <div className="h-screen flex flex-col calligraphy-bg">
      {/* 헤더 */}
      <header className="flex-shrink-0 px-6 py-6 organic-header">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/settings')}
              className="w-10 h-10 rounded-full bg-muted/40 hover:bg-muted/60 flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="text-center">
              <h1 className="font-medium text-primary ink-splash">내 글씨 모음</h1>
              <p className="text-sm text-muted-foreground">촬영한 글씨 작품들</p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <Plus className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>
      </header>

      {/* 필터 및 뷰 옵션 */}
      <div className="flex-shrink-0 px-6 py-4">
        <div className="max-w-md mx-auto space-y-4">
          {/* 뷰 모드 및 통계 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">총 {writings.length}개</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">
                {selectedTag ? `${selectedTag} ${filteredWritings.length}개` : '전체'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/30'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/30'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 태그 필터 */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all duration-300 ${
                selectedTag === null 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              전체
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all duration-300 ${
                  selectedTag === tag 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 overflow-y-auto px-6 pb-24">
        <div className="max-w-md mx-auto">
          {filteredWritings.length === 0 ? (
            /* 빈 상태 */
            <div className="handmade-card p-12 text-center space-y-4 mt-8">
              <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto">
                <Camera className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-primary mb-2">아직 글씨 작품이 없어요</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  종이에 쓴 글씨를 카메라로 촬영해서<br />나만의 글씨 컬렉션을 만들어보세요
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="ink-button"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  첫 작품 촬영하기
                </Button>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            /* 그리드 뷰 */
            <div className="grid grid-cols-2 gap-4">
              {filteredWritings.map((writing, index) => (
                <div 
                  key={writing.id}
                  className="group relative handmade-card p-3 cursor-pointer hover:scale-105 transition-all duration-300"
                  onClick={() => setSelectedWriting(writing.id)}
                >
                  {/* 이미지 */}
                  <div className="aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-muted/20">
                    <img 
                      src={writing.imageUrl} 
                      alt={writing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* 정보 */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm text-primary line-clamp-1">
                      {writing.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {writing.date}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {writing.tags.slice(0, 2).map(tag => (
                        <span 
                          key={tag}
                          className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 액션 버튼들 */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareToCommunity(writing);
                      }}
                      className="w-8 h-8 rounded-full bg-blue-500/90 hover:bg-blue-600 flex items-center justify-center shadow-lg"
                      title="커뮤니티에 공유"
                    >
                      <Users className="w-3 h-3 text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(writing);
                      }}
                      className="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg"
                      title="일반 공유"
                    >
                      <Share className="w-3 h-3 text-muted-foreground" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(writing.id);
                      }}
                      className="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg"
                      title="삭제"
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* 리스트 뷰 */
            <div className="space-y-4">
              {filteredWritings.map((writing) => (
                <div 
                  key={writing.id}
                  className="handmade-card p-4 cursor-pointer hover:scale-[1.02] transition-all duration-300"
                  onClick={() => setSelectedWriting(writing.id)}
                >
                  <div className="flex gap-4">
                    {/* 썸네일 */}
                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-muted/20 flex-shrink-0">
                      <img 
                        src={writing.imageUrl} 
                        alt={writing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* 정보 */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-primary">{writing.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {writing.description}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShareToCommunity(writing);
                            }}
                            className="w-8 h-8 rounded-full hover:bg-blue-100 flex items-center justify-center"
                            title="커뮤니티에 공유"
                          >
                            <Users className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(writing);
                            }}
                            className="w-8 h-8 rounded-full hover:bg-muted/30 flex items-center justify-center"
                            title="일반 공유"
                          >
                            <Share className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(writing.id);
                            }}
                            className="w-8 h-8 rounded-full hover:bg-destructive/10 flex items-center justify-center"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{writing.date}</span>
                        </div>
                        
                        <div className="flex gap-1">
                          {writing.tags.map(tag => (
                            <span 
                              key={tag}
                              className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
        multiple
      />

      {/* 플로팅 카메라 버튼 */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center ink-button"
      >
        <Camera className="w-6 h-6" />
      </button>

      {/* 하단 네비게이션 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-border/50 px-6 py-3 flowing-nav">
        <div className="max-w-md mx-auto">
          <div className="flex justify-around items-center">
            <button 
              className="flex-col gap-2 text-muted-foreground flex items-center hover:text-primary transition-colors duration-300"
              onClick={() => navigate('/home')}
            >
              <div className="w-8 h-8 rounded-full hover:bg-primary/10 flex items-center justify-center transition-colors duration-300">
                <div className="w-4 h-4 rounded-full bg-muted-foreground hover:bg-primary transition-colors duration-300"></div>
              </div>
              <span className="text-xs">홈</span>
            </button>
            
            <button 
              className="flex-col gap-2 text-muted-foreground flex items-center hover:text-primary transition-colors duration-300"
              onClick={() => navigate('/learn')}
            >
              <div className="w-8 h-8 rounded-full hover:bg-primary/10 flex items-center justify-center transition-colors duration-300">
                <Tag className="w-4 h-4" />
              </div>
              <span className="text-xs">📚 학습</span>
            </button>
            
            <button 
              className="flex-col gap-2 text-muted-foreground flex items-center hover:text-primary transition-colors duration-300"
              onClick={() => navigate('/community')}
            >
              <div className="w-8 h-8 rounded-full hover:bg-primary/10 flex items-center justify-center transition-colors duration-300">
                <Users className="w-4 h-4" />
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
              className="flex-col gap-2 text-primary flex items-center transition-colors duration-300"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center transition-colors duration-300">
                <Eye className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs">설정</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};