import axios from 'axios';
import { Octokit } from '@octokit/rest';
import * as dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

export interface FigmaConfig {
  token: string;
  fileKey: string;
  nodeIds?: string[];
}

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

export class FigmaGitHubSync {
  private figmaClient: any;
  private githubClient: Octokit;
  private figmaConfig: FigmaConfig;
  private githubConfig: GitHubConfig;

  constructor(figmaConfig: FigmaConfig, githubConfig: GitHubConfig) {
    this.figmaConfig = figmaConfig;
    this.githubConfig = githubConfig;

    // Initialize Figma client
    this.figmaClient = axios.create({
      baseURL: 'https://api.figma.com/v1',
      headers: {
        'X-Figma-Token': figmaConfig.token,
      },
    });

    // Initialize GitHub client
    this.githubClient = new Octokit({
      auth: githubConfig.token,
    });
  }

  // Figma에서 파일 데이터 가져오기
  async getFigmaFile() {
    try {
      console.log(chalk.blue('📐 Fetching Figma file...'));
      const response = await this.figmaClient.get(`/files/${this.figmaConfig.fileKey}`);
      return response.data;
    } catch (error) {
      console.error(chalk.red('❌ Error fetching Figma file:'), error);
      throw error;
    }
  }

  // Figma 노드 데이터 가져오기
  async getFigmaNodes(nodeIds: string[]) {
    try {
      console.log(chalk.blue('🎨 Fetching Figma nodes...'));
      const ids = nodeIds.join(',');
      const response = await this.figmaClient.get(
        `/files/${this.figmaConfig.fileKey}/nodes?ids=${ids}`
      );
      return response.data;
    } catch (error) {
      console.error(chalk.red('❌ Error fetching Figma nodes:'), error);
      throw error;
    }
  }

  // Figma 스타일을 CSS로 변환
  convertFigmaStyleToCSS(node: any): string {
    const styles: any = {};

    if (node.absoluteBoundingBox) {
      styles.width = `${node.absoluteBoundingBox.width}px`;
      styles.height = `${node.absoluteBoundingBox.height}px`;
    }

    if (node.backgroundColor) {
      const { r, g, b, a } = node.backgroundColor;
      styles.backgroundColor = `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${a})`;
    }

    if (node.cornerRadius) {
      styles.borderRadius = `${node.cornerRadius}px`;
    }

    return Object.entries(styles)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');
  }

  // Figma 컴포넌트를 React 컴포넌트로 변환
  generateReactComponent(node: any): string {
    const componentName = node.name.replace(/[^a-zA-Z0-9]/g, '');
    const styles = this.convertFigmaStyleToCSS(node);

    return `import React from 'react';

const ${componentName} = () => {
  return (
    <div 
      className="${componentName.toLowerCase()}"
      style={{ ${styles} }}
    >
      {/* Generated from Figma: ${node.name} */}
    </div>
  );
};

export default ${componentName};
`;
  }

  // GitHub에 파일 생성 또는 업데이트
  async pushToGitHub(path: string, content: string, message: string) {
    try {
      console.log(chalk.blue(`📤 Pushing to GitHub: ${path}`));
      
      // 기존 파일 확인
      let sha: string | undefined;
      try {
        const { data } = await this.githubClient.repos.getContent({
          owner: this.githubConfig.owner,
          repo: this.githubConfig.repo,
          path,
          ref: this.githubConfig.branch,
        });
        sha = (data as any).sha;
      } catch (error) {
        // 파일이 없으면 새로 생성
      }

      await this.githubClient.repos.createOrUpdateFileContents({
        owner: this.githubConfig.owner,
        repo: this.githubConfig.repo,
        path,
        message,
        content: Buffer.from(content).toString('base64'),
        branch: this.githubConfig.branch,
        sha,
      });
      console.log(chalk.green(`✅ Successfully pushed ${path}`));
    } catch (error) {
      console.error(chalk.red(`❌ Error pushing ${path}:`), error);
      throw error;
    }
  }

  // 전체 동기화 프로세스
  async sync() {
    console.log(chalk.bold.cyan('🚀 Starting Figma to GitHub sync...'));
    
    try {
      // Figma 파일 데이터 가져오기
      const figmaFile = await this.getFigmaFile();
      console.log(chalk.green(`✅ Fetched Figma file: ${figmaFile.name}`));

      // 노드가 지정되지 않았으면 전체 document 사용
      const nodeIds = this.figmaConfig.nodeIds || [figmaFile.document.id];
      const nodesData = await this.getFigmaNodes(nodeIds);

      // 각 노드를 React 컴포넌트로 변환하고 GitHub에 푸시
      for (const [nodeId, nodeData] of Object.entries(nodesData.nodes)) {
        const node = nodeData as any;
        const componentCode = this.generateReactComponent(node);
        const fileName = `${node.name.replace(/[^a-zA-Z0-9]/g, '')}.tsx`;
        const filePath = `src/components/figma/${fileName}`;

        await this.pushToGitHub(
          filePath,
          componentCode,
          `Sync from Figma: ${node.name}`
        );
      }

      console.log(chalk.bold.green('🎉 Sync completed successfully!'));
    } catch (error) {
      console.error(chalk.bold.red('💥 Sync failed:'), error);
      throw error;
    }
  }
}

export default FigmaGitHubSync;
