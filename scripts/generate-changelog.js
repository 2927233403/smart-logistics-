const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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
    console.error('获取 Git 提交历史失败:', error.message);
    return [];
  }
}

function categorizeCommit(message) {
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

function generateChangelog(commits) {
  const versions = [];
  const today = new Date().toISOString().split('T')[0];
  
  let currentVersion = {
    version: 'v' + require('../package.json').version,
    date: today,
    title: '最新更新',
    changes: [],
    type: 'feature'
  };
  
  commits.forEach(commit => {
    const category = categorizeCommit(commit.message);
    currentVersion.changes.push({
      message: commit.message,
      hash: commit.hash,
      author: commit.author,
      category: category
    });
  });
  
  if (currentVersion.changes.length > 0) {
    versions.push(currentVersion);
  }
  
  return versions;
}

function main() {
  const commits = getGitCommits();
  const changelog = generateChangelog(commits);
  
  const outputDir = path.join(__dirname, '../public/data');
  const outputPath = path.join(outputDir, 'changelog.json');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(changelog, null, 2));
  console.log(`更新日志已生成: ${outputPath}`);
  console.log(`共包含 ${changelog.length > 0 ? changelog[0].changes.length : 0} 条更新记录`);
}

if (require.main === module) {
  main();
}

module.exports = { getGitCommits, generateChangelog, main };
