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

## 上传到 GitHub 仓库

### 推送主分支代码

1. 常规推送：

   ```powershell
   git add .
   git commit -m "feat: update"
   git push -u origin main
   ```

### 发布到 GitHub Pages（gh-pages 分支）

1. 进入 dist 目录：

   ```powershell
   cd dist
   ```

2. 初始化 git 并提交：

   ```powershell
   git init
   git add .
   git commit -m "deploy: build for gh-pages"
   git branch -M gh-pages
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   git push -f origin gh-pages
   ```

3. 回到项目根目录：

   ```powershell
   cd ..
   ```

### 配置 GitHub Pages

1. 打开 GitHub 仓库页面，进入 Settings > Pages。
2. 选择 gh-pages 分支作为发布源，保存。
3. 稍等片刻，访问 GitHub Pages 提供的网址即可访问你的主页。

## 自定义域名

1.  在你的域名服务商（如阿里云、腾讯云、Namecheap 等）后台，将你的域名（如 example.com）添加一条 CNAME 记录，指向你的 GitHub Pages 地址（如 BobHuang666.github.io）。
2.  在你的 GitHub 仓库根目录下新建一个名为 CNAME 的文件，内容只写你的自定义域名（如 example.com），不加 http:// 或 https://，每行一个域名。
3.  提交并推送 CNAME 文件到 GitHub 仓库。
4.  在 GitHub 仓库的 Settings > Pages 页面，Custom domain 处填写你的域名并保存。
5.  等待 DNS 生效后，访问你的自定义域名即可访问你的 GitHub Pages 网站。
