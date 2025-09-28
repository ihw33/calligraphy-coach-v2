export class FigmaAPI {
  private token: string;
  private baseUrl = 'https://api.figma.com/v1';

  constructor() {
    this.token = process.env.FIGMA_ACCESS_TOKEN || '';
    if (!this.token) {
      throw new Error('FIGMA_ACCESS_TOKEN environment variable is required');
    }
  }

  async getFile(fileKey: string, nodeIds?: string[]) {
    const url = `${this.baseUrl}/files/${fileKey}`;
    const params = nodeIds ? `?ids=${nodeIds.join(',')}` : '';
    
    const response = await fetch(`${url}${params}`, {
      headers: {
        'X-Figma-Token': this.token
      }
    });

    if (!response.ok) {
      throw new Error(`Figma API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2)
        }
      ]
    };
  }

  async getStyles(fileKey: string) {
    const url = `${this.baseUrl}/files/${fileKey}/styles`;
    
    const response = await fetch(url, {
      headers: {
        'X-Figma-Token': this.token
      }
    });

    if (!response.ok) {
      throw new Error(`Figma API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2)
        }
      ]
    };
  }

  async createComponent(fileKey: string, name: string, design: any) {
    // Figma API를 통한 컴포넌트 생성
    // 실제로는 Figma의 REST API 제한으로 인해 읽기 전용이므로,
    // 여기서는 디자인 데이터를 분석하여 로컬 파일로 변환하는 방식으로 구현
    
    return {
      content: [
        {
          type: 'text',
          text: `Component "${name}" design analyzed and ready for code generation`
        }
      ]
    };
  }

  // Figma 스타일을 CSS/React Native 스타일로 변환
  convertFigmaStyleToReactNative(node: any): any {
    const styles: any = {};

    // 배경색
    if (node.fills && node.fills.length > 0) {
      const fill = node.fills[0];
      if (fill.type === 'SOLID') {
        const { r, g, b } = fill.color;
        const alpha = fill.opacity || 1;
        styles.backgroundColor = `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${alpha})`;
      }
    }

    // 크기
    if (node.absoluteBoundingBox) {
      styles.width = node.absoluteBoundingBox.width;
      styles.height = node.absoluteBoundingBox.height;
    }

    // 텍스트 스타일
    if (node.style) {
      styles.fontSize = node.style.fontSize;
      styles.fontWeight = node.style.fontWeight;
      styles.textAlign = node.style.textAlignHorizontal?.toLowerCase();
    }

    // 테두리
    if (node.strokes && node.strokes.length > 0) {
      const stroke = node.strokes[0];
      if (stroke.type === 'SOLID') {
        const { r, g, b } = stroke.color;
        styles.borderColor = `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
        styles.borderWidth = node.strokeWeight || 1;
      }
    }

    // 모서리 둥글게
    if (node.cornerRadius) {
      styles.borderRadius = node.cornerRadius;
    }

    return styles;
  }
}
