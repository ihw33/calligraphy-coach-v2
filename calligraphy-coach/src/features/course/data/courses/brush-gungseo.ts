import type { Course } from '../../types/course';

// 🖌️ 붓글씨 - 궁서체 코스 (실물 모드)
export const brushGungseoCourse: Course = {
  id: 'brush-gungseo',
  type: 'brush',
  category: 'hangul',
  level: 'intermediate',
  title: '🖌️ 한글 붓글씨 - 궁서체',
  description: '[실물] 조선 궁중에서 사용된 아름다운 궁서체를 붓과 먹으로 익히는 정통 서예 과정',
  thumbnail: '/images/courses/brush-gungseo.png',
  order: 4,
  lessons: [
    {
      id: 'bg-01',
      title: '🎯 기본 획과 점 - 기필, 송필, 수필',
      description: '붓글씨의 기초! 기필(시작), 송필(중간), 수필(마무리) 익히기',
      order: 1,
      characters: [
        { 
          id: 'gc001', 
          character: '一', 
          type: 'korean', 
          meaning: '가로획',
          referenceImage: '/images/gungseo/horizontal.png',
          strokeOrder: [1]
        },
        { 
          id: 'gc002', 
          character: '丨', 
          type: 'korean', 
          meaning: '세로획',
          referenceImage: '/images/gungseo/vertical.png',
          strokeOrder: [1]
        },
        { 
          id: 'gc003', 
          character: '丶', 
          type: 'korean', 
          meaning: '점',
          referenceImage: '/images/gungseo/dot.png',
          strokeOrder: [1]
        },
        { 
          id: 'gc004', 
          character: '丿', 
          type: 'korean', 
          meaning: '삐침',
          referenceImage: '/images/gungseo/slash.png',
          strokeOrder: [1]
        }
      ],
      practiceMode: 'single',
      fontStyle: 'gungseo',
      duration: 40,
      status: 'available',
      progress: 0
    },
    {
      id: 'bg-02',
      title: '📝 기본 자음 (ㄱ, ㄴ, ㄷ, ㄹ, ㅁ)',
      description: '궁서체 자음의 기본 형태와 필법 익히기',
      order: 2,
      characters: [
        { 
          id: 'gc005', 
          character: 'ㄱ', 
          type: 'korean',
          pronunciation: '기역',
          referenceImage: '/images/gungseo/ㄱ.png'
        },
        { 
          id: 'gc006', 
          character: 'ㄴ', 
          type: 'korean',
          pronunciation: '니은',
          referenceImage: '/images/gungseo/ㄴ.png'
        },
        { 
          id: 'gc007', 
          character: 'ㄷ', 
          type: 'korean',
          pronunciation: '디귿',
          referenceImage: '/images/gungseo/ㄷ.png'
        },
        { 
          id: 'gc008', 
          character: 'ㄹ', 
          type: 'korean',
          pronunciation: '리을',
          referenceImage: '/images/gungseo/ㄹ.png'
        },
        { 
          id: 'gc009', 
          character: 'ㅁ', 
          type: 'korean',
          pronunciation: '미음',
          referenceImage: '/images/gungseo/ㅁ.png'
        }
      ],
      practiceMode: 'single',
      fontStyle: 'gungseo',
      duration: 35,
      status: 'locked',
      progress: 0
    },
    {
      id: 'bg-03',
      title: '📝 복잡한 자음 (ㅂ, ㅅ, ㅇ, ㅈ, ㅊ, ㅋ, ㅌ, ㅍ, ㅎ)',
      description: '획이 많은 자음들의 균형과 조화 익히기',
      order: 3,
      characters: [
        { id: 'gc010', character: 'ㅂ', type: 'korean', pronunciation: '비읍' },
        { id: 'gc011', character: 'ㅅ', type: 'korean', pronunciation: '시옷' },
        { id: 'gc012', character: 'ㅇ', type: 'korean', pronunciation: '이응' },
        { id: 'gc013', character: 'ㅈ', type: 'korean', pronunciation: '지읒' },
        { id: 'gc014', character: 'ㅊ', type: 'korean', pronunciation: '치읓' },
        { id: 'gc015', character: 'ㅋ', type: 'korean', pronunciation: '키읔' },
        { id: 'gc016', character: 'ㅌ', type: 'korean', pronunciation: '티읕' },
        { id: 'gc017', character: 'ㅍ', type: 'korean', pronunciation: '피읖' },
        { id: 'gc018', character: 'ㅎ', type: 'korean', pronunciation: '히읗' }
      ],
      practiceMode: 'single',
      fontStyle: 'gungseo',
      duration: 45,
      status: 'locked',
      progress: 0
    },
    {
      id: 'bg-04',
      title: '✨ 기본 모음 (ㅏ, ㅓ, ㅗ, ㅜ, ㅡ, ㅣ)',
      description: '모음의 점획 연결과 균형 익히기',
      order: 4,
      characters: [
        { id: 'gc019', character: 'ㅏ', type: 'korean', pronunciation: '아' },
        { id: 'gc020', character: 'ㅓ', type: 'korean', pronunciation: '어' },
        { id: 'gc021', character: 'ㅗ', type: 'korean', pronunciation: '오' },
        { id: 'gc022', character: 'ㅜ', type: 'korean', pronunciation: '우' },
        { id: 'gc023', character: 'ㅡ', type: 'korean', pronunciation: '으' },
        { id: 'gc024', character: 'ㅣ', type: 'korean', pronunciation: '이' }
      ],
      practiceMode: 'single',
      fontStyle: 'gungseo',
      duration: 30,
      status: 'locked',
      progress: 0
    },
    {
      id: 'bg-05',
      title: '✨ 복합 모음 (ㅑ, ㅕ, ㅛ, ㅠ, ㅐ, ㅔ, ㅒ, ㅖ)',
      description: '겹모음의 조화로운 연결법 익히기',
      order: 5,
      characters: [
        { id: 'gc025', character: 'ㅑ', type: 'korean', pronunciation: '야' },
        { id: 'gc026', character: 'ㅕ', type: 'korean', pronunciation: '여' },
        { id: 'gc027', character: 'ㅛ', type: 'korean', pronunciation: '요' },
        { id: 'gc028', character: 'ㅠ', type: 'korean', pronunciation: '유' },
        { id: 'gc029', character: 'ㅐ', type: 'korean', pronunciation: '애' },
        { id: 'gc030', character: 'ㅔ', type: 'korean', pronunciation: '에' },
        { id: 'gc031', character: 'ㅒ', type: 'korean', pronunciation: '얘' },
        { id: 'gc032', character: 'ㅖ', type: 'korean', pronunciation: '예' }
      ],
      practiceMode: 'single',
      fontStyle: 'gungseo',
      duration: 35,
      status: 'locked',
      progress: 0
    },
    {
      id: 'bg-06',
      title: '🎨 자음 글자 변화 - 위치별 형태',
      description: '자음이 초성, 중성, 종성 위치에 따라 변화하는 형태 익히기',
      order: 6,
      characters: [
        { id: 'gc033', character: '가', type: 'korean', meaning: 'ㄱ + ㅏ' },
        { id: 'gc034', character: '거', type: 'korean', meaning: 'ㄱ + ㅓ' },
        { id: 'gc035', character: '고', type: 'korean', meaning: 'ㄱ + ㅗ' },
        { id: 'gc036', character: '구', type: 'korean', meaning: 'ㄱ + ㅜ' },
        { id: 'gc037', character: '그', type: 'korean', meaning: 'ㄱ + ㅡ' },
        { id: 'gc038', character: '기', type: 'korean', meaning: 'ㄱ + ㅣ' }
      ],
      practiceMode: 'single',
      fontStyle: 'gungseo',
      duration: 40,
      status: 'locked',
      progress: 0
    },
    {
      id: 'bg-07',
      title: '💫 받침 자음 - 종성 위치',
      description: '받침으로 쓰이는 자음의 형태와 균형',
      order: 7,
      characters: [
        { id: 'gc039', character: '각', type: 'korean', meaning: '받침 ㄱ' },
        { id: 'gc040', character: '간', type: 'korean', meaning: '받침 ㄴ' },
        { id: 'gc041', character: '갈', type: 'korean', meaning: '받침 ㄹ' },
        { id: 'gc042', character: '감', type: 'korean', meaning: '받침 ㅁ' },
        { id: 'gc043', character: '갑', type: 'korean', meaning: '받침 ㅂ' },
        { id: 'gc044', character: '갓', type: 'korean', meaning: '받침 ㅅ' },
        { id: 'gc045', character: '강', type: 'korean', meaning: '받침 ㅇ' }
      ],
      practiceMode: 'single',
      fontStyle: 'gungseo',
      duration: 35,
      status: 'locked',
      progress: 0
    },
    {
      id: 'bg-08',
      title: '🌟 겹자음 병서체 (ㄲ, ㄸ, ㅃ, ㅆ, ㅉ)',
      description: '된소리 겹자음의 균형잡힌 배치',
      order: 8,
      characters: [
        { id: 'gc046', character: 'ㄲ', type: 'korean', pronunciation: '쌍기역' },
        { id: 'gc047', character: 'ㄸ', type: 'korean', pronunciation: '쌍디귿' },
        { id: 'gc048', character: 'ㅃ', type: 'korean', pronunciation: '쌍비읍' },
        { id: 'gc049', character: 'ㅆ', type: 'korean', pronunciation: '쌍시옷' },
        { id: 'gc050', character: 'ㅉ', type: 'korean', pronunciation: '쌍지읒' },
        { id: 'gc051', character: '까', type: 'korean', meaning: 'ㄲ + ㅏ' },
        { id: 'gc052', character: '따', type: 'korean', meaning: 'ㄸ + ㅏ' },
        { id: 'gc053', character: '빠', type: 'korean', meaning: 'ㅃ + ㅏ' }
      ],
      practiceMode: 'single',
      fontStyle: 'gungseo',
      duration: 40,
      status: 'locked',
      progress: 0
    },
    {
      id: 'bg-09',
      title: '🔤 겹자음 받침 (ㄳ, ㄵ, ㄶ, ㄺ, ㄻ, ㄼ, ㄽ, ㄾ, ㄿ, ㅀ, ㅄ)',
      description: '복잡한 겹받침의 조화로운 배치',
      order: 9,
      characters: [
        { id: 'gc054', character: '앉', type: 'korean', meaning: '받침 ㄵ' },
        { id: 'gc055', character: '않', type: 'korean', meaning: '받침 ㄶ' },
        { id: 'gc056', character: '닭', type: 'korean', meaning: '받침 ㄺ' },
        { id: 'gc057', character: '삶', type: 'korean', meaning: '받침 ㄻ' },
        { id: 'gc058', character: '밟', type: 'korean', meaning: '받침 ㄼ' },
        { id: 'gc059', character: '외곬', type: 'korean', meaning: '받침 ㄽ' },
        { id: 'gc060', character: '핥', type: 'korean', meaning: '받침 ㄾ' }
      ],
      practiceMode: 'single',
      fontStyle: 'gungseo',
      duration: 45,
      status: 'locked',
      progress: 0
    },
    {
      id: 'bg-10',
      title: '📜 궁서체 단어 연습',
      description: '완성된 궁서체로 아름다운 단어 쓰기',
      order: 10,
      characters: [
        { id: 'gc061', character: '나라', type: 'korean', meaning: '국가' },
        { id: 'gc062', character: '한글', type: 'korean', meaning: '한국 문자' },
        { id: 'gc063', character: '세종', type: 'korean', meaning: '세종대왕' },
        { id: 'gc064', character: '정성', type: 'korean', meaning: '마음' },
        { id: 'gc065', character: '아름', type: 'korean', meaning: '미(美)' },
        { id: 'gc066', character: '고맙', type: 'korean', meaning: '감사' }
      ],
      practiceMode: 'word',
      fontStyle: 'gungseo',
      duration: 50,
      status: 'locked',
      progress: 0
    },
    {
      id: 'bg-11',
      title: '📜 궁서체 문장 연습',
      description: '아름다운 문장을 궁서체로 완성하기',
      order: 11,
      characters: [
        { id: 'gc067', character: '천지현황', type: 'korean', meaning: '하늘 땅의 이치' },
        { id: 'gc068', character: '홍익인간', type: 'korean', meaning: '널리 인간을 이롭게' },
        { id: 'gc069', character: '충효예의', type: 'korean', meaning: '충성과 효도와 예의' },
        { id: 'gc070', character: '인의예지', type: 'korean', meaning: '인간의 도리' }
      ],
      practiceMode: 'sentence',
      fontStyle: 'gungseo',
      duration: 60,
      status: 'locked',
      progress: 0
    }
  ],
  totalLessons: 11,
  completedLessons: 0,
  progress: 0,
  estimatedTime: 450, // 총 7시간 30분
  evaluationCriteria: {
    brush: {
      form: 40,        // 형태
      proportion: 30,  // 비례
      pressure: 20,    // 필압
      strokeOrder: 10  // 획순
    }
  },
  status: 'available'
};