#!/bin/bash
# git_release.sh - Automated git release creation

set -e

if [ $# -lt 1 ]; then
    echo "Usage: $0 <version> [description]"
    echo ""
    echo "Examples:"
    echo "  $0 v1.0.0"
    echo "  $0 v1.0.1 \"Bug fixes and improvements\""
    exit 1
fi

VERSION=$1
DESCRIPTION=${2:-"Release $VERSION"}

echo "Creating release: $VERSION"
echo "Description: $DESCRIPTION"
echo ""

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "Error: Not a git repository"
    exit 1
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "Warning: You have uncommitted changes"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Create tag
echo "Creating tag..."
git tag -a "$VERSION" -m "$DESCRIPTION"

# Push tag
echo "Pushing tag..."
git push origin "$VERSION"

echo ""
echo "Release $VERSION created successfully!"
echo ""
echo "Next steps:"
echo "  - Create GitHub release from tag"
echo "  - Upload release assets"
echo "  - Update changelog"
echo ""
