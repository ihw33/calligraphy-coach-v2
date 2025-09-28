import { promises as fs } from 'fs';
import path from 'path';

export class FileSystem {
  private projectRoot: string;

  constructor() {
    // 프로젝트 루트 경로 설정
    this.projectRoot = process.cwd();
  }

  async readFile(filePath: string) {
    try {
      const fullPath = path.resolve(this.projectRoot, filePath);
      const content = await fs.readFile(fullPath, 'utf8');
      
      return {
        content: [
          {
            type: 'text',
            text: content
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to read file ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async writeFile(filePath: string, content: string) {
    try {
      const fullPath = path.resolve(this.projectRoot, filePath);
      
      // 디렉토리가 존재하지 않으면 생성
      const dir = path.dirname(fullPath);
      await fs.mkdir(dir, { recursive: true });
      
      await fs.writeFile(fullPath, content, 'utf8');
      
      return {
        content: [
          {
            type: 'text',
            text: `Successfully wrote file: ${filePath}`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to write file ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async listFiles(dirPath: string) {
    try {
      const fullPath = path.resolve(this.projectRoot, dirPath);
      const files = await fs.readdir(fullPath);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(files, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to list files in ${dirPath}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async createDirectory(dirPath: string) {
    try {
      const fullPath = path.resolve(this.projectRoot, dirPath);
      await fs.mkdir(fullPath, { recursive: true });
      
      return {
        content: [
          {
            type: 'text',
            text: `Successfully created directory: ${dirPath}`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to create directory ${dirPath}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // React Native 컴포넌트 템플릿 생성
  generateReactNativeComponent(componentName: string, props: any = {}): string {
    const { styles = {}, children = [] } = props;
    
    const styleSheet = Object.entries(styles)
      .map(([key, value]) => `  ${key}: ${JSON.stringify(value, null, 4).replace(/"/g, "'")},`)
      .join('\n');

    return `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ${componentName}Props {
  // Add your props here
}

export const ${componentName}: React.FC<${componentName}Props> = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>${componentName}</Text>
      {/* Add your component content here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
${styleSheet}
});

export default ${componentName};
`;
  }

  // TypeScript 타입 정의 생성
  generateTypeDefinitions(types: Record<string, any>): string {
    const typeDefinitions = Object.entries(types)
      .map(([name, definition]) => {
        const fields = Object.entries(definition)
          .map(([field, type]) => `  ${field}: ${type};`)
          .join('\n');
        
        return `export interface ${name} {\n${fields}\n}`;
      })
      .join('\n\n');

    return typeDefinitions;
  }
}
