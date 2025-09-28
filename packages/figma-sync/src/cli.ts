#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import * as dotenv from 'dotenv';
import FigmaGitHubSync from './index';

dotenv.config();

const program = new Command();

program
  .name('figma-sync')
  .description('Sync Figma designs to GitHub')
  .version('1.0.0');

program
  .command('sync')
  .description('Sync Figma file to GitHub repository')
  .option('-f, --file <fileKey>', 'Figma file key')
  .option('-n, --nodes <nodeIds...>', 'Specific node IDs to sync')
  .option('-o, --owner <owner>', 'GitHub repository owner')
  .option('-r, --repo <repo>', 'GitHub repository name')
  .option('-b, --branch <branch>', 'GitHub branch', 'main')
  .action(async (options) => {
    try {
      // 환경 변수에서 설정 읽기
      const figmaToken = process.env.FIGMA_ACCESS_TOKEN;
      const githubToken = process.env.GITHUB_TOKEN;

      if (!figmaToken || !githubToken) {
        console.error(chalk.red('❌ Missing required environment variables:'));
        if (!figmaToken) console.error(chalk.red('   - FIGMA_ACCESS_TOKEN'));
        if (!githubToken) console.error(chalk.red('   - GITHUB_TOKEN'));
        process.exit(1);
      }

      const figmaConfig = {
        token: figmaToken,
        fileKey: options.file || process.env.FIGMA_FILE_KEY || '',
        nodeIds: options.nodes,
      };

      const githubConfig = {
        token: githubToken,
        owner: options.owner || process.env.GITHUB_OWNER || '',
        repo: options.repo || process.env.GITHUB_REPO || '',
        branch: options.branch,
      };

      if (!figmaConfig.fileKey || !githubConfig.owner || !githubConfig.repo) {
        console.error(chalk.red('❌ Missing required configuration:'));
        if (!figmaConfig.fileKey) console.error(chalk.red('   - Figma file key'));
        if (!githubConfig.owner) console.error(chalk.red('   - GitHub owner'));
        if (!githubConfig.repo) console.error(chalk.red('   - GitHub repository'));
        process.exit(1);
      }

      const sync = new FigmaGitHubSync(figmaConfig, githubConfig);
      await sync.sync();
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error);
      process.exit(1);
    }
  });

program
  .command('init')
  .description('Initialize Figma sync configuration')
  .action(async () => {
    console.log(chalk.cyan('📝 Creating .env.example file...'));
    
    const envExample = `# Figma Configuration
FIGMA_ACCESS_TOKEN=your_figma_access_token
FIGMA_FILE_KEY=your_figma_file_key

# GitHub Configuration
GITHUB_TOKEN=your_github_token
GITHUB_OWNER=your_github_username
GITHUB_REPO=calligraphy-coach-v2
`;

    await require('fs').promises.writeFile('.env.example', envExample);
    console.log(chalk.green('✅ Created .env.example'));
    console.log(chalk.yellow('📌 Copy .env.example to .env and fill in your credentials'));
  });

program.parse();
