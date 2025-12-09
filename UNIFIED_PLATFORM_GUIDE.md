# 🚀 GenSpark 2.0 Unified Platform - Complete Integration Guide

## Overview

**GenSpark 2.0 Unified** brings together the best capabilities from three powerful AI systems:

- **ChatGPT 2.0 UNRESTRICTED** - Unrestricted chat, GitHub integration, file operations
- **Kimi AI** - Ultra-long context (200K tokens), document analysis, mathematical computation
- **GenSpark AI** - Multi-modal generation, workspace suite, online/offline hybrid

This integration provides a **complete, unified AI platform** with intelligent routing that automatically selects the best engine for each task.

---

## 🎯 Key Features

### From ChatGPT 2.0
- ✅ **Unrestricted Chat** - No content filters or restrictions
- ✅ **GitHub Integration** - Full repository management
- ✅ **File System Access** - Read and write files locally
- ✅ **Code Execution** - Direct code interpretation
- ✅ **Persistent Memory** - Never forgets conversations
- ✅ **Unlimited Context** - No token limits

### From Kimi AI
- ✅ **Ultra-Long Context** - 200K+ token context window
- ✅ **Document Analysis** - PDF, DOCX, Excel processing
- ✅ **Mathematical Computation** - Advanced calculations
- ✅ **Advanced Web Search** - Context-aware search
- ✅ **Code Interpreter** - Multi-language execution
- ✅ **Multi-Language Support** - Native Chinese + English

### From GenSpark
- ✅ **Multi-Modal AI** - Text, images, audio, video
- ✅ **Image Generation** - Stable Diffusion, DALL-E
- ✅ **Video Generation** - AI-powered video creation
- ✅ **Audio Generation** - Text-to-speech, music
- ✅ **Workspace Suite** - Slides, Docs, Sheets, Designer
- ✅ **Online/Offline Hybrid** - Best of both worlds

### Unified Orchestration
- ✅ **Intelligent Routing** - Auto-detects best engine for each task
- ✅ **Automatic Fallback** - Seamless failover between engines
- ✅ **Capability Detection** - Knows what each engine can do
- ✅ **Unified API** - Single interface for all features
- ✅ **Performance Monitoring** - Real-time statistics

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Unified AI Orchestrator                      │
│          (Intelligent Routing & Coordination)                │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐   ┌───────▼────────┐   ┌───────▼────────┐
│  ChatGPT 2.0   │   │    Kimi AI     │   │  GenSpark AI   │
│  UNRESTRICTED  │   │                │   │                │
├────────────────┤   ├────────────────┤   ├────────────────┤
│ • Chat         │   │ • Long Context │   │ • Multi-Modal  │
│ • GitHub       │   │ • Documents    │   │ • Generation   │
│ • Files        │   │ • Math         │   │ • Workspace    │
│ • Memory       │   │ • Search       │   │ • Online AI    │
└────────────────┘   └────────────────┘   └────────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Local AI Engine  │
                    │  (Offline Mode)   │
                    └───────────────────┘
```

---

## 🚀 Quick Start

### 1. Installation

```bash
# Clone repository
git clone https://github.com/SpidermanTotro/AgentFoundry-instantly.git
cd AgentFoundry-instantly

# Install dependencies
npm install

# Install mathjs for Kimi's math capabilities
npm install mathjs
```

### 2. Configuration

Create a `.env` file (optional - works without API keys):

```bash
# AI Provider API Keys (Optional)
GOOGLE_API_KEY=your_google_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
COHERE_API_KEY=your_cohere_api_key

# GitHub Integration (Required for GitHub features)
GITHUB_TOKEN=your_github_personal_access_token

# Server Configuration
PORT=3001
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### 3. Start the Server

```bash
# Start backend server
npm run server

# Or start both frontend + backend
npm start
```

### 4. Verify Installation

```bash
# Check health
curl http://localhost:3001/api/health

# Check capabilities
curl http://localhost:3001/api/unified/capabilities

# Check statistics
curl http://localhost:3001/api/unified/stats
```

---

## 📡 API Endpoints

### Unified Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/unified/chat` | POST | Unified chat with intelligent routing |
| `/api/unified/long-context` | POST | Long context processing (Kimi) |
| `/api/unified/analyze-document` | POST | Document analysis (Kimi) |
| `/api/unified/compute-math` | POST | Mathematical computation (Kimi) |
| `/api/unified/web-search` | POST | Advanced web search (Kimi) |
| `/api/unified/github` | POST | GitHub operations (ChatGPT 2.0) |
| `/api/unified/file-operation` | POST | File system access (ChatGPT 2.0) |
| `/api/unified/execute-code` | POST | Code execution (Kimi + ChatGPT) |
| `/api/unified/generate-image` | POST | Image generation (GenSpark) |
| `/api/unified/auto` | POST | Auto-routing based on task |
| `/api/unified/capabilities` | GET | Get all capabilities |
| `/api/unified/stats` | GET | Get system statistics |
| `/api/unified/health` | GET | Health check |

---

## 💡 Usage Examples

### Example 1: Unified Chat

```javascript
const response = await fetch('http://localhost:3001/api/unified/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Explain quantum computing in simple terms',
    personality: 'assistant'
  })
});

const data = await response.json();
console.log(data.message);
console.log('Routed to:', data.metadata.engine);
```

### Example 2: Long Context Processing

```javascript
// Process 50 messages (would exceed normal context limits)
const messages = [];
for (let i = 0; i < 50; i++) {
  messages.push({ role: 'user', content: `Question ${i}` });
  messages.push({ role: 'assistant', content: `Answer ${i}` });
}

const response = await fetch('http://localhost:3001/api/unified/long-context', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages })
});

const data = await response.json();
console.log(`Processed ${data.tokenCount} tokens`);
```

### Example 3: Document Analysis

```javascript
const response = await fetch('http://localhost:3001/api/unified/analyze-document', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    filePath: './research-paper.pdf',
    options: {
      extractText: true,
      summarize: true
    }
  })
});

const data = await response.json();
console.log(`Document: ${data.wordCount} words`);
console.log(data.content);
```

### Example 4: Mathematical Computation

```javascript
const response = await fetch('http://localhost:3001/api/unified/compute-math', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    expression: 'sqrt(144) + log(100) * 5'
  })
});

const data = await response.json();
console.log(`Result: ${data.result}`);
```

### Example 5: Auto-Routing

```javascript
// Let the orchestrator choose the best engine
const tasks = [
  { description: 'Calculate 2^10 + sqrt(144)' },  // → Kimi
  { description: 'List GitHub repos' },           // → ChatGPT 2.0
  { description: 'Generate sunset image' }        // → GenSpark
];

for (const task of tasks) {
  const response = await fetch('http://localhost:3001/api/unified/auto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task })
  });
  
  const data = await response.json();
  console.log(`Task: ${task.description}`);
  console.log(`Routed to: ${data.metadata.engine}`);
  console.log(`Type: ${data.metadata.taskType}\n`);
}
```

---

## 🎯 Intelligent Routing

The orchestrator automatically routes tasks to the best engine based on:

### Task Type Detection

| Pattern | Routed To | Reason |
|---------|-----------|--------|
| `.pdf`, `.docx`, `document` | Kimi | Document analysis expertise |
| `calculate`, math expressions | Kimi | Mathematical computation |
| `github`, `repository`, `pull request` | ChatGPT 2.0 | GitHub integration |
| `read file`, `write file` | ChatGPT 2.0 | File system access |
| `image`, `generate picture` | GenSpark | Image generation |
| `video`, `animation` | GenSpark | Video generation |
| `search`, `find information` | Kimi | Advanced web search |
| Long message history (>20) | Kimi | Ultra-long context |
| Default chat | ChatGPT 2.0 | Unrestricted chat |

### Manual Override

You can specify which engine to use:

```javascript
const response = await fetch('http://localhost:3001/api/unified/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Hello',
    options: {
      preferredEngine: 'kimi',  // Force use of Kimi
      fallbackEnabled: true      // Enable fallback if Kimi fails
    }
  })
});
```

---

## 📊 Capabilities & Statistics

### Check Available Capabilities

```bash
curl http://localhost:3001/api/unified/capabilities
```

Response:
```json
{
  "success": true,
  "capabilities": {
    "orchestrator": {
      "version": "1.0.0",
      "unifiedEngines": 4,
      "initialized": true
    },
    "engines": {
      "chatgpt": {
        "unrestricted_chat": true,
        "github_integration": true,
        "file_operations": true,
        ...
      },
      "kimi": {
        "longContext": "200K+ tokens",
        "documentAnalysis": "PDF, DOCX, Excel",
        "mathComputation": "Advanced",
        ...
      },
      "genspark": {
        "multiModal": true,
        "imageGeneration": true,
        "videoGeneration": true,
        ...
      }
    }
  }
}
```

### Get System Statistics

```bash
curl http://localhost:3001/api/unified/stats
```

Response:
```json
{
  "success": true,
  "stats": {
    "orchestrator": {
      "totalEngines": 4,
      "activeEngines": 4,
      "capabilities": 15
    },
    "engines": {
      "kimi": {
        "contextSize": 50,
        "cachedDocuments": 5,
        "cachedSearches": 10,
        "utilizationPercent": "25.00"
      },
      ...
    }
  }
}
```

---

## 🧪 Testing

### Run Integration Tests

```bash
# Make sure server is running first
npm run server

# In another terminal, run tests
node tests/unified-integration.test.js
```

### Manual Testing

See [UNIFIED_INTEGRATION_EXAMPLES.md](./UNIFIED_INTEGRATION_EXAMPLES.md) for comprehensive examples.

---

## 🔧 Troubleshooting

### Issue: Orchestrator not initialized
**Solution**: Check server logs for initialization errors. Ensure all dependencies are installed.

### Issue: Math computation fails
**Solution**: Install mathjs: `npm install mathjs`

### Issue: Document analysis fails
**Solution**: Ensure the file path is correct and the file exists. Check file permissions.

### Issue: GitHub integration not working
**Solution**: Add `GITHUB_TOKEN` to your `.env` file with a valid GitHub personal access token.

### Issue: Engine-specific features not available
**Solution**: Check `/api/unified/capabilities` to see which engines are initialized and available.

---

## 📚 Documentation

- **[Integration Examples](./UNIFIED_INTEGRATION_EXAMPLES.md)** - Comprehensive API examples
- **[ChatGPT 2.0 Features](./CHATGPT2_UNRESTRICTED.md)** - ChatGPT capabilities
- **[GenSpark Features](./genspark-2.0/README.md)** - GenSpark capabilities
- **[Installation Guide](./INSTALL.md)** - Detailed installation instructions

---

## 🎓 Best Practices

1. **Use Auto-Routing** - Let the orchestrator choose the best engine
2. **Leverage Long Context** - Use Kimi for multi-turn conversations
3. **Cache Results** - Document and search results are automatically cached
4. **Monitor Stats** - Check `/stats` to track system performance
5. **Handle Errors** - Always check `success` field in responses
6. **Use Fallbacks** - Enable `fallbackEnabled` for critical operations
7. **Check Capabilities** - Query `/capabilities` before using features

---

## 🔐 Privacy & Security

- ✅ **100% Self-Hosted** - Your data stays on your machine
- ✅ **No Telemetry** - Zero tracking or analytics
- ✅ **Open Source** - Full source code available
- ✅ **Optional Cloud** - API keys are optional, not required
- ✅ **Encrypted Storage** - Persistent memory is secure
- ✅ **Audit Trail** - All operations are logged

---

## 🗺️ Roadmap

### Phase 1 (Current)
- [x] Unified orchestrator
- [x] ChatGPT 2.0 integration
- [x] Kimi AI integration
- [x] GenSpark integration
- [x] Intelligent routing
- [x] API endpoints
- [x] Documentation
- [x] Tests

### Phase 2 (Next)
- [ ] Real-time streaming for all engines
- [ ] Advanced caching strategies
- [ ] Load balancing across engines
- [ ] Custom routing rules
- [ ] Performance analytics dashboard
- [ ] Plugin system for custom engines

### Phase 3 (Future)
- [ ] Multi-user support
- [ ] Team collaboration features
- [ ] Advanced workflow automation
- [ ] Mobile app integration
- [ ] Cloud sync (optional)
- [ ] Enterprise features

---

## 🤝 Contributing

Contributions are welcome! Please see our contributing guidelines.

---

## 📄 License

MIT License - Free for any use

---

## 🎉 Conclusion

**GenSpark 2.0 Unified** is the most comprehensive AI platform available, combining:
- ChatGPT 2.0's unrestricted capabilities
- Kimi's ultra-long context and document processing
- GenSpark's multi-modal generation

All working together seamlessly with intelligent routing!

---

**Last Updated**: December 8, 2024  
**Version**: 1.0.0  
**Status**: ✅ Production Ready  

---

<div align="center">

**Built with ❤️ by the community, for the community**

🚀 **The Ultimate Unified AI Platform** 🚀

</div>
