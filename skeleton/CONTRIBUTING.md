# Contributing Guide

Thank you for your interest in contributing to AgentFoundry!

## Code of Conduct

Be respectful, inclusive, and collaborative.

## Getting Started

### 1. Fork and Clone

```bash
# Fork on GitHub, then clone
git clone https://github.com/YOUR_USERNAME/AgentFoundry-instantly.git
cd AgentFoundry-instantly
```

### 2. Setup Development Environment

```bash
# Navigate to skeleton
cd skeleton

# Setup Dev Copilot
./setup_devcopilot.sh

# Make scripts executable
chmod +x *.sh

# Install dependencies
pip install -r requirements.txt
pip install -r requirements-devcopilot.txt
```

### 3. Create Branch

```bash
git checkout -b feature/your-feature-name
```

## Development Workflow

### Using Dev Copilot

Generate new components:

```bash
python dev_copilot.py generate --template agent_stub --name MyFeature
```

Review your code:

```bash
python dev_copilot.py review --file path/to/code.py
```

### Using Development Lab

Start the lab for interactive development:

```bash
./start_dev_lab.sh
```

Navigate to http://localhost:8501

## Contribution Types

### 1. Bug Fixes

1. Create issue describing bug
2. Create branch: `fix/issue-number-description`
3. Fix bug with minimal changes
4. Add test case
5. Submit PR

### 2. New Features

1. Discuss in issue first
2. Create branch: `feature/feature-name`
3. Implement feature
4. Add tests and documentation
5. Submit PR

### 3. Documentation

1. Create branch: `docs/what-youre-documenting`
2. Update or add documentation
3. Submit PR

### 4. Templates

Adding new Dev Copilot templates:

1. Create template in `dev_copilot_templates/`
2. Follow naming: `template_name.py`
3. Use placeholders: `{{name}}`, `{{class_name}}`
4. Document in README_COPILOT.md
5. Submit PR

## Code Style

### Python

- Follow PEP 8
- Use type hints where helpful
- Maximum line length: 100 characters
- Docstrings for all public functions

Example:

```python
def process_agent(agent_name: str, config: dict) -> dict:
    """
    Process agent with given configuration.
    
    Args:
        agent_name: Name of the agent
        config: Configuration dictionary
        
    Returns:
        Processing result dictionary
    """
    pass
```

### Shell Scripts

- Use `set -e` for error handling
- Add descriptive comments
- Check for required arguments
- Provide usage help

Example:

```bash
#!/bin/bash
# script_name.sh - Short description

set -e

if [ $# -lt 1 ]; then
    echo "Usage: $0 <required-arg>"
    exit 1
fi
```

### JavaScript/TypeScript

- Follow repository conventions
- Use ESLint configuration
- Prefer functional components (React)

## Testing

### Run Tests

```bash
./run_tests.sh
```

### Write Tests

Add tests for new features:

```python
# tests/test_my_feature.py
import unittest
from skeleton.my_feature import MyFeature

class TestMyFeature(unittest.TestCase):
    def test_basic_functionality(self):
        feature = MyFeature()
        result = feature.process()
        self.assertIsNotNone(result)
```

### Test Coverage

Aim for 80%+ coverage on new code.

## Documentation

### Code Documentation

- Docstrings for all public APIs
- Inline comments for complex logic
- README updates for new features

### User Documentation

Update relevant docs:
- README.md
- AUTOMATION_README.md
- MIGRATION_GUIDE.md
- README_COPILOT.md

## Pull Request Process

### Before Submitting

1. **Test**: Run `./run_tests.sh`
2. **Lint**: Check code style
3. **Document**: Update docs
4. **Commit**: Clear, descriptive commits

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Template

## Testing
How to test these changes

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Code follows style guide
- [ ] Commits are clear
```

### Review Process

1. Submit PR
2. Automated checks run
3. Maintainer reviews
4. Address feedback
5. Approval and merge

## Commit Messages

### Format

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

### Examples

```
feat(dev-copilot): add interactive mode

Add interactive mode to Dev Copilot for real-time
code generation and review.

Closes #123
```

```
fix(web-app): correct agent list display

Agent names were not displaying correctly in the
manager interface. Fixed by updating the state
management logic.
```

## Development Tips

### Local Testing

Test scripts locally before PR:

```bash
# Test in isolated directory
mkdir /tmp/test-feature
cp -r skeleton /tmp/test-feature/
cd /tmp/test-feature/skeleton
./start_dev_lab.sh
```

### Debugging

Use Dev Copilot for debugging:

```bash
python dev_copilot.py review --file problematic_file.py
```

### Performance

- Profile before optimizing
- Keep changes minimal
- Consider backwards compatibility

## Community

### Getting Help

- Check existing issues
- Ask in discussions
- Review documentation

### Reporting Issues

Use issue templates:
- Bug report
- Feature request
- Documentation improvement

Include:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details

## Recognition

Contributors are acknowledged in:
- CONTRIBUTORS.md (if exists)
- Release notes
- Project README

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (ISC).

## Questions?

Open an issue with the 'question' label or check existing documentation.

Thank you for contributing! 🎉
