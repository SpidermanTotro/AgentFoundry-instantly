#!/bin/bash
# Package Agent Packs Script
# Creates distributable agent packages

set -e

echo "📦 Packaging AgentPacks..."
echo ""

# Create package directory
PACKAGE_DIR="dist/agentpacks"
mkdir -p "$PACKAGE_DIR"

# Find all agent files
AGENT_FILES=$(find skeleton/generated -name "*_agent.py" -o -name "*agent*.py" 2>/dev/null || true)

if [ -z "$AGENT_FILES" ]; then
    echo "⚠️  No agent files found in skeleton/generated/"
    echo "   Generate agents first using: python3 skeleton/dev_copilot.py scaffold <agent_name>"
    exit 1
fi

# Package each agent
for agent in $AGENT_FILES; do
    agent_name=$(basename "$agent" .py)
    echo "Packaging: $agent_name"
    
    # Create agent package directory
    pkg_dir="$PACKAGE_DIR/$agent_name"
    mkdir -p "$pkg_dir"
    
    # Copy agent files
    cp "$agent" "$pkg_dir/"
    
    # Copy metadata if exists
    metadata="${agent%.*}_metadata.py"
    if [ -f "$metadata" ]; then
        cp "$metadata" "$pkg_dir/"
    fi
    
    # Copy helper if exists
    helper="${agent%.*}_helper.py"
    if [ -f "$helper" ]; then
        cp "$helper" "$pkg_dir/"
    fi
    
    # Create package README
    cat > "$pkg_dir/README.md" << EOF
# $agent_name

Agent package created by AgentFoundry.

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## Usage

\`\`\`python
from $agent_name import create_agent

agent = create_agent()
agent.initialize()
result = agent.process(data)
\`\`\`
EOF
    
    # Create requirements.txt
    cat > "$pkg_dir/requirements.txt" << EOF
requests>=2.31.0
python-dotenv>=1.0.0
pyyaml>=6.0.1
EOF
    
    # Create tarball
    tar -czf "$PACKAGE_DIR/${agent_name}.tar.gz" -C "$PACKAGE_DIR" "$agent_name"
    echo "  ✓ Created: ${agent_name}.tar.gz"
done

echo ""
echo "✅ Packaging complete!"
echo "   Output directory: $PACKAGE_DIR"
echo ""
ls -lh "$PACKAGE_DIR"/*.tar.gz 2>/dev/null || echo "   No packages created"
echo ""
