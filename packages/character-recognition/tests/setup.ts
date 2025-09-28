import { vi } from 'vitest';

// ImageData 모킹 (Node.js 환경에서 사용)
global.ImageData = global.ImageData || class ImageData {
  public data: Uint8ClampedArray;
  public width: number;
  public height: number;

  constructor(data: Uint8ClampedArray | number, width: number, height?: number) {
    if (typeof data === 'number') {
      // ImageData(width, height) 생성자
      this.width = data;
      this.height = width;
      this.data = new Uint8ClampedArray(this.width * this.height * 4);
    } else {
      // ImageData(data, width, height?) 생성자
      this.data = data;
      this.width = width;
      this.height = height || Math.floor(data.length / (width * 4));
    }
  }
};

// Canvas 2D context 모킹
const mockCanvas2DContext = {
  drawImage: vi.fn(),
  getImageData: vi.fn().mockReturnValue(new ImageData(new Uint8ClampedArray(4), 1, 1)),
  putImageData: vi.fn(),
  createImageData: vi.fn().mockImplementation((width: number, height: number) => {
    return new ImageData(width, height);
  }),
  canvas: {
    width: 320,
    height: 320,
    toDataURL: vi.fn().mockReturnValue('data:image/png;base64,mock-data')
  }
};

// HTMLCanvasElement 모킹
global.HTMLCanvasElement = global.HTMLCanvasElement || class HTMLCanvasElement {
  width = 320;
  height = 320;
  
  getContext(contextType: string) {
    if (contextType === '2d') {
      return mockCanvas2DContext;
    }
    return null;
  }
  
  toDataURL() {
    return 'data:image/png;base64,mock-data';
  }
};

// HTMLImageElement 모킹
global.HTMLImageElement = global.HTMLImageElement || class HTMLImageElement {
  src = '';
  width = 0;
  height = 0;
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  
  constructor() {
    // 비동기적으로 로드 완료 시뮬레이션
    setTimeout(() => {
      if (this.onload) {
        this.width = 100;
        this.height = 100;
        this.onload();
      }
    }, 0);
  }
};

// createObjectURL 모킹
global.URL = global.URL || {
  createObjectURL: vi.fn().mockReturnValue('blob:mock-url'),
  revokeObjectURL: vi.fn()
} as any;

// Blob 모킹
global.Blob = global.Blob || class Blob {
  size: number;
  type: string;
  
  constructor(array: any[], options: any = {}) {
    this.type = options.type || '';
    this.size = array.reduce((total, item) => total + (item?.length || 0), 0);
  }
};