#!/bin/bash
# Git Release Script
# Automated git tagging and release workflow

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

if [ $# -eq 0 ]; then
    echo "Usage: $0 <version> [release_notes]"
    echo ""
    echo "Examples:"
    echo "  $0 1.0.0 'Initial release'"
    echo "  $0 1.1.0 'Added new features'"
    exit 1
fi

VERSION="$1"
RELEASE_NOTES="${2:-Release $VERSION}"

echo -e "${GREEN}🚀 Creating Git Release${NC}"
echo "   Version: $VERSION"
echo "   Notes: $RELEASE_NOTES"
echo ""

# Validate version format
if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo -e "${RED}❌ Invalid version format. Use semantic versioning (e.g., 1.0.0)${NC}"
    exit 1
fi

# Check if working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  Working directory has uncommitted changes${NC}"
    read -p "Commit changes before creating release? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "Pre-release commit for v$VERSION"
    else
        echo -e "${RED}❌ Please commit or stash changes before creating release${NC}"
        exit 1
    fi
fi

# Create git tag
echo "Creating tag: v$VERSION"
git tag -a "v$VERSION" -m "$RELEASE_NOTES"

# Push tag
echo "Pushing tag to remote..."
git push origin "v$VERSION"

# Create changelog entry
CHANGELOG_FILE="CHANGELOG.md"
if [ ! -f "$CHANGELOG_FILE" ]; then
    echo "# Changelog" > "$CHANGELOG_FILE"
    echo "" >> "$CHANGELOG_FILE"
fi

# Prepend new version to changelog
DATE=$(date +%Y-%m-%d)
{
    echo "## [$VERSION] - $DATE"
    echo ""
    echo "$RELEASE_NOTES"
    echo ""
    cat "$CHANGELOG_FILE"
} > "$CHANGELOG_FILE.tmp"
mv "$CHANGELOG_FILE.tmp" "$CHANGELOG_FILE"

echo ""
echo -e "${GREEN}✅ Release v$VERSION created successfully!${NC}"
echo ""
echo "Next steps:"
echo "  1. Create GitHub release: https://github.com/YOUR_REPO/releases/new?tag=v$VERSION"
echo "  2. Update CHANGELOG.md with detailed changes"
echo "  3. Announce the release"
echo ""
