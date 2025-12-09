# GenSpark 2.0 Unified - Installation Guide

## 🚀 Complete Integration of All AgentFoundry Features

This guide covers installing and running the GenSpark 2.0 Unified platform with ALL features from the AgentFoundry-instantly repository integrated.

---

## 📋 Prerequisites

### System Requirements
- **OS**: Linux, macOS, or Windows
- **Node.js**: >= 16.0.0
- **RAM**: 4GB minimum (8GB recommended for AI features)
- **Disk Space**: 2GB minimum (more for AI models)

### Optional (for specific features)
- **Python 3.8+**: For advanced AI models
- **FFmpeg**: For video/audio processing (auto-installed)
- **Docker**: For containerized deployment

---

## 🔧 Installation Methods

### Method 1: Quick Install (Recommended)

#### Linux / macOS
```bash
# Navigate to GenSpark 2.0 directory
cd genspark-2.0

# Install dependencies
npm install

# Start the unified server
npm start
```

#### Windows
```powershell
# Navigate to GenSpark 2.0 directory
cd genspark-2.0

# Install dependencies
npm install

# Start the unified server
npm start
```

### Method 2: Development Setup

```bash
cd genspark-2.0

# Install all dependencies
npm install

# Run frontend and backend together
npm run unified

# Or run separately:
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

### Method 3: Docker Deployment

```bash
cd genspark-2.0

# Build and run with Docker Compose
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop
docker-compose down
```

### Method 4: Desktop Application

```bash
cd genspark-2.0

# Install dependencies
npm install

# Development mode (with live reload)
npm run electron:dev

# Build production packages
npm run electron:build:linux    # Linux only
npm run electron:build:all      # All formats (AppImage, DEB, RPM)
```

---

## ⚙️ Configuration

### 1. Environment Setup

Copy the example environment file:
```bash
cd genspark-2.0
cp .env.example .env
```

### 2. Configure Settings

Edit `.env` file:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# AI Mode
AI_MODE=hybrid  # Options: offline, online, hybrid

# Online AI Providers (Optional)
GOOGLE_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
COHERE_API_KEY=your_key_here

# Enable/Disable Features
ENABLE_WORKSPACE=true
ENABLE_MEDIA_GEN=true
ENABLE_CODE_ASSISTANT=true
ENABLE_CHAT=true
```

### 3. Feature Configuration

The unified server loads all features automatically. You can enable/disable specific features in the `.env` file.

---

## 🎯 Running the Application

### Web Interface

```bash
# Start server
cd genspark-2.0
npm start

# Access at:
# http://localhost:3000
```

### Desktop Application

```bash
# Run in development
npm run electron:dev

# Or use the built application
./dist-electron/GenSpark-2.0-*.AppImage  # Linux
```

---

## 🧪 Testing the Integration

### 1. Check Server Status

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "healthy",
  "services": {
    "ai": true,
    "media": true,
    "auth": true,
    "vectordb": true,
    "websocket": true
  }
}
```

### 2. Test AI Engines

```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, test AI engines", "mode": "offline"}'
```

### 3. Test Code Intelligence

```bash
curl -X POST http://localhost:3000/api/code/complete \
  -H "Content-Type: application/json" \
  -d '{"code": "function hello", "language": "javascript"}'
```

### 4. View Available Features

```bash
curl http://localhost:3000/
```

---

## 📊 Feature Verification

After installation, verify all features are working:

### Web Interface
1. **Chat Mode** - Test AI conversations
2. **Code Mode** - Test code completion
3. **Workspace Mode** - Check workspace tools
4. **Media Mode** - Verify media generation

### API Endpoints
- `/api/ai/chat` - AI conversations
- `/api/code/complete` - Code completion
- `/api/media/image/generate` - Image generation
- `/api/workspace/slides/create` - Slides creation

---

## 🔍 Troubleshooting

### Issue: Dependencies fail to install

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Issue: Server won't start

**Solution:**
```bash
# Check if port is already in use
lsof -i :3000  # Linux/Mac
netstat -ano | findstr :3000  # Windows

# Use a different port
PORT=3001 npm start
```

### Issue: AI engines not loading

**Solution:**
- Check that parent directories exist (../../server/ai-engine/)
- Verify .env configuration
- Check console for specific error messages

### Issue: Media generation fails

**Solution:**
```bash
# Ensure FFmpeg is installed
ffmpeg -version

# Install if missing
# Ubuntu/Debian
sudo apt-get install ffmpeg

# macOS
brew install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html
```

### Issue: Electron app won't build

**Solution:**
```bash
# Install build dependencies
# Ubuntu/Debian
sudo apt-get install build-essential

# Rebuild native modules
npm rebuild

# Try building again
npm run electron:build:linux
```

---

## 🔄 Updating

### Update from Git

```bash
cd genspark-2.0
git pull origin main
npm install
npm start
```

### Update Dependencies

```bash
npm update
npm audit fix
```

---

## 📦 Building for Distribution

### Linux Packages

```bash
# AppImage (portable)
npm run electron:build:appimage

# DEB (Debian/Ubuntu)
npm run electron:build:deb

# RPM (Fedora/RHEL)
npm run electron:build:rpm

# All formats
npm run electron:build:all
```

Output files will be in `dist-electron/`

### Windows Packages

```bash
npm run electron:build:win
```

### macOS Packages

```bash
npm run electron:build:mac
```

---

## 🌐 Network Configuration

### Firewall Rules

Allow port 3000 (or your configured port):

```bash
# Ubuntu/Debian
sudo ufw allow 3000

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

### Reverse Proxy (Optional)

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔒 Security Considerations

### Production Deployment

1. **Change JWT Secret**
   ```env
   JWT_SECRET=your-strong-secret-here
   ```

2. **Restrict CORS**
   ```env
   CORS_ORIGIN=https://your-domain.com
   ```

3. **Enable HTTPS** (use reverse proxy)

4. **Firewall Configuration** (restrict access)

---

## 📚 Additional Resources

- **README-UNIFIED.md** - Complete feature documentation
- **API Documentation** - Available at http://localhost:3000/
- **GitHub Issues** - Report bugs and request features

---

## ✅ Next Steps

After installation:

1. **Explore the UI** - Try all 4 modes (Chat, Code, Workspace, Media)
2. **Configure Features** - Edit .env for your needs
3. **Test AI Engines** - Verify all AI capabilities
4. **Generate Media** - Try image, video, audio, GIF generation
5. **Use Workspace Tools** - Create slides, docs, sheets

---

## 🆘 Getting Help

If you encounter issues:

1. Check this installation guide
2. Review README-UNIFIED.md
3. Check console logs for errors
4. Search GitHub Issues
5. Create a new issue with details

---

**Enjoy GenSpark 2.0 Unified - All Features in ONE Platform!** 🚀
