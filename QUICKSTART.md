# ⚡ 快速开始指南 - 5 分钟启动

## 前置条件

在开始之前，请确保你已经安装了以下软件：

- **Node.js** (v14 或更高版本) - [下载](https://nodejs.org/)
- **MongoDB** (本地或 MongoDB Atlas) - [下载](https://www.mongodb.com/try/download/community)
- **代码编辑器** (VS Code 推荐) - [下载](https://code.visualstudio.com/)

### 验证安装
```bash
node --version      # 应该显示 v14.0.0 或更高
npm --version       # 应该显示 6.0.0 或更高
mongod --version    # 可选，如果使用本地 MongoDB
```

---

## 第一步：启动 MongoDB（1 分钟）

### 选项 A：本地 MongoDB（推荐用于开发）

```bash
# 在 macOS/Linux 上
brew services start mongodb-community

# 在 Windows 上
# 1. 打开 Services（services.msc）
# 2. 找到 "MongoDB Server" 服务
# 3. 右键点击 → 启动

# 验证 MongoDB 已运行
mongo --eval "db.adminCommand('ping')"
# 应该返回: { ok: 1 }
```

### 选项 B：MongoDB Atlas（云数据库）

如果你不想安装本地 MongoDB，可以使用免费的云数据库：

1. 访问 https://www.mongodb.com/cloud/atlas
2. 点击 "Try Free"
3. 创建账户
4. 创建一个 Cluster（选择 Free tier）
5. 获取连接字符串：`mongodb+srv://username:password@cluster.mongodb.net/yulan`
6. 将连接字符串保存，后面会用到

---

## 第二步：启动后端服务器（2 分钟）

### 1. 进入后端目录
```bash
cd backend
```

### 2. 安装依赖
```bash
npm install
```

### 3. 创建环境配置文件

复制 `.env.example` 到 `.env`：
```bash
cp .env.example .env
```

### 编辑 `.env` 文件

**如果使用本地 MongoDB：**
```env
MONGODB_URI=mongodb://localhost:27017/yulan
SECRET_KEY=yulan-secret-key-dev
PORT=5000
NODE_ENV=development
```

**如果使用 MongoDB Atlas：**
```env
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/yulan
SECRET_KEY=yulan-secret-key-dev
PORT=5000
NODE_ENV=development
```

### 4. 启动开发服务器

```bash
npm run dev
```

你应该看到类似的输出：
```
╔════════════════════════════════════════════╗
║     🎨 Yulan 评论系统后端服务已启动        ║
║                                            ║
║  ✅ 服务器运行于: http://localhost:5000     ║
║  ✅ WebSocket: 已连接                      ║
║  ✅ MongoDB: 已连接                        ║
║                                            ║
║  📍 API 基础地址: http://localhost:5000/api
║  💡 前端地址: frontend/comments-widget.html
║                                            ║
╚════════════════════════════════════════════╝
```

🎉 **后端已成功启动！**

---

## 第三步：测试前端（2 分钟）

### 打开前端界面

在你的浏览器中打开：
```
http://localhost:5000/../frontend/comments-widget.html
```

或者使用 Python 简单服务器：
```bash
cd frontend
python -m http.server 8000
```

然后访问：
```
http://localhost:8000/comments-widget.html
```

---

## 第四步：测试功能（1 分钟）

### 测试游客登录
1. 点击 "游客登录" 按钮
2. 你应该看到一个随机生成的游客用户名
3. 系统会自动登录

### 测试发表评论
1. 在文本框中输入评论内容
2. 点击 "发表评论" 按钮
3. 评论应该立即出现在列表中

### 测试点赞功能
1. 点击评论下方的 ❤️ 按钮
2. 点赞数应该增加 1
3. 再次点击取消点赞

### 测试用户认证
1. 点击 "注册" 标签
2. 填写邮箱、用户名和密码
3. 点击 "注册" 按钮
4. 注册成功后自动登录

---

## 常见问题

### Q: 后端无法连接到 MongoDB

**A:** 检查以下几点：

1. MongoDB 是否正在运行？
```bash
# 检查 MongoDB 状态
ps aux | grep mongod

# 或使用 MongoDB 命令行
mongo
```

2. 连接字符串是否正确？
```bash
# 编辑 .env 文件，确保 MONGODB_URI 正确
cat .env
```

3. 防火墙是否阻止了连接？
```bash
# 尝试连接到 MongoDB
mongo localhost:27017
```

### Q: 前端显示"API 连接失败"

**A:** 

1. 确保后端服务器正在运行
2. 检查浏览器控制台（F12 → Console）查看具体错误
3. 尝试清空浏览器缓存（Ctrl+Shift+Delete）
4. 检查 `api-client.js` 中的 `baseURL` 是否正确

### Q: 注册时显示"该邮箱已被注册"

**A:** 这是正常的，表示你之前已经注册过这个邮箱。尝试用不同的邮箱地址或清空数据库。

清空 MongoDB：
```bash
mongo
use yulan
db.dropDatabase()
exit
```

### Q: 评论发表后不显示

**A:** 

1. 检查浏览器控制台（F12）是否有错误
2. 确保你已登录
3. 尝试刷新页面（F5）
4. 检查后端日志是否有错误信息

### Q: 我想改变 API 地址

**A:** 修改 `frontend/comments-widget.html` 中的以下行：

```javascript
// 在 window.addEventListener('DOMContentLoaded', ...) 中
api = new YulanAPI('http://your-backend-url.com');
```

或者在 `api-client.js` 中修改默认地址：

```javascript
constructor(baseURL = 'http://your-backend-url.com') {
  this.baseURL = baseURL;
  // ...
}
```

---

## 下一步

### ✅ 本地开发完成后

1. **集成到你的网站**
   - 在你的 Figma 网站中添加 `<iframe>`
   - 或复制 HTML 代码到你的页面

2. **部署到云端**
   - 查看 [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)
   - Railway、Render 或 Heroku 都是不错的选择

3. **自定义样式**
   - 修改 `comments-widget.html` 中的 CSS
   - 使其与你的网站风格一致

4. **添加高级功能**
   - 评论回复功能
   - 评论编辑功能
   - 用户 @ 提及
   - 内容审核

---

## 生产环境检查清单

部署到生产环境前，请检查以下事项：

- [ ] 修改 `.env` 中的 `SECRET_KEY` 为强密钥
- [ ] 使用 MongoDB Atlas 而不是本地 MongoDB
- [ ] 启用 CORS 白名单（只允许你的域名）
- [ ] 添加速率限制防止滥用
- [ ] 启用 HTTPS
- [ ] 设置 MongoDB 认证用户名和密码
- [ ] 配置备份和监控

---

## 技术栈

| 组件 | 技术 | 版本 |
|------|------|------|
| 后端框架 | Express.js | ^4.18.2 |
| 数据库 | MongoDB | 4.0+ |
| 认证 | JWT | jsonwebtoken ^9.0.0 |
| 密码加密 | bcryptjs | ^2.4.3 |
| 实时通信 | Socket.io | ^4.6.1 |
| 前端 | Vanilla JavaScript | ES6+ |

---

## 文件结构参考

```
yulan/
├── backend/
│   ├── server.js          # 主程序
│   ├── package.json       # 依赖配置
│   └── .env              # 环境变量（需要自己创建）
│
├── frontend/
│   ├── comments-widget.html
│   ├── api-client.js
│   └── styles.css
│
├── README.md
├── QUICKSTART.md         # 你在这里
└── DEPLOYMENT_GUIDE.md
```

---

## 获取帮助

- 📖 查看 [`API_DOCS.md`](./API_DOCS.md) 了解所有 API
- 🌍 查看 [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) 了解部署
- 🐛 在 GitHub Issues 中提交问题
- 💬 加入讨论社区

---

**现在你已经准备好开始了！祝你使用愉快！🚀**
