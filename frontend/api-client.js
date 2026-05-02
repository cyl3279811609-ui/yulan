/**
 * Yulan 评论系统 - API 客户端
 * 
 * 功能: 与后端 API 通信、用户认证、评论管理、点赞操作
 * 使用方式: 在 HTML 中引入此文件后使用全局 yulanAPI 对象
 * 
 * 示例:
 *   yulanAPI.setToken(token);
 *   yulanAPI.comments.create(pageUrl, content);
 *   yulanAPI.comments.fetch(pageUrl);
 */

const yulanAPI = {
  // 配置
  baseURL: 'http://localhost:5000',
  token: localStorage.getItem('yulan_token') || null,
  user: JSON.parse(localStorage.getItem('yulan_user')) || null,
  
  /**
   * 设置 API 令牌
   */
  setToken(token) {
    this.token = token;
    localStorage.setItem('yulan_token', token);
  },
  
  /**
   * 获取 API 令牌
   */
  getToken() {
    return this.token;
  },
  
  /**
   * 清除令牌和用户信息
   */
  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('yulan_token');
    localStorage.removeItem('yulan_user');
  },
  
  /**
   * 设置用户信息
   */
  setUser(user) {
    this.user = user;
    localStorage.setItem('yulan_user', JSON.stringify(user));
  },
  
  /**
   * 发送 API 请求
   */
  async request(method, endpoint, data = null) {
    const url = `${this.baseURL}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    // 添加授权令牌
    if (this.token) {
      options.headers.Authorization = `Bearer ${this.token}`;
    }
    
    // 添加请求体
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || '请求失败');
      }
      
      return result;
    } catch (error) {
      console.error(`API 错误 [${method} ${endpoint}]:`, error.message);
      throw error;
    }
  },
  
  // ============ 认证 API ============
  
  auth: {
    /**
     * 用户注册
     */
    async register(email, name, password) {
      const result = await yulanAPI.request('POST', '/api/auth/register', {
        email,
        name,
        password
      });
      yulanAPI.setToken(result.token);
      yulanAPI.setUser(result.user);
      return result;
    },
    
    /**
     * 用户登录
     */
    async login(email, password) {
      const result = await yulanAPI.request('POST', '/api/auth/login', {
        email,
        password
      });
      yulanAPI.setToken(result.token);
      yulanAPI.setUser(result.user);
      return result;
    },
    
    /**
     * 游客登录
     */
    async loginAsGuest() {
      const result = await yulanAPI.request('POST', '/api/auth/guest');
      yulanAPI.setToken(result.token);
      yulanAPI.setUser(result.user);
      return result;
    }
  },
  
  // ============ 评论 API ============
  
  comments: {
    /**
     * 获取某个页面的所有评论
     */
    async fetch(pageUrl) {
      return await yulanAPI.request('GET', `/api/comments?pageUrl=${encodeURIComponent(pageUrl)}`);
    },
    
    /**
     * 创建新评论
     */
    async create(pageUrl, content, parentCommentId = null) {
      return await yulanAPI.request('POST', '/api/comments', {
        pageUrl,
        content,
        parentCommentId
      });
    },
    
    /**
     * 删除评论
     */
    async delete(commentId) {
      return await yulanAPI.request('DELETE', `/api/comments/${commentId}`);
    }
  },
  
  // ============ 点赞 API ============
  
  likes: {
    /**
     * 点赞评论
     */
    async create(commentId) {
      return await yulanAPI.request('POST', '/api/likes', { commentId });
    },
    
    /**
     * 取消点赞
     */
    async delete(commentId) {
      return await yulanAPI.request('DELETE', `/api/likes/${commentId}`);
    }
  },
  
  // ============ 工具函数 ============
  
  /**
   * 检查用户是否已认证
   */
  isAuthenticated() {
    return !!this.token;
  },
  
  /**
   * 获取当前用户
   */
  getCurrentUser() {
    return this.user;
  },
  
  /**
   * 检查健康状态
   */
  async checkHealth() {
    try {
      const result = await yulanAPI.request('GET', '/api/health');
      console.log('服务器状态:', result);
      return true;
    } catch (error) {
      console.error('服务器不可用:', error);
      return false;
    }
  }
};

// 导出到全局作用域
if (typeof window !== 'undefined') {
  window.yulanAPI = yulanAPI;
}

// Node.js 环境下导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = yulanAPI;
}
