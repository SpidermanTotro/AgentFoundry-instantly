#!/bin/bash
# Start Development Lab
# Launches Streamlit-based development environment

set -e

echo "🚀 Starting AgentFoundry Development Lab..."
echo ""

# Check if Streamlit is installed
if ! command -v streamlit &> /dev/null; then
    echo "⚠️  Streamlit not found. Installing..."
    pip install streamlit
fi

# Check if in virtual environment
if [ -z "$VIRTUAL_ENV" ]; then
    echo "⚠️  Not in a virtual environment"
    echo "   Recommended: source venv/bin/activate"
    echo ""
fi

# Set environment variables
export STREAMLIT_SERVER_PORT=8501
export STREAMLIT_SERVER_HEADLESS=true
export STREAMLIT_BROWSER_GATHER_USAGE_STATS=false

# Create necessary directories
mkdir -p skeleton/generated
mkdir -p skeleton/logs

echo "Starting Streamlit on http://localhost:8501"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start Streamlit
streamlit run skeleton/web_agent_app.py \
    --server.port 8501 \
    --server.headless true \
    --browser.gatherUsageStats false \
    --theme.base light
