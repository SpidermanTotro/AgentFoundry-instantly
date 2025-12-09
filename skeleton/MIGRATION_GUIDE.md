# Migration Guide

Guide for migrating to the skeleton tooling system.

## Overview

This guide helps you integrate skeleton tools into your existing AgentFoundry project or migrate from manual workflows to automated tooling.

## Prerequisites

- Python 3.8+
- Git
- pip package manager

## Migration Paths

### Path 1: New Project

Starting a new project with skeleton tools:

```bash
# 1. Copy skeleton to your project
cp -r skeleton/ my-project/

# 2. Navigate to project
cd my-project

# 3. Setup environment
./setup_devcopilot.sh
chmod +x *.sh

# 4. Install dependencies
pip install -r requirements.txt

# 5. Start development lab
./start_dev_lab.sh
```

### Path 2: Existing Project

Adding skeleton tools to existing project:

```bash
# 1. Copy skeleton alongside your project
cp -r /path/to/skeleton/ ./

# 2. Setup
cd skeleton
./setup_devcopilot.sh
chmod +x *.sh

# 3. Install dependencies (optional, isolated)
pip install -r requirements.txt

# 4. Use tools as needed
```

### Path 3: Repository-Level Integration

Integrating automation at repository level:

```bash
# 1. Copy GitHub workflows to repo root
cp skeleton/.github/workflows/repo_health_check.yml .github/workflows/
cp skeleton/.github/ISSUE_TEMPLATE/update_repo.md .github/ISSUE_TEMPLATE/

# 2. Commit and push
git add .github/
git commit -m "Add repository health check automation"
git push

# 3. Action runs automatically on schedule
```

## Component Migration

### Dev Copilot

Migrating from manual code generation to Dev Copilot:

**Before**:
```bash
# Manual file creation
touch new_agent.py
nano new_agent.py
# ... manual coding ...
```

**After**:
```bash
# Template-based generation
python dev_copilot.py generate --template agent_stub --name new_agent
```

### Agent Management

Migrating from scattered agent files to organized management:

**Before**:
```
my-project/
├── agent1.py
├── agent2.py
└── utils.py
```

**After**:
```
my-project/
├── skeleton/
│   ├── web_agent_app.py
│   └── ...
└── agents/
    ├── agent1.py
    └── agent2.py
```

Use web interface:
```bash
cd skeleton
./start_dev_lab.sh
# Navigate to Agent Manager
```

### Testing

Migrating from manual testing to automated:

**Before**:
```bash
python -m pytest tests/
python -m unittest discover
```

**After**:
```bash
cd skeleton
./run_tests.sh
```

### Packaging

Migrating from manual packaging:

**Before**:
```bash
tar -czf agent.tar.gz agent.py
# ... manual process ...
```

**After**:
```bash
cd skeleton
./package_agentpacks.sh ../agents dist/agentpacks 1.0.0
```

## Configuration Migration

### Environment Variables

Update your `.env` or shell profile:

```bash
# Add to .bashrc or .zshrc
export DEVCOPILOT_CONFIG=skeleton/.devcopilot/config.json
export AGENTS_DIR=agents
```

### Git Integration

Update `.gitignore`:

```gitignore
# Dev Copilot
skeleton/.devcopilot/logs/
skeleton/generated/

# Agent outputs
agents/generated/
models/
*.pt
*.pth
```

## Data Migration

### Agent Files

If you have existing agents, organize them:

```bash
# Create agents directory
mkdir -p agents

# Move existing agents
mv *.py agents/

# Exclude non-agent files
mv agents/setup.py ./
mv agents/app.py ./
```

### Configuration Files

Migrate existing configs to skeleton structure:

```bash
# Copy existing config
cp config.json skeleton/.devcopilot/custom_config.json

# Update Dev Copilot to use it
python dev_copilot.py --config .devcopilot/custom_config.json
```

## GitHub Integration

### Workflow Migration

If you have existing GitHub Actions:

1. Review existing workflows in `.github/workflows/`
2. Compare with `skeleton/.github/workflows/repo_health_check.yml`
3. Merge or keep separate based on needs

```bash
# Keep both
cp skeleton/.github/workflows/repo_health_check.yml .github/workflows/

# Or merge into existing workflow
# Edit .github/workflows/main.yml and add health check job
```

### Issue Templates

Merge issue templates:

```bash
# Add to existing templates
cp skeleton/.github/ISSUE_TEMPLATE/update_repo.md .github/ISSUE_TEMPLATE/

# Or replace
rm -rf .github/ISSUE_TEMPLATE/
cp -r skeleton/.github/ISSUE_TEMPLATE/ .github/
```

## Rollback Plan

If migration issues occur:

### Rollback Scripts

```bash
# 1. Remove skeleton (if causing issues)
rm -rf skeleton/

# 2. Remove GitHub workflows
rm .github/workflows/repo_health_check.yml
rm .github/ISSUE_TEMPLATE/update_repo.md

# 3. Restore from git
git checkout -- .github/
```

### Gradual Migration

Migrate one component at a time:

1. **Week 1**: Dev Copilot only
2. **Week 2**: Add web_agent_app
3. **Week 3**: Add automation scripts
4. **Week 4**: Enable GitHub Actions

## Best Practices

### Directory Structure

Recommended structure after migration:

```
my-project/
├── skeleton/              # Skeleton tools (keep separate)
│   ├── dev_copilot.py
│   ├── web_agent_app.py
│   └── ...
├── agents/               # Your agent code
│   ├── agent1.py
│   └── agent2.py
├── src/                  # Application source
├── tests/                # Tests
├── .github/              # GitHub automation
│   ├── workflows/
│   │   └── repo_health_check.yml
│   └── ISSUE_TEMPLATE/
│       └── update_repo.md
└── README.md
```

### Version Control

Track skeleton tools in git:

```bash
# Add skeleton to version control
git add skeleton/
git commit -m "Add skeleton developer tools"

# Or keep separate
echo "skeleton/generated/" >> .gitignore
echo "skeleton/.devcopilot/logs/" >> .gitignore
```

### Dependency Management

Keep dependencies isolated:

```bash
# Option 1: Separate virtual environments
python -m venv venv-project
python -m venv venv-skeleton

# Option 2: Combined requirements
cat skeleton/requirements.txt >> requirements.txt
```

## Troubleshooting

### Import Errors

If Dev Copilot can't find modules:

```bash
# Ensure skeleton is in Python path
export PYTHONPATH="${PYTHONPATH}:./skeleton"

# Or install in development mode
cd skeleton
pip install -e .
```

### Path Issues

If scripts can't find files:

```bash
# Use absolute paths in config
{
  "templates_dir": "/absolute/path/to/skeleton/dev_copilot_templates",
  "output_dir": "/absolute/path/to/output"
}
```

### GitHub Action Not Triggering

Check:
1. Workflow file in `.github/workflows/` (repo root, not skeleton/)
2. Valid cron syntax
3. Repository permissions

## Support

For migration assistance:
1. Review component documentation
2. Check [AUTOMATION_README.md](AUTOMATION_README.md)
3. Open an issue with 'migration' label

## License

Same as parent repository.
