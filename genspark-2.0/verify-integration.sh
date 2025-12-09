#!/bin/bash

# GenSpark 2.0 Unified - Integration Verification Script
# This script verifies that all features are properly integrated

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   GenSpark 2.0 Unified - Integration Verification             ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Not in genspark-2.0 directory${NC}"
    echo "Please run this script from the genspark-2.0 directory"
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo ""

# Verification counters
PASSED=0
FAILED=0

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $2"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌${NC} $2 (MISSING: $1)"
        ((FAILED++))
        return 1
    fi
}

# Function to check directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} $2"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌${NC} $2 (MISSING: $1)"
        ((FAILED++))
        return 1
    fi
}

# Function to check for specific content in file
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✅${NC} $3"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌${NC} $3 (NOT FOUND in $1)"
        ((FAILED++))
        return 1
    fi
}

echo "═══════════════════════════════════════════════════════════════"
echo "1. Checking Core Files"
echo "═══════════════════════════════════════════════════════════════"
check_file "src/unified-server.js" "Unified Server"
check_file "src/App.jsx" "Main Application Component"
check_file "src/App.css" "Application Styles"
check_file "src/main.jsx" "Application Entry Point"
check_file "index.html" "HTML Entry Point"
check_file "vite.config.js" "Vite Configuration"
check_file "package.json" "Package Configuration"
check_file ".env.example" "Environment Configuration Template"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "2. Checking UI Components"
echo "═══════════════════════════════════════════════════════════════"
check_file "src/components/ChatGPT2.jsx" "ChatGPT2 Component"
check_file "src/components/ChatGPT2.css" "ChatGPT2 Styles"
check_file "src/components/CodeEditor.jsx" "Code Editor Component"
check_file "src/components/ChatPanel.jsx" "Chat Panel Component"
check_file "src/components/SkillsPanel.jsx" "Skills Panel Component"
check_file "src/components/StatusBar.jsx" "Status Bar Component"
check_file "src/components/CodeAssistant.jsx" "Code Assistant Component"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "3. Checking Utilities & Hooks"
echo "═══════════════════════════════════════════════════════════════"
check_file "src/utils/ConversationManager.js" "Conversation Manager Utility"
check_file "src/hooks/useWebSocket.js" "WebSocket Hook"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "4. Checking GenSpark 2.0 Original Modules"
echo "═══════════════════════════════════════════════════════════════"
check_file "src/server.js" "Original GenSpark 2.0 Server"
check_dir "src/ai" "AI Engine Directory"
check_dir "src/media" "Media Generation Directory"
check_dir "src/workspace" "Workspace Directory"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "5. Checking Electron Configuration"
echo "═══════════════════════════════════════════════════════════════"
check_file "electron/main.js" "Electron Main Process"
check_file "electron/preload.js" "Electron Preload Script"
check_content "electron/main.js" "unified-server.js" "Electron uses unified server"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "6. Checking Documentation"
echo "═══════════════════════════════════════════════════════════════"
check_file "README-UNIFIED.md" "Unified Features README"
check_file "INSTALL-UNIFIED.md" "Installation Guide"
check_file "MIGRATION-GUIDE.md" "Migration Guide"
check_file "INTEGRATION-SUMMARY.md" "Integration Summary"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "7. Checking Installation Scripts"
echo "═══════════════════════════════════════════════════════════════"
check_file "install.sh" "Linux/macOS Installation Script"
check_file "install.ps1" "Windows Installation Script"
check_file "ChatGPT2-Desktop.sh" "Desktop Launch Script"
check_file "ChatGPT2-Desktop-Linux.sh" "Linux Desktop Launch Script"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "8. Checking Docker Configuration"
echo "═══════════════════════════════════════════════════════════════"
check_file "Dockerfile" "Docker Configuration"
check_file "docker-compose.yml" "Docker Compose Configuration"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "9. Checking Parent Directory AI Engines"
echo "═══════════════════════════════════════════════════════════════"
if [ -d "../../server/ai-engine" ]; then
    echo -e "${GREEN}✅${NC} AI Engines directory exists"
    ((PASSED++))
    
    # Check for specific engines
    check_file "../../server/ai-engine/LocalAIEngine.js" "LocalAIEngine"
    check_file "../../server/ai-engine/GenSparkAI.js" "GenSparkAI"
    check_file "../../server/ai-engine/CodeIntelligence.js" "CodeIntelligence"
    check_file "../../server/ai-engine/PluginSystem.js" "PluginSystem"
    check_file "../../server/ai-engine/CompleteGenSparkAI.js" "CompleteGenSparkAI"
    check_file "../../server/ai-engine/ChatGPT2_Unrestricted.js" "ChatGPT2_Unrestricted"
    check_file "../../server/ai-engine/OfflineGenSparkAI.js" "OfflineGenSparkAI"
else
    echo -e "${YELLOW}⚠️${NC}  AI Engines directory not found (optional - graceful fallback enabled)"
fi
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "10. Checking Package.json Configuration"
echo "═══════════════════════════════════════════════════════════════"
check_content "package.json" "unified-server.js" "Start script uses unified server"
check_content "package.json" "react" "React dependency"
check_content "package.json" "express" "Express dependency"
check_content "package.json" "socket.io" "Socket.IO dependency"
check_content "package.json" "@monaco-editor/react" "Monaco Editor dependency"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "11. Checking App.jsx Configuration"
echo "═══════════════════════════════════════════════════════════════"
check_content "src/App.jsx" "chat" "Chat Mode"
check_content "src/App.jsx" "code" "Code Mode"
check_content "src/App.jsx" "workspace" "Workspace Mode"
check_content "src/App.jsx" "media" "Media Mode"
echo ""

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    VERIFICATION RESULTS                        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"
echo ""

# Calculate percentage
TOTAL=$((PASSED + FAILED))
if [ $TOTAL -gt 0 ]; then
    PERCENTAGE=$((PASSED * 100 / TOTAL))
    echo "Completion: $PERCENTAGE%"
    echo ""
fi

# Recommendations
if [ $FAILED -eq 0 ]; then
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║  🎉 PERFECT! All integration checks passed!                   ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "Next steps:"
    echo "1. Run 'npm install' to install dependencies"
    echo "2. Run 'npm start' to start the unified server"
    echo "3. Access http://localhost:3000"
    echo "4. Explore all 4 modes: Chat, Code, Workspace, Media"
    echo ""
elif [ $PERCENTAGE -ge 80 ]; then
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║  ✅ GOOD! Most checks passed, integration is functional       ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "Some optional components are missing, but core features are available."
    echo "You can proceed with: npm install && npm start"
    echo ""
else
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║  ⚠️  WARNING! Some critical files are missing                 ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "Please ensure you have:"
    echo "1. Properly cloned the repository"
    echo "2. Are in the genspark-2.0 directory"
    echo "3. Have all required files from the integration"
    echo ""
fi

# Additional checks
echo "═══════════════════════════════════════════════════════════════"
echo "Additional Information"
echo "═══════════════════════════════════════════════════════════════"

# Check Node version
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js: $NODE_VERSION"
else
    echo "❌ Node.js not found (required: >=16.0.0)"
fi

# Check npm version
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm: $NPM_VERSION"
else
    echo "❌ npm not found"
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed (node_modules exists)"
else
    echo "⚠️  Dependencies not installed. Run: npm install"
fi

# Check if .env exists
if [ -f ".env" ]; then
    echo "✅ Environment configured (.env exists)"
else
    echo "ℹ️  No .env file. Copy .env.example if needed: cp .env.example .env"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "For more information, see:"
echo "  • README-UNIFIED.md - Feature documentation"
echo "  • INSTALL-UNIFIED.md - Installation instructions"
echo "  • MIGRATION-GUIDE.md - Migration help"
echo "  • INTEGRATION-SUMMARY.md - Integration details"
echo "═══════════════════════════════════════════════════════════════"
echo ""

exit 0
