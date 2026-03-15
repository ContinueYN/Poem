# 诗之古河 - 部署指南

本文档提供详细的项目部署说明，帮助您将项目部署到各种环境。

## 📋 目录

- [本地开发环境](#本地开发环境)
- [部署到 Web 服务器](#部署到 web 服务器)
- [部署到云平台](#部署到云平台)
- [性能优化建议](#性能优化建议)
- [常见问题解决](#常见问题解决)

---

## 本地开发环境

### 方式一：使用 VS Code Live Server（推荐）

1. 安装 VS Code 扩展：**Live Server**
2. 右键点击 `index.html`
3. 选择 **"Open with Live Server"**
4. 浏览器会自动打开 `http://127.0.0.1:5500`

**优点**：
- 实时热重载
- 零配置
- 适合开发调试

### 方式二：使用 Python HTTP 服务器

```bash
# Python 3.x
python -m http.server 8000

# Python 2.x
python -m SimpleHTTPServer 8000
```

访问：`http://localhost:8000`

### 方式三：使用 Node.js http-server

```bash
# 安装 http-server
npm install -g http-server

# 启动服务器
http-server -p 8000 -c-1
```

访问：`http://localhost:8000`

**参数说明**：
- `-p 8000`: 指定端口
- `-c-1`: 禁用缓存（开发时使用）

---

## 部署到 Web 服务器

### Nginx 部署

1. **上传项目文件**到服务器：
```bash
scp -r ./PR-2-Poem user@your-server:/var/www/poem-river
```

2. **配置 Nginx** (`/etc/nginx/sites-available/poem-river`)：
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/poem-river;
    index index.html;

    # 启用 Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
}
```

3. **启用配置并重启 Nginx**：
```bash
sudo ln -s /etc/nginx/sites-available/poem-river /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Apache 部署

1. **上传项目文件**到服务器文档根目录

2. **创建 .htaccess 文件**：
```apache
RewriteEngine On
RewriteBase /

# 重定向所有请求到 index.html（SPA 支持）
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L,QSA]

# 启用压缩
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/css application/javascript
</IfModule>

# 缓存控制
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

## 部署到云平台

### Vercel 部署（推荐）

1. **安装 Vercel CLI**：
```bash
npm install -g vercel
```

2. **登录并部署**：
```bash
# 登录
vercel login

# 部署
vercel
```

3. **生产环境部署**：
```bash
vercel --prod
```

**优点**：
- 自动 HTTPS
- 全球 CDN
- 零配置部署
- 自动优化

### Netlify 部署

1. **通过 Netlify CLI**：
```bash
# 安装 CLI
npm install -g netlify-cli

# 登录
netlify login

# 部署
netlify deploy --prod
```

2. **通过 Git 自动部署**：
   - 连接 GitHub/GitLab 仓库
   - 设置构建命令：`无`（静态项目）
   - 设置发布目录：`.`
   - 自动部署

### GitHub Pages 部署

1. **创建 gh-pages 分支**：
```bash
git checkout --orphan gh-pages
git reset --hard
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

2. **启用 GitHub Pages**：
   - 进入仓库 Settings
   - 找到 Pages 选项
   - 选择 `gh-pages` 分支
   - 保存

访问：`https://your-username.github.io/PR-2-Poem/`

---

## 性能优化建议

### 1. 图片优化

```bash
# 使用 ImageMagick 压缩图片
mogrify -quality 85 -resize 1920x1080\> assets/textures/*.jpg
mogrify -quality 90 assets/calligraphy/*.jpg
```

### 2. 启用 CDN

在 HTML 中使用 CDN 加载 Three.js：
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
```

### 3. 资源预加载

在 `<head>` 中添加：
```html
<link rel="preload" href="assets/textures/paper-texture.jpg" as="image">
<link rel="preload" href="js/poemGenerator.js" as="script">
```

### 4. 代码分割

对于大型项目，考虑使用 Webpack 等工具进行代码分割。

---

## 常见问题解决

### Q1: 纹理加载失败

**问题**：控制台显示纹理加载 404 错误

**解决方案**：
- 检查文件路径是否正确
- 确保使用 HTTP 服务器而非直接打开 HTML 文件
- 检查 CORS 设置

### Q2: Three.js 渲染空白

**问题**：Canvas 显示空白

**解决方案**：
```javascript
// 检查 WebGL 支持
if (!window.WebGLRenderingContext) {
    alert('您的浏览器不支持 WebGL');
}

// 检查相机位置
camera.position.z = 5; // 确保相机距离合适
```

### Q3: 移动端性能问题

**解决方案**：
```javascript
// 降低像素比
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 减少粒子数量
const particleCount = isMobile ? 500 : 1000;
```

### Q4: 路由刷新 404

**解决方案**：配置服务器将所有请求重定向到 index.html

---

## 📞 技术支持

如遇到其他问题，请：

1. 查看浏览器控制台错误信息
2. 检查 Network 面板资源加载状态
3. 确认浏览器支持 WebGL（Chrome 80+、Firefox 75+）

---

**祝部署顺利！** 🎉
