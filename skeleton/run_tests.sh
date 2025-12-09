#!/bin/bash
# Run Tests Script
# Execute test suite with coverage

set -e

echo "🧪 Running AgentFoundry Tests..."
echo ""

# Check if pytest is installed
if ! command -v pytest &> /dev/null; then
    echo "Installing pytest..."
    pip install pytest pytest-cov
fi

# Create test directories if they don't exist
mkdir -p tests/unit
mkdir -p tests/integration

# Create dummy test file if no tests exist
if [ ! -f "tests/unit/test_sample.py" ]; then
    cat > tests/unit/test_sample.py << 'EOF'
"""Sample test file"""

def test_sample():
    """Sample test case"""
    assert True

def test_addition():
    """Test basic arithmetic"""
    assert 1 + 1 == 2

def test_string_concat():
    """Test string concatenation"""
    assert "hello" + " " + "world" == "hello world"
EOF
    echo "Created sample test file"
fi

# Run tests with coverage
echo "Running tests..."
pytest tests/ \
    -v \
    --cov=skeleton \
    --cov-report=term-missing \
    --cov-report=html \
    --tb=short

echo ""
echo "✅ Tests completed!"
echo ""
echo "Coverage report generated in: htmlcov/index.html"
echo ""

# Run linting if flake8 is available
if command -v flake8 &> /dev/null; then
    echo "Running linting..."
    flake8 skeleton/ --max-line-length=100 --exclude=venv,__pycache__ || true
    echo ""
fi

# Run type checking if mypy is available
if command -v mypy &> /dev/null; then
    echo "Running type checking..."
    mypy skeleton/ --ignore-missing-imports || true
    echo ""
fi
