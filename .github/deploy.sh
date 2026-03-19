#!/bin/bash

# 智能物流下单官网一键部署脚本

echo "=== 智能物流下单官网部署开始 ==="

# 1. 安装Node.js
echo "1. 安装Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# 验证Node.js安装
echo "Node.js版本:"
node -v
echo "npm版本:"
npm -v

# 2. 安装依赖
echo "2. 安装项目依赖..."
npm install

# 3. 构建项目
echo "3. 构建项目..."
npm run build

# 4. 安装并配置PM2
echo "4. 安装并配置PM2..."
npm install -g pm2

# 启动应用
npm run build
npm start

# 5. 安装并配置Nginx
echo "5. 安装并配置Nginx..."
apt-get install -y nginx

# 创建Nginx配置文件
cat > /etc/nginx/sites-available/smart-logistics << EOL
server {
    listen 80;
    server_name wu追情红梦.online;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOL

# 启用配置
ln -s /etc/nginx/sites-available/smart-logistics /etc/nginx/sites-enabled/

# 测试Nginx配置
nginx -t

# 重启Nginx
systemctl restart nginx

# 6. 启动应用
echo "6. 启动应用..."
pm2 start npm --name "smart-logistics" -- start

# 查看应用状态
echo "应用状态:"
pm2 status

echo "=== 智能物流下单官网部署完成 ==="
echo "请在浏览器中访问: http://wu追情红梦.online"
echo "或直接访问: http://116.62.11.210:3000"
