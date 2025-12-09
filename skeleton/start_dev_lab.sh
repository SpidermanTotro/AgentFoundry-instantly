#!/bin/bash
# start_dev_lab.sh - Start the development lab

set -e

echo "Starting Agent Development Lab..."

# Check if streamlit is installed
if ! command -v streamlit &> /dev/null; then
    echo "Streamlit not found. Installing..."
    pip install streamlit
fi

# Check if requirements are installed
if [ -f requirements.txt ]; then
    echo "Checking dependencies..."
    pip install -r requirements.txt -q
fi

# Create necessary directories
mkdir -p agents
mkdir -p models
mkdir -p data

echo ""
echo "🚀 Starting Streamlit app..."
echo "   Open http://localhost:8501 in your browser"
echo ""
echo "   Press Ctrl+C to stop"
echo ""

# Start streamlit
streamlit run web_agent_app.py
