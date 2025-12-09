# GenSpark 2.0 Platform - Complete Integration Guide

## 🎯 Overview

This guide explains the complete integration of all AgentFoundry-instantly features into the GenSpark 2.0 platform. The integration provides:

1. **Unified Web Applications** - All features working seamlessly together
2. **GGUF Model Support** - Offline AI with llama.cpp integration
3. **Cross-Platform Builds** - Linux, Windows, and macOS desktop applications
4. **Coherent Tool Linking** - Web apps, AI components, and desktop versions interconnected
5. **Offline-Online Syncing** - Smart switching between offline and online AI modes

---

## 🏗️ Architecture

### Component Overview

```
GenSpark 2.0 Platform
├── ChatGPT 2.0 UNRESTRICTED (Port 3001) - Main Hub
│   ├── Authentication & Authorization
│   ├── Vector Database (RAG)
│   ├── WebSocket Streaming
│   └── Integrated AI Engine
├── GenSpark 2.0 (Port 3002) - Offline AI Platform
│   ├── GGUF Model Support
│   ├── Workspace Management
│   └── Media Generation (Offline)
├── GenSpark AI Developer (Port 3003) - Development Tools
│   ├── Live Streaming
│   └── Real File Generation
└── Supporting Services
    ├── GitHub 2.0 Integration (Port 3004)
    └── Forge Spark MVP (Port 3005)
```

### Integrated AI Engine

The `IntegratedAIEngine` provides seamless switching between:

1. **GGUF Models** (Offline, fastest for code)
   - llama2-7b, mistral-7b, codellama-7b
   - Runs via llama.cpp binaries
   - Best for: Code generation, local AI

2. **Offline AI** (Transformers.js)
   - Local models (LaMini, CodeGen)
   - NLP processing (natural, compromise)
   - Best for: Document processing, search, privacy

3. **Online AI** (Cloud Providers)
   - Google Gemini, Anthropic Claude, OpenAI
   - Best for: Latest features, multi-modal AI

---

## 🚀 Getting Started

### Quick Start

#### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

#### 2. Build Frontend

```bash
npm run build
```

#### 3. Start the Integrated Platform

**Option A: Default Mode (Hybrid)**
```bash
npm run platform
```

**Option B: Offline-Only Mode**
```bash
npm run platform:offline
```

**Option C: Online-Only Mode**
```bash
npm run platform:online
```

**Option D: Custom Launch**
```bash
node start-genspark-platform.js
```

### What Gets Started

When you run `npm run platform`, the launcher automatically:

1. ✅ Starts ChatGPT 2.0 UNRESTRICTED server (Port 3001)
2. ✅ Initializes Integrated AI Engine (GGUF + Offline + Online)
3. ✅ Starts Frontend development server (Port 5173)
4. ✅ Starts GenSpark 2.0 if available (Port 3002)
5. ✅ Starts AI Developer if available (Port 3003)
6. ✅ Displays status dashboard

---

## 🎯 AI Engine Modes

### Hybrid Mode (Recommended)

**Adaptive AI selection based on task:**

- Code generation → GGUF models (fastest)
- Web search → Online (latest info) or Offline KB (privacy)
- Image generation → Online (best quality) or Offline (procedural)
- Document processing → Offline (fast, private)

**Example:**
```javascript
// Automatically uses best engine
const result = await aiEngine.generateCode('create a REST API', 'javascript');
// Uses: GGUF if available, else Offline, else Online
```

### Offline Mode

**100% local processing, no internet required:**

- Uses GGUF models or Transformers.js
- Local knowledge base for search
- Procedural media generation
- Complete privacy

**Example:**
```bash
AI_MODE=offline npm run platform
```

### Online Mode

**Cloud-powered AI with latest features:**

- Access to GPT-4, Claude, Gemini
- Advanced image/video generation
- Web search with real-time data
- Multi-modal capabilities

**Example:**
```bash
AI_MODE=online npm run platform
```

---

## 📡 API Endpoints

### Core Endpoints

#### Health Check
```bash
GET http://localhost:3001/api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "ChatGPT 2.0 UNRESTRICTED - All Systems Ready",
  "features": {
    "authentication": true,
    "vectorDatabase": true,
    "websocket": true,
    "rag": true,
    "streaming": true
  }
}
```

#### Chat Endpoint
```bash
POST http://localhost:3001/api/chat
Content-Type: application/json

{
  "message": "Explain async/await in JavaScript",
  "history": []
}
```

**Response:**
```json
{
  "success": true,
  "message": "Async/await is a syntax for handling asynchronous operations...",
  "engine": "GGUF",
  "responseTime": 1250,
  "cached": false
}
```

#### Code Generation
```bash
POST http://localhost:3001/api/generate-code
Content-Type: application/json

{
  "prompt": "Create a REST API for user management",
  "language": "javascript",
  "options": {}
}
```

**Response:**
```json
{
  "success": true,
  "code": "const express = require('express');\n...",
  "language": "javascript",
  "engine": "GGUF",
  "responseTime": 800,
  "cached": false
}
```

#### Image Generation
```bash
POST http://localhost:3001/api/generate-image
Content-Type: application/json

{
  "prompt": "A futuristic city at sunset",
  "width": 512,
  "height": 512,
  "style": "geometric"
}
```

#### Web Search
```bash
POST http://localhost:3001/api/search
Content-Type: application/json

{
  "query": "javascript array methods",
  "limit": 10
}
```

#### Document Processing
```bash
POST http://localhost:3001/api/process-document
Content-Type: application/json

{
  "content": "Your document text here...",
  "type": "text",
  "options": {}
}
```

### AI Engine Management

#### Get AI Statistics
```bash
GET http://localhost:3001/api/ai/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "mode": "hybrid",
    "initialized": true,
    "availableEngines": {
      "gguf": true,
      "offline": true,
      "online": false
    },
    "metrics": {
      "totalRequests": 150,
      "cacheHits": 45,
      "cacheMisses": 105,
      "cacheHitRate": "30.00%",
      "engineUsage": {
        "GGUF": 80,
        "Offline": 70
      },
      "averageResponseTime": {
        "GGUF": 850,
        "Offline": 1200
      }
    }
  }
}
```

#### Switch AI Mode
```bash
POST http://localhost:3001/api/ai/mode
Content-Type: application/json

{
  "mode": "offline"
}
```

#### Clear Cache
```bash
POST http://localhost:3001/api/ai/cache/clear
```

---

## 🔧 GGUF Model Setup

### Installing GGUF Models

GGUF models provide the best offline AI experience. Here's how to set them up:

#### 1. Create Models Directory
```bash
mkdir -p models
```

#### 2. Download Models

**Recommended Models:**

**TinyLlama (Fastest, smallest):**
```bash
wget https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf -P models/
```

**Llama 2 7B (Balanced):**
```bash
wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q4_K_M.gguf -P models/
```

**Mistral 7B (Best quality):**
```bash
wget https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF/resolve/main/mistral-7b-instruct-v0.2.Q4_K_M.gguf -P models/
```

**CodeLlama (Best for code):**
```bash
wget https://huggingface.co/TheBloke/CodeLlama-7B-Instruct-GGUF/resolve/main/codellama-7b-instruct.Q4_K_M.gguf -P models/
```

#### 3. Install llama.cpp

**Linux:**
```bash
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
make
cp main ../bin/llama.cpp
```

**macOS:**
```bash
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
make
cp main ../bin/llama.cpp
```

**Windows:**
```powershell
# Use pre-built binaries from releases
# https://github.com/ggerganov/llama.cpp/releases
```

---

## 🖥️ Cross-Platform Builds

### Desktop Applications

#### Linux Builds

**AppImage (Universal Linux):**
```bash
npm run electron:build:linux -- --target AppImage
```

**Debian Package (.deb):**
```bash
npm run electron:build:linux -- --target deb
```

**RPM Package (.rpm):**
```bash
npm run electron:build:linux -- --target rpm
```

**All Linux Targets:**
```bash
npm run electron:build:all
```

#### Windows Build

```bash
npm run electron:build:win
```

Produces:
- NSIS installer (.exe)
- Portable executable
- ZIP archive

#### macOS Build

```bash
npm run electron:build:mac
```

Produces:
- DMG installer
- ZIP archive
- Universal binary (Intel + Apple Silicon)

### Build Configuration

All build settings are in `genspark-integration.config.js`:

```javascript
builds: {
  desktop: {
    enabled: true,
    platforms: ['linux', 'windows', 'macos'],
    linux: {
      targets: ['AppImage', 'deb', 'rpm'],
      category: 'Development'
    },
    windows: {
      targets: ['nsis', 'portable', 'zip']
    },
    macos: {
      targets: ['dmg', 'zip']
    }
  }
}
```

---

## 🔄 Offline-Online Synchronization

### How It Works

The `IntegratedAIEngine` automatically manages offline-online switching:

1. **Request comes in** → Check cache first
2. **Cache miss** → Select best engine based on:
   - Current mode (offline/online/hybrid)
   - Task type (code/text/image)
   - Engine availability
   - Performance metrics
3. **Process request** → Use selected engine
4. **Fallback if needed** → Try alternative engines
5. **Cache result** → Store for future requests

### Caching Strategy

**Smart Caching:**
- Automatically caches all responses
- 1-hour TTL by default
- Max 1000 entries
- MD5 hash keys for efficiency

**Cache Hit Rate:**
- Typical: 20-40% for general use
- High: 60-80% for repetitive tasks

### Performance Monitoring

Track engine performance in real-time:

```bash
curl http://localhost:3001/api/ai/stats
```

Shows:
- Engine usage distribution
- Average response times
- Cache effectiveness
- Total requests processed

---

## 📚 Configuration

### Main Configuration File

All integration settings are in `genspark-integration.config.js`:

```javascript
module.exports = {
  platform: {
    mode: 'hybrid' // 'offline', 'online', 'hybrid'
  },
  
  aiEngines: {
    gguf: {
      enabled: true,
      defaultModel: 'tinyllama'
    },
    primary: {
      offline: { enabled: true },
      online: { enabled: true }
    },
    fallback: {
      enabled: true,
      order: ['gguf', 'offline', 'online']
    }
  },
  
  sync: {
    strategy: 'adaptive',
    cache: {
      enabled: true,
      maxSize: 1000,
      ttl: 3600000
    }
  }
}
```

### Environment Variables

Create `.env` file for API keys (optional):

```bash
# Server
PORT=3001
NODE_ENV=development
DEV_MODE=true
AI_MODE=hybrid

# AI Providers (for online mode)
GOOGLE_AI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

---

## 🎯 Use Cases

### 1. Pure Offline Development

**Scenario:** Working on secure/airgapped system

```bash
# Set offline mode
AI_MODE=offline npm run platform

# Or in code
await aiEngine.setMode('offline');
```

**Benefits:**
- Complete privacy
- No internet needed
- Consistent performance
- Zero API costs

### 2. Hybrid Development (Recommended)

**Scenario:** Normal development workflow

```bash
# Default hybrid mode
npm run platform
```

**Benefits:**
- Best of both worlds
- Automatic optimization
- Smart fallbacks
- Cost effective

### 3. Cloud-Powered Development

**Scenario:** Need latest AI features

```bash
# Online mode with API keys
AI_MODE=online npm run platform
```

**Benefits:**
- Latest AI models
- Advanced features
- Multi-modal support
- Real-time web data

---

## 🔍 Troubleshooting

### GGUF Models Not Working

**Problem:** GGUF engine not initializing

**Solution:**
1. Check models directory exists: `ls -la models/`
2. Verify model files: `ls -lh models/*.gguf`
3. Check llama.cpp binary: `./bin/llama.cpp --version`
4. Review logs for specific errors

### Port Already in Use

**Problem:** Port 3001 already in use

**Solution:**
```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=3002
```

### Dependencies Not Installing

**Problem:** npm install fails

**Solution:**
```bash
# Use legacy peer deps
npm install --legacy-peer-deps

# Skip install scripts
npm install --ignore-scripts

# Clean and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### AI Engine Not Responding

**Problem:** AI requests timeout or fail

**Solution:**
1. Check AI engine status: `GET /api/ai/stats`
2. Try different mode: `POST /api/ai/mode` with `{"mode": "offline"}`
3. Clear cache: `POST /api/ai/cache/clear`
4. Restart server

---

## 📊 Performance Optimization

### Response Time Targets

- Text generation: < 2000ms
- Code generation: < 1500ms
- Image generation: < 5000ms
- Web search: < 1000ms
- Document processing: < 1000ms

### Tips for Better Performance

1. **Use GGUF models** for code generation (fastest)
2. **Enable caching** for repeated queries
3. **Choose smaller models** for quick responses
4. **Use offline mode** when privacy matters
5. **Limit context size** for faster processing

---

## 🚀 Next Steps

1. **Install GGUF models** for best offline experience
2. **Configure API keys** for online features (optional)
3. **Build desktop apps** for your platform
4. **Explore API endpoints** with examples
5. **Customize configuration** for your needs

---

## 📖 Additional Resources

- [GGUF Models Hub](https://huggingface.co/models?search=gguf)
- [llama.cpp Documentation](https://github.com/ggerganov/llama.cpp)
- [Transformers.js Guide](https://huggingface.co/docs/transformers.js)
- [Electron Builder Docs](https://www.electron.build/)

---

## ✅ Summary

The GenSpark 2.0 Platform provides:

✅ **Unified Integration** - All features work together seamlessly
✅ **GGUF Support** - Fast offline AI with llama.cpp
✅ **Cross-Platform** - Linux, Windows, macOS builds
✅ **Smart Syncing** - Automatic offline-online switching
✅ **High Performance** - Optimized for speed and efficiency
✅ **Complete Privacy** - 100% offline capable
✅ **Flexible Deployment** - Web, desktop, or Docker

**Start building with GenSpark 2.0 today!** 🎉
