import type { Course, Character } from '../../types/course';

// 🎵 K-Culture 한글 손글씨 코스 - K-pop, 드라마, 음식 등
export const penHangulKCultureCourse: Course = {
  id: 'pen-hangul-kculture',
  type: 'pen',
  category: 'hangul',
  level: 'beginner',
  title: '✏️ K-Culture 한글 쓰기',
  description: '[디지털] K-pop, 드라마, 한식 등 인기 한국 문화 단어로 재미있게 한글 배우기',
  thumbnail: '/images/courses/pen-hangul-kculture.png',
  order: 1,
  lessons: [
    {
      id: 'phk-01',
      title: '🎯 한글 첫걸음 - 자음/모음/기본글자',
      description: '한글의 기초! 자음 5개, 모음 5개, 기본 글자 10개를 한 번에 마스터',
      order: 1,
      characters: [
        // 자음 5개
        { id: 'kc001', character: 'ㄱ', type: 'korean', pronunciation: '기역' },
        { id: 'kc002', character: 'ㄴ', type: 'korean', pronunciation: '니은' },
        { id: 'kc003', character: 'ㅁ', type: 'korean', pronunciation: '미음' },
        { id: 'kc004', character: 'ㅅ', type: 'korean', pronunciation: '시옷' },
        { id: 'kc005', character: 'ㅇ', type: 'korean', pronunciation: '이응' },
        // 모음 5개
        { id: 'kc006', character: 'ㅏ', type: 'korean', pronunciation: '아' },
        { id: 'kc007', character: 'ㅓ', type: 'korean', pronunciation: '어' },
        { id: 'kc008', character: 'ㅗ', type: 'korean', pronunciation: '오' },
        { id: 'kc009', character: 'ㅜ', type: 'korean', pronunciation: '우' },
        { id: 'kc010', character: 'ㅣ', type: 'korean', pronunciation: '이' },
        // 기본 글자 10개
        { id: 'kc011', character: '가', type: 'korean', pronunciation: '가' },
        { id: 'kc012', character: '나', type: 'korean', pronunciation: '나' },
        { id: 'kc013', character: '다', type: 'korean', pronunciation: '다' },
        { id: 'kc014', character: '마', type: 'korean', pronunciation: '마' },
        { id: 'kc015', character: '사', type: 'korean', pronunciation: '사' },
        { id: 'kc016', character: '아', type: 'korean', pronunciation: '아' },
        { id: 'kc017', character: '자', type: 'korean', pronunciation: '자' },
        { id: 'kc018', character: '카', type: 'korean', pronunciation: '카' },
        { id: 'kc019', character: '타', type: 'korean', pronunciation: '타' },
        { id: 'kc020', character: '파', type: 'korean', pronunciation: '파' }
      ],
      practiceMode: 'single',
      duration: 30,
      status: 'available',
      progress: 0
    },
    {
      id: 'phk-02',
      title: '🍚 한식 메뉴 - 기본',
      description: '외국인이 꼭 알아야 할 한국 음식 이름',
      order: 2,
      characters: [
        { id: 'kc021', character: '김치', type: 'korean', meaning: 'Kimchi' },
        { id: 'kc022', character: '비빔밥', type: 'korean', meaning: 'Bibimbap' },
        { id: 'kc023', character: '불고기', type: 'korean', meaning: 'Bulgogi' },
        { id: 'kc024', character: '삼겹살', type: 'korean', meaning: 'Samgyeopsal' },
        { id: 'kc025', character: '떡볶이', type: 'korean', meaning: 'Tteokbokki' },
        { id: 'kc026', character: '김밥', type: 'korean', meaning: 'Kimbap' }
      ],
      practiceMode: 'word',
      duration: 20,
      status: 'locked',
      progress: 0
    },
    {
      id: 'phk-03',
      title: '🎵 K-pop 그룹 이름',
      description: '인기 K-pop 아이돌 그룹 이름 쓰기',
      order: 3,
      characters: [
        { id: 'kc027', character: '방탄소년단', type: 'korean', meaning: 'BTS' },
        { id: 'kc028', character: '블랙핑크', type: 'korean', meaning: 'BLACKPINK' },
        { id: 'kc029', character: '세븐틴', type: 'korean', meaning: 'SEVENTEEN' },
        { id: 'kc030', character: '스트레이키즈', type: 'korean', meaning: 'Stray Kids' },
        { id: 'kc031', character: '엔시티', type: 'korean', meaning: 'NCT' },
        { id: 'kc032', character: '트와이스', type: 'korean', meaning: 'TWICE' },
        { id: 'kc033', character: '에이티즈', type: 'korean', meaning: 'ATEEZ' },
        { id: 'kc034', character: '아이브', type: 'korean', meaning: 'IVE' }
      ],
      practiceMode: 'word',
      duration: 25,
      status: 'locked',
      progress: 0
    },
    {
      id: 'phk-04',
      title: '📺 인기 드라마 제목',
      description: '화제의 K-드라마 제목 쓰기',
      order: 4,
      characters: [
        { id: 'kc025', character: '오징어게임', type: 'korean', meaning: 'Squid Game' },
        { id: 'kc026', character: '사랑의불시착', type: 'korean', meaning: 'Crash Landing on You' },
        { id: 'kc027', character: '이태원클라쓰', type: 'korean', meaning: 'Itaewon Class' },
        { id: 'kc028', character: '더글로리', type: 'korean', meaning: 'The Glory' },
        { id: 'kc029', character: '킹덤', type: 'korean', meaning: 'Kingdom' },
        { id: 'kc030', character: '지옥', type: 'korean', meaning: 'Hellbound' }
      ],
      practiceMode: 'word',
      duration: 20,
      status: 'locked',
      progress: 0
    },
    {
      id: 'phk-05',
      title: '🌟 K-pop 스타 이름',
      description: '유명한 K-pop 가수/배우 이름 쓰기',
      order: 5,
      characters: [
        { id: 'kc031', character: '아이유', type: 'korean', meaning: 'IU' },
        { id: 'kc032', character: '지민', type: 'korean', meaning: 'Jimin' },
        { id: 'kc033', character: '정국', type: 'korean', meaning: 'Jungkook' },
        { id: 'kc034', character: '제니', type: 'korean', meaning: 'Jennie' },
        { id: 'kc035', character: '리사', type: 'korean', meaning: 'Lisa' },
        { id: 'kc036', character: '차은우', type: 'korean', meaning: 'Cha Eun-woo' }
      ],
      practiceMode: 'word',
      duration: 15,
      status: 'locked',
      progress: 0
    },
    {
      id: 'phk-06',
      title: '🍜 한식 메뉴 - 심화',
      description: '더 많은 한국 음식 이름 익히기',
      order: 6,
      characters: [
        { id: 'kc037', character: '짜장면', type: 'korean', meaning: 'Jjajangmyeon' },
        { id: 'kc038', character: '짬뽕', type: 'korean', meaning: 'Jjamppong' },
        { id: 'kc039', character: '냉면', type: 'korean', meaning: 'Naengmyeon' },
        { id: 'kc040', character: '순대', type: 'korean', meaning: 'Sundae' },
        { id: 'kc041', character: '호떡', type: 'korean', meaning: 'Hotteok' },
        { id: 'kc042', character: '붕어빵', type: 'korean', meaning: 'Bungeoppang' },
        { id: 'kc043', character: '팥빙수', type: 'korean', meaning: 'Patbingsu' },
        { id: 'kc044', character: '치킨', type: 'korean', meaning: 'Chicken' }
      ],
      practiceMode: 'word',
      duration: 25,
      status: 'locked',
      progress: 0
    },
    {
      id: 'phk-07',
      title: '💬 일상 명사',
      description: '자주 쓰는 명사 단어 연습',
      order: 7,
      characters: [
        { id: 'kc045', character: '사랑', type: 'korean', meaning: 'Love' },
        { id: 'kc046', character: '친구', type: 'korean', meaning: 'Friend' },
        { id: 'kc047', character: '학교', type: 'korean', meaning: 'School' },
        { id: 'kc048', character: '집', type: 'korean', meaning: 'Home' },
        { id: 'kc049', character: '가족', type: 'korean', meaning: 'Family' },
        { id: 'kc050', character: '시간', type: 'korean', meaning: 'Time' }
      ],
      practiceMode: 'word',
      duration: 15,
      status: 'locked',
      progress: 0
    },
    {
      id: 'phk-08',
      title: '🎬 일상 동사',
      description: '자주 쓰는 동사 단어 연습',
      order: 8,
      characters: [
        { id: 'kc051', character: '먹다', type: 'korean', meaning: 'To eat' },
        { id: 'kc052', character: '마시다', type: 'korean', meaning: 'To drink' },
        { id: 'kc053', character: '가다', type: 'korean', meaning: 'To go' },
        { id: 'kc054', character: '오다', type: 'korean', meaning: 'To come' },
        { id: 'kc055', character: '보다', type: 'korean', meaning: 'To see/watch' },
        { id: 'kc056', character: '듣다', type: 'korean', meaning: 'To listen' }
      ],
      practiceMode: 'word',
      duration: 15,
      status: 'locked',
      progress: 0
    },
    {
      id: 'phk-09',
      title: '✨ 감정 형용사',
      description: '감정을 표현하는 형용사 연습',
      order: 9,
      characters: [
        { id: 'kc057', character: '좋다', type: 'korean', meaning: 'Good' },
        { id: 'kc058', character: '예쁘다', type: 'korean', meaning: 'Pretty' },
        { id: 'kc059', character: '귀엽다', type: 'korean', meaning: 'Cute' },
        { id: 'kc060', character: '멋있다', type: 'korean', meaning: 'Cool' },
        { id: 'kc061', character: '맛있다', type: 'korean', meaning: 'Delicious' },
        { id: 'kc062', character: '재미있다', type: 'korean', meaning: 'Fun/Interesting' }
      ],
      practiceMode: 'word',
      duration: 15,
      status: 'locked',
      progress: 0
    },
    {
      id: 'phk-10',
      title: '🎉 K-Culture 표현',
      description: 'K-pop 팬들이 자주 쓰는 표현',
      order: 10,
      characters: [
        { id: 'kc063', character: '대박', type: 'korean', meaning: 'Awesome!' },
        { id: 'kc064', character: '화이팅', type: 'korean', meaning: 'Fighting!' },
        { id: 'kc065', character: '사랑해', type: 'korean', meaning: 'I love you' },
        { id: 'kc066', character: '보고싶어', type: 'korean', meaning: 'I miss you' },
        { id: 'kc067', character: '고마워', type: 'korean', meaning: 'Thank you' },
        { id: 'kc068', character: '미안해', type: 'korean', meaning: 'Sorry' }
      ],
      practiceMode: 'word',
      duration: 15,
      status: 'locked',
      progress: 0
    },
    {
      id: 'phk-11',
      title: '🏙️ 한국 지명',
      description: '주요 도시와 관광지 이름',
      order: 11,
      characters: [
        { id: 'kc069', character: '서울', type: 'korean', meaning: 'Seoul' },
        { id: 'kc070', character: '부산', type: 'korean', meaning: 'Busan' },
        { id: 'kc071', character: '제주도', type: 'korean', meaning: 'Jeju Island' },
        { id: 'kc072', character: '경주', type: 'korean', meaning: 'Gyeongju' },
        { id: 'kc073', character: '강남', type: 'korean', meaning: 'Gangnam' },
        { id: 'kc074', character: '명동', type: 'korean', meaning: 'Myeongdong' },
        { id: 'kc075', character: '홍대', type: 'korean', meaning: 'Hongdae' },
        { id: 'kc076', character: '이태원', type: 'korean', meaning: 'Itaewon' }
      ],
      practiceMode: 'word',
      duration: 20,
      status: 'locked',
      progress: 0
    }
  ],
  totalLessons: 11,
  completedLessons: 0,
  progress: 0,
  estimatedTime: 215, // 총 소요 시간 (분)
  evaluationCriteria: {
    pen: {
      accuracy: 40,
      smoothness: 30,
      consistency: 30
    }
  },
  status: 'available'
};

// K-Culture 코스의 하위 카테고리별 레슨 필터링 헬퍼
export function getKCultureLessonsByCategory(category: 'basic' | 'food' | 'kpop' | 'drama' | 'daily') {
  const categoryMap = {
    basic: ['phk-01', 'phk-02'], // 자음/모음
    food: ['phk-03', 'phk-07'], // 한식
    kpop: ['phk-04', 'phk-06', 'phk-11'], // K-pop 관련
    drama: ['phk-05'], // 드라마
    daily: ['phk-08', 'phk-09', 'phk-10', 'phk-12'] // 일상 표현
  };
  
  return penHangulKCultureCourse.lessons.filter(
    lesson => categoryMap[category].includes(lesson.id)
  );
}