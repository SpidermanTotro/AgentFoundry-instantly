#!/bin/bash

# Test script to verify all functionality
# This script demonstrates that all checks, repairs, and automation work properly

set -e  # Exit on error

echo "==================================="
echo "AgentFoundry Comprehensive Test"
echo "==================================="
echo ""

echo "1. Testing Makefile help..."
make help
echo "✓ Makefile help works"
echo ""

echo "2. Cleaning previous builds..."
make clean
echo "✓ Clean complete"
echo ""

echo "3. Running code formatting (repair)..."
make repair
echo "✓ Code formatting complete"
echo ""

echo "4. Running all linters..."
make lint
echo "✓ All linters passed"
echo ""

echo "5. Running tests..."
make test
echo "✓ All tests passed"
echo ""

echo "6. Running tests with coverage..."
make test-coverage
echo "✓ Coverage report generated"
echo ""

echo "7. Running all checks (lint + test)..."
make check
echo "✓ All checks passed"
echo ""

echo "8. Testing package imports..."
python3 << 'EOF'
from agentfoundry import Agent, Task

# Create agent
agent = Agent('TestAgent', config={'model': 'gpt-4'})
print(f"  Created: {agent}")

# Create task
task = Task('test', 'Test task', parameters={'key': 'value'})
print(f"  Created: {task}")

# Execute
result = agent.execute(task)
print(f"  Result: {result['status']}")
EOF
echo "✓ Package functionality verified"
echo ""

echo "==================================="
echo "All tests PASSED! ✅"
echo "==================================="
echo ""
echo "Summary of available commands:"
echo "  make help          - Show all available commands"
echo "  make check         - Run all checks (lint + test)"
echo "  make repair        - Auto-repair code issues"
echo "  make lint          - Run linters"
echo "  make test          - Run tests"
echo "  make test-coverage - Run tests with coverage"
echo "  make clean         - Clean build artifacts"
echo "  make install       - Install dependencies"
echo "  make install-dev   - Install dev dependencies"
echo ""
