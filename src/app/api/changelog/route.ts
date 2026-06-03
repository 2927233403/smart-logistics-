import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  changes: Array<{
    message: string;
    hash: string;
    author: string;
    category: string;
  }>;
  type: string;
}

function getGitCommits() {
  try {
    const gitLog = execSync(
      'git log --oneline --format="%h|%ad|%s|%an" --date=format:"%Y-%m-%d" --since="6 months ago"',
      { cwd: process.cwd(), encoding: 'utf-8' }
    );
    
    const commits = gitLog.trim().split('\n').map(line => {
      const [hash, date, message, author] = line.split('|');
      return {
        hash: hash.trim(),
        date: date.trim(),
        message: message.trim(),
        author: author.trim()
      };
    });
    
    return commits;
  } catch (error) {
    console.error('获取 Git 提交历史失败:', error instanceof Error ? error.message : error);
    return [];
  }
}

function categorizeCommit(message: string) {
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes('feat') || lowerMsg.includes('feature') || lowerMsg.includes('新增')) {
    return 'feature';
  }
  if (lowerMsg.includes('fix') || lowerMsg.includes('bug') || lowerMsg.includes('修复')) {
    return 'fix';
  }
  if (lowerMsg.includes('refactor') || lowerMsg.includes('重构')) {
    return 'refactor';
  }
  if (lowerMsg.includes('style') || lowerMsg.includes('样式')) {
    return 'style';
  }
  if (lowerMsg.includes('docs') || lowerMsg.includes('文档')) {
    return 'docs';
  }
  return 'enhancement';
}

function generateChangelog(commits: Array<{ hash: string; date: string; message: string; author: string }>) {
  const versions: ChangelogEntry[] = [];
  const today = new Date().toISOString().split('T')[0];
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  let version = 'v1.0.0';
  if (fs.existsSync(packageJsonPath)) {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    version = 'v' + pkg.version;
  }
  
  const currentVersion: ChangelogEntry = {
    version,
    date: today,
    title: commits.length > 0 ? '最新更新' : '暂无更新',
    changes: [],
    type: commits.length > 0 ? 'feature' : 'enhancement'
  };
  
  commits.forEach(commit => {
    const category = categorizeCommit(commit.message);
    currentVersion.changes.push({
      message: commit.message,
      hash: commit.hash,
      author: commit.author,
      category
    });
  });
  
  if (currentVersion.changes.length > 0) {
    versions.push(currentVersion);
  }
  
  return versions;
}

export async function GET() {
  try {
    const commits = getGitCommits();
    const changelog = generateChangelog(commits);
    
    return NextResponse.json(changelog);
  } catch (error) {
    console.error('生成更新日志失败:', error);
    return NextResponse.json([], { status: 500 });
  }
}
