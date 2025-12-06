#!/bin/bash

# Advanced Offline AI Copilot Pro - Universal Installation Script
# Supports: Linux (Ubuntu, Debian, Fedora, Arch), macOS, WSL

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Banner
echo -e "${CYAN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║      ░█████╗░░█████╗░██████╗░██╗██╗░░░░░░█████╗░████████╗║
║      ██╔══██╗██╔══██╗██╔══██╗██║██║░░░░░██╔══██╗╚══██╔══╝║
║      ██║░░╚═╝██║░░██║██████╔╝██║██║░░░░░██║░░██║░░░██║░░░║
║      ██║░░██╗██║░░██║██╔═══╝░██║██║░░░░░██║░░██║░░░██║░░░║
║      ╚█████╔╝╚█████╔╝██║░░░░░██║███████╗╚█████╔╝░░░██║░░░║
║      ░╚════╝░░╚════╝░╚═╝░░░░░╚═╝╚══════╝░╚════╝░░░░╚═╝░░░║
║                                                           ║
║         Advanced Offline AI Copilot Pro - Installer      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${GREEN}🚀 Installing Advanced Offline AI Copilot Pro${NC}\n"

# Detect OS
OS="unknown"
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
    echo -e "${BLUE}📟 Detected OS: Linux${NC}"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
    echo -e "${BLUE}📟 Detected OS: macOS${NC}"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    OS="windows"
    echo -e "${BLUE}📟 Detected OS: Windows (Git Bash/Cygwin)${NC}"
else
    echo -e "${RED}❌ Unsupported operating system: $OSTYPE${NC}"
    exit 1
fi

# Check for Node.js
echo -e "\n${YELLOW}🔍 Checking for Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo -e "${YELLOW}📥 Installing Node.js...${NC}"
    
    if [[ "$OS" == "linux" ]]; then
        # Detect Linux distribution
        if [ -f /etc/os-release ]; then
            . /etc/os-release
            DISTRO=$ID
        fi
        
        case $DISTRO in
            ubuntu|debian)
                curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
                sudo apt-get install -y nodejs
                ;;
            fedora)
                sudo dnf install -y nodejs npm
                ;;
            arch)
                sudo pacman -S nodejs npm
                ;;
            *)
                echo -e "${RED}❌ Unsupported Linux distribution${NC}"
                echo -e "${YELLOW}Please install Node.js manually: https://nodejs.org/${NC}"
                exit 1
                ;;
        esac
    elif [[ "$OS" == "macos" ]]; then
        if command -v brew &> /dev/null; then
            brew install node
        else
            echo -e "${RED}❌ Homebrew not found${NC}"
            echo -e "${YELLOW}Please install Homebrew first: https://brew.sh/${NC}"
            exit 1
        fi
    fi
else
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js $NODE_VERSION is installed${NC}"
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo -e "${GREEN}✓ npm $NPM_VERSION is installed${NC}"

# Installation directory
INSTALL_DIR="${HOME}/.copilot-pro"
echo -e "\n${YELLOW}📂 Installation directory: $INSTALL_DIR${NC}"

# Create installation directory
if [ -d "$INSTALL_DIR" ]; then
    echo -e "${YELLOW}⚠️  Installation directory already exists${NC}"
    read -p "Do you want to reinstall? This will remove existing data. (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}🗑️  Removing existing installation...${NC}"
        rm -rf "$INSTALL_DIR"
    else
        echo -e "${YELLOW}Installation cancelled${NC}"
        exit 0
    fi
fi

mkdir -p "$INSTALL_DIR"
echo -e "${GREEN}✓ Created installation directory${NC}"

# Copy files
echo -e "\n${YELLOW}📦 Copying application files...${NC}"
cp -r . "$INSTALL_DIR/"
cd "$INSTALL_DIR"

# Install dependencies
echo -e "\n${YELLOW}📥 Installing dependencies (this may take a few minutes)...${NC}"
npm install --production

# Build the application
echo -e "\n${YELLOW}🔨 Building application...${NC}"
npm run build

# Create launcher script
echo -e "\n${YELLOW}📝 Creating launcher scripts...${NC}"

if [[ "$OS" == "linux" ]] || [[ "$OS" == "macos" ]]; then
    # Create CLI launcher
    LAUNCHER_PATH="${HOME}/.local/bin/copilot-pro"
    mkdir -p "${HOME}/.local/bin"
    
    cat > "$LAUNCHER_PATH" << 'LAUNCHER_EOF'
#!/bin/bash
cd "${HOME}/.copilot-pro"
node server/index.js &
SERVER_PID=$!
sleep 2
npm run dev
kill $SERVER_PID
LAUNCHER_EOF
    
    chmod +x "$LAUNCHER_PATH"
    echo -e "${GREEN}✓ Created CLI launcher: $LAUNCHER_PATH${NC}"
    
    # Create desktop entry for Linux
    if [[ "$OS" == "linux" ]]; then
        DESKTOP_DIR="${HOME}/.local/share/applications"
        mkdir -p "$DESKTOP_DIR"
        
        cat > "${DESKTOP_DIR}/copilot-pro.desktop" << DESKTOP_EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=Copilot Pro
Comment=Advanced Offline AI Coding Assistant
Exec=${HOME}/.local/bin/copilot-pro
Icon=${INSTALL_DIR}/public/icon.png
Terminal=false
Categories=Development;IDE;
Keywords=code;programming;ai;copilot;
DESKTOP_EOF
        
        chmod +x "${DESKTOP_DIR}/copilot-pro.desktop"
        echo -e "${GREEN}✓ Created desktop entry${NC}"
    fi
    
    # Create macOS app (if on macOS)
    if [[ "$OS" == "macos" ]]; then
        echo -e "${YELLOW}🍎 Creating macOS application...${NC}"
        npm run electron:build
        echo -e "${GREEN}✓ macOS app created in dist/ directory${NC}"
    fi
fi

# Create systemd service for Linux
if [[ "$OS" == "linux" ]]; then
    echo -e "\n${YELLOW}⚙️  Creating systemd service...${NC}"
    
    SERVICE_DIR="${HOME}/.config/systemd/user"
    mkdir -p "$SERVICE_DIR"
    
    cat > "${SERVICE_DIR}/copilot-pro.service" << SERVICE_EOF
[Unit]
Description=Advanced Offline AI Copilot Pro
After=network.target

[Service]
Type=simple
WorkingDirectory=${INSTALL_DIR}
ExecStart=/usr/bin/node ${INSTALL_DIR}/server/index.js
Restart=on-failure
RestartSec=10
Environment="NODE_ENV=production"
Environment="PORT=3001"

[Install]
WantedBy=default.target
SERVICE_EOF
    
    # Enable and start service
    systemctl --user daemon-reload
    systemctl --user enable copilot-pro.service
    systemctl --user start copilot-pro.service
    
    echo -e "${GREEN}✓ Systemd service created and started${NC}"
    echo -e "${CYAN}   To check status: systemctl --user status copilot-pro${NC}"
    echo -e "${CYAN}   To stop: systemctl --user stop copilot-pro${NC}"
    echo -e "${CYAN}   To restart: systemctl --user restart copilot-pro${NC}"
fi

# Add to PATH if not already
if [[ "$OS" == "linux" ]] || [[ "$OS" == "macos" ]]; then
    if [[ ":$PATH:" != *":${HOME}/.local/bin:"* ]]; then
        echo -e "\n${YELLOW}📌 Adding to PATH...${NC}"
        
        SHELL_CONFIG=""
        if [ -f "${HOME}/.bashrc" ]; then
            SHELL_CONFIG="${HOME}/.bashrc"
        elif [ -f "${HOME}/.zshrc" ]; then
            SHELL_CONFIG="${HOME}/.zshrc"
        fi
        
        if [ -n "$SHELL_CONFIG" ]; then
            echo '' >> "$SHELL_CONFIG"
            echo '# Copilot Pro' >> "$SHELL_CONFIG"
            echo 'export PATH="${HOME}/.local/bin:$PATH"' >> "$SHELL_CONFIG"
            echo -e "${GREEN}✓ Added to PATH in $SHELL_CONFIG${NC}"
            echo -e "${YELLOW}⚠️  Run 'source $SHELL_CONFIG' or restart your terminal${NC}"
        fi
    fi
fi

# Create uninstall script
echo -e "\n${YELLOW}📝 Creating uninstall script...${NC}"
cat > "${INSTALL_DIR}/uninstall.sh" << 'UNINSTALL_EOF'
#!/bin/bash
echo "🗑️  Uninstalling Copilot Pro..."

# Stop service if running
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    systemctl --user stop copilot-pro.service 2>/dev/null || true
    systemctl --user disable copilot-pro.service 2>/dev/null || true
    rm -f "${HOME}/.config/systemd/user/copilot-pro.service"
    systemctl --user daemon-reload
fi

# Remove files
rm -f "${HOME}/.local/bin/copilot-pro"
rm -f "${HOME}/.local/share/applications/copilot-pro.desktop"
rm -rf "${HOME}/.copilot-pro"

echo "✓ Copilot Pro has been uninstalled"
UNINSTALL_EOF

chmod +x "${INSTALL_DIR}/uninstall.sh"
echo -e "${GREEN}✓ Created uninstall script${NC}"

# Final message
echo -e "\n${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}║         ✅ Installation Complete!                         ║${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"

echo -e "\n${CYAN}🚀 How to use:${NC}"
echo -e "${YELLOW}   • Run from terminal: ${GREEN}copilot-pro${NC}"

if [[ "$OS" == "linux" ]]; then
    echo -e "${YELLOW}   • Or launch from applications menu${NC}"
    echo -e "${YELLOW}   • Service is running at: ${GREEN}http://localhost:3001${NC}"
fi

echo -e "\n${CYAN}📚 Features:${NC}"
echo -e "${YELLOW}   ✓ 100% Offline AI${NC}"
echo -e "${YELLOW}   ✓ Self-Learning System${NC}"
echo -e "${YELLOW}   ✓ Multi-Language Support${NC}"
echo -e "${YELLOW}   ✓ Real-Time Code Analysis${NC}"
echo -e "${YELLOW}   ✓ Advanced Refactoring${NC}"

echo -e "\n${CYAN}🔧 Management:${NC}"
echo -e "${YELLOW}   • Update: cd ~/.copilot-pro && git pull && npm install && npm run build${NC}"
echo -e "${YELLOW}   • Uninstall: ~/.copilot-pro/uninstall.sh${NC}"

if [[ "$OS" == "linux" ]]; then
    echo -e "${YELLOW}   • Check service: systemctl --user status copilot-pro${NC}"
fi

echo -e "\n${PURPLE}⭐ Star us on GitHub: https://github.com/SpidermanTotro/AgentFoundry-instantly${NC}"
echo -e "${PURPLE}🐛 Report issues: https://github.com/SpidermanTotro/AgentFoundry-instantly/issues${NC}\n"

# Open browser
if [[ "$OS" == "linux" ]]; then
    sleep 3
    xdg-open http://localhost:3001 2>/dev/null || true
elif [[ "$OS" == "macos" ]]; then
    sleep 3
    open http://localhost:3001 2>/dev/null || true
fi
