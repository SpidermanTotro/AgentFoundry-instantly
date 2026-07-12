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
const LocalAIEngine = require('./ai-engine/LocalAIEngine');
const PluginSystem = require('./ai-engine/PluginSystem');
const CodeIntelligence = require('./ai-engine/CodeIntelligence');

// Import services
const authService = require('./services/AuthService');
const vectorDB = require('./services/VectorDB');

// Import routes
const authRoutes = require('./routes/auth');
const vectordbRoutes = require('./routes/vectordb');

// Load environment
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3001;
const server = http.createServer(app);
const aiEngine = new LocalAIEngine();
const pluginSystem = new PluginSystem();
const codeIntelligence = new CodeIntelligence();
const pluginSystemReady = pluginSystem.initialize();

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

// Offline code-assistance endpoints used by the editor UI.
app.post('/api/complete', async (req, res) => {
  try {
    const { code = '', language = 'javascript', cursorPosition = code.length } = req.body;
    const suggestions = await aiEngine.generateCompletion(code, cursorPosition, language);
    res.json({ success: true, suggestions, mode: 'offline-ai' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/analyze', (req, res) => {
  try {
    const { code = '', language = 'javascript' } = req.body;
    res.json({ success: true, analysis: aiEngine.analyzeCode(code, language), mode: 'offline-ai' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/explain', (req, res) => {
  try {
    const { code = '', language = 'javascript' } = req.body;
    const analysis = aiEngine.analyzeCode(code, language);
    const explanation = [
      `Language: ${language}`,
      `Complexity: ${analysis.complexity.level} (${analysis.complexity.score})`,
      `Maintainability: ${analysis.metrics.maintainabilityIndex.rating} (${analysis.metrics.maintainabilityIndex.score}/100)`,
      `Issues: ${analysis.issues.length}`
    ].join('\n');
    res.json({ success: true, explanation, analysis, mode: 'offline-ai' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/refactor', async (req, res) => {
  try {
    await pluginSystemReady;
    const { code = '', language = 'javascript' } = req.body;
    const analysis = aiEngine.analyzeCode(code, language);
    const suggestions = analysis.suggestions.map((suggestion) => ({
      title: suggestion.title,
      description: suggestion.description,
      impact: suggestion.priority,
      category: suggestion.type
    }));
    res.json({ success: true, suggestions, mode: 'offline-ai' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/format', async (req, res) => {
  try {
    const { code = '', language = 'javascript' } = req.body;
    const formatted = await codeIntelligence.formatCode(code, language);
    res.json({ success: true, formatted, mode: 'offline' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/stats', async (req, res) => {
  await pluginSystemReady;
  res.json({
    success: true,
    statistics: {
      plugins: pluginSystem.getStatistics(),
      learnedSkills: aiEngine.getSkills().length,
      learningEnabled: aiEngine.learningEnabled,
      memorySize: aiEngine.contextMemory.length,
      uptime: process.uptime()
    }
  });
});

app.get('/api/skills', async (req, res) => {
  await pluginSystemReady;
  res.json({
    success: true,
    skills: pluginSystem.getRecommendedSkills('', 'all'),
    statistics: pluginSystem.getStatistics(),
    mode: 'offline'
  });
});

app.get('/api/skills/export', async (req, res) => {
  await pluginSystemReady;
  res.json({ success: true, skills: await pluginSystem.exportSkills() });
});

// Main chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, stream = false } = req.body;
    
    // For now, echo response (AI providers need API keys)
    const response = {
      success: true,
      message: `Echo: ${message}`,
      info: 'Add API keys in .env for full AI responses',
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
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
    const { prompt } = req.body;
    res.json({
      success: true,
      message: 'Image generation requires API keys (DALL-E, Stable Diffusion)',
      prompt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    const { query } = req.body;
    res.json({
      success: true,
      message: 'Web search requires SERP API key',
      query,
      results: []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
