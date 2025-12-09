# Installation Guide - ChatGPT 2.0 Unified Platform

Complete guide to download, install, and run the unified ChatGPT 2.0, Kimi AI, and GenSpark platform.

---

## 📥 Quick Download & Install

### Option 1: Download ZIP (Easiest)

1. **Download the repository:**
   - Go to: https://github.com/SpidermanTotro/AgentFoundry-instantly
   - Click the green **"Code"** button
   - Select **"Download ZIP"**
   - Extract the ZIP file to your desired location

2. **Install dependencies:**
   ```bash
   cd AgentFoundry-instantly
   npm install
   ```

3. **Start the platform:**
   ```bash
   npm run server
   ```

4. **Access the platform:**
   - Open browser: http://localhost:3001
   - API endpoint: http://localhost:3001/api/unified/health

---

### Option 2: Clone with Git

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SpidermanTotro/AgentFoundry-instantly.git
   cd AgentFoundry-instantly
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the platform:**
   ```bash
   npm run server
   ```

---

## 🔧 System Requirements

### Minimum Requirements
- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher
- **RAM**: 2GB minimum, 4GB recommended
- **Disk Space**: 500MB for installation
- **OS**: Windows 10+, macOS 10.15+, Linux (Ubuntu 18.04+)

### Check your versions:
```bash
node --version
npm --version
```

If you don't have Node.js installed:
- **Windows/Mac**: Download from https://nodejs.org/
- **Linux**: `sudo apt install nodejs npm`

---

## 📦 What Gets Installed

When you run `npm install`, these dependencies are installed:

**Core Dependencies:**
- `express` - Web server
- `mathjs` - Mathematical computation (for Kimi AI)
- `sqlite3` - Persistent memory storage
- `axios` - HTTP client for web browsing
- `mammoth` - DOCX document processing
- `pdf-parse` - PDF document processing

**Optional (for full features):**
- OpenAI API key (for ChatGPT/GenSpark engines)
- Internet connection (for web search)

---

## ⚙️ Configuration

### 1. Environment Variables (Optional)

Create a `.env` file in the root directory:

```bash
# API Keys (optional - platform works without them)
OPENAI_API_KEY=your_openai_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# Database
DB_PATH=./data/chatgpt2.db

# Logging
LOG_LEVEL=info
```

### 2. First Run Setup

On first run, the platform will:
- Create necessary directories (`/data`, `/logs`)
- Initialize SQLite database
- Set up unified orchestrator
- Start all 4 AI engines

You'll see:
```
✅ UnifiedAIOrchestrator initialized
✅ ChatGPT 2.0 engine ready
✅ Kimi AI engine ready
✅ GenSpark AI engine ready
✅ Local AI engine ready
🚀 Server running on http://localhost:3001
```

---

## 🚀 Usage After Installation

### Test the Installation

**1. Check health:**
```bash
curl http://localhost:3001/api/unified/health
```

**2. Get capabilities:**
```bash
curl http://localhost:3001/api/unified/capabilities
```

**3. Send a test message:**
```bash
curl -X POST http://localhost:3001/api/unified/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!", "personality": "unrestricted"}'
```

### Access the Platform

**Web Interface:**
- Main page: http://localhost:3001
- API docs: See `UNIFIED_INTEGRATION_EXAMPLES.md`

**API Endpoints:**
- `/api/unified/chat` - Chat with any personality
- `/api/unified/auto` - Auto-routing based on task
- `/api/unified/long-context` - Long conversations (200K tokens)
- `/api/unified/analyze-document` - PDF/DOCX analysis
- `/api/unified/calculate` - Math computation
- `/api/unified/web-search` - Web browsing
- `/api/unified/execute-code` - Code execution
- `/api/unified/github` - GitHub integration
- `/api/unified/file-operation` - File system access

---

## 📂 Directory Structure After Installation

```
AgentFoundry-instantly/
├── server/
│   ├── index.js                    # Main server
│   ├── ai-engine/
│   │   ├── UnifiedAIOrchestrator.js  # Orchestrator
│   │   ├── KimiAI.js                 # Kimi AI engine
│   │   └── ChatGPT2_Unrestricted.js  # ChatGPT 2.0 engine
│   └── routes/
│       └── unified.js                # Unified API routes
├── tests/
│   └── unified-integration.test.js   # Integration tests
├── data/                             # Created on first run
│   └── chatgpt2.db                   # SQLite database
├── logs/                             # Created on first run
│   └── server.log                    # Server logs
├── node_modules/                     # Dependencies (after npm install)
├── package.json                      # Project configuration
├── INSTALLATION.md                   # This file
├── UNIFIED_PLATFORM_GUIDE.md         # Platform guide
├── UNIFIED_INTEGRATION_EXAMPLES.md   # API examples
└── README.md                         # Project overview
```

---

## 🧪 Verify Installation

Run the integration tests:

```bash
node tests/unified-integration.test.js
```

Expected output:
```
✅ Health check passed
✅ Capabilities check passed
✅ Long context processing passed
✅ Document analysis passed
✅ Math computation passed
✅ Auto-routing passed
✅ Web search passed
✅ Code execution passed
✅ GitHub integration passed
✅ File operations passed

🎉 All 10 tests passed!
```

---

## 🔒 Security Notes

**What's Installed:**
- ✅ Safe code execution (vm module with sandboxing)
- ✅ No telemetry or tracking
- ✅ All data stored locally
- ✅ No cloud dependencies

**Privacy:**
- All AI processing happens on your machine
- No data sent to external servers (unless using OpenAI API)
- Full offline mode available
- Self-hosted and open source

---

## 🐛 Troubleshooting

### Installation Issues

**Problem: `npm install` fails**
```bash
# Solution 1: Clear cache
npm cache clean --force
npm install

# Solution 2: Use legacy peer deps
npm install --legacy-peer-deps

# Solution 3: Update npm
npm install -g npm@latest
```

**Problem: Port 3001 already in use**
```bash
# Change port in .env file
PORT=3002

# Or kill the process using port 3001
# Windows:
netstat -ano | findstr :3001
taskkill /PID <process_id> /F

# Mac/Linux:
lsof -ti:3001 | xargs kill -9
```

**Problem: Permission errors**
```bash
# Windows: Run as Administrator
# Mac/Linux: Use sudo for global installs
sudo npm install -g npm
```

### Runtime Issues

**Problem: Server won't start**
- Check Node.js version: `node --version` (need v14+)
- Check for errors in console
- Verify all dependencies installed: `npm install`

**Problem: Database errors**
- Delete `data/chatgpt2.db` and restart
- Ensure write permissions in `/data` folder

**Problem: Module not found**
- Run `npm install` again
- Check `node_modules` folder exists
- Try: `npm install --save mathjs`

---

## 📚 Next Steps

After installation:

1. **Read the Platform Guide:** `UNIFIED_PLATFORM_GUIDE.md`
2. **Try the Examples:** `UNIFIED_INTEGRATION_EXAMPLES.md`
3. **Run Tests:** `TESTING_GUIDE.md`
4. **Check Features:** `CHATGPT2_FEATURES_COMPARISON.md`
5. **See Improvements:** `WHY_UNIFIED_IS_BETTER.md`
6. **Future Updates:** `FUTURE_UPDATES_ROADMAP.md`

---

## 🆘 Getting Help

**Documentation:**
- Platform Guide: `UNIFIED_PLATFORM_GUIDE.md`
- API Examples: `UNIFIED_INTEGRATION_EXAMPLES.md`
- Testing Guide: `TESTING_GUIDE.md`

**Issues:**
- GitHub Issues: https://github.com/SpidermanTotro/AgentFoundry-instantly/issues
- Check existing issues first
- Provide error logs and system info

---

## 🎯 Quick Start Checklist

- [ ] Download/clone repository
- [ ] Install Node.js (v14+)
- [ ] Run `npm install`
- [ ] Run `npm run server`
- [ ] Test with `curl http://localhost:3001/api/unified/health`
- [ ] Run integration tests: `node tests/unified-integration.test.js`
- [ ] Read `UNIFIED_PLATFORM_GUIDE.md`
- [ ] Try examples from `UNIFIED_INTEGRATION_EXAMPLES.md`

---

## ✅ Installation Complete!

You now have:
- ✅ ChatGPT 2.0 Unified Platform installed
- ✅ All 4 AI engines (ChatGPT 2.0, Kimi, GenSpark, Local)
- ✅ Unified orchestrator with intelligent routing
- ✅ All 6 personalities available
- ✅ Document analysis (PDF, DOCX)
- ✅ Math computation
- ✅ 200K token context
- ✅ Web browsing
- ✅ GitHub integration
- ✅ File system access
- ✅ Code execution
- ✅ Zero restrictions
- ✅ 100% offline capable

**Start using:**
```bash
npm run server
# Open: http://localhost:3001
```

**API usage:**
```bash
curl -X POST http://localhost:3001/api/unified/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!", "personality": "unrestricted"}'
```

---

**Version:** 1.0.0  
**Status:** Production Ready  
**License:** Open Source  
**Support:** Self-hosted, offline, free forever
