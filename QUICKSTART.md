# ⚡ 快速开始指南 (5 分钟)

这是一个**完整的 Yulan 评论系统快速启动指南**。按照以下步骤操作，5 分钟内即可启动！

---

## 📋 前置要求

在开始前，请确保已安装：

- ✅ **Node.js v14+** - [下载](https://nodejs.org/)
- ✅ **MongoDB** - 选择其中一个：
  - 本地安装: [MongoDB Community](https://www.mongodb.com/try/download/community)
  - 云端: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (推荐，免费)

### 验证安装
```bash
node --version   # 应该显示 v14+ 的版本
npm --version    # 应该显示 6.0+ 的版本
```

---

## 🚀 五个简单步骤

### 第 1 步：进入后端目录

```bash
cd backend
```

### 第 2 步：安装依赖

```bash
npm install
```

这会安装所有必需的 Node.js 包。预期时间：1-2 分钟

### 第 3 步：配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env
```

编辑 `.env` 文件（可选）：
```env
# 本地 MongoDB
MONGODB_URI=mongodb://localhost:27017/yulan

# 或使用 MongoDB Atlas（云端）
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yulan

PORT=5000
```

### 第 4 步：启动服务器

```bash
npm run dev
```

你应该看到：
```
✅ MongoDB 连接成功
🚀 服务器运行在 http://localhost:5000
```

**恭喜！后端已启动！** 🎉

### 第 5 步：测试前端

在浏览器中打开：
```
http://localhost:5000/../frontend/comments-widget.html
```

或者用 Python 起一个简单的服务器：
```bash
# 在项目根目录
python -m http.server 8000

# 然后访问
http://localhost:8000/frontend/comments-widget.html
```

---

## ✨ 功能测试

现在你可以测试以下功能：

### 1. **游客登录** 👤
- 点击「游客登录」按钮
- 不需要注册即可使用

### 2. **发表评论** 💬
- 在文本框输入内容
- 点击「发表评论」
- 评论应该立即显示

### 3. **点赞功能** ❤️
- 点击评论下方的心形按钮
- 点赞计数应该增加

### 4. **用户账户**
- 点击「注册新账户」创建账户
- 或「登录」使用已有账户
- 登录后可以删除自己的评论

---

## 📁 项目结构

```
yulan/
├── backend/
│   ├── server.js          # 主服务器（所有 API）
│   ├── package.json       # 依赖配置
│   └── .env.example       # 环境变量模板
├── frontend/
│   ├── api-client.js      # API SDK
│   └── comments-widget.html # 完整界面
└── README.md              # 项目文档
```

---

## 🛠️ 常见问题

### Q1: 连接 MongoDB 失败？

**解决方案:**
```bash
# 如果是本地 MongoDB，确保已启动
mongod

# 如果使用 MongoDB Atlas
# 1. 在 MongoDB Atlas 创建集群
# 2. 获取连接字符串
# 3. 在 .env 中更新 MONGODB_URI
```

### Q2: 前端无法连接后端？

**解决方案:**
```javascript
// 在 frontend/comments-widget.html 中
// 或 frontend/api-client.js 中修改
yulanAPI.baseURL = 'http://localhost:5000';
```

### Q3: 端口 5000 已被占用？

**解决方案:**
```bash
# 修改 .env 文件
PORT=5001  # 或其他可用端口
```

### Q4: 如何关闭服务器？

**解决方案:**
```bash
Ctrl + C  # 在终端中按这个组合键
```

---

## 🌐 后续集成到网站

### 方法 1：嵌入 HTML（简单）

在你的网站 HTML 中添加：
```html
<!DOCTYPE html>
<html>
<head>
    <!-- 你的其他代码 -->
</head>
<body>
    <!-- 你的网站内容 -->
    
    <!-- 在末尾添加 -->
    <iframe src="http://localhost:5000/../frontend/comments-widget.html"
            style="width: 100%; height: 800px; border: none;">
    </iframe>
</body>
</html>
```

### 方法 2：直接使用 API（高级）

```html
<script src="frontend/api-client.js"></script>
<script>
  // 初始化
  await yulanAPI.auth.loginAsGuest();
  
  // 发表评论
  await yulanAPI.comments.create(
    'http://mypage.com',
    '这是一条评论'
  );
  
  // 获取评论
  const comments = await yulanAPI.comments.fetch('http://mypage.com');
</script>
```

---

## 📊 数据库信息

### 创建的集合

**Users（用户）**
```
{
  _id: ObjectId,
  email: String,
  name: String,
  password: String (hashed),
  isGuest: Boolean,
  createdAt: Date
}
```

**Comments（评论）**
```
{
  _id: ObjectId,
  pageUrl: String,
  userId: ObjectId (ref User),
  userName: String,
  content: String,
  likes: Number,
  createdAt: Date
}
```

**Likes（点赞）**
```
{
  _id: ObjectId,
  commentId: ObjectId (ref Comment),
  userId: ObjectId (ref User),
  createdAt: Date
}
```

---

## 🎯 下一步

✅ 本地测试完成后：

1. 查看 `README.md` 了解完整文档
2. 查看 `DEPLOYMENT_GUIDE.md` 部署到云端
3. 自定义样式以匹配你的网站
4. 邀请用户使用评论系统

---

## 💡 提示

- 💾 数据会自动保存到 MongoDB
- ⚡ 支持多用户实时更新（WebSocket）
- 🔒 密码已加密存储
- 📱 完全响应式设计，支持手机

---

## 📞 需要帮助？

- 🐛 检查浏览器控制台 (F12) 的错误消息
- 📖 查看 `README.md` 的完整文档
- 💬 在 GitHub Issues 提问

---

**祝贺！你现在已经拥有一个完整的评论系统！** 🎉
