import { Octokit } from '@octokit/rest';

export class GitHubAPI {
  private octokit: Octokit;
  private owner = 'ihw33';
  private repo = 'calligraphy-coach-v2';

  constructor() {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error('GITHUB_TOKEN environment variable is required');
    }

    this.octokit = new Octokit({
      auth: token,
    });
  }

  async createPR(title: string, body: string, head: string, base: string = 'main') {
    try {
      const response = await this.octokit.pulls.create({
        owner: this.owner,
        repo: this.repo,
        title,
        body,
        head,
        base,
      });

      return {
        content: [
          {
            type: 'text',
            text: `Pull Request created successfully: ${response.data.html_url}`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to create PR: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async commitFiles(branch: string, message: string, files: Array<{ path: string; content: string }>) {
    try {
      // 브랜치가 존재하는지 확인하고, 없으면 생성
      let branchExists = true;
      try {
        await this.octokit.git.getRef({
          owner: this.owner,
          repo: this.repo,
          ref: `heads/${branch}`,
        });
      } catch {
        branchExists = false;
      }

      if (!branchExists) {
        // main 브랜치의 최신 커밋 SHA 가져오기
        const mainRef = await this.octokit.git.getRef({
          owner: this.owner,
          repo: this.repo,
          ref: 'heads/main',
        });

        // 새 브랜치 생성
        await this.octokit.git.createRef({
          owner: this.owner,
          repo: this.repo,
          ref: `refs/heads/${branch}`,
          sha: mainRef.data.object.sha,
        });
      }

      // 각 파일을 커밋
      for (const file of files) {
        const content = Buffer.from(file.content, 'utf8').toString('base64');
        
        // 파일이 이미 존재하는지 확인
        let sha: string | undefined;
        try {
          const existingFile = await this.octokit.repos.getContent({
            owner: this.owner,
            repo: this.repo,
            path: file.path,
            ref: branch,
          });
          
          if ('sha' in existingFile.data) {
            sha = existingFile.data.sha;
          }
        } catch {
          // 파일이 존재하지 않음
        }

        await this.octokit.repos.createOrUpdateFileContents({
          owner: this.owner,
          repo: this.repo,
          path: file.path,
          message: `${message} - ${file.path}`,
          content,
          branch,
          sha,
        });
      }

      return {
        content: [
          {
            type: 'text',
            text: `Successfully committed ${files.length} files to branch "${branch}"`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to commit files: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async createBranch(name: string, fromBranch: string = 'main') {
    try {
      const ref = await this.octokit.git.getRef({
        owner: this.owner,
        repo: this.repo,
        ref: `heads/${fromBranch}`,
      });

      await this.octokit.git.createRef({
        owner: this.owner,
        repo: this.repo,
        ref: `refs/heads/${name}`,
        sha: ref.data.object.sha,
      });

      return {
        content: [
          {
            type: 'text',
            text: `Branch "${name}" created successfully from "${fromBranch}"`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to create branch: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
