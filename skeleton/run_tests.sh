#!/bin/bash
# run_tests.sh - Run test suite

set -e

echo "Running tests..."

# Check if pytest is available
if command -v pytest &> /dev/null; then
    echo "Using pytest..."
    pytest tests/ -v
elif command -v python &> /dev/null; then
    echo "Using unittest..."
    python -m unittest discover tests/ -v
else
    echo "Error: No test runner found (pytest or python)"
    exit 1
fi

echo ""
echo "Tests complete!"
