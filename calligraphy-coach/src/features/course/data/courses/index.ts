import type { Course, CourseType, LanguageCategory, DifficultyLevel } from '../../types/course';
import { penHangulKCultureCourse } from './pen-hangul-kculture';
import { brushGungseoCourse } from './brush-gungseo';
import { hwang92SebeobCourse } from './hwang92-sebeop';

// Note: These courses are temporarily commented out as they're not fully configured
// They will be re-enabled once content is prepared

// // ✏️ 펜글씨 - 한글 기초 코스 (디지털 모드) - 체계적 학습용
// export const penHangulBasicCourse: Course = {
//   id: 'pen-hangul-basic',
//   type: 'pen',
//   category: 'hangul',
//   level: 'beginner',
//   title: '✏️ 한글 기초 - 체계적 학습',
//   description: '[디지털] 한글 자음/모음을 체계적으로 배우고 싶은 분들을 위한 정통 코스',
//   thumbnail: '/images/courses/pen-hangul-basic.png',
//   order: 2,
//   lessons: [],
//   totalLessons: 0,
//   completedLessons: 0,
//   progress: 0,
//   estimatedTime: 50,
//   evaluationCriteria: {
//     pen: {
//       accuracy: 40,
//       smoothness: 30,
//       consistency: 30
//     }
//   },
//   status: 'coming_soon'
// };

// // ✏️ 펜글씨 - 한글 중급 코스 (디지털 모드)
// export const penHangulIntermediateCourse: Course = {
//   id: 'pen-hangul-intermediate',
//   type: 'pen',
//   category: 'hangul',
//   level: 'intermediate',
//   title: '✏️ 한글 펜글씨 - 중급',
//   description: '[디지털] 단어와 문장을 깔끔하게 쓰는 연습을 합니다',
//   thumbnail: '/images/courses/pen-hangul-intermediate.png',
//   order: 3,
//   lessons: [],
//   totalLessons: 0,
//   completedLessons: 0,
//   progress: 0,
//   estimatedTime: 25,
//   prerequisites: ['pen-hangul-basic'],
//   status: 'coming_soon'
// };

// 🖌️ 붓글씨 - 판본체 코스 (실물 모드)
export const brushPanbonCourse: Course = {
  id: 'brush-panbon',
  type: 'brush',
  category: 'hangul',
  level: 'intermediate',
  title: '🖌️ 한글 붓글씨 - 판본체',
  description: '[실물] 한국 전통 판본체를 붓과 먹으로 써봅니다',
  thumbnail: '/images/courses/brush-panbon.png',
  order: 3,
  lessons: [
    {
      id: 'bp-01',
      title: '판본체 기본 자모',
      description: '판본체의 자음과 모음을 익힙니다',
      order: 1,
      characters: [
        { id: 'c017', character: 'ㄱ', type: 'korean', referenceImage: '/images/panbon/ㄱ.png' },
        { id: 'c018', character: 'ㄴ', type: 'korean', referenceImage: '/images/panbon/ㄴ.png' },
        { id: 'c019', character: 'ㅏ', type: 'korean', referenceImage: '/images/panbon/ㅏ.png' },
        { id: 'c020', character: 'ㅓ', type: 'korean', referenceImage: '/images/panbon/ㅓ.png' }
      ],
      practiceMode: 'single',
      fontStyle: 'panbon',
      duration: 30,
      status: 'available',
      progress: 0
    },
    {
      id: 'bp-02',
      title: '판본체 글자 연습',
      description: '판본체로 완성된 글자를 써봅니다',
      order: 2,
      characters: [
        { id: 'c021', character: '가', type: 'korean' },
        { id: 'c022', character: '나', type: 'korean' },
        { id: 'c023', character: '작', type: 'korean' },
        { id: 'c024', character: '산', type: 'korean' }
      ],
      practiceMode: 'single',
      fontStyle: 'panbon',
      duration: 40,
      status: 'locked',
      progress: 0
    }
  ],
  totalLessons: 2,
  completedLessons: 0,
  progress: 0,
  estimatedTime: 70,
  evaluationCriteria: {
    brush: {
      form: 40,
      proportion: 30,
      pressure: 20,
      strokeOrder: 10
    }
  },
  status: 'available'
};

// // ✏️ 펜글씨 - 한자 기초 코스 (디지털 모드) - Coming Soon
// export const penHanjaBasicCourse: Course = {
//   id: 'pen-hanja-basic',
//   type: 'pen',
//   category: 'hanja',
//   level: 'beginner',
//   title: '✏️ 한자 펜글씨 - 8급',
//   description: '[디지털] 한자능력시험 8급 50자를 펜으로 익힙니다',
//   thumbnail: '/images/courses/pen-hanja-8.png',
//   order: 4,
//   lessons: [],
//   totalLessons: 0,
//   completedLessons: 0,
//   progress: 0,
//   estimatedTime: 20,
//   status: 'coming_soon'
// };

// // 🖌️ 붓글씨 - 해서체 기초 (실물 모드) - Coming Soon
// export const brushHaeseoCourse: Course = {
//   id: 'brush-haeseo-basic',
//   type: 'brush',
//   category: 'hanja',
//   level: 'beginner',
//   title: '🖌️ 한자 붓글씨 - 해서체',
//   description: '[실물] 한문 서예의 기본인 해서체를 붓과 먹으로 배웁니다',
//   thumbnail: '/images/courses/brush-haeseo.png',
//   order: 5,
//   lessons: [],
//   totalLessons: 0,
//   completedLessons: 0,
//   progress: 0,
//   estimatedTime: 30,
//   evaluationCriteria: {
//     brush: {
//       form: 40,
//       proportion: 30,
//       pressure: 20,
//       strokeOrder: 10
//     }
//   },
//   status: 'coming_soon'
// };

// 전체 코스 목록 - 현재 활성화된 코스만 포함
export const allCourses: Course[] = [
  penHangulKCultureCourse, // K-Culture 코스 (가장 인기)
  brushPanbonCourse,        // 판본체 붓글씨 코스
  brushGungseoCourse,       // 궁서체 붓글씨 코스
  hwang92SebeobCourse,      // 황자원 92 서법 한자 코스
  // 추후 추가될 코스들:
  // penHangulBasicCourse,
  // penHangulIntermediateCourse,
  // penHanjaBasicCourse,
  // brushHaeseoCourse
];

// 카테고리별 코스 필터링
export function getCoursesByType(type: CourseType): Course[] {
  return allCourses.filter(course => course.type === type);
}

export function getCoursesByCategory(category: LanguageCategory): Course[] {
  return allCourses.filter(course => course.category === category);
}

export function getCoursesByLevel(level: DifficultyLevel): Course[] {
  return allCourses.filter(course => course.level === level);
}

export function getCourseById(id: string): Course | undefined {
  return allCourses.find(course => course.id === id);
}