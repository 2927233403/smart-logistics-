# Vercel 部署域名配置指南

## 当前项目状态

✅ **项目配置检查通过**
- Next.js 版本: 16.1.7
- 构建命令: `next build`
- 输出目录: `.next`
- 框架: Next.js
- vercel.json 配置已优化

## 域名问题分析

### 问题域名
- **原域名**: `wu追情红梦.online`
- **Punycode 编码**: `xn--wu-rm4d6i0a8t2av0v.online`
- **问题**: Vercel 无法为包含中文字符的域名创建 SSL 证书

### 解决方案

#### 方案 1: 使用 Vercel 免费域名（推荐）
1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 进入 `smart-logistics` 项目
3. 删除有问题的自定义域名
4. 使用自动生成的 `.vercel.app` 域名
5. 重新部署项目

**优点**: 
- 无需配置，立即可用
- 自动 HTTPS
- 免费使用

#### 方案 2: 注册英文域名
1. 注册纯英文域名，例如：
   - `wuzhuiqinghongmeng.online`
   - `smart-logistics-order.com`
   - `smartlogistics.site`

2. 在 Vercel 中配置：
   - 项目设置 → Domains
   - 添加新域名
   - 配置 DNS 记录

**DNS 配置示例**:
```
类型: CNAME
名称: www
值: cname.vercel-dns.com

类型: A
名称: @
值: 76.76.21.21
```

## 部署步骤

### 1. 确保代码已推送到 GitHub
```bash
git add -A
git commit -m "更新配置"
git push origin master
```

### 2. 在 Vercel 中重新部署
- Vercel 会自动检测 GitHub 推送
- 点击 "Redeploy" 按钮手动触发

### 3. 验证部署
- 检查构建日志
- 访问部署的 URL
- 测试所有功能

## 环境变量配置（如需要）

如果项目需要环境变量，在 Vercel 中添加：

1. 项目设置 → Environment Variables
2. 添加以下变量（根据需要）:
   ```
   NEXT_PUBLIC_API_URL=https://your-api.com
   DATABASE_URL=your-database-url
   ```

## 常见问题

### Q: SSL 证书创建失败
A: 使用 Vercel 免费域名或注册英文域名

### Q: 构建失败
A: 检查 `next.config.ts` 和 `vercel.json` 配置

### Q: 部署后无法访问
A: 检查 DNS 配置和域名状态

## 联系支持

如遇到问题：
- Vercel 文档: https://vercel.com/docs
- GitHub Issues: https://github.com/2927233403/smart-logistics-/issues
