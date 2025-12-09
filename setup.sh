#!/bin/bash
# GenSpark 2.0 Platform - Quick Start Script
# Automated setup for all platform components

set -e

echo "═══════════════════════════════════════════════════════"
echo "  GenSpark 2.0 Platform - Quick Start Setup"
echo "═══════════════════════════════════════════════════════"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 16+ from https://nodejs.org"
    exit 1
fi

echo -e "${GREEN}✅ Node.js detected: $(node --version)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm detected: $(npm --version)${NC}"
echo ""

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
if [ -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules already exists, skipping install${NC}"
else
    npm install --legacy-peer-deps --ignore-scripts
    echo -e "${GREEN}✅ Dependencies installed${NC}"
fi
echo ""

# Build frontend
echo -e "${BLUE}🔨 Building frontend...${NC}"
npm run build
echo -e "${GREEN}✅ Frontend built${NC}"
echo ""

# Check for .env file
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  No .env file found${NC}"
    echo -e "${BLUE}Creating .env from example...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ Created .env file${NC}"
        echo -e "${YELLOW}💡 Edit .env to add API keys for online mode${NC}"
    fi
fi
echo ""

# Check for GGUF models
echo -e "${BLUE}🔍 Checking for GGUF models...${NC}"
if [ -d "models" ] && [ "$(ls -A models/*.gguf 2>/dev/null)" ]; then
    echo -e "${GREEN}✅ GGUF models found:${NC}"
    ls -lh models/*.gguf | awk '{print "   •", $9, "(" $5 ")"}'
else
    echo -e "${YELLOW}⚠️  No GGUF models found${NC}"
    echo ""
    echo "For best offline AI experience, download GGUF models:"
    echo ""
    echo "1. Create models directory:"
    echo "   ${BLUE}mkdir -p models${NC}"
    echo ""
    echo "2. Download a model (choose one):"
    echo ""
    echo "   ${BLUE}# TinyLlama (Fastest, 637MB)${NC}"
    echo "   wget https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf -P models/"
    echo ""
    echo "   ${BLUE}# Mistral 7B (Best quality, 4.1GB)${NC}"
    echo "   wget https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF/resolve/main/mistral-7b-instruct-v0.2.Q4_K_M.gguf -P models/"
    echo ""
fi
echo ""

# Check for llama.cpp
echo -e "${BLUE}🔍 Checking for llama.cpp...${NC}"
if [ -f "bin/llama.cpp" ] || command -v llama.cpp &> /dev/null; then
    echo -e "${GREEN}✅ llama.cpp found${NC}"
else
    echo -e "${YELLOW}⚠️  llama.cpp not found${NC}"
    echo ""
    echo "To use GGUF models, install llama.cpp:"
    echo ""
    echo "   ${BLUE}git clone https://github.com/ggerganov/llama.cpp${NC}"
    echo "   ${BLUE}cd llama.cpp${NC}"
    echo "   ${BLUE}make${NC}"
    echo "   ${BLUE}mkdir -p ../bin${NC}"
    echo "   ${BLUE}cp main ../bin/llama.cpp${NC}"
    echo ""
fi
echo ""

# Display next steps
echo "═══════════════════════════════════════════════════════"
echo -e "  ${GREEN}✅ Setup Complete!${NC}"
echo "═══════════════════════════════════════════════════════"
echo ""
echo -e "${BLUE}🚀 Start the platform:${NC}"
echo ""
echo "   ${GREEN}# Default (Hybrid mode)${NC}"
echo "   npm run platform"
echo ""
echo "   ${GREEN}# Offline mode (no internet needed)${NC}"
echo "   npm run platform:offline"
echo ""
echo "   ${GREEN}# Online mode (with API keys)${NC}"
echo "   npm run platform:online"
echo ""
echo -e "${BLUE}📖 Documentation:${NC}"
echo "   GENSPARK_2.0_INTEGRATION_GUIDE.md"
echo ""
echo -e "${BLUE}🌐 After starting:${NC}"
echo "   • Frontend: http://localhost:5173"
echo "   • API: http://localhost:3001/api"
echo "   • Health: http://localhost:3001/api/health"
echo ""
echo "═══════════════════════════════════════════════════════"
