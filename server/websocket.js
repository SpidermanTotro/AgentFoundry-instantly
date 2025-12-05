const { Server } = require('socket.io');

/**
 * WebSocket Server for Real-Time AI Streaming
 * Handles: Chat streaming, Image/Video generation progress, Web search
 */
class WebSocketServer {
  constructor(httpServer, aiEngines) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    });

    this.aiEngines = aiEngines;
    this.activeConnections = new Map();

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`✅ WebSocket client connected: ${socket.id}`);
      this.activeConnections.set(socket.id, {
        connectedAt: new Date(),
        messageCount: 0,
      });

      // Chat streaming
      socket.on('chat:stream', async (data) => {
        await this.handleChatStream(socket, data);
      });

      // Image generation with progress
      socket.on('image:generate', async (data) => {
        await this.handleImageGeneration(socket, data);
      });

      // Video generation with progress (long-running)
      socket.on('video:generate', async (data) => {
        await this.handleVideoGeneration(socket, data);
      });

      // Web search
      socket.on('search:query', async (data) => {
        await this.handleWebSearch(socket, data);
      });

      // Disconnect
      socket.on('disconnect', () => {
        console.log(`❌ WebSocket client disconnected: ${socket.id}`);
        this.activeConnections.delete(socket.id);
      });
    });
  }

  /**
   * Handle real-time chat streaming (token-by-token like ChatGPT)
   */
  async handleChatStream(socket, data) {
    const { message, history = [], mode = 'chatgpt2', temperature = 0.7 } = data;
    const stats = this.activeConnections.get(socket.id);
    stats.messageCount++;

    try {
      console.log(`💬 Streaming chat for ${socket.id}: "${message.substring(0, 50)}..."`);

      // Get AI engine
      const engine = this.aiEngines.chatgpt2 || this.aiEngines.complete;
      
      if (!engine || !engine.chat) {
        throw new Error('AI engine not available');
      }

      // Simulate streaming (in real implementation, use streaming API)
      const response = await engine.chat(message, history, { 
        mode, 
        temperature,
        stream: false // We'll simulate streaming
      });

      const fullText = response.response || response.message || 'No response';
      
      // Stream token by token (simulate real streaming)
      const tokens = fullText.split(' ');
      for (let i = 0; i < tokens.length; i++) {
        const token = i === 0 ? tokens[i] : ' ' + tokens[i];
        socket.emit('chat:token', { 
          token,
          index: i,
          total: tokens.length 
        });
        
        // Small delay to simulate streaming (remove in production with real streaming)
        await new Promise(resolve => setTimeout(resolve, 30));
      }

      // Send completion
      socket.emit('chat:complete', {
        message: fullText,
        metadata: response.metadata || {},
        stats: {
          tokens: tokens.length,
          duration: response.duration || 0,
        },
      });

    } catch (error) {
      console.error('Chat streaming error:', error);
      socket.emit('chat:error', {
        message: error.message,
        code: 'CHAT_STREAM_ERROR',
      });
    }
  }

  /**
   * Handle image generation with progress updates
   */
  async handleImageGeneration(socket, data) {
    const { prompt, model = 'dall-e-3', size = '1024x1024' } = data;

    try {
      console.log(`🎨 Generating image for ${socket.id}: "${prompt.substring(0, 50)}..."`);

      // Progress updates
      socket.emit('image:progress', { progress: 0, status: 'Initializing...' });
      
      const engine = this.aiEngines.complete || this.aiEngines.chatgpt2;
      if (!engine || !engine.generateImage) {
        throw new Error('Image generation not available');
      }

      socket.emit('image:progress', { progress: 30, status: 'Sending request...' });

      const result = await engine.generateImage(prompt, { model, size });

      socket.emit('image:progress', { progress: 90, status: 'Finalizing...' });

      socket.emit('image:complete', {
        url: result.url || result.imageUrl,
        prompt,
        metadata: result.metadata || {},
      });

    } catch (error) {
      console.error('Image generation error:', error);
      socket.emit('image:error', {
        message: error.message,
        code: 'IMAGE_GEN_ERROR',
      });
    }
  }

  /**
   * Handle video generation with progress (can take 5-10 minutes!)
   */
  async handleVideoGeneration(socket, data) {
    const { prompt, duration = 5, fps = 24 } = data;

    try {
      console.log(`🎬 Generating video for ${socket.id}: "${prompt.substring(0, 50)}..."`);

      // Video generation takes time, send progress updates
      socket.emit('video:progress', { progress: 0, status: 'Initializing video generation...' });
      
      const engine = this.aiEngines.complete || this.aiEngines.chatgpt2;
      if (!engine || !engine.generateVideo) {
        throw new Error('Video generation not available');
      }

      // Simulate progress (real API would have callbacks)
      const progressInterval = setInterval(() => {
        const currentProgress = Math.min(70, Math.random() * 70);
        socket.emit('video:progress', { 
          progress: currentProgress, 
          status: 'Generating frames...' 
        });
      }, 5000);

      const result = await engine.generateVideo(prompt, { duration, fps });

      clearInterval(progressInterval);
      socket.emit('video:progress', { progress: 95, status: 'Encoding video...' });

      socket.emit('video:complete', {
        url: result.url || result.videoUrl,
        prompt,
        duration: result.duration || duration,
        metadata: result.metadata || {},
      });

    } catch (error) {
      console.error('Video generation error:', error);
      socket.emit('video:error', {
        message: error.message,
        code: 'VIDEO_GEN_ERROR',
      });
    }
  }

  /**
   * Handle web search with real-time results
   */
  async handleWebSearch(socket, data) {
    const { query, limit = 10 } = data;

    try {
      console.log(`🔍 Web search for ${socket.id}: "${query}"`);

      const engine = this.aiEngines.complete || this.aiEngines.chatgpt2;
      if (!engine || !engine.webSearch) {
        throw new Error('Web search not available');
      }

      const results = await engine.webSearch(query, { limit });

      socket.emit('search:complete', {
        query,
        results: results.results || results || [],
        count: results.count || 0,
      });

    } catch (error) {
      console.error('Web search error:', error);
      socket.emit('search:error', {
        message: error.message,
        code: 'SEARCH_ERROR',
      });
    }
  }

  /**
   * Get connection statistics
   */
  getStats() {
    return {
      activeConnections: this.activeConnections.size,
      totalMessages: Array.from(this.activeConnections.values())
        .reduce((sum, conn) => sum + conn.messageCount, 0),
    };
  }

  /**
   * Broadcast to all connected clients
   */
  broadcast(event, data) {
    this.io.emit(event, data);
  }
}

module.exports = WebSocketServer;
