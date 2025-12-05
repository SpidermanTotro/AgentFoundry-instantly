# 🚀 Installation Guide - Advanced Offline AI Copilot Pro

Complete installation instructions for all platforms: Linux, macOS, Windows, Docker, and Portable versions.

---

## 📋 Table of Contents

- [System Requirements](#system-requirements)
- [Quick Install](#quick-install)
- [Platform-Specific Installation](#platform-specific-installation)
  - [Linux](#-linux-installation)
  - [macOS](#-macos-installation)
  - [Windows](#-windows-installation)
  - [Docker](#-docker-installation)
- [Desktop Application](#desktop-application)
- [Portable Version](#portable-version)
- [Post-Installation](#post-installation)
- [Updating](#updating)
- [Uninstallation](#uninstallation)
- [Troubleshooting](#troubleshooting)

---

## 💻 System Requirements

### Minimum Requirements
- **OS**: Linux (Ubuntu 18.04+, Debian 10+, Fedora 30+, Arch), macOS 10.15+, Windows 10/11
- **RAM**: 2 GB
- **Disk Space**: 500 MB
- **Node.js**: 16.x or higher
- **npm**: 8.x or higher

### Recommended Requirements
- **RAM**: 4 GB or more
- **Disk Space**: 1 GB
- **Node.js**: 20.x LTS
- **CPU**: Multi-core processor

---

## ⚡ Quick Install

### One-Line Install (Linux/macOS)
```bash
curl -fsSL https://raw.githubusercontent.com/SpidermanTotro/AgentFoundry-instantly/main/install.sh | bash
```

### One-Line Install (Windows PowerShell - Run as Administrator)
```powershell
irm https://raw.githubusercontent.com/SpidermanTotro/AgentFoundry-instantly/main/install.ps1 | iex
```

---

## 🐧 Linux Installation

### Method 1: Automated Script (Recommended)

#### For Debian/Ubuntu:
```bash
# Download and run installer
curl -fsSL https://raw.githubusercontent.com/SpidermanTotro/AgentFoundry-instantly/main/install.sh -o install.sh
chmod +x install.sh
./install.sh
```

#### For Fedora:
```bash
# Download and run installer
curl -fsSL https://raw.githubusercontent.com/SpidermanTotro/AgentFoundry-instantly/main/install.sh -o install.sh
chmod +x install.sh
./install.sh
```

#### For Arch Linux:
```bash
# Download and run installer
curl -fsSL https://raw.githubusercontent.com/SpidermanTotro/AgentFoundry-instantly/main/install.sh -o install.sh
chmod +x install.sh
./install.sh
```

### Method 2: Manual Installation

```bash
# 1. Install Node.js (if not installed)
# Ubuntu/Debian:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Fedora:
sudo dnf install nodejs npm

# Arch:
sudo pacman -S nodejs npm

# 2. Clone repository
git clone https://github.com/SpidermanTotro/AgentFoundry-instantly.git
cd AgentFoundry-instantly

# 3. Install dependencies
npm install

# 4. Build application
npm run build

# 5. Create launcher
mkdir -p ~/.local/bin
cat > ~/.local/bin/copilot-pro << 'EOF'
#!/bin/bash
cd "${HOME}/AgentFoundry-instantly"
npm start
EOF
chmod +x ~/.local/bin/copilot-pro

# 6. Add to PATH (add to ~/.bashrc or ~/.zshrc)
echo 'export PATH="${HOME}/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Method 3: System Service (Systemd)

```bash
# Create systemd service
mkdir -p ~/.config/systemd/user
cat > ~/.config/systemd/user/copilot-pro.service << EOF
[Unit]
Description=Advanced Offline AI Copilot Pro
After=network.target

[Service]
Type=simple
WorkingDirectory=$HOME/AgentFoundry-instantly
ExecStart=/usr/bin/node $HOME/AgentFoundry-instantly/server/index.js
Restart=on-failure
RestartSec=10
Environment="NODE_ENV=production"
Environment="PORT=3001"

[Install]
WantedBy=default.target
EOF

# Enable and start service
systemctl --user daemon-reload
systemctl --user enable copilot-pro.service
systemctl --user start copilot-pro.service

# Check status
systemctl --user status copilot-pro
```

### Desktop Entry (Linux)

```bash
# Create desktop entry
mkdir -p ~/.local/share/applications
cat > ~/.local/share/applications/copilot-pro.desktop << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=Copilot Pro
Comment=Advanced Offline AI Coding Assistant
Exec=$HOME/.local/bin/copilot-pro
Icon=$HOME/AgentFoundry-instantly/public/icon.png
Terminal=false
Categories=Development;IDE;
Keywords=code;programming;ai;copilot;
EOF

chmod +x ~/.local/share/applications/copilot-pro.desktop
```

---

## 🍎 macOS Installation

### Method 1: Automated Script (Recommended)

```bash
# Download and run installer
curl -fsSL https://raw.githubusercontent.com/SpidermanTotro/AgentFoundry-instantly/main/install.sh -o install.sh
chmod +x install.sh
./install.sh
```

### Method 2: Homebrew

```bash
# Install Node.js (if not installed)
brew install node

# Clone repository
git clone https://github.com/SpidermanTotro/AgentFoundry-instantly.git
cd AgentFoundry-instantly

# Install dependencies
npm install

# Build application
npm run build

# Create launcher
mkdir -p ~/.local/bin
cat > ~/.local/bin/copilot-pro << 'EOF'
#!/bin/bash
cd "${HOME}/AgentFoundry-instantly"
npm start
EOF
chmod +x ~/.local/bin/copilot-pro

# Add to PATH (add to ~/.zshrc or ~/.bash_profile)
echo 'export PATH="${HOME}/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Method 3: Build macOS App

```bash
# Build standalone macOS application
npm run electron:build:mac

# Install app
cp -r dist-electron/mac/Copilot\ Pro.app /Applications/
```

---

## 🪟 Windows Installation

### Method 1: PowerShell Script (Recommended)

**Run PowerShell as Administrator:**

```powershell
# Set execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Download and run installer
$script = Invoke-WebRequest -Uri "https://raw.githubusercontent.com/SpidermanTotro/AgentFoundry-instantly/main/install.ps1" -UseBasicParsing
Invoke-Expression $script.Content
```

### Method 2: Manual Installation

```powershell
# 1. Install Node.js from https://nodejs.org/ (if not installed)

# 2. Clone repository
git clone https://github.com/SpidermanTotro/AgentFoundry-instantly.git
cd AgentFoundry-instantly

# 3. Install dependencies
npm install

# 4. Build application
npm run build

# 5. Create shortcut
# Copy the following to a new file: copilot-pro.bat
@echo off
cd /d "%LOCALAPPDATA%\AgentFoundry-instantly"
npm start

# 6. Create Windows Service (optional)
# Download NSSM from https://nssm.cc/
# Install service:
nssm install CopilotPro "C:\Program Files\nodejs\node.exe" "C:\path\to\AgentFoundry-instantly\server\index.js"
nssm set CopilotPro AppDirectory "C:\path\to\AgentFoundry-instantly"
nssm start CopilotPro
```

### Method 3: Build Windows Installer

```bash
# Build Windows installer
npm run electron:build:win

# Run the installer
.\dist-electron\Copilot-Pro-Setup-1.0.0.exe
```

---

## 🐳 Docker Installation

### Method 1: Docker Compose (Recommended)

```bash
# 1. Clone repository
git clone https://github.com/SpidermanTotro/AgentFoundry-instantly.git
cd AgentFoundry-instantly

# 2. Build and run
docker-compose up -d

# 3. View logs
docker-compose logs -f

# 4. Stop
docker-compose down
```

### Method 2: Docker CLI

```bash
# Build image
docker build -t copilot-pro:latest .

# Run container
docker run -d \
  --name copilot-pro \
  -p 3001:3001 \
  -v copilot-data:/app/data \
  -v copilot-skills:/app/server/ai-engine \
  --restart unless-stopped \
  copilot-pro:latest

# View logs
docker logs -f copilot-pro

# Stop container
docker stop copilot-pro
docker rm copilot-pro
```

### Docker with NGINX Reverse Proxy

```bash
# Start with NGINX proxy
docker-compose --profile with-proxy up -d

# Access via:
# HTTP: http://localhost:80
# HTTPS: https://localhost:443
```

---

## 💾 Desktop Application

### Electron Desktop App

Build standalone desktop applications for all platforms:

```bash
# Install dependencies
npm install

# Build for current platform
npm run electron:build

# Build for specific platform
npm run electron:build:linux   # Linux (AppImage, deb, rpm)
npm run electron:build:mac     # macOS (dmg, app)
npm run electron:build:win     # Windows (exe, portable)

# Build for all platforms
npm run electron:build:all
```

### Installation Packages

After building, find installation packages in `dist-electron/`:

**Linux:**
- `Copilot-Pro-1.0.0.AppImage` - Portable, works on all distros
- `copilot-pro_1.0.0_amd64.deb` - Debian/Ubuntu package
- `copilot-pro-1.0.0.x86_64.rpm` - Fedora/RHEL package

**macOS:**
- `Copilot Pro-1.0.0.dmg` - macOS installer
- `Copilot Pro-1.0.0-mac.zip` - Portable version

**Windows:**
- `Copilot-Pro-Setup-1.0.0.exe` - Windows installer
- `Copilot-Pro-1.0.0-portable.exe` - Portable version

---

## 📦 Portable Version

### Create Portable Installation

```bash
# 1. Build application
npm install
npm run build

# 2. Create portable package
mkdir copilot-pro-portable
cp -r dist/ server/ public/ node_modules/ copilot-pro-portable/
cp package.json index.html copilot-pro-portable/

# 3. Create launcher script
# Linux/macOS:
cat > copilot-pro-portable/run.sh << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"
node server/index.js &
sleep 2
xdg-open http://localhost:3001
EOF
chmod +x copilot-pro-portable/run.sh

# Windows:
cat > copilot-pro-portable/run.bat << 'EOF'
@echo off
cd /d %~dp0
start /b node server\index.js
timeout /t 2 /nobreak > nul
start http://localhost:3001
EOF

# 4. Create archive
tar -czf copilot-pro-portable.tar.gz copilot-pro-portable/
# or
zip -r copilot-pro-portable.zip copilot-pro-portable/
```

### Using Portable Version

1. Extract the archive to any location (USB drive, network share, etc.)
2. Run the launcher script:
   - Linux/macOS: `./run.sh`
   - Windows: Double-click `run.bat`
3. Access at `http://localhost:3001`

---

## ✅ Post-Installation

### Verify Installation

```bash
# Check if service is running
curl http://localhost:3001/api/health

# Expected output:
# {"status":"ok","message":"Advanced AI Copilot Server Running",...}
```

### Access the Application

Open your browser and navigate to:
- **Local**: http://localhost:3001
- **Network**: http://YOUR_IP:3001

### First-Time Setup

1. **Open the application** in your browser
2. **Test AI features**:
   - Click "Analyze" to test code analysis
   - Try "Get Suggestions" for completions
   - Open "Chat" for interactive assistance
3. **Check Skills Panel** to see available AI capabilities
4. **Configure settings** (optional):
   - Auto-analyze on/off
   - Learning mode
   - Language preferences

---

## 🔄 Updating

### Update via Git

```bash
# Navigate to installation directory
cd ~/.copilot-pro  # Linux/macOS
cd %LOCALAPPDATA%\CopilotPro  # Windows

# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Rebuild application
npm run build

# Restart service
systemctl --user restart copilot-pro  # Linux
# or restart manually
```

### Update Docker Installation

```bash
# Pull latest changes
cd /path/to/AgentFoundry-instantly
git pull

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Auto-Update (Desktop App)

The Electron desktop application includes built-in auto-update functionality:
- Updates are checked automatically on startup
- You'll be notified when updates are available
- Updates download in the background
- Restart the app to apply updates

---

## 🗑️ Uninstallation

### Linux/macOS

```bash
# Run uninstall script
~/.copilot-pro/uninstall.sh

# Or manually:
# Stop service
systemctl --user stop copilot-pro
systemctl --user disable copilot-pro

# Remove files
rm -rf ~/.copilot-pro
rm ~/.local/bin/copilot-pro
rm ~/.local/share/applications/copilot-pro.desktop
rm ~/.config/systemd/user/copilot-pro.service
systemctl --user daemon-reload
```

### Windows

```powershell
# Run uninstall script
powershell -File "$env:LOCALAPPDATA\CopilotPro\uninstall.ps1"

# Or use Windows "Add or Remove Programs"
```

### Docker

```bash
# Stop and remove containers
docker-compose down

# Remove volumes (optional - deletes learned data)
docker-compose down -v

# Remove images
docker rmi copilot-pro:latest
```

---

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Check what's using port 3001
lsof -i :3001  # Linux/macOS
netstat -ano | findstr :3001  # Windows

# Kill the process or change port
export PORT=3002
npm start
```

### Node.js Version Issues

```bash
# Check Node.js version
node --version

# Should be 16.x or higher
# Update if needed:
# Linux: Use NodeSource repository
# macOS: brew upgrade node
# Windows: Download from nodejs.org
```

### Permission Errors (Linux)

```bash
# Fix ownership
sudo chown -R $USER:$USER ~/.copilot-pro

# Fix permissions
chmod +x ~/.local/bin/copilot-pro
chmod +x ~/.copilot-pro/uninstall.sh
```

### Database Errors

```bash
# Reset database
rm ~/.copilot-pro/server/ai-engine/code_intelligence.db

# Restart application (database will be recreated)
systemctl --user restart copilot-pro
```

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm run build
```

### Browser Not Opening

```bash
# Manually open browser
xdg-open http://localhost:3001  # Linux
open http://localhost:3001      # macOS
start http://localhost:3001     # Windows
```

### Electron App Won't Start

```bash
# Check Node.js path in Electron
which node  # Should match the path in electron.js

# Rebuild native modules
npm rebuild

# Run in development mode for debugging
npm run electron:dev
```

---

## 📞 Support

Need help? Here are your options:

- 📖 **Documentation**: See main [README.md](README.md)
- 🐛 **Report Issues**: [GitHub Issues](https://github.com/SpidermanTotro/AgentFoundry-instantly/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/SpidermanTotro/AgentFoundry-instantly/discussions)
- ⭐ **Star the Project**: [GitHub Repository](https://github.com/SpidermanTotro/AgentFoundry-instantly)

---

## 🎯 Next Steps

After installation:

1. ✅ Read the [Usage Guide](README.md#usage)
2. ✅ Explore [Features](README.md#features)
3. ✅ Check [API Documentation](README.md#api-endpoints)
4. ✅ Learn about [Skills System](README.md#skills-system)
5. ✅ Join the community and contribute!

---

**Enjoy your Advanced Offline AI Copilot Pro!** 🚀
