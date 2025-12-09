#!/bin/bash
# Setup Dev Copilot Environment
# This script sets up the offline-first development copilot

set -e

echo "🔧 Setting up AgentFoundry Dev Copilot..."
echo ""

# Check Python version
echo "Checking Python version..."
python3 --version || { echo "❌ Python 3 is required"; exit 1; }

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate || . venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install dev copilot dependencies
echo "Installing Dev Copilot dependencies..."
pip install -r skeleton/requirements-devcopilot.txt

# Create necessary directories
echo "Creating directories..."
mkdir -p skeleton/generated
mkdir -p skeleton/logs
mkdir -p skeleton/data

# Verify installation
echo ""
echo "Verifying installation..."
python3 skeleton/dev_copilot.py config

echo ""
echo "✅ Dev Copilot setup complete!"
echo ""
echo "Next steps:"
echo "  1. Activate the virtual environment: source venv/bin/activate"
echo "  2. List available templates: python3 skeleton/dev_copilot.py list"
echo "  3. Scaffold a new agent: python3 skeleton/dev_copilot.py scaffold my_agent"
echo "  4. Start the dev lab: streamlit run skeleton/web_agent_app.py"
echo ""
