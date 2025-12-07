# 🚀 GenSpark 2.0 Unified - Quick Start Guide

## Get Started in 3 Minutes!

### Step 1: Navigate to Directory

```bash
cd genspark-2.0
```

### Step 2: Verify Integration (Optional)

```bash
./verify-integration.sh
```

You should see: ✅ Passed: 43 | ❌ Failed: 0

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start the Server

```bash
npm start
```

### Step 5: Open Your Browser

Navigate to: **http://localhost:3000**

---

## 🎯 What You'll See

### The Interface Has 4 Modes:

1. **💬 Chat Mode**
   - Full ChatGPT 2.0 UNRESTRICTED experience
   - Unlimited conversations
   - Export/import functionality
   - Real-time streaming

2. **💻 Code Mode**
   - AI-powered code completion
   - Real-time suggestions
   - Code analysis and refactoring
   - Monaco editor (VS Code experience)

3. **📊 Workspace Mode**
   - AI Slides creator
   - Document editor
   - Spreadsheet tools
   - Graphic designer

4. **🎨 Media Mode**
   - Image generation
   - Video creation
   - Audio synthesis
   - GIF animation

---

## 📡 Testing the API

### Check Health

```bash
curl http://localhost:3000/health
```

Expected:
```json
{
  "status": "healthy",
  "services": {
    "ai": true,
    "media": true,
    "auth": true,
    "vectordb": true
  }
}
```

### Chat with AI

```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, GenSpark!", "mode": "offline"}'
```

### Complete Code

```bash
curl -X POST http://localhost:3000/api/code/complete \
  -H "Content-Type: application/json" \
  -d '{"code": "function hello", "language": "javascript"}'
```

---

## 🔧 Configuration (Optional)

### Create Environment File

```bash
cp .env.example .env
```

### Edit Configuration

```bash
nano .env
```

Key settings:
```env
PORT=3000
AI_MODE=hybrid     # offline, online, hybrid
ENABLE_CHAT=true
ENABLE_CODE_ASSISTANT=true
ENABLE_WORKSPACE=true
ENABLE_MEDIA_GEN=true
```

---

## 🖥️ Desktop Application

### Development Mode

```bash
npm run electron:dev
```

### Build for Linux

```bash
npm run electron:build:linux
```

Outputs:
- `GenSpark-2.0-*.AppImage` (portable)
- `genspark-2-0_*.deb` (Debian/Ubuntu)
- `genspark-2-0-*.rpm` (Fedora/RHEL)

---

## 🐳 Docker Deployment

### Quick Start

```bash
docker-compose up -d
```

### View Logs

```bash
docker-compose logs -f
```

### Stop

```bash
docker-compose down
```

---

## ⚡ Quick Commands

```bash
# Development
npm run unified          # Start server + frontend
npm run server           # Server only
npm run dev              # Frontend only

# Desktop
npm run electron:dev     # Desktop development
npm run electron:build   # Build desktop app

# Docker
docker-compose up -d     # Start in background
docker-compose logs -f   # View logs
docker-compose down      # Stop
```

---

## 🎓 Learning Path

### Day 1: Basic Usage
1. ✅ Start the server
2. ✅ Try Chat mode
3. ✅ Try Code mode
4. ✅ Test API endpoints

### Day 2: Advanced Features
1. ✅ Configure .env
2. ✅ Try Workspace mode
3. ✅ Try Media generation
4. ✅ Explore all AI engines

### Day 3: Deployment
1. ✅ Build desktop app
2. ✅ Try Docker deployment
3. ✅ Configure for production
4. ✅ Set up reverse proxy

---

## 🆘 Common Issues

### Port Already in Use

```bash
# Use different port
PORT=3001 npm start
```

### Dependencies Won't Install

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Server Won't Start

```bash
# Check logs
npm start 2>&1 | tee server.log

# Check if process is running
ps aux | grep node
```

---

## 📚 Documentation

- **README-UNIFIED.md** - Complete feature list
- **INSTALL-UNIFIED.md** - Detailed installation
- **MIGRATION-GUIDE.md** - Migrating from root
- **INTEGRATION-SUMMARY.md** - Integration details

---

## 🎉 Success Indicators

You'll know everything is working when:

✅ Server starts on http://localhost:3000  
✅ Health check returns status: healthy  
✅ All 4 modes are accessible  
✅ AI chat responds  
✅ Code completion works  
✅ No error messages in console  

---

## 🚀 What's Next?

1. **Explore Features**
   - Try all 4 modes
   - Test different AI engines
   - Generate media
   - Use workspace tools

2. **Customize**
   - Edit .env for your needs
   - Configure AI providers
   - Set up themes
   - Add custom shortcuts

3. **Deploy**
   - Build desktop app
   - Set up Docker
   - Configure production
   - Share with team

---

## 💡 Pro Tips

- **Offline First**: Works 100% offline by default
- **API Keys Optional**: Only needed for online features
- **Keyboard Shortcuts**: Available in desktop app
- **Export Data**: Save conversations, projects, media
- **Zero Cost**: Everything is free forever

---

## 🎯 Goals for First Hour

- [ ] Start the server
- [ ] Access web interface
- [ ] Try Chat mode
- [ ] Complete some code
- [ ] Generate an image
- [ ] Read documentation
- [ ] Configure .env
- [ ] Test API endpoints

---

**Welcome to GenSpark 2.0 Unified!**  
**All Features. One Platform. Zero Cost. 100% Offline.** 🚀

For help: Check documentation or create an issue on GitHub
