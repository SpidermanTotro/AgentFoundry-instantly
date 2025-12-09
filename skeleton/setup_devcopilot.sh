#!/bin/bash
# setup_devcopilot.sh - Setup Dev Copilot environment

set -e

echo "Setting up Dev Copilot..."

# Create necessary directories
mkdir -p .devcopilot/logs
mkdir -p dev_copilot_templates
mkdir -p generated

# Check if config exists
if [ ! -f .devcopilot/config.json ]; then
    echo "Creating default configuration..."
    cat > .devcopilot/config.json <<'EOF'
{
  "llm": {
    "enabled": false,
    "model_path": "",
    "model_type": "llama",
    "context_size": 2048,
    "temperature": 0.7,
    "max_tokens": 512
  },
  "templates_dir": "dev_copilot_templates",
  "output_dir": "generated",
  "logging": {
    "enabled": true,
    "level": "INFO",
    "file": ".devcopilot/logs/devcopilot.log"
  },
  "features": {
    "code_generation": true,
    "code_review": true,
    "template_system": true,
    "interactive_mode": true
  }
}
EOF
    echo "Configuration created at .devcopilot/config.json"
else
    echo "Configuration already exists"
fi

# Install Python dependencies if requirements file exists
if [ -f requirements-devcopilot.txt ]; then
    echo "Installing Python dependencies..."
    pip install -r requirements-devcopilot.txt
fi

echo ""
echo "Dev Copilot setup complete!"
echo ""
echo "Note: Local LLM is DISABLED by default."
echo "To enable:"
echo "  1. Download a local model (Llama, GPT4All, etc.)"
echo "  2. Edit .devcopilot/config.json and set 'enabled': true"
echo "  3. Set 'model_path' to your model file"
echo ""
echo "Usage:"
echo "  python dev_copilot.py --help"
echo ""
