#!/bin/bash
# Create Repository Script
# Automated repository creation using repo_maker.py

set -e

if [ $# -eq 0 ]; then
    echo "Usage: $0 <repository_name> [template]"
    echo ""
    echo "Examples:"
    echo "  $0 my-new-repo"
    echo "  $0 my-new-repo default"
    exit 1
fi

REPO_NAME="$1"
TEMPLATE="${2:-default}"

echo "🏗️  Creating repository: $REPO_NAME"
echo "   Template: $TEMPLATE"
echo ""

# Run repo maker
python3 skeleton/repo_maker.py "$REPO_NAME" --template "$TEMPLATE"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Repository created successfully!"
    echo ""
    echo "Next steps:"
    echo "  cd $REPO_NAME"
    echo "  git add ."
    echo "  git commit -m 'Initial commit'"
    echo ""
else
    echo "❌ Failed to create repository"
    exit 1
fi
