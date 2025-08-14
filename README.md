# 个人主页项目说明

## 本地运行

1. 安装依赖：

   ```powershell
   npm install
   ```

2. 启动开发服务器：

   ```powershell
   npm run dev
   ```

   访问终端输出的本地地址即可预览页面。

## 打包静态文件

1. 运行打包命令：

   ```powershell
   npm run build
   ```

2. 打包后文件会生成在 `dist` 目录。

## 部署页面

1. 运行部署命令：

   ```powershell
   npm run deploy
   ```

2. 上传到gh-pages分支，自动部署页面


## 配置 GitHub Pages

1. 打开 GitHub 仓库页面，进入 Settings > Pages。
2. 选择 gh-pages 分支作为发布源，保存。
3. 稍等片刻，访问 GitHub Pages 提供的网址即可访问你的主页。
