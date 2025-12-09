#!/bin/bash
# package_agentpacks.sh - Package agents into distributable formats

set -e

echo "Packaging AgentPacks..."

# Configuration
AGENTS_DIR="${1:-agents}"
OUTPUT_DIR="${2:-dist/agentpacks}"
VERSION="${3:-0.1.0}"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Find all agent files
if [ ! -d "$AGENTS_DIR" ]; then
    echo "Warning: Agents directory '$AGENTS_DIR' not found"
    echo "Creating example structure..."
    mkdir -p "$AGENTS_DIR"
    exit 0
fi

# Package each agent
for agent_file in "$AGENTS_DIR"/*.py; do
    if [ -f "$agent_file" ]; then
        agent_name=$(basename "$agent_file" .py)
        echo "Packaging: $agent_name"
        
        # Create agent package directory
        package_dir="$OUTPUT_DIR/$agent_name"
        mkdir -p "$package_dir"
        
        # Copy agent file
        cp "$agent_file" "$package_dir/"
        
        # Create metadata
        cat > "$package_dir/metadata.json" <<EOF
{
  "name": "$agent_name",
  "version": "$VERSION",
  "packaged": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "type": "agent"
}
EOF
        
        # Create README
        cat > "$package_dir/README.md" <<EOF
# $agent_name

Agent package v$VERSION

## Installation

\`\`\`bash
python $agent_name.py
\`\`\`

## License

ISC
EOF
        
        # Create archive
        cd "$OUTPUT_DIR"
        tar -czf "${agent_name}-${VERSION}.tar.gz" "$agent_name"
        rm -rf "$agent_name"
        cd - > /dev/null
        
        echo "  Created: $OUTPUT_DIR/${agent_name}-${VERSION}.tar.gz"
    fi
done

echo ""
echo "Packaging complete!"
echo "Output: $OUTPUT_DIR"
ls -lh "$OUTPUT_DIR"/*.tar.gz 2>/dev/null || echo "No packages created"
