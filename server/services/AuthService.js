/**
 * Authentication Service
 * Provides JWT-based authentication, user management, and API key handling
 */

const crypto = require('crypto');

class AuthService {
  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.apiKeys = new Map();
    this.initialized = false;
    
    // Default admin user (change in production!)
    this.users.set('admin', {
      id: 'admin',
      username: 'admin',
      email: 'admin@localhost',
      passwordHash: this.hashPassword('admin123'),
      role: 'admin',
      createdAt: Date.now(),
      apiKeys: []
    });
  }

  /**
   * Initialize authentication system
   */
  async initialize() {
    try {
      // Load users from database (if exists)
      // In production, connect to PostgreSQL/MongoDB
      console.log('✅ Auth Service initialized');
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Auth initialization error:', error.message);
      return false;
    }
  }

  /**
   * Hash password using SHA-256
   * In production, use bcrypt or argon2
   */
  hashPassword(password) {
    return crypto
      .createHash('sha256')
      .update(password + process.env.JWT_SECRET || 'default-secret')
      .digest('hex');
  }

  /**
   * Generate JWT token (simplified)
   * In production, use jsonwebtoken library
   */
  generateToken(userId) {
    const payload = {
      userId,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    
    const tokenData = Buffer.from(JSON.stringify(payload)).toString('base64');
    const signature = crypto
      .createHmac('sha256', process.env.JWT_SECRET || 'default-secret')
      .update(tokenData)
      .digest('hex');
    
    return `${tokenData}.${signature}`;
  }

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    try {
      const [tokenData, signature] = token.split('.');
      
      const expectedSignature = crypto
        .createHmac('sha256', process.env.JWT_SECRET || 'default-secret')
        .update(tokenData)
        .digest('hex');
      
      if (signature !== expectedSignature) {
        return null;
      }
      
      const payload = JSON.parse(Buffer.from(tokenData, 'base64').toString());
      
      if (payload.exp < Date.now()) {
        return null; // Expired
      }
      
      return payload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Register new user
   */
  async register(username, email, password) {
    if (!this.initialized) await this.initialize();
    
    if (this.users.has(username)) {
      throw new Error('Username already exists');
    }
    
    const user = {
      id: crypto.randomUUID(),
      username,
      email,
      passwordHash: this.hashPassword(password),
      role: 'user',
      createdAt: Date.now(),
      apiKeys: [],
      settings: {
        theme: 'dark',
        language: 'en',
        notifications: true
      }
    };
    
    this.users.set(username, user);
    console.log(`✅ User registered: ${username}`);
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
  }

  /**
   * Login user
   */
  async login(username, password) {
    if (!this.initialized) await this.initialize();
    
    const user = this.users.get(username);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const passwordHash = this.hashPassword(password);
    if (passwordHash !== user.passwordHash) {
      throw new Error('Invalid credentials');
    }
    
    const token = this.generateToken(user.id);
    
    // Create session
    this.sessions.set(token, {
      userId: user.id,
      username: user.username,
      loginAt: Date.now()
    });
    
    console.log(`✅ User logged in: ${username}`);
    
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    };
  }

  /**
   * Logout user
   */
  async logout(token) {
    this.sessions.delete(token);
    return true;
  }

  /**
   * Get user from token
   */
  async getUserFromToken(token) {
    const payload = this.verifyToken(token);
    if (!payload) return null;
    
    const session = this.sessions.get(token);
    if (!session) return null;
    
    const user = Array.from(this.users.values()).find(u => u.id === payload.userId);
    if (!user) return null;
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
  }

  /**
   * Generate API key for user
   */
  async generateAPIKey(userId, name = 'Default') {
    const user = Array.from(this.users.values()).find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const apiKey = `sk_${crypto.randomBytes(32).toString('hex')}`;
    
    const keyData = {
      key: apiKey,
      name,
      userId,
      createdAt: Date.now(),
      lastUsed: null,
      usageCount: 0
    };
    
    this.apiKeys.set(apiKey, keyData);
    user.apiKeys.push(apiKey);
    
    console.log(`✅ API key generated for user ${userId}`);
    
    return {
      key: apiKey,
      name,
      createdAt: keyData.createdAt
    };
  }

  /**
   * Validate API key
   */
  async validateAPIKey(apiKey) {
    const keyData = this.apiKeys.get(apiKey);
    if (!keyData) return null;
    
    // Update usage stats
    keyData.lastUsed = Date.now();
    keyData.usageCount++;
    
    const user = Array.from(this.users.values()).find(u => u.id === keyData.userId);
    if (!user) return null;
    
    return {
      userId: user.id,
      username: user.username,
      role: user.role
    };
  }

  /**
   * Revoke API key
   */
  async revokeAPIKey(apiKey) {
    const keyData = this.apiKeys.get(apiKey);
    if (!keyData) return false;
    
    const user = Array.from(this.users.values()).find(u => u.id === keyData.userId);
    if (user) {
      user.apiKeys = user.apiKeys.filter(k => k !== apiKey);
    }
    
    this.apiKeys.delete(apiKey);
    console.log(`✅ API key revoked`);
    return true;
  }

  /**
   * Get user's API keys
   */
  async getUserAPIKeys(userId) {
    const user = Array.from(this.users.values()).find(u => u.id === userId);
    if (!user) return [];
    
    return user.apiKeys.map(key => {
      const keyData = this.apiKeys.get(key);
      return {
        key: key.substring(0, 12) + '...',
        name: keyData?.name || 'Unknown',
        createdAt: keyData?.createdAt,
        lastUsed: keyData?.lastUsed,
        usageCount: keyData?.usageCount || 0
      };
    });
  }

  /**
   * Get statistics
   */
  async getStats() {
    return {
      totalUsers: this.users.size,
      activeSessions: this.sessions.size,
      totalAPIKeys: this.apiKeys.size,
      usersOnline: this.sessions.size
    };
  }

  /**
   * Middleware: Require authentication
   */
  requireAuth() {
    return async (req, res, next) => {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const apiKey = req.headers['x-api-key'];
      
      if (token) {
        const user = await this.getUserFromToken(token);
        if (user) {
          req.user = user;
          return next();
        }
      }
      
      if (apiKey) {
        const user = await this.validateAPIKey(apiKey);
        if (user) {
          req.user = user;
          return next();
        }
      }
      
      res.status(401).json({ error: 'Unauthorized' });
    };
  }

  /**
   * Middleware: Require admin role
   */
  requireAdmin() {
    return async (req, res, next) => {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
      }
      next();
    };
  }
}

// Singleton instance
const authService = new AuthService();

module.exports = authService;
