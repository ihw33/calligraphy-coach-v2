import type { Course } from '../../types/course';

// 🈲 황자원 92 서법 - 서예의 기본 원리
export const hwang92SebeobCourse: Course = {
  id: 'hwang92-sebeop',
  type: 'brush',
  category: 'hanja',
  level: 'intermediate',
  title: '📜 황자원 92 서법 - 기초편',
  description: '[실물] 황자원의 간가결구 구십이법 중 1-4번 서법으로 배우는 한자 서예의 기본 구조',
  thumbnail: '/images/courses/hwang92-sebeop.png',
  order: 10,
  lessons: [
    {
      id: 'h92-01',
      title: '서법 1: 천복자범화개모어기하 (天覆者凡畫皆冒於其下)',
      description: '하늘이 덮는 자 - 상단 횡획이 전체를 덮는 구조',
      order: 1,
      characters: [
        { 
          id: 'h92c001', 
          character: '宇', 
          type: 'chinese',
          meaning: '집 우',
          pronunciation: 'woo',
          referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images- sample/서법-01-01-宇.png'
        },
        { 
          id: 'h92c002', 
          character: '宙', 
          type: 'chinese',
          meaning: '집 주',
          pronunciation: 'joo',
          referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images- sample/서법-01-02-宙.gif'
        },
        { 
          id: 'h92c003', 
          character: '定', 
          type: 'chinese',
          meaning: '정할 정',
          pronunciation: 'jeong',
          referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images- sample/서법-01-03-定.gif'
        },
        { 
          id: 'h92c004', 
          character: '甯', 
          type: 'chinese',
          meaning: '편안할 녕',
          pronunciation: 'nyeong',
          referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images- sample/서법-01-04-甯.gif'
        }
      ],
      practiceMode: 'single',
      fontStyle: 'haeseo',
      duration: 45,
      status: 'available',
      progress: 0
    },
    {
      id: 'h92-02',
      title: '서법 2: 지재자유화개탁어기상 (地載者有畫皆託於其上)',
      description: '땅이 받치는 자 - 하단 횡획이 모든 것을 받치는 구조',
      order: 2,
      characters: [
        { 
          id: 'h92c005', 
          character: '至', 
          type: 'chinese',
          meaning: '이를 지',
          pronunciation: 'ji',
          referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images- sample/서법-02-01-至.gif'
        },
        { 
          id: 'h92c006', 
          character: '聖', 
          type: 'chinese',
          meaning: '성스러울 성',
          pronunciation: 'seong',
          referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images- sample/서법-02-02-聖.gif'
        },
        { 
          id: 'h92c007', 
          character: '孟', 
          type: 'chinese',
          meaning: '맏 맹',
          pronunciation: 'maeng',
          referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images- sample/서법-02-03-孟.gif'
        },
        { 
          id: 'h92c008', 
          character: '蓋', 
          type: 'chinese',
          meaning: '덮을 개',
          pronunciation: 'gae',
          referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images- sample/서법-02-04-蓋.gif'
        }
      ],
      practiceMode: 'single',
      fontStyle: 'haeseo',
      duration: 45,
      status: 'locked',
      progress: 0
    },
    {
      id: 'h92-03',
      title: '서법 3: 양좌자우앙 (讓左者右昂)',
      description: '왼쪽에 양보하는 자 - 오른쪽이 높아지는 구조',
      order: 3,
      characters: [
        { 
          id: 'h92c009', 
          character: '來', 
          type: 'chinese',
          meaning: '올 래',
          pronunciation: 'rae',
          referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images- sample/서법-03-01-來.gif'
        },
        { 
          id: 'h92c010', 
          character: '部', 
          type: 'chinese',
          meaning: '떼 부',
          pronunciation: 'bu',
          referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images- sample/서법-03-02-部.gif'
        },
        { 
          id: 'h92c011', 
          character: '勿', 
          type: 'chinese',
          meaning: '말 물',
          pronunciation: 'mul',
          referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images- sample/서법-03-03-勿.gif'
        },
        { 
          id: 'h92c012', 
          character: '即', 
          type: 'chinese',
          meaning: '곧 즉',
          pronunciation: 'jeuk',
          referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images- sample/서법-03-04-即.gif'
        }
      ],
      practiceMode: 'single',
      fontStyle: 'haeseo',
      duration: 45,
      status: 'locked',
      progress: 0
    },
    {
      id: 'h92-04',
      title: '서법 4: 양우자좌고 (讓右者左高)',
      description: '오른쪽에 양보하는 자 - 왼쪽이 높아지는 구조',
      order: 4,
      characters: [
        { 
          id: 'h92c013', 
          character: '貝', 
          type: 'chinese',
          meaning: '조개 패',
          pronunciation: 'pae',
          referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images- sample/서법-04-01-貝.gif'
        },
        { 
          id: 'h92c014', 
          character: '東', 
          type: 'chinese',
          meaning: '동녘 동',
          pronunciation: 'dong',
          referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images- sample/서법-04-02-東.gif'
        },
        { 
          id: 'h92c015', 
          character: '議', 
          type: 'chinese',
          meaning: '의논할 의',
          pronunciation: 'ui',
          referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images- sample/서법-04-03-議.gif'
        },
        { 
          id: 'h92c016', 
          character: '責', 
          type: 'chinese',
          meaning: '꾸짖을 책',
          pronunciation: 'chaek',
          referenceImage: '/reference/황자원_92_서법/images/hwang-01-04/images- sample/서법-04-04-責.gif'
        }
      ],
      practiceMode: 'single',
      fontStyle: 'haeseo',
      duration: 45,
      status: 'locked',
      progress: 0
    }
  ],
  totalLessons: 4,
  completedLessons: 0,
  progress: 0,
  estimatedTime: 180, // 총 3시간
  evaluationCriteria: {
    brush: {
      form: 35,        // 형태 (구조 원리 중시)
      proportion: 35,  // 비례 (서법의 핵심)
      pressure: 15,    // 필압
      strokeOrder: 15  // 획순
    }
  },
  status: 'available'
};