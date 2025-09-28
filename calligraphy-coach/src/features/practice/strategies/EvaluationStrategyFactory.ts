import type { EvaluationStrategy, EvaluationStrategyFactory } from './types';
import { Hwang92Strategy } from './Hwang92Strategy';
import { StandardStrategy } from './StandardStrategy';

/**
 * 평가 전략 팩토리 클래스
 * 싱글톤 패턴으로 구현
 */
class EvaluationStrategyFactoryImpl implements EvaluationStrategyFactory {
  private static instance: EvaluationStrategyFactoryImpl;
  private strategies = new Map<string, EvaluationStrategy>();
  private defaultStrategy: EvaluationStrategy;
  
  private constructor() {
    this.defaultStrategy = new StandardStrategy();
    this.initializeStrategies();
  }
  
  static getInstance(): EvaluationStrategyFactoryImpl {
    if (!this.instance) {
      this.instance = new EvaluationStrategyFactoryImpl();
    }
    return this.instance;
  }
  
  private initializeStrategies() {
    // 황자원 92법 전략 등록
    this.register('hwang92-sebeop:h92-01', new Hwang92Strategy('천복자', 'h92-01'));
    this.register('hwang92-sebeop:h92-02', new Hwang92Strategy('지재자', 'h92-02'));
    this.register('hwang92-sebeop:h92-03', new Hwang92Strategy('좌포자', 'h92-03'));
    this.register('hwang92-sebeop:h92-04', new Hwang92Strategy('우포자', 'h92-04'));
    
    // 기본 전략 등록
    this.register('standard', this.defaultStrategy);
    
    // TODO: 다른 코스 전략들 추가
    // this.register('panbon-basic', new PanbonStrategy());
    // this.register('gungseo-advanced', new GungseoStrategy());
  }
  
  register(key: string, strategy: EvaluationStrategy): void {
    this.strategies.set(key, strategy);
  }
  
  getStrategy(courseId: string, lessonId?: string): EvaluationStrategy {
    // 레슨 ID가 있으면 코스:레슨 형식으로 검색
    if (lessonId) {
      const key = `${courseId}:${lessonId}`;
      const strategy = this.strategies.get(key);
      if (strategy) return strategy;
    }
    
    // 코스 ID만으로 검색
    const courseStrategy = this.strategies.get(courseId);
    if (courseStrategy) return courseStrategy;
    
    // 기본 전략 반환
    return this.defaultStrategy;
  }
  
  hasStrategy(courseId: string, lessonId?: string): boolean {
    const key = lessonId ? `${courseId}:${lessonId}` : courseId;
    return this.strategies.has(key);
  }
  
  /**
   * 코스 ID와 레슨 ID로부터 전략 타입 판별
   */
  getStrategyType(courseId: string, lessonId?: string): 'hwang92' | 'standard' | 'custom' {
    const strategy = this.getStrategy(courseId, lessonId);
    return strategy.evaluationType;
  }
  
  /**
   * 모든 등록된 전략 목록 반환 (디버깅용)
   */
  getAllStrategies(): Map<string, EvaluationStrategy> {
    return new Map(this.strategies);
  }
}

// 싱글톤 인스턴스 export
export const evaluationStrategyFactory = EvaluationStrategyFactoryImpl.getInstance();