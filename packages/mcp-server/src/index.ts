import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { FigmaAPI } from './tools/figma.js';
import { GitHubAPI } from './tools/github.js';
import { FileSystem } from './tools/filesystem.js';

class CalligraphyCoachMCPServer {
  private server: Server;
  private figma: FigmaAPI;
  private github: GitHubAPI;
  private fs: FileSystem;

  constructor() {
    this.server = new Server(
      {
        name: 'calligraphy-coach-mcp',
        version: '1.0.0',
      }
    );

    this.figma = new FigmaAPI();
    this.github = new GitHubAPI();
    this.fs = new FileSystem();

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          // Figma Tools
          {
            name: 'figma_get_file',
            description: 'Figma 파일의 디자인 데이터를 가져옵니다',
            inputSchema: {
              type: 'object',
              properties: {
                fileKey: { type: 'string', description: 'Figma 파일 키' },
                nodeIds: { 
                  type: 'array', 
                  items: { type: 'string' },
                  description: '특정 노드 ID들 (선택사항)'
                }
              },
              required: ['fileKey']
            }
          },
          {
            name: 'figma_create_component',
            description: 'Figma에 새로운 컴포넌트를 생성합니다',
            inputSchema: {
              type: 'object',
              properties: {
                fileKey: { type: 'string', description: 'Figma 파일 키' },
                name: { type: 'string', description: '컴포넌트 이름' },
                design: { type: 'object', description: '디자인 데이터' }
              },
              required: ['fileKey', 'name', 'design']
            }
          },
          {
            name: 'figma_get_styles',
            description: 'Figma 파일의 색상/텍스트 스타일을 가져옵니다',
            inputSchema: {
              type: 'object',
              properties: {
                fileKey: { type: 'string', description: 'Figma 파일 키' }
              },
              required: ['fileKey']
            }
          },
          
          // GitHub Tools
          {
            name: 'github_create_pr',
            description: 'GitHub에 Pull Request를 생성합니다',
            inputSchema: {
              type: 'object',
              properties: {
                title: { type: 'string', description: 'PR 제목' },
                body: { type: 'string', description: 'PR 설명' },
                head: { type: 'string', description: '소스 브랜치' },
                base: { type: 'string', description: '타겟 브랜치', default: 'main' }
              },
              required: ['title', 'body', 'head']
            }
          },
          {
            name: 'github_commit_files',
            description: '파일 변경사항을 GitHub에 커밋합니다',
            inputSchema: {
              type: 'object',
              properties: {
                branch: { type: 'string', description: '브랜치 이름' },
                message: { type: 'string', description: '커밋 메시지' },
                files: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      path: { type: 'string' },
                      content: { type: 'string' }
                    }
                  }
                }
              },
              required: ['branch', 'message', 'files']
            }
          },

          // File System Tools
          {
            name: 'fs_read_file',
            description: '로컬 파일을 읽습니다',
            inputSchema: {
              type: 'object',
              properties: {
                path: { type: 'string', description: '파일 경로' }
              },
              required: ['path']
            }
          },
          {
            name: 'fs_write_file',
            description: '로컬 파일을 작성합니다',
            inputSchema: {
              type: 'object',
              properties: {
                path: { type: 'string', description: '파일 경로' },
                content: { type: 'string', description: '파일 내용' }
              },
              required: ['path', 'content']
            }
          },
          {
            name: 'convert_figma_to_react_native',
            description: 'Figma 디자인을 React Native 컴포넌트로 변환합니다',
            inputSchema: {
              type: 'object',
              properties: {
                figmaFileKey: { type: 'string', description: 'Figma 파일 키' },
                nodeId: { type: 'string', description: '변환할 노드 ID' },
                componentName: { type: 'string', description: '생성할 컴포넌트 이름' },
                outputPath: { type: 'string', description: '출력 파일 경로' }
              },
              required: ['figmaFileKey', 'nodeId', 'componentName', 'outputPath']
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (!args) {
        throw new Error('Arguments are required');
      }

      try {
        switch (name) {
          case 'figma_get_file':
            return await this.figma.getFile(
              args.fileKey as string, 
              args.nodeIds as string[] | undefined
            );
          
          case 'figma_create_component':
            return await this.figma.createComponent(
              args.fileKey as string, 
              args.name as string, 
              args.design as any
            );
          
          case 'figma_get_styles':
            return await this.figma.getStyles(args.fileKey as string);
          
          case 'github_create_pr':
            return await this.github.createPR(
              args.title as string, 
              args.body as string, 
              args.head as string, 
              args.base as string
            );
          
          case 'github_commit_files':
            return await this.github.commitFiles(
              args.branch as string, 
              args.message as string, 
              args.files as Array<{ path: string; content: string }>
            );
          
          case 'fs_read_file':
            return await this.fs.readFile(args.path as string);
          
          case 'fs_write_file':
            return await this.fs.writeFile(
              args.path as string, 
              args.content as string
            );
          
          case 'convert_figma_to_react_native':
            return await this.convertFigmaToReactNative(args);
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`
            }
          ]
        };
      }
    });
  }

  private async convertFigmaToReactNative(args: any) {
    // Figma 디자인 → React Native 변환 로직
    const figmaData = await this.figma.getFile(args.figmaFileKey, [args.nodeId]);
    const reactNativeCode = this.generateReactNativeComponent(figmaData, args.componentName);
    await this.fs.writeFile(args.outputPath, reactNativeCode);
    
    return {
      content: [
        {
          type: 'text',
          text: `Successfully converted Figma design to React Native component: ${args.outputPath}`
        }
      ]
    };
  }

  private generateReactNativeComponent(figmaData: any, componentName: string): string {
    // Figma 데이터를 React Native 코드로 변환하는 로직
    // 실제 구현에서는 더 정교한 변환 로직이 필요
    return `
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ${componentName} = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Generated from Figma</Text>
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
});
`;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Calligraphy Coach MCP Server running on stdio');
  }
}

const server = new CalligraphyCoachMCPServer();
server.run().catch(console.error);
