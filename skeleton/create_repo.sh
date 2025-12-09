#!/bin/bash
# create_repo.sh - Wrapper script for repository creation

set -e

if [ $# -lt 1 ]; then
    echo "Usage: $0 <repo-name> [description] [template]"
    echo ""
    echo "Arguments:"
    echo "  repo-name    Name of the repository to create"
    echo "  description  Optional repository description"
    echo "  template     Optional template: basic (default), node, python"
    echo ""
    echo "Examples:"
    echo "  $0 my-project"
    echo "  $0 my-app \"My awesome app\" node"
    exit 1
fi

REPO_NAME=$1
DESCRIPTION=${2:-""}
TEMPLATE=${3:-"basic"}

echo "Creating repository: $REPO_NAME"
echo "Description: $DESCRIPTION"
echo "Template: $TEMPLATE"
echo ""

python repo_maker.py "$REPO_NAME" --description "$DESCRIPTION" --template "$TEMPLATE"

echo ""
echo "Repository created successfully!"
echo ""
echo "Next steps:"
echo "  cd $REPO_NAME"
echo "  git init"
echo "  git add ."
echo "  git commit -m \"Initial commit\""
echo ""
