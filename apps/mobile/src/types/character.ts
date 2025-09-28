/**
 * Character 인터페이스 - MVP용 최소한의 필드만 정의
 */
export interface Character {
  /** 고유 식별자 */
  id: string;
  
  /** 유니코드 값 (예: "가", "한") */
  unicode: string;
  
  /** 문자 이름 (예: "기역아") */
  name: string;
  
  /** 참조 이미지 URL */
  imageUrl: string;
}

// Future: difficulty, strokeOrder, category, variants 등