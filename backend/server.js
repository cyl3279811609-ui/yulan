/**
 * Yulan 个人作品集网站 - 后端服务器
 * 功能: 用户认证、评论管理、点赞系统、实时通信
 * 
 * 依赖: express, mongoose, socket.io, jsonwebtoken, bcryptjs
 * 
 * 启动方式:
 *   npm install
 *   npm run dev
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { createServer } = require('http');
const { Server } = require('socket.io');

// 加载环境变量
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'DELETE']
  }
});

// 中间件
app.use(cors());
app.use(express.json());

// ============ 数据库模型 ============

// 用户模型
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'https://via.placeholder.com/40?text=User' },
  isGuest: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// 评论模型
const commentSchema = new mongoose.Schema({
  pageUrl: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String, required: true },
  content: { type: String, required: true },
  parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 点赞模型
const likeSchema = new mongoose.Schema({
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Comment = mongoose.model('Comment', commentSchema);
const Like = mongoose.model('Like', likeSchema);

// ============ 认证中间件 ============

/**
 * 验证 JWT 令牌
 */
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: '未提供令牌' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: '令牌无效或已过期' });
  }
};

// ============ 认证 API ============

/**
 * POST /api/auth/register
 * 用户注册
 */
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, name, password } = req.body;
    
    // 验证输入
    if (!email || !name || !password) {
      return res.status(400).json({ error: '缺少必要字段' });
    }
    
    // 检查用户是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: '邮箱已被注册' });
    }
    
    // 加密密码
    const hashedPassword = await bcryptjs.hash(password, 10);
    
    // 创建用户
    const user = new User({
      email,
      name,
      password: hashedPassword,
      isGuest: false
    });
    
    await user.save();
    
    // 生成 JWT 令牌
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.status(201).json({
      message: '注册成功',
      token,
      user: { id: user._id, email: user.email, name: user.name, avatar: user.avatar }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ error: '注册失败' });
  }
});

/**
 * POST /api/auth/login
 * 用户登录
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 验证输入
    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码不能为空' });
    }
    
    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }
    
    // 验证密码
    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }
    
    // 生成 JWT 令牌
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.json({
      message: '登录成功',
      token,
      user: { id: user._id, email: user.email, name: user.name, avatar: user.avatar }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ error: '登录失败' });
  }
});

/**
 * POST /api/auth/guest
 * 游客登录
 */
app.post('/api/auth/guest', async (req, res) => {
  try {
    const guestName = '游客_' + Math.random().toString(36).substring(7);
    
    // 创建游客用户
    const user = new User({
      email: `guest_${Date.now()}@temp.com`,
      name: guestName,
      password: 'guest', // 游客不需要真实密码
      isGuest: true
    });
    
    await user.save();
    
    // 生成 JWT 令牌
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // 游客令牌24小时过期
    );
    
    res.json({
      message: '游客登录成功',
      token,
      user: { id: user._id, email: user.email, name: user.name, avatar: user.avatar }
    });
  } catch (error) {
    console.error('游客登录错误:', error);
    res.status(500).json({ error: '游客登录失败' });
  }
});

// ============ 评论 API ============

/**
 * GET /api/comments?pageUrl=...
 * 获取某个页面的所有评论
 */
app.get('/api/comments', async (req, res) => {
  try {
    const { pageUrl } = req.query;
    
    if (!pageUrl) {
      return res.status(400).json({ error: '缺少 pageUrl 参数' });
    }
    
    // 获取顶级评论（不包含回复）
    const comments = await Comment.find({ 
      pageUrl,
      parentCommentId: null 
    }).sort({ createdAt: -1 });
    
    // 为每条评论获取回复
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parentCommentId: comment._id });
        return {
          ...comment.toObject(),
          replies
        };
      })
    );
    
    res.json(commentsWithReplies);
  } catch (error) {
    console.error('获取评论错误:', error);
    res.status(500).json({ error: '获取评论失败' });
  }
});

/**
 * POST /api/comments
 * 创建新评论
 */
app.post('/api/comments', verifyToken, async (req, res) => {
  try {
    const { pageUrl, content, parentCommentId } = req.body;
    
    // 验证输入
    if (!pageUrl || !content) {
      return res.status(400).json({ error: '缺少必要字段' });
    }
    
    // 查找用户信息
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(401).json({ error: '用户不存在' });
    }
    
    // 创建评论
    const comment = new Comment({
      pageUrl,
      userId: user._id,
      userName: user.name,
      userAvatar: user.avatar,
      content,
      parentCommentId: parentCommentId || null
    });
    
    await comment.save();
    
    // 如果是回复，更新父评论
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, { $inc: { likes: 0 } });
    }
    
    // 通过 WebSocket 广播新评论
    io.emit('new-comment', comment);
    
    res.status(201).json({
      message: '评论创建成功',
      comment
    });
  } catch (error) {
    console.error('创建评论错误:', error);
    res.status(500).json({ error: '创建评论失败' });
  }
});

/**
 * DELETE /api/comments/:id
 * 删除评论
 */
app.delete('/api/comments/:id', verifyToken, async (req, res) => {
  try {
    const commentId = req.params.id;
    
    // 查找评论
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: '评论不存在' });
    }
    
    // 检查权限（只有评论所有者可以删除）
    if (comment.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: '没有权限删除该评论' });
    }
    
    // 删除所有点赞
    await Like.deleteMany({ commentId });
    
    // 删除所有回复
    const replies = await Comment.find({ parentCommentId: commentId });
    for (const reply of replies) {
      await Like.deleteMany({ commentId: reply._id });
      await Comment.findByIdAndDelete(reply._id);
    }
    
    // 删除评论本身
    await Comment.findByIdAndDelete(commentId);
    
    // 通过 WebSocket 广播删除事件
    io.emit('comment-deleted', { commentId });
    
    res.json({ message: '评论删除成功' });
  } catch (error) {
    console.error('删除评论错误:', error);
    res.status(500).json({ error: '删除评论失败' });
  }
});

// ============ 点赞 API ============

/**
 * POST /api/likes
 * 点赞评论
 */
app.post('/api/likes', verifyToken, async (req, res) => {
  try {
    const { commentId } = req.body;
    
    if (!commentId) {
      return res.status(400).json({ error: '缺少 commentId' });
    }
    
    // 检查是否已经点赞
    const existingLike = await Like.findOne({ 
      commentId, 
      userId: req.user.userId 
    });
    
    if (existingLike) {
      return res.status(400).json({ error: '已经点过赞了' });
    }
    
    // 创建点赞
    const like = new Like({
      commentId,
      userId: req.user.userId
    });
    
    await like.save();
    
    // 更新评论的点赞计数
    await Comment.findByIdAndUpdate(
      commentId,
      { $inc: { likes: 1 } }
    );
    
    // 通过 WebSocket 广播新点赞
    io.emit('new-like', { commentId, likes: (await Comment.findById(commentId)).likes });
    
    res.status(201).json({ message: '点赞成功', like });
  } catch (error) {
    console.error('点赞错误:', error);
    res.status(500).json({ error: '点赞失败' });
  }
});

/**
 * DELETE /api/likes/:commentId
 * 取消点赞
 */
app.delete('/api/likes/:commentId', verifyToken, async (req, res) => {
  try {
    const commentId = req.params.commentId;
    
    // 删除点赞
    const result = await Like.findOneAndDelete({ 
      commentId, 
      userId: req.user.userId 
    });
    
    if (!result) {
      return res.status(404).json({ error: '点赞记录不存在' });
    }
    
    // 更新评论的点赞计数
    await Comment.findByIdAndUpdate(
      commentId,
      { $inc: { likes: -1 } }
    );
    
    // 通过 WebSocket 广播取消点赞
    io.emit('unlike', { commentId, likes: (await Comment.findById(commentId)).likes });
    
    res.json({ message: '取消点赞成功' });
  } catch (error) {
    console.error('取消点赞错误:', error);
    res.status(500).json({ error: '取消点赞失败' });
  }
});

// ============ WebSocket 事件 ============

io.on('connection', (socket) => {
  console.log('用户已连接:', socket.id);
  
  // 用户连接时的问候
  socket.emit('message', { text: '欢迎使用 Yulan 评论系统！' });
  
  // 监听断开连接
  socket.on('disconnect', () => {
    console.log('用户已断开连接:', socket.id);
  });
});

// ============ 健康检查 ============

app.get('/api/health', (req, res) => {
  res.json({ status: '✅ 服务器运行中' });
});

// ============ 数据库连接 ============

const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/yulan';
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB 连接成功');
  } catch (error) {
    console.error('❌ MongoDB 连接失败:', error.message);
    // 如果连接失败，等待后重试
    setTimeout(connectDatabase, 5000);
  }
};

// ============ 服务器启动 ============

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();
  
  httpServer.listen(PORT, () => {
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
    console.log(`📝 API 文档: http://localhost:${PORT}/api/health`);
  });
};

startServer();

module.exports = app;
