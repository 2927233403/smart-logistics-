@echo off

REM 智能物流下单官网一键部署脚本（Windows版）

echo === 智能物流下单官网部署开始 ===

REM 1. 检查Node.js安装
 echo 1. 检查Node.js安装...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js未安装，请先安装Node.js 18.x或更高版本
    echo 下载地址：https://nodejs.org/en/download/
    pause
    exit /b 1
)

echo Node.js已安装
node -v
echo npm版本:
npm -v

REM 2. 安装依赖
echo 2. 安装项目依赖...
npm install
if %errorlevel% neq 0 (
    echo 依赖安装失败，请检查网络连接
    pause
    exit /b 1
)

REM 3. 构建项目
echo 3. 构建项目...
npm run build
if %errorlevel% neq 0 (
    echo 项目构建失败，请检查代码
    pause
    exit /b 1
)

REM 4. 启动应用
echo 4. 启动应用...
echo 正在启动Next.js应用...
start "Smart Logistics App" npm start

REM 5. 等待应用启动
echo 5. 等待应用启动...
timeout /t 10 /nobreak >nul

echo 应用启动中，请稍候...
timeout /t 10 /nobreak >nul

REM 6. 检查应用状态
echo 6. 检查应用状态...
echo 应用已启动，请在浏览器中访问：
echo http://116.62.11.210:3000
echo 或访问域名：
echo http://wu追情红梦.online

echo === 智能物流下单官网部署完成 ===
echo 注意：请确保服务器防火墙已开放3000端口
echo 请确保域名已解析到服务器IP：116.62.11.210

pause
