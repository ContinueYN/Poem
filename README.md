# 诗之古河 - 数字雅集

> 当古诗遇见数字艺术，传承千年文脉，创新数字表达

## 项目简介

**诗之古河**是一个将传统文化与现代科技融合创新的 Web 应用项目。通过先进的 Three.js 三维渲染技术，将静态的书法作品转化为动态的数字诗境，让千年诗词文化在数字世界中焕发新生。

本项目旨在通过 Web 技术实现传统文化与现代科技的融合创新，为用户提供沉浸式的古诗创作与欣赏体验。

## ✨ 核心功能

### 🖌️ 书法数字化
- 将传统书法作品转化为三维动态展示
- 还原笔墨神韵，展现书法艺术之美

### 📜 智能装帧
- 自动生成唐风卷轴、绢本册页等传统装帧形式
- 支持多种边框颜色自定义

### 🌌 意境可视化
- 根据诗歌内容生成对应的高级元素粒子效果
- 可调节旋转速度、启用/禁用粒子效果等动画参数

### 📖 诗书雅集
- 展示已创作的数字诗笺作品
- 支持按作者、风格、主题等维度筛选作品

## 🚀 技术栈

- **前端核心**: HTML5 + CSS3 + JavaScript (ES6+)
- **3D 渲染**: [Three.js](https://threejs.org/) (r128)
- **动画库**: Tween.js
- **UI 控制**: OrbitControls
- **设计风格**: 新中式美学风格

## 📁 项目结构

```
PR-2-Poem/
├── index.html              # 首页
├── poem.html              # 诗笺生成页面
├── gallery.html           # 诗书雅集展示页面
├── css/                   # 样式文件
│   ├── main.css          # 全局样式
│   ├── home.css          # 首页样式
│   ├── poem.css          # 诗笺页面样式
│   └── gallery.css       # 雅集页面样式
├── js/                    # JavaScript 文件
│   ├── main.js           # 主逻辑
│   ├── home.js           # 首页交互
│   ├── poemGenerator.js  # 诗笺生成器
│   ├── galleryRenderer.js# 雅集渲染器
│   └── libs/             # 第三方库
│       ├── three.min.js
│       ├── tween.min.js
│       └── orbitControls.js
└── assets/                # 资源文件
    ├── calligraphy/      # 书法作品图片
    ├── textures/         # 纹理贴图
    └── data/
        └── metadata.json # 诗歌元数据
```

## 🎯 使用指南

### 1. 访问首页
打开 `index.html` 浏览项目介绍和功能展示

### 2. 创作诗笺
1. 访问 `poem.html`
2. 从下拉列表选择诗歌作品（敦煌月、飞天赋、九色鹿、阳光曲）
3. 设置装帧风格（唐风卷轴/绢本册页/碑刻拓片）
4. 调整动画效果参数
5. 点击"生成诗笺"按钮
6. 可下载生成的作品或重置重新创作

### 3. 浏览雅集
访问 `gallery.html` 欣赏已创作的数字诗笺作品，支持多维度筛选

## 🎨 设计特色

- **色彩体系**: 
  - 敦煌红 (#8a3324)
  - 绢本黄 (#f8f3e6)
  - 墨黑 (#333)
  - 金色 (#d4b36a)

- **视觉元素**:
  - 传统纸张纹理背景
  - 渐变色彩过渡
  - 流畅的动画效果
  - 响应式布局设计

## 🖼️ 项目截图

### 首页预览
数字化传承古代诗书艺术的主页面，包含 3D 预览效果和特性介绍

### 诗笺生成
选择诗歌、设置装帧风格、调整动画效果，生成专属的数字诗笺

### 诗书雅集
浏览所有已创作的数字诗笺作品，支持多维度筛选

## 📦 本地运行

由于项目使用了 Three.js 等现代 Web 技术，建议通过本地服务器运行：

### 方式零：使用启动脚本（Windows）

双击运行 `start.bat` 文件，会自动启动 HTTP 服务器并打开浏览器。

### 方式一：使用 Python
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

### 方式二：使用 Node.js
```bash
# 安装 http-server
npm install -g http-server

# 启动服务器
http-server -p 8000
```

### 方式三：使用 VS Code
安装 "Live Server" 扩展，右键选择 "Open with Live Server"

然后在浏览器访问 `http://localhost:8000`

## 🌐 浏览器兼容性

- Chrome 80+ ✅
- Firefox 75+ ✅
- Safari 13+ ✅
- Edge 80+ ✅
- Opera 67+ ✅

**注意**：需要浏览器支持 WebGL 2.0

## 🔧 开发建议

### 推荐的 VS Code 扩展

- **Live Server** - 实时预览
- **Prettier** - 代码格式化
- **ESLint** - JavaScript 检查
- **CSS Peek** - CSS 快速查看
- **Path Intellisense** - 路径自动补全

### 代码规范

项目遵循以下代码规范：
- HTML5 语义化标签
- CSS3 变量和 Flexbox/Grid布局
- JavaScript ES6+ 语法
- 无注释简洁代码风格

## 📝 元数据说明

项目包含以下诗歌作品：

| 编号 | 诗名 | 作者 | 背景 | 装帧风格 |
|------|------|------|------|----------|
| poem1 | 敦煌月 | 李白 | 边塞 | 卷轴 |
| poem2 | 飞天赋 | 王维 | 乐舞 | 绢本 |
| poem3 | 九色鹿 | 白居易 | 神话 | 卷轴 |
| poem4 | 阳关曲 | 王之涣 | 离别 | 绢本 |

## 👥 团队分工

- **文化策划**: 诗歌创作、书法提供、文化指导
- **技术开发**: 三维渲染、动画实现、系统架构
- **项目管理**: 资源协调、进度控制、赛事申报

## 📄 许可证

© 2025 ContinueYN | 传承千年文脉，创新数字表达

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证

## 🙏 致谢

- 感谢 Three.js 团队提供的优秀 WebGL 库
- 感谢所有为传统文化数字化做出贡献的工作者
- 感谢敦煌研究院提供的数字资源参考

---

**技术支持**: Three.js WebGL 引擎  
**项目状态**: 持续开发中 🚀

**最后更新**: 2026-03-15
