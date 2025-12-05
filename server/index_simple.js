const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

// Import services
const authService = require('./services/AuthService');
const vectorDB = require('./services/VectorDB');

// Import routes
const authRoutes = require('./routes/auth');
const vectordbRoutes = require('./routes/vectordb');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize services
(async () => {
  await authService.initialize();
  console.log('✅ Authentication service initialized');
})();

(async () => {
  await vectorDB.initialize();
  console.log('✅ Vector database initialized');
})();

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/vectordb', vectordbRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ChatGPT 2.0 Server - Auth & VectorDB Ready',
    features: {
      authentication: true,
      vectorDatabase: true,
      rag: true
    }
  });
});

// Basic chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    res.json({
      success: true,
      response: `Echo: ${message} (Configure API keys for AI responses)`,
      message: 'Authentication and Vector DB are working. Add API keys for full AI functionality.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// WebSocket for streaming
io.on('connection', (socket) => {
  console.log('✅ WebSocket client connected:', socket.id);
  
  socket.on('chat:stream', async (data) => {
    const { message } = data;
    const words = `Response to: ${message}`.split(' ');
    
    for (let word of words) {
      socket.emit('chat:token', { token: word + ' ' });
      await new Promise(r => setTimeout(r, 50));
    }
    
    socket.emit('chat:complete', { message: `Response to: ${message}` });
  });
  
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 ========================================`);
  console.log(`   ChatGPT 2.0 Server`);
  console.log(`   ========================================`);
  console.log(`   Status: ONLINE`);
  console.log(`   Port: ${PORT}`);
  console.log(`   Features:`);
  console.log(`   ✓ Authentication System`);
  console.log(`   ✓ Vector Database (RAG)`);
  console.log(`   ✓ WebSocket Streaming`);
  console.log(`   ========================================\n`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
  console.log(`🧠 Vector DB: http://localhost:${PORT}/api/vectordb\n`);
});

module.exports = { app, server, io };
