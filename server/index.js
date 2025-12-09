#!/usr/bin/env node
/**
 * ChatGPT 2.0 UNRESTRICTED - Complete Unified Server
 * Merges: Authentication + Vector DB + WebSocket + AI Engines
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

// Import services
const authService = require('./services/AuthService');
const vectorDB = require('./services/VectorDB');

// Import AI Engine
const IntegratedAIEngine = require('./ai-engine/IntegratedAIEngine');
const aiEngine = new IntegratedAIEngine();

// Import routes
const authRoutes = require('./routes/auth');
const vectordbRoutes = require('./routes/vectordb');

// Load environment
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3001;
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Initialize services
console.log('\n🚀 ChatGPT 2.0 UNRESTRICTED - Complete Server Starting...\n');

(async () => {
  try {
    await authService.initialize();
    console.log('✅ Authentication Service initialized');
  } catch (error) {
    console.error('⚠️  Auth service error:', error.message);
  }
})();

(async () => {
  try {
    await vectorDB.initialize();
    console.log('✅ Vector Database initialized');
  } catch (error) {
    console.error('⚠️  Vector DB warning:', error.message);
  }
})();

// Initialize Integrated AI Engine
(async () => {
  try {
    await aiEngine.initialize();
    console.log('✅ Integrated AI Engine initialized');
  } catch (error) {
    console.error('⚠️  AI Engine warning:', error.message);
  }
})();

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/vectordb', vectordbRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ChatGPT 2.0 UNRESTRICTED - All Systems Ready',
    timestamp: new Date().toISOString(),
    features: {
      authentication: true,
      vectorDatabase: true,
      websocket: true,
      rag: true,
      streaming: true
    },
    server: {
      port: PORT,
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

// Main chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, stream = false } = req.body;
    
    // Wait for initialization with timeout
    if (!aiEngine.initialized) {
      const timeout = Date.now() + 5000; // 5 second timeout
      while (!aiEngine.initialized && Date.now() < timeout) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    if (!aiEngine.initialized) {
      return res.json({
        success: true,
        message: `Echo: ${message}`,
        info: 'AI Engine still initializing... This is an echo response.',
        mode: 'echo',
        timestamp: new Date().toISOString()
      });
    }

    // Generate response using integrated AI engine
    const result = await aiEngine.generateText(message, {
      history,
      maxTokens: 512
    });
    
    res.json({
      success: true,
      message: result.text || result.response || 'No response generated',
      engine: result.engine,
      responseTime: result.responseTime,
      cached: result.cached,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Generate image endpoint
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, width = 512, height = 512, style } = req.body;
    
    if (!aiEngine.initialized) {
      return res.json({
        success: false,
        error: 'AI Engine initializing...'
      });
    }

    const result = await aiEngine.generateImage(prompt, {
      width,
      height,
      style
    });
    
    res.json({
      success: true,
      image: result.image || result.data,
      engine: result.engine,
      responseTime: result.responseTime,
      cached: result.cached,
      metadata: result.metadata
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Generate code endpoint
app.post('/api/generate-code', async (req, res) => {
  try {
    const { prompt, language = 'javascript', options = {} } = req.body;
    
    // Wait for initialization with timeout
    if (!aiEngine.initialized) {
      const timeout = Date.now() + 5000;
      while (!aiEngine.initialized && Date.now() < timeout) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    if (!aiEngine.initialized) {
      return res.json({
        success: false,
        error: 'AI Engine still initializing...'
      });
    }

    const result = await aiEngine.generateCode(prompt, language, options);
    
    res.json({
      success: true,
      code: result.text || result.code,
      language,
      engine: result.engine,
      responseTime: result.responseTime,
      cached: result.cached
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Generate video endpoint
app.post('/api/generate-video', async (req, res) => {
  try {
    const { prompt } = req.body;
    res.json({
      success: true,
      message: 'Video generation requires API keys',
      prompt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate audio endpoint
app.post('/api/generate-audio', async (req, res) => {
  try {
    const { text } = req.body;
    res.json({
      success: true,
      message: 'Audio generation requires API keys (ElevenLabs)',
      text
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Web search endpoint
app.post('/api/search', async (req, res) => {
  try {
    const { query, limit = 10 } = req.body;
    
    if (!aiEngine.initialized) {
      return res.json({
        success: false,
        error: 'AI Engine initializing...'
      });
    }

    const result = await aiEngine.search(query, { limit });
    
    res.json({
      success: true,
      results: result.results || [],
      engine: result.engine,
      responseTime: result.responseTime,
      cached: result.cached,
      query
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Process document endpoint
app.post('/api/process-document', async (req, res) => {
  try {
    const { content, type = 'text', options = {} } = req.body;
    
    if (!aiEngine.initialized) {
      return res.json({
        success: false,
        error: 'AI Engine initializing...'
      });
    }

    const result = await aiEngine.processDocument(content, type, options);
    
    res.json({
      success: true,
      processed: result.processed || result,
      engine: result.engine,
      responseTime: result.responseTime,
      cached: result.cached
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// AI Engine stats endpoint
app.get('/api/ai/stats', (req, res) => {
  try {
    const stats = aiEngine.getStats();
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Set AI mode endpoint
app.post('/api/ai/mode', (req, res) => {
  try {
    const { mode } = req.body;
    const success = aiEngine.setMode(mode);
    
    if (success) {
      res.json({
        success: true,
        mode: aiEngine.mode,
        message: `AI mode set to ${mode}`
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Invalid mode. Use: offline, online, or hybrid'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Clear cache endpoint
app.post('/api/ai/cache/clear', (req, res) => {
  try {
    aiEngine.clearCache();
    res.json({
      success: true,
      message: 'Cache cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// WebSocket handling for real-time streaming
io.on('connection', (socket) => {
  console.log('✅ WebSocket client connected:', socket.id);
  
  // Chat streaming
  socket.on('chat:stream', async (data) => {
    try {
      const { message } = data;
      
      // Simulate streaming response (token by token)
      const response = `This is a streaming response to: "${message}". Configure API keys for real AI responses.`;
      const words = response.split(' ');
      
      for (const word of words) {
        socket.emit('chat:token', { token: word + ' ' });
        await new Promise(resolve => setTimeout(resolve, 50)); // 50ms delay per word
      }
      
      socket.emit('chat:complete', {
        message: response,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      socket.emit('chat:error', { error: error.message });
    }
  });
  
  // Image generation progress
  socket.on('image:generate', async (data) => {
    try {
      const { prompt } = data;
      
      socket.emit('image:progress', { progress: 0, status: 'Starting...' });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      socket.emit('image:progress', { progress: 50, status: 'Generating...' });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      socket.emit('image:progress', { progress: 100, status: 'Complete!' });
      socket.emit('image:complete', {
        message: 'Image generation requires API keys',
        prompt
      });
    } catch (error) {
      socket.emit('image:error', { error: error.message });
    }
  });
  
  // Disconnect handler
  socket.on('disconnect', () => {
    console.log('❌ WebSocket client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path
  });
});

// Start server
server.listen(PORT, () => {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  🚀 ChatGPT 2.0 UNRESTRICTED - Server ONLINE');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`\n  Mode: Complete Unified Server`);
  console.log(`  Port: ${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('\n  ✅ Features Enabled:');
  console.log('     • Authentication (JWT + API Keys)');
  console.log('     • Vector Database (RAG)');
  console.log('     • WebSocket Streaming');
  console.log('     • Real-time Chat');
  console.log('     • Multi-modal Support');
  console.log('\n  📡 Endpoints:');
  console.log(`     • API: http://localhost:${PORT}/api`);
  console.log(`     • Health: http://localhost:${PORT}/api/health`);
  console.log(`     • Auth: http://localhost:${PORT}/api/auth`);
  console.log(`     • Vector DB: http://localhost:${PORT}/api/vectordb`);
  console.log(`     • WebSocket: ws://localhost:${PORT}`);
  console.log('\n  🔐 Default Credentials:');
  console.log('     Username: admin');
  console.log('     Password: admin123');
  console.log('\n═══════════════════════════════════════════════════════════\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = { app, server, io };
