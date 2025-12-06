#!/bin/bash
# Forge Spark MVP Installation Script
# Real working installation for Linux

set -e

echo "🔥 Forge Spark MVP Installation"
echo "================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo -e "${RED}Error: This script requires Linux${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Linux detected${NC}"

# Install Python 3
if ! command -v python3 &> /dev/null; then
    echo "Installing Python 3..."
    sudo apt update
    sudo apt install -y python3 python3-pip python3-venv
fi
echo -e "${GREEN}✓ Python 3 installed${NC}"

# Install Node.js
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
fi
echo -e "${GREEN}✓ Node.js installed${NC}"

# Install Docker
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi
echo -e "${GREEN}✓ Docker installed${NC}"

# Create Python virtual environment
echo "Creating Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Installation Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "To start Forge Spark:"
echo "  1. docker-compose up -d"
echo "  2. Open http://localhost:8000"
echo ""
echo "To activate Python environment:"
echo "  source venv/bin/activate"
echo ""
