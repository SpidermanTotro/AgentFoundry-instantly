# Contributing to AgentFoundry Skeleton

Thank you for your interest in contributing to the AgentFoundry Skeleton project! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Submission Guidelines](#submission-guidelines)
- [Community](#community)

## Code of Conduct

This project adheres to a code of conduct that all contributors are expected to follow:

- **Be respectful**: Treat everyone with respect and kindness
- **Be collaborative**: Work together constructively
- **Be inclusive**: Welcome diverse perspectives
- **Be professional**: Maintain professional communication
- **Be patient**: Help newcomers learn and grow

## Getting Started

### Prerequisites

- Python 3.8 or higher
- Git
- Basic understanding of Python development
- Familiarity with GitHub workflows

### First Contribution

1. **Find an issue**: Browse [open issues](https://github.com/your-repo/issues)
2. **Comment**: Express interest and ask questions
3. **Get assigned**: Wait for maintainer assignment
4. **Start coding**: Follow development setup below

Good first issues are labeled with `good-first-issue`.

## Development Setup

### 1. Fork and Clone

```bash
# Fork on GitHub, then clone your fork
git clone https://github.com/YOUR-USERNAME/AgentFoundry-instantly.git
cd AgentFoundry-instantly
```

### 2. Set Up Development Environment

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install development dependencies
pip install -r skeleton/requirements-devcopilot.txt

# Install testing tools
pip install pytest pytest-cov black flake8 mypy
```

### 3. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 4. Configure Dev Tools

```bash
# Setup dev copilot
./skeleton/setup_devcopilot.sh

# Verify setup
python3 skeleton/dev_copilot.py config
```

## How to Contribute

### Types of Contributions

We welcome:

1. **Bug Fixes**: Fix reported issues
2. **New Features**: Add new functionality
3. **Documentation**: Improve or add docs
4. **Templates**: Create new code templates
5. **Tests**: Add or improve test coverage
6. **Examples**: Provide usage examples
7. **Performance**: Optimize existing code

### Contribution Workflow

1. **Discuss**: For large changes, open an issue first
2. **Develop**: Make your changes in a feature branch
3. **Test**: Ensure all tests pass
4. **Document**: Update relevant documentation
5. **Commit**: Use clear commit messages
6. **Push**: Push to your fork
7. **PR**: Open a pull request

## Coding Standards

### Python Style

Follow [PEP 8](https://pep8.org/) with these specifics:

- **Line length**: Maximum 100 characters
- **Indentation**: 4 spaces (no tabs)
- **Quotes**: Use double quotes for strings
- **Imports**: Grouped and sorted (stdlib, third-party, local)

### Code Formatting

Use Black for automatic formatting:

```bash
black skeleton/
```

### Linting

Run flake8 before committing:

```bash
flake8 skeleton/ --max-line-length=100
```

### Type Hints

Use type hints for function signatures:

```python
def process_data(input_data: str, config: Dict[str, Any]) -> bool:
    """Process input data."""
    pass
```

### Docstrings

Use Google-style docstrings:

```python
def scaffold_agent(name: str, agent_type: str = "default") -> bool:
    """
    Scaffold a new agent with all necessary files.
    
    Args:
        name: Agent name in snake_case
        agent_type: Type of agent to create
        
    Returns:
        True if successful, False otherwise
        
    Raises:
        ValueError: If name is invalid
    """
    pass
```

## Testing Guidelines

### Writing Tests

- Place tests in `tests/` directory
- Mirror source structure: `skeleton/dev_copilot.py` → `tests/test_dev_copilot.py`
- Use descriptive test names: `test_scaffold_agent_creates_files`
- Test edge cases and error conditions

### Test Structure

```python
import pytest
from skeleton.dev_copilot import DevCopilot

def test_scaffold_agent_success():
    """Test successful agent scaffolding."""
    copilot = DevCopilot()
    result = copilot.scaffold_agent("test_agent", "default")
    assert result is True

def test_scaffold_agent_invalid_name():
    """Test scaffolding with invalid name."""
    copilot = DevCopilot()
    with pytest.raises(ValueError):
        copilot.scaffold_agent("Invalid-Name!", "default")
```

### Running Tests

```bash
# Run all tests
./skeleton/run_tests.sh

# Run specific test file
pytest tests/test_dev_copilot.py -v

# Run with coverage
pytest tests/ --cov=skeleton --cov-report=html
```

### Test Coverage

- Aim for >80% code coverage
- All new features must include tests
- Bug fixes should include regression tests

## Submission Guidelines

### Commit Messages

Use conventional commits format:

```
type(scope): Short description

Longer description if needed

Fixes #123
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

**Examples**:
```
feat(copilot): Add support for custom templates

docs(readme): Update installation instructions

fix(health-check): Correct staleness calculation
Fixes #42
```

### Pull Request Process

1. **Update docs**: Ensure documentation is current
2. **Add tests**: Include tests for new features
3. **Run tests**: Verify all tests pass
4. **Update changelog**: Add entry to CHANGELOG.md
5. **Create PR**: Use PR template
6. **Address feedback**: Respond to review comments
7. **Merge**: Maintainer will merge when approved

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Testing
How has this been tested?

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] No new warnings
```

### Review Process

- Maintainers review within 3-5 business days
- Address feedback promptly
- Be open to suggestions
- Update PR based on reviews
- Squash commits if requested

## Adding New Templates

### Template Guidelines

1. **Use placeholders**: `{{ variable_name }}`
2. **Include docstrings**: Comprehensive documentation
3. **Follow conventions**: Match existing code style
4. **Provide examples**: Show usage in docstring
5. **Test thoroughly**: Ensure template generates valid code

### Template Checklist

- [ ] Template file in `skeleton/dev_copilot_templates/`
- [ ] Uses clear placeholder names
- [ ] Includes comprehensive docstrings
- [ ] Generates valid, working code
- [ ] Tested with various inputs
- [ ] Documented in README

### Example Template PR

```markdown
## New Template: REST API Endpoint

Adds template for generating REST API endpoints with Flask.

**Template**: `skeleton/dev_copilot_templates/api_endpoint.py`

**Features**:
- Request validation
- Error handling
- Response formatting
- OpenAPI documentation

**Usage**:
```bash
python3 skeleton/dev_copilot.py generate api_endpoint user_api.py
```
```

## Documentation Contributions

### Documentation Standards

- **Clear and concise**: Simple language
- **Examples included**: Show don't just tell
- **Up to date**: Reflect current code
- **Well organized**: Logical structure
- **Proofread**: No typos or errors

### Documentation Locations

- **README.md**: Overview and quick start
- **AUTOMATION_README.md**: Automation details
- **README_COPILOT.md**: Dev Copilot guide
- **MIGRATION_GUIDE.md**: Migration instructions
- **CONTRIBUTING.md**: This file
- **Inline docs**: Docstrings and comments

## Community

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **Pull Requests**: Code contributions and discussions
- **Discussions**: General questions and ideas

### Getting Help

- Check existing documentation
- Search closed issues
- Ask in GitHub Discussions
- Tag maintainers if urgent

### Recognition

Contributors are recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project README

## Release Process

Maintainers handle releases:

1. Version bump following [semantic versioning](https://semver.org/)
2. Update CHANGELOG.md
3. Create git tag
4. Publish release notes
5. Announce release

## Questions?

If you have questions:

1. Check documentation
2. Search existing issues
3. Open a new issue
4. Tag with `question` label

## Thank You!

Your contributions make this project better. Thank you for taking the time to contribute!

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
