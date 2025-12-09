# Migration Guide

## Migrating Existing Projects to AgentFoundry Skeleton

This guide helps you integrate the AgentFoundry skeleton tooling into existing projects.

## Overview

The skeleton provides offline-first development tools that can be integrated into any existing repository without disrupting current workflows.

## Migration Strategies

### Strategy 1: Full Integration (Recommended)

Integrate all skeleton features into your existing project.

**Steps**:

1. **Backup your project**:
   ```bash
   git checkout -b pre-skeleton-backup
   git checkout main
   ```

2. **Copy skeleton directory**:
   ```bash
   cp -r /path/to/AgentFoundry-skeleton/skeleton ./
   ```

3. **Install dependencies**:
   ```bash
   pip install -r skeleton/requirements.txt
   pip install -r skeleton/requirements-devcopilot.txt
   ```

4. **Configure for your project**:
   Edit `skeleton/.devcopilot/config.json`:
   ```json
   {
     "template_directory": "skeleton/dev_copilot_templates",
     "output_directory": "src/agents",  // Your project structure
     "offline_mode": true
   }
   ```

5. **Update .gitignore**:
   ```
   skeleton/generated/
   skeleton/logs/
   skeleton/.devcopilot/*.log
   ```

6. **Enable health check** (optional):
   ```bash
   mkdir -p .github/workflows
   cp skeleton/.github/workflows/repo_health_check.yml .github/workflows/
   ```

7. **Test integration**:
   ```bash
   ./skeleton/setup_devcopilot.sh
   python3 skeleton/dev_copilot.py list
   ```

### Strategy 2: Partial Integration

Select specific tools that fit your workflow.

**Common Selections**:

- **Dev Copilot only**: Copy `dev_copilot.py`, templates, and config
- **Web Lab only**: Copy `web_agent_app.py` and requirements
- **Automation only**: Copy shell scripts
- **Health Check only**: Copy GitHub workflow files

**Example** (Dev Copilot only):
```bash
mkdir -p tools/devcopilot
cp skeleton/dev_copilot.py tools/devcopilot/
cp -r skeleton/dev_copilot_templates tools/devcopilot/
cp -r skeleton/.devcopilot tools/devcopilot/
```

### Strategy 3: Reference Integration

Keep skeleton separate and reference it from your project.

**Steps**:

1. **Add as submodule**:
   ```bash
   git submodule add https://github.com/your-repo/skeleton skeleton-tools
   ```

2. **Create wrapper scripts**:
   ```bash
   # scripts/scaffold.sh
   #!/bin/bash
   python3 skeleton-tools/dev_copilot.py scaffold "$@"
   ```

3. **Update paths in config**:
   Point to your project directories in config files

## Project-Specific Configurations

### Python Projects

```json
{
  "template_directory": "skeleton/dev_copilot_templates",
  "output_directory": "src/",
  "features": {
    "code_generation": true,
    "syntax_checking": true
  }
}
```

Update templates to match your:
- Import style
- Code formatting (Black, autopep8, etc.)
- Type hints usage
- Docstring format (Google, NumPy, reStructuredText)

### JavaScript/TypeScript Projects

While skeleton is Python-focused, you can:

1. Use shell scripts (language-agnostic)
2. Adapt Python tools as reference
3. Create JavaScript equivalents
4. Use web UI for visual tools

### Monorepo Projects

Configure separate output directories per package:

```json
{
  "configurations": {
    "backend": {
      "output_directory": "packages/backend/src"
    },
    "frontend": {
      "output_directory": "packages/frontend/src"
    }
  }
}
```

## Customizing Templates

### Adapt to Your Code Style

**Example**: Add company header to templates

```python
# skeleton/dev_copilot_templates/agent_stub.py
"""
{{ agent_name }}

Copyright (c) 2024 Your Company
Licensed under XYZ License
"""

# ... rest of template
```

### Match Your Architecture

Update templates to match your architecture patterns:

**Example**: Add base class inheritance

```python
from your_framework import BaseAgent

class {{ class_name }}Agent(BaseAgent):  # Inherit from your base
    """{{ description }}"""
    
    def __init__(self, config=None):
        super().__init__(config)  # Call parent constructor
        # Your initialization
```

### Add Custom Templates

Create project-specific templates:

```bash
# skeleton/dev_copilot_templates/api_endpoint.py
# skeleton/dev_copilot_templates/database_model.py
# skeleton/dev_copilot_templates/test_case.py
```

## Integrating with Existing Tools

### CI/CD Integration

#### GitHub Actions

Add to your existing workflow:

```yaml
# .github/workflows/ci.yml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run skeleton tests
        run: ./skeleton/run_tests.sh
```

#### GitLab CI

```yaml
# .gitlab-ci.yml
test:
  script:
    - ./skeleton/run_tests.sh
```

### IDE Integration

#### VS Code

Add tasks (`.vscode/tasks.json`):
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Dev Lab",
      "type": "shell",
      "command": "./skeleton/start_dev_lab.sh"
    }
  ]
}
```

#### PyCharm

Add External Tools (Settings → Tools → External Tools):
- Name: "Scaffold Agent"
- Program: `python3`
- Arguments: `skeleton/dev_copilot.py scaffold $Prompt$`

### Package Managers

#### With Poetry

```toml
# pyproject.toml
[tool.poetry.scripts]
scaffold = "skeleton.dev_copilot:main"
dev-lab = "skeleton.start_dev_lab:main"
```

#### With setuptools

```python
# setup.py
setup(
    entry_points={
        'console_scripts': [
            'scaffold=skeleton.dev_copilot:main',
        ],
    }
)
```

## Migration Checklist

- [ ] Backup existing project
- [ ] Choose migration strategy
- [ ] Copy/reference skeleton files
- [ ] Install dependencies
- [ ] Update configuration for project structure
- [ ] Customize templates for code style
- [ ] Update .gitignore
- [ ] Test dev copilot functionality
- [ ] Integrate with existing CI/CD
- [ ] Update team documentation
- [ ] Train team on new tools
- [ ] Enable health check (optional)

## Troubleshooting Migration Issues

### Import Conflicts

**Problem**: Skeleton modules conflict with existing modules

**Solution**: Rename skeleton directory or use aliased imports
```python
import skeleton.dev_copilot as skel_copilot
```

### Path Issues

**Problem**: Scripts can't find templates or config

**Solution**: Use absolute paths or set PYTHONPATH
```bash
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
```

### Dependency Conflicts

**Problem**: Skeleton requirements conflict with existing requirements

**Solution**: Use separate virtual environment or optional dependencies
```toml
[tool.poetry.extras]
skeleton = ["streamlit", "jinja2"]
```

### Permission Issues

**Problem**: Scripts not executable

**Solution**: Set execute permissions
```bash
chmod +x skeleton/*.sh
```

## Rolling Back

If migration causes issues:

1. **Restore from backup**:
   ```bash
   git checkout pre-skeleton-backup
   ```

2. **Remove skeleton files**:
   ```bash
   rm -rf skeleton/
   git checkout main
   ```

3. **Reinstall original dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Gradual Migration

Start small and expand:

1. **Week 1**: Install skeleton, explore tools
2. **Week 2**: Use dev copilot for new agents only
3. **Week 3**: Integrate web lab for team
4. **Week 4**: Enable automation scripts
5. **Week 5**: Activate health check
6. **Week 6**: Full team adoption

## Team Coordination

### Communication Plan

1. **Announce**: Share migration plan with team
2. **Train**: Conduct training sessions
3. **Document**: Update internal wiki/docs
4. **Support**: Designate skeleton champions
5. **Feedback**: Collect and address feedback

### Training Resources

- Schedule demo sessions
- Create quick-start guides
- Record video tutorials
- Set up office hours for questions

## Success Metrics

Track adoption:
- Number of agents generated
- Dev lab usage frequency
- Test automation adoption
- Health check issue response time
- Team satisfaction scores

## Best Practices

1. **Start with one tool** - Don't overwhelm team
2. **Customize for your needs** - Templates should match your style
3. **Get team buy-in** - Address concerns early
4. **Document changes** - Update project docs
5. **Monitor usage** - Track what works
6. **Iterate** - Improve based on feedback

## Support

- Check `AUTOMATION_README.md` for detailed documentation
- Review `README_COPILOT.md` for usage guide
- Open issues for problems
- Contact maintainers for help

## Next Steps

After successful migration:
1. Customize templates for your domain
2. Create project-specific workflows
3. Share lessons learned with team
4. Contribute improvements back to skeleton
