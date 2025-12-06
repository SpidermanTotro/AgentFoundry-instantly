/**
 * GenSpark AI Developer - Main Server
 * Live Streaming AI Responses
 * Real File Creation
 * 100% Offline
 */

import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import GGUFEngine from './ai/gguf-engine.js';
import FileManager from './file-system/file-manager.js';
import DeveloperAI from './developer/developer-ai.js';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// Initialize AI components
const aiEngine = new GGUFEngine();
const fileManager = new FileManager();
const developerAI = new DeveloperAI(aiEngine, fileManager);

// Track active connections
const connections = new Set();

// WebSocket for LIVE streaming
wss.on('connection', (ws) => {
    connections.add(ws);
    console.log('✅ Client connected. Total connections:', connections.size);

    ws.on('message', async (data) => {
        try {
            const message = JSON.parse(data);
            
            switch (message.type) {
                case 'chat':
                    await handleChatStream(ws, message);
                    break;
                case 'buildProject':
                    await handleBuildProject(ws, message);
                    break;
                case 'completeCode':
                    await handleCodeCompletion(ws, message);
                    break;
                case 'fixBug':
                    await handleBugFix(ws, message);
                    break;
                default:
                    ws.send(JSON.stringify({ error: 'Unknown message type' }));
            }
        } catch (error) {
            ws.send(JSON.stringify({ error: error.message }));
        }
    });

    ws.on('close', () => {
        connections.delete(ws);
        console.log('❌ Client disconnected. Total connections:', connections.size);
    });
});

/**
 * Handle chat with LIVE streaming
 */
async function handleChatStream(ws, message) {
    const { prompt } = message;
    
    ws.send(JSON.stringify({ type: 'start', prompt }));
    
    const stream = await aiEngine.chat(prompt, true);
    
    for await (const chunk of stream) {
        if (chunk.token) {
            ws.send(JSON.stringify({
                type: 'token',
                token: chunk.token,
                full: chunk.full
            }));
        }
        
        if (chunk.done) {
            ws.send(JSON.stringify({
                type: 'done',
                full: chunk.full,
                tokens: chunk.full.length
            }));
        }
    }
}

/**
 * Handle project building with LIVE updates
 */
async function handleBuildProject(ws, message) {
    const { description, options } = message;
    
    // Listen to all developer AI events
    developerAI.on('phase', (data) => {
        ws.send(JSON.stringify({ type: 'phase', ...data }));
    });
    
    developerAI.on('thinking', (data) => {
        ws.send(JSON.stringify({ type: 'thinking', ...data }));
    });
    
    developerAI.on('generating', (data) => {
        ws.send(JSON.stringify({ type: 'generating', ...data }));
    });
    
    developerAI.on('codeStreaming', (data) => {
        ws.send(JSON.stringify({ type: 'codeStream', ...data }));
    });
    
    // Build the project
    const result = await developerAI.buildProject(description, options);
    
    ws.send(JSON.stringify({
        type: 'buildComplete',
        success: result.success,
        project: result.project,
        files: result.files,
        statistics: result.statistics
    }));
}

/**
 * Handle code completion
 */
async function handleCodeCompletion(ws, message) {
    const { code, cursorPosition, language } = message;
    
    const stream = await aiEngine.completeCode(code, cursorPosition, language);
    
    for await (const chunk of stream) {
        if (chunk.token) {
            ws.send(JSON.stringify({
                type: 'completion',
                token: chunk.token,
                full: chunk.full
            }));
        }
    }
}

/**
 * Handle bug fixing
 */
async function handleBugFix(ws, message) {
    const { code, error, language } = message;
    
    const stream = await aiEngine.fixBugs(code, error, language);
    
    for await (const chunk of stream) {
        if (chunk.token) {
            ws.send(JSON.stringify({
                type: 'bugFix',
                token: chunk.token,
                full: chunk.full
            }));
        }
    }
}

// =============================================================================
// REST API Endpoints
// =============================================================================

/**
 * Root endpoint
 */
app.get('/', (req, res) => {
    res.json({
        name: 'GenSpark AI Developer',
        version: '1.0.0',
        description: 'Next-Level Programming Tool - Live AI Responses, Real Files, 100% Offline',
        status: 'running',
        features: {
            liveStreaming: true,
            realFiles: true,
            offlineAI: aiEngine.isLoaded,
            developerMimicry: true,
            autoGitHub: true
        },
        endpoints: {
            websocket: 'ws://localhost:3003',
            rest: 'http://localhost:3003/api'
        },
        model: aiEngine.getModelInfo()
    });
});

/**
 * Health check
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        aiEngine: aiEngine.isLoaded ? 'ready' : 'not loaded',
        connections: connections.size,
        files: fileManager.fileHistory.size,
        uptime: process.uptime()
    });
});

/**
 * Load AI model
 */
app.post('/api/ai/load', async (req, res) => {
    const { model = 'codellama-13b' } = req.body;
    const result = await aiEngine.loadModel(model);
    res.json(result);
});

/**
 * Get model info
 */
app.get('/api/ai/models', (req, res) => {
    res.json(aiEngine.getModelInfo());
});

/**
 * Chat (non-streaming)
 */
app.post('/api/ai/chat', async (req, res) => {
    const { message } = req.body;
    const result = await aiEngine.chat(message, false);
    res.json(result);
});

/**
 * Build project
 */
app.post('/api/developer/build', async (req, res) => {
    const { description, options } = req.body;
    
    // Send initial response
    res.json({
        status: 'building',
        message: 'Project build started. Connect to WebSocket for live updates.',
        websocket: 'ws://localhost:3003'
    });
    
    // Build in background
    developerAI.buildProject(description, options);
});

/**
 * Create file
 */
app.post('/api/files/create', async (req, res) => {
    const { path, content, autoUpload = false } = req.body;
    const result = await fileManager.createFile(path, content, { autoUpload });
    res.json(result);
});

/**
 * List files
 */
app.get('/api/files', async (req, res) => {
    const { directory = '' } = req.query;
    const result = await fileManager.listFiles(directory);
    res.json(result);
});

/**
 * Get file stats
 */
app.get('/api/files/stats', async (req, res) => {
    const stats = await fileManager.getStats();
    res.json(stats);
});

/**
 * Complete code
 */
app.post('/api/code/complete', async (req, res) => {
    const { code, cursorPosition, language = 'javascript' } = req.body;
    
    let completion = '';
    const stream = await aiEngine.completeCode(code, cursorPosition, language);
    
    for await (const chunk of stream) {
        if (chunk.token) {
            completion += chunk.token;
        }
    }
    
    res.json({
        success: true,
        completion: completion
    });
});

/**
 * Fix bugs
 */
app.post('/api/code/fix', async (req, res) => {
    const { code, error, language = 'javascript' } = req.body;
    
    let fix = '';
    const stream = await aiEngine.fixBugs(code, error, language);
    
    for await (const chunk of stream) {
        if (chunk.token) {
            fix += chunk.token;
        }
    }
    
    res.json({
        success: true,
        fix: fix
    });
});

/**
 * Generate tests
 */
app.post('/api/code/tests', async (req, res) => {
    const { code, language = 'javascript', framework = 'jest' } = req.body;
    
    let tests = '';
    const stream = await aiEngine.generateTests(code, language, framework);
    
    for await (const chunk of stream) {
        if (chunk.token) {
            tests += chunk.token;
        }
    }
    
    res.json({
        success: true,
        tests: tests
    });
});

// =============================================================================
// Start Server
// =============================================================================

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║             🚀 GenSpark AI Developer - LIVE & RUNNING 🚀              ║
║                                                                       ║
║  Next-Level Programming Tool                                          ║
║  ✅ Live AI Streaming Responses                                       ║
║  ✅ Creates REAL Files on Your System                                 ║
║  ✅ Mimics Human Developer Behavior                                   ║
║  ✅ 100% Offline with GGUF Models                                     ║
║  ✅ Auto-Upload to GitHub                                             ║
║                                                                       ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                       ║
║  🌐 WebSocket (Live Streaming): ws://localhost:${PORT}                ║
║  🌐 REST API: http://localhost:${PORT}/api                            ║
║  📊 Health Check: http://localhost:${PORT}/health                     ║
║                                                                       ║
║  💡 AI Model: ${aiEngine.isLoaded ? '✅ LOADED' : '⚠️  NOT LOADED (use POST /api/ai/load)'}  ║
║  📁 Output Directory: ${fileManager.outputDir}                        ║
║  👥 Active Connections: ${connections.size}                                           ║
║                                                                       ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                       ║
║  📖 QUICK START:                                                      ║
║                                                                       ║
║  1. Load AI Model:                                                    ║
║     curl -X POST http://localhost:${PORT}/api/ai/load \\                 ║
║          -H "Content-Type: application/json" \\                       ║
║          -d '{"model": "tinyllama"}'                                  ║
║                                                                       ║
║  2. Build a Project:                                                  ║
║     curl -X POST http://localhost:${PORT}/api/developer/build \\         ║
║          -H "Content-Type: application/json" \\                       ║
║          -d '{"description": "Build a REST API", "options": {}}'      ║
║                                                                       ║
║  3. Connect WebSocket for LIVE updates!                               ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
    `);
});

export default app;
