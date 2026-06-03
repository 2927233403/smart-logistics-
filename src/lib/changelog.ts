import fs from 'fs';
import path from 'path';

export interface ChangelogEntry {
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

export interface StaticChangelogEntry {
  version: string;
  date: string;
  title: string;
  changes: string[];
  type: string;
}

const staticChangelog: StaticChangelogEntry[] = [
  {
    version: "v2.0.1",
    date: "2026年6月1日",
    title: "AI智能助手与文件管理",
    changes: [
      "新增AI智能助手页面，支持文本和语音输入",
      "优化文件上传下载功能，支持多种格式",
      "添加智能搜索建议功能",
      "优化导航栏UI和交互体验",
      "修复多个已知问题"
    ],
    type: "feature"
  },
  {
    version: "v2.0.0",
    date: "2026年5月30日",
    title: "全新升级版本",
    changes: [
      "全新的主题系统，支持多种主题切换",
      "优化定位和天气功能",
      "改进购物车功能",
      "添加更新公告自动展示",
      "优化整体UI美观度"
    ],
    type: "major"
  },
  {
    version: "v1.5.0",
    date: "2026年5月28日",
    title: "功能增强",
    changes: [
      "添加物流追踪查询历史",
      "优化仓储管理页面",
      "改进响应式设计",
      "添加企业科技感图片"
    ],
    type: "enhancement"
  }
];

export function getChangelog(): StaticChangelogEntry[] {
  try {
    const changelogPath = path.join(process.cwd(), 'src/data/changelog.json');
    
    if (fs.existsSync(changelogPath)) {
      const data = fs.readFileSync(changelogPath, 'utf-8');
      const dynamicChangelog: ChangelogEntry[] = JSON.parse(data);
      
      if (dynamicChangelog.length > 0 && dynamicChangelog[0].changes.length > 0) {
        const latestVersion = dynamicChangelog[0];
        return [
          {
            version: latestVersion.version,
            date: latestVersion.date.replace(/-/g, '年') + '月' + latestVersion.date.split('-')[2] + '日',
            title: latestVersion.title,
            changes: latestVersion.changes.map(c => c.message),
            type: latestVersion.type
          },
          ...staticChangelog
        ];
      }
    }
  } catch (error) {
    console.error('读取更新日志失败:', error);
  }
  
  return staticChangelog;
}
