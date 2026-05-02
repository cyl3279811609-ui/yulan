# 🎨 Yulan 个人作品集网站 - 评论系统

一个完整的、生产就绪的**评论 + 点赞系统**，为你的 Figma 网站添加互动功能。

![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/node-v14.0-green)
![MongoDB](https://img.shields.io/badge/mongodb-4.0%2B-green)

---

## ✨ 功能特性

| 功能 | 描述 |
|------|------|
| 👤 **用户认证** | 支持注册、登录、游客登录 |
| 💬 **留言评论** | 发表、编辑、删除评论 |
| ❤️ **点赞系统** | 点赞和取消点赞 |
| 🧵 **嵌套回复** | 支持评论回复（开发中） |
| ⚡ **实时更新** | WebSocket 实时通知 |
| 🔐 **安全认证** | JWT 令牌认证 |
| 📱 **响应式设计** | 适配所有设备 |

---

## 🚀 快速开始

### 前置要求
- Node.js v14.0+
- MongoDB 4.0+
- npm 或 yarn

### 三步启动

```bash
# 1. 进入后端目录
cd backend

# 2. 安装依赖
npm install

# 3. 启动服务器
npm run dev
```

就这么简单！🎉 现在在浏览器打开 `frontend/comments-widget.html`

**详见**: [`QUICKSTART.md`](./QUICKSTART.md) - 5分钟完整指南

---

## 📖 文档

- 📘 **[快速开始](./QUICKSTART.md)** - 5分钟启动指南
- 🌍 **[部署指南](./DEPLOYMENT_GUIDE.md)** - 从本地到云端
- 🛠️ **[API 文档](./API_DOCS.md)** - 完整 API 参考
- 🤝 **[贡献指南](./CONTRIBUTING.md)** - 如何贡献代码

---

## 📁 项目结构

```
yulan/
├── backend/                    # Node.js 后端
│   ├── server.js              # 主服务器文件 (所有 API + WebSocket)
│   ├── package.json           # 项目依赖
│   └── .env.example           # 环境变量配置
│
├── frontend/                   # 前端代码
│   ├── api-client.js          # 与后端通信的 SDK
│   ├── comments-widget.html   # 完整的评论组件
│   └── styles.css             # 样式表
│
├── README.md                   # 本文件
├── QUICKSTART.md              # 快速开始指南
├── DEPLOYMENT_GUIDE.md        # 部署指南
└── API_DOCS.md                # API 文档
```

---

## 🎯 核心概念

### 1. **后端架构**
- Express.js: 轻量级 Web 框架
- MongoDB: NoSQL 数据库
- Socket.io: 实时通信
- JWT: 用户认证

### 2. **前端架构**
- 原生 JavaScript（无依赖）
- RESTful API 调用
- WebSocket 实时更新
- 简洁的 CSS 设计

### 3. **数据模型**
```javascript
// 用户
{
  _id: ObjectId,
  email: String,
  name: String,
  password: String (hashed),
  avatarUrl: String,
  createdAt: Date
}

// 评论
{
  _id: ObjectId,
  pageUrl: String,
  userId: ObjectId,
  userName: String,
  userAvatar: String,
  content: String,
  parentCommentId: ObjectId (null for top-level),
  likes: Number,
  replies: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}

// 点赞
{
  _id: ObjectId,
  commentId: ObjectId,
  userId: ObjectId,
  createdAt: Date
}
```

---

## 🔌 API 端点

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/guest` - 游客登录

### 评论
- `GET /api/comments?pageUrl=...` - 获取评论列表
- `POST /api/comments` - 创建评论
- `DELETE /api/comments/:id` - 删除评论

### 点赞
- `POST /api/likes` - 点赞
- `DELETE /api/likes/:commentId` - 取消点赞

详见: [`API_DOCS.md`](./API_DOCS.md)

---

## 🛠️ 环境配置

### 本地开发
```bash
MONGODB_URI=mongodb://localhost:27017/yulan
SECRET_KEY=dev-secret-key
PORT=5000
NODE_ENV=development
```

### 生产环境
```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/yulan
SECRET_KEY=<strong-random-key>
PORT=5000
NODE_ENV=production
```

详见: [`backend/.env.example`](./backend/.env.example)

---

## 🌐 集成到你的网站

### 方法 1: 嵌入 HTML
```html
<!DOCTYPE html>
<html>
<head>
    <!-- 你的其他代码 -->
</head>
<body>
    <!-- 你的网站内容 -->
    
    <!-- 在 </body> 前添加评论系统 -->
    <script src="path/to/api-client.js"></script>
    <script>
        // 初始化（可选）
        yulanAPI.baseURL = 'https://your-backend.com';
    </script>
    <iframe src="path/to/comments-widget.html"></iframe>
</body>
</html>
```

### 方法 2: 作为 Web Component（高级）
```javascript
class YulanComments extends HTMLElement {
  connectedCallback() {
    // 初始化评论系统
  }
}

customElements.define('yulan-comments', YulanComments);
```

---

## 📊 数据库设计

### Collections

**Users**
- 存储用户账户信息和认证数据

**Comments**
- 存储所有评论
- 索引: `pageUrl`, `userId`, `createdAt`

**Likes**
- 存储点赞关系
- 索引: `commentId`, `userId`

### 查询优化
```javascript
// 获取某页面的最新评论
db.comments.find({ pageUrl, parentCommentId: null })
  .sort({ createdAt: -1 })
  .limit(20)

// 获取用户的所有评论
db.comments.find({ userId })

// 获取评论的点赞数
db.likes.countDocuments({ commentId })
```

---

## 🚀 部署选项

| 平台 | 后端支持 | 数据库 | 成本 | 推荐度 |
|------|--------|--------|------|--------|
| Railway | ✅ | ✅ | 免费-$5 | ⭐⭐⭐⭐⭐ |
| Render | ✅ | ✅ | 免费-$7 | ⭐⭐⭐⭐⭐ |
| Heroku | ✅ | ✅ | $7+ | ⭐⭐⭐⭐ |
| Vercel | ❌ | - | - | ❌ (仅适合前端) |

详见: [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)

---

## 📦 依赖

### 后端
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.0.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.0",
  "socket.io": "^4.6.1",
  "cors": "^2.8.5"
}
```

### 前端
- 无外部依赖（纯 JavaScript）

---

## 🔒 安全特性

✅ **密码安全**
- 使用 bcryptjs 加密存储
- Argon2 算法（下一步改进）

✅ **认证**
- JWT 令牌认证
- 令牌过期机制（30天）

✅ **授权**
- 用户只能删除自己的评论
- 点赞数据与用户关联

✅ **其他**
- CORS 保护
- SQL 注入防护（MongoDB 驱动）
- XSS 防护（HTML 转义）

---

## 🐛 已知问题

- [ ] 嵌套回复功能需要完善
- [ ] 需要添加评论编辑功能
- [ ] 评论搜索功能待实现
- [ ] 需要添加内容审核

---

## 🤝 贡献

欢迎贡献！请查看 [`CONTRIBUTING.md`](./CONTRIBUTING.md)

---

## 📝 许可证

MIT © 2026 Yulan

---

## 💬 反馈

有任何问题或建议？
- 📧 邮件: your-email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/cyl3279811609-ui/yulan/issues)
- 💡 讨论: [GitHub Discussions](https://github.com/cyl3279811609-ui/yulan/discussions)

---

## 🎓 学习资源

- **Node.js**: https://nodejs.org/docs/
- **Express**: https://expressjs.com/
- **MongoDB**: https://docs.mongodb.com/
- **Socket.io**: https://socket.io/docs/
- **JWT**: https://jwt.io/introduction

---

**Made with ❤️ for Yulan**

![Yulan Banner](https://via.placeholder.com/800x200?text=Yulan+%7C+Personal+Portfolio)
