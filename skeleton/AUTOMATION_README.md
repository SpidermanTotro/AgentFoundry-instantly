# Automation System Documentation

## Overview

The AgentFoundry skeleton includes a comprehensive automation system designed to streamline development workflows, ensure code quality, and maintain repository health.

## Components

### 1. Repository Health Check (GitHub Action)

**Location**: `.github/workflows/repo_health_check.yml`

**Purpose**: Automated monitoring of repository activity and staleness detection

**Features**:
- Runs daily at 00:00 UTC (configurable via schedule)
- Checks for repository inactivity (30-day threshold)
- Creates labeled issues when staleness detected
- Non-destructive - only creates notifications
- Labels: `repo-health`, `update-suggested`

**Configuration**:
```yaml
schedule:
  - cron: '0 0 * * *'  # Daily at midnight UTC

staleness_threshold: 30  # Days of inactivity
```

**Disabling the Action**:
1. Navigate to `.github/workflows/repo_health_check.yml`
2. Add `if: false` to the job, or
3. Delete the workflow file, or
4. Disable from Settings → Actions → Workflows

### 2. Development Copilot

**Location**: `skeleton/dev_copilot.py`

**Purpose**: Offline-first AI coding assistant with template-driven scaffolding

**Features**:
- Generate agents from templates
- Offline mode (no internet required)
- Template-based code generation
- Metadata and helper generation

**Usage**:
```bash
# Setup
./skeleton/setup_devcopilot.sh

# List templates
python3 skeleton/dev_copilot.py list

# Scaffold new agent
python3 skeleton/dev_copilot.py scaffold my_agent --type conversational

# Generate from template
python3 skeleton/dev_copilot.py generate agent_stub output_file.py
```

### 3. Web Development Lab

**Location**: `skeleton/web_agent_app.py`

**Purpose**: Browser-based development environment using Streamlit

**Features**:
- Agent scaffolding UI
- Template browser
- Test runner
- Configuration editor
- Training lab interface

**Launch**:
```bash
./skeleton/start_dev_lab.sh
# or
streamlit run skeleton/web_agent_app.py
```

**Access**: http://localhost:8501

### 4. Repository Maker

**Location**: `skeleton/repo_maker.py`

**Purpose**: Automated repository creation and scaffolding

**Features**:
- Directory structure generation
- README, .gitignore, requirements.txt creation
- Git initialization
- Template-based setup

**Usage**:
```bash
# Using script
./skeleton/create_repo.sh my-new-repo

# Direct Python
python3 skeleton/repo_maker.py my-new-repo --template default
```

### 5. Agent Training

**Location**: `skeleton/train_agent.py`

**Purpose**: Agent training and fine-tuning utilities

**Usage**:
```bash
python3 skeleton/train_agent.py path/to/agent.py --epochs 10 --batch-size 32 --lr 0.001 --evaluate
```

### 6. Packaging System

**Location**: `skeleton/package_agentpacks.sh`

**Purpose**: Create distributable agent packages

**Features**:
- Bundles agents with metadata and helpers
- Creates tar.gz archives
- Generates package documentation
- Includes dependencies

**Usage**:
```bash
./skeleton/package_agentpacks.sh
```

**Output**: `dist/agentpacks/`

### 7. Release Automation

**Location**: `skeleton/git_release.sh`

**Purpose**: Automated git tagging and release workflow

**Features**:
- Semantic versioning
- Git tag creation
- Changelog generation
- Pre-release validation

**Usage**:
```bash
./skeleton/git_release.sh 1.0.0 "Initial release"
```

## Workflows

### Daily Development Workflow

1. **Start dev environment**:
   ```bash
   source venv/bin/activate
   ./skeleton/start_dev_lab.sh
   ```

2. **Create new agent**:
   - Use web UI (Agent Scaffold page), or
   - CLI: `python3 skeleton/dev_copilot.py scaffold agent_name`

3. **Test changes**:
   ```bash
   ./skeleton/run_tests.sh
   ```

4. **Package for distribution**:
   ```bash
   ./skeleton/package_agentpacks.sh
   ```

### Release Workflow

1. **Complete development**
2. **Run full test suite**: `./skeleton/run_tests.sh`
3. **Create release**: `./skeleton/git_release.sh X.Y.Z "Release notes"`
4. **Package agents**: `./skeleton/package_agentpacks.sh`
5. **Publish to GitHub Releases**

### Repository Health Workflow

1. **Action runs daily** (automatic)
2. **If staleness detected**: Issue created
3. **Review issue**: Assess suggested updates
4. **Take action**: Update repository or close issue
5. **Cycle continues**: Next check in 24 hours

## Configuration Files

### Dev Copilot Config

**Location**: `skeleton/.devcopilot/config.json`

**Key Settings**:
```json
{
  "enable_local_llm": false,
  "offline_mode": true,
  "template_directory": "dev_copilot_templates",
  "features": {
    "code_generation": true,
    "template_scaffolding": true
  }
}
```

### Workflow Config

**Location**: `.github/workflows/repo_health_check.yml`

**Customization**:
- Change schedule: Modify `cron` expression
- Adjust threshold: Change `staleness_threshold`
- Modify labels: Update issue labels

## Best Practices

1. **Keep offline mode enabled** for security and reliability
2. **Review health check issues** within 48 hours
3. **Use semantic versioning** for releases
4. **Run tests before releases** to ensure quality
5. **Package agents consistently** for distribution
6. **Document configurations** when changing defaults

## Troubleshooting

### Dev Copilot not working
- Verify Python 3.8+ installed
- Check dependencies: `pip install -r skeleton/requirements-devcopilot.txt`
- Verify config file exists: `skeleton/.devcopilot/config.json`

### Streamlit won't start
- Install Streamlit: `pip install streamlit`
- Check port 8501 not in use: `lsof -i :8501`
- Try different port: `streamlit run skeleton/web_agent_app.py --server.port 8502`

### Tests failing
- Install test dependencies: `pip install pytest pytest-cov`
- Create test directories: `mkdir -p tests/unit tests/integration`
- Check test file syntax

### Health check not running
- Verify workflow file in `.github/workflows/`
- Check Actions enabled in repository settings
- Review workflow logs in Actions tab

## Security Notes

- Local LLM disabled by default (no external API calls)
- Offline mode prevents unintended network requests
- Health check only creates issues (non-destructive)
- Scripts include input validation
- No secrets stored in configuration files

## Support

For issues or questions:
1. Check this documentation
2. Review skeleton/README.md
3. Check GitHub Issues
4. Refer to individual tool documentation

## Future Enhancements

Planned features:
- Enhanced training capabilities
- Additional templates
- Integration with more IDEs
- Advanced health metrics
- Automated dependency updates
