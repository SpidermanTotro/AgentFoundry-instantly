# 🚀 GenSpark AI Developer

## **Next-Level Programming Tool**
### Live AI Responses • Real File Creation • 100% Offline • Developer Mimicry

---

## 🎯 What Is This?

**GenSpark AI Developer** is a revolutionary AI-powered development tool that:

✅ **Streams responses LIVE** - See AI code being generated in real-time, token by token  
✅ **Creates REAL files** - Actual files written to your system, not just text output  
✅ **100% Offline** - Uses local GGUF models (CodeLlama, DeepSeek, Llama 3)  
✅ **Mimics human developers** - Plans, researches, tests, explains decisions  
✅ **Auto-uploads to GitHub** - Optional automatic git commits  
✅ **WebSocket streaming** - Ultra-fast live updates (<100ms latency)  
✅ **Complete projects** - Build entire applications from a single description  

---

## 💡 Why Is This Revolutionary?

### 🔥 **LIVE Streaming AI**
Unlike ChatGPT or other tools that show results after completion, this streams **every single token** as it's generated. You see the AI "thinking" in real-time.

### 📁 **REAL File Creation**
This doesn't just show you code - it **actually writes files** to your disk:
```javascript
// Writes REAL files like:
output/my-app/src/index.js
output/my-app/package.json
output/my-app/README.md
```

### 🧠 **Developer Mimicry**
The AI acts like a senior developer:
- Plans the project architecture
- Asks clarifying questions
- Explains its decisions
- Writes tests automatically
- Generates documentation
- Commits to git

### 🔌 **100% Offline**
Uses local GGUF models via llama.cpp - no API keys, no internet required, no data sent to cloud.

---

## 🚀 Quick Start

### 1. **Install Dependencies**

```bash
npm install
```

### 2. **Download AI Model** (Choose one)

**Option A: TinyLlama (Fastest, smallest - 670MB)**
```bash
mkdir -p models
cd models
wget https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf
cd ..
```

**Option B: CodeLlama 13B (Best for coding - 7.6GB)**
```bash
mkdir -p models
cd models
wget https://huggingface.co/TheBloke/CodeLlama-13B-Instruct-GGUF/resolve/main/codellama-13b-instruct.Q4_K_M.gguf
cd ..
```

**Option C: DeepSeek Coder 33B (Elite coding AI - 19GB)**
```bash
mkdir -p models
cd models
wget https://huggingface.co/TheBloke/deepseek-coder-33b-instruct-GGUF/resolve/main/deepseek-coder-33b-instruct.Q4_K_M.gguf
cd ..
```

### 3. **Start the Server**

```bash
npm start
```

Server will start on `http://localhost:3003`

### 4. **Open the Web UI**

Open your browser to: `http://localhost:3003`

### 5. **Load the AI Model**

```bash
curl -X POST http://localhost:3003/api/ai/load \
     -H "Content-Type: application/json" \
     -d '{"model": "tinyllama"}'
```

### 6. **Build Your First Project!**

In the web UI, type:
```
Build me a REST API server with Express
```

Watch as the AI:
- Plans the architecture
- Generates files in real-time
- Creates tests
- Writes documentation
- Saves everything to `output/`

---

## 📚 Features

### 🤖 **AI Features**

| Feature | Description |
|---------|-------------|
| **Live Streaming** | Real-time token-by-token generation |
| **Code Completion** | Intelligent autocomplete for any language |
| **Bug Fixing** | Automatic bug detection and fixing |
| **Refactoring** | Smart code refactoring with explanations |
| **Test Generation** | Auto-generate unit tests (100% coverage) |
| **Documentation** | Auto-generate README, JSDoc, docstrings |

### 📁 **File System Features**

| Feature | Description |
|---------|-------------|
| **Real File Creation** | Writes actual files to disk |
| **Multi-file Projects** | Generate entire project structures |
| **File Watching** | Monitor file changes in real-time |
| **Git Integration** | Auto-commit and upload to GitHub |
| **File History** | Track all files created |

### 👨‍💻 **Developer Features**

| Feature | Description |
|---------|-------------|
| **Project Planning** | AI plans the architecture |
| **Multi-phase Building** | Planning → Architecture → Implementation → Testing |
| **Progress Updates** | Live updates on what AI is doing |
| **Decision Explanations** | AI explains why it made certain choices |
| **Question Asking** | AI asks clarifying questions |

---

## 🌐 API Reference

### **WebSocket API** (Live Streaming)

Connect to: `ws://localhost:3003`

#### **Chat with Streaming**
```javascript
ws.send(JSON.stringify({
    type: 'chat',
    prompt: 'Explain recursion'
}));

// Receive:
// { type: 'token', token: 'R', full: 'R' }
// { type: 'token', token: 'e', full: 'Re' }
// { type: 'token', token: 'c', full: 'Rec' }
// ...
// { type: 'done', full: 'Recursion is...' }
```

#### **Build Project**
```javascript
ws.send(JSON.stringify({
    type: 'buildProject',
    description: 'Create a React todo app',
    options: {
        name: 'todo-app',
        language: 'javascript',
        includeTests: true,
        includeDocs: true
    }
}));

// Receive:
// { type: 'phase', phase: 'planning', status: 'started' }
// { type: 'thinking', text: '...', type: 'planning' }
// { type: 'phase', phase: 'implementation', status: 'started' }
// { type: 'generating', file: 'src/App.js', status: 'started' }
// { type: 'codeStream', file: 'src/App.js', token: '...' }
// { type: 'buildComplete', files: [...] }
```

### **REST API**

#### **Load AI Model**
```bash
POST /api/ai/load
{
  "model": "codellama-13b"  # or "tinyllama", "mistral-7b", etc.
}
```

#### **Chat (Non-streaming)**
```bash
POST /api/ai/chat
{
  "message": "What is React?"
}
```

#### **Code Completion**
```bash
POST /api/code/complete
{
  "code": "function add(a, b) {",
  "cursorPosition": 20,
  "language": "javascript"
}
```

#### **Fix Bugs**
```bash
POST /api/code/fix
{
  "code": "const x = y + 1;",
  "error": "ReferenceError: y is not defined",
  "language": "javascript"
}
```

#### **Generate Tests**
```bash
POST /api/code/tests
{
  "code": "function add(a, b) { return a + b; }",
  "language": "javascript",
  "framework": "jest"
}
```

#### **Create File**
```bash
POST /api/files/create
{
  "path": "src/index.js",
  "content": "console.log('Hello World');",
  "autoUpload": true
}
```

#### **List Files**
```bash
GET /api/files?directory=src
```

---

## 🔧 Configuration

### **Available Models**

| Model | Size | Speed | Use Case |
|-------|------|-------|----------|
| **TinyLlama 1.1B** | 670MB | ⚡ Ultra Fast | Quick tasks, testing |
| **Mistral 7B** | 4.4GB | ⚡⚡ Fast | General coding |
| **Llama 3 8B** | 4.9GB | ⚡⚡ Fast | Strong reasoning |
| **CodeLlama 13B** | 7.6GB | ⚡⚡⚡ Medium | Best for code |
| **DeepSeek 33B** | 19GB | ⚡⚡⚡⚡ Slow | Elite coding AI |

### **System Requirements**

| Model | RAM | CPU | Recommended |
|-------|-----|-----|-------------|
| TinyLlama | 2GB | 2 cores | Testing only |
| Mistral/Llama 3 | 8GB | 4 cores | Good balance |
| CodeLlama 13B | 16GB | 8 cores | **Recommended** |
| DeepSeek 33B | 32GB | 16 cores | Production |

---

## 💰 Cost Comparison

### **GenSpark AI Developer: $0**

**vs. Competitors:**

| Service | Cost/Year | GenSpark Saves |
|---------|-----------|----------------|
| GitHub Copilot | $100 | $100 |
| ChatGPT Plus | $240 | $240 |
| Cursor AI | $240 | $240 |
| Tabnine Pro | $120 | $120 |
| Codeium Pro | $180 | $180 |
| Replit AI | $300 | $300 |
| **TOTAL** | **$1,180/year** | **$1,180/year** |

**GenSpark AI Developer is FREE, FOREVER, 100% OFFLINE**

---

## 🎯 Use Cases

### **1. Build Complete Projects**
```
"Create a full-stack e-commerce site with React, Node.js, and MongoDB"
```
→ Generates 25+ files, complete app in 5 minutes

### **2. Debug Code**
```
"Fix this bug: [paste code and error]"
```
→ AI explains the problem and provides fixed code

### **3. Learn Programming**
```
"Explain how async/await works in JavaScript"
```
→ Detailed explanations with examples

### **4. Generate Tests**
```
"Write tests for this function: [paste code]"
```
→ Comprehensive test suite with edge cases

### **5. Refactor Code**
```
"Refactor this code to use modern ES6 syntax"
```
→ Improved, cleaner code

---

## 🛠️ Development

### **Project Structure**
```
genspark-ai-developer/
├── src/
│   ├── ai/
│   │   └── gguf-engine.js      # GGUF AI engine with streaming
│   ├── file-system/
│   │   └── file-manager.js     # Real file creation & git
│   ├── developer/
│   │   └── developer-ai.js     # Developer mimicry system
│   └── server.js               # Main server with WebSocket
├── public/
│   └── index.html              # Web UI
├── models/                     # GGUF models go here
├── output/                     # Generated files go here
├── package.json
└── README.md
```

### **Run Tests**
```bash
npm test
```

### **Development Mode** (with auto-reload)
```bash
npm run dev
```

---

## 🚀 Roadmap

- [x] Live streaming AI responses
- [x] Real file creation
- [x] 100% offline with GGUF models
- [x] Developer mimicry (planning, testing, docs)
- [x] WebSocket API
- [x] Web UI
- [ ] VS Code extension
- [ ] Desktop app (Electron)
- [ ] Multi-language support (Python, TypeScript, Go, Rust)
- [ ] GPU acceleration
- [ ] Cloud model support (optional)
- [ ] Collaborative coding (multi-user)

---

## 📝 License

MIT - Free to use, modify, distribute

---

## 🙏 Credits

Built with:
- **node-llama-cpp** - GGUF model support
- **Express** - Web server
- **ws** - WebSocket server
- **chokidar** - File watching

Models from:
- **Meta** - Llama 3, CodeLlama
- **Mistral AI** - Mistral
- **DeepSeek** - DeepSeek Coder
- **TheBloke** - GGUF quantizations

---

## 🔗 Links

- **GitHub**: [genspark-ai-developer](https://github.com/SpidermanTotro/AgentFoundry-instantly)
- **Issues**: [Report bugs](https://github.com/SpidermanTotro/AgentFoundry-instantly/issues)
- **Discussions**: [Community](https://github.com/SpidermanTotro/AgentFoundry-instantly/discussions)

---

## 🎉 **READY TO CODE WITH AI?**

```bash
npm install
npm start
```

Then open: `http://localhost:3003`

**Welcome to the future of programming.** 🚀
