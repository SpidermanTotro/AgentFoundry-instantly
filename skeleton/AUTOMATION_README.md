# Automation Guide

This guide covers the automation tools and scripts provided in the skeleton directory.

## Overview

The skeleton includes several automation scripts to streamline common development tasks:

1. **Repository Creation** - Automated repository scaffolding
2. **Agent Packaging** - Package agents for distribution
3. **Git Releases** - Automated release creation
4. **Testing** - Test execution
5. **GitHub Actions** - Automated repository health checks

## Repository Creation

### Using repo_maker.py

Create new repositories with standard structure:

```bash
python repo_maker.py my-project --description "My awesome project" --template python
```

Templates available:
- `basic` - Basic repository structure
- `node` - Node.js project with package.json
- `python` - Python project with setup.py

### Using create_repo.sh

Wrapper script for easier usage:

```bash
./create_repo.sh my-project "Description" python
```

This creates:
- Standard directory structure (src/, tests/, docs/)
- README.md
- .gitignore
- LICENSE
- GitHub workflows and issue templates
- Package configuration (package.json or setup.py)

## Agent Packaging

Package agents into distributable archives:

```bash
./package_agentpacks.sh [agents_dir] [output_dir] [version]
```

Example:
```bash
./package_agentpacks.sh agents dist/agentpacks 1.0.0
```

This creates `.tar.gz` archives with:
- Agent code
- metadata.json
- README.md

## Git Releases

Automated git release creation:

```bash
./git_release.sh v1.0.0 "Release description"
```

This:
1. Creates an annotated git tag
2. Pushes tag to remote
3. Provides instructions for GitHub release

## Testing

Run test suite:

```bash
./run_tests.sh
```

Automatically detects and uses:
- pytest (if available)
- unittest (fallback)

## GitHub Actions

### Repository Health Check

The skeleton includes a scheduled GitHub Action that:
- Runs weekly (configurable)
- Checks for repository activity
- Creates issues for stale repositories (30+ days inactive)
- Labels issues with 'repo-health' and 'update-suggested'

**Location**: `.github/workflows/repo_health_check.yml`

**Configuration**:
```yaml
schedule:
  - cron: '0 0 * * 0'  # Weekly on Sunday

staleness_days: 30
labels: ['repo-health', 'update-suggested']
```

**To enable**:
1. Copy to repository root `.github/workflows/`
2. Commit and push
3. Action runs automatically on schedule

**To disable**:
- Delete the workflow file, or
- Change the cron schedule to never run, or
- Adjust staleness threshold

### Issue Template

Automated issue creation uses this template:
- Location: `.github/ISSUE_TEMPLATE/update_repo.md`
- Creates standardized update request issues

## Dev Copilot Setup

Automated Dev Copilot environment setup:

```bash
./setup_devcopilot.sh
```

This:
1. Creates configuration directories
2. Generates default config.json
3. Installs Python dependencies
4. Provides setup instructions

## Development Lab

Start the Streamlit development lab:

```bash
./start_dev_lab.sh
```

This:
1. Checks dependencies
2. Installs Streamlit if needed
3. Creates necessary directories
4. Starts the web interface at http://localhost:8501

## Best Practices

### Automation Workflow

1. **Setup**: Run `setup_devcopilot.sh` once
2. **Development**: Use `start_dev_lab.sh` for interactive work
3. **Testing**: Run `run_tests.sh` before commits
4. **Packaging**: Use `package_agentpacks.sh` for distribution
5. **Releasing**: Use `git_release.sh` for version tags

### Script Permissions

Make scripts executable:
```bash
chmod +x skeleton/*.sh
```

### Environment Variables

Scripts respect these environment variables:
- `DEVCOPILOT_CONFIG` - Dev Copilot config path
- `AGENTS_DIR` - Agents directory (default: agents/)
- `OUTPUT_DIR` - Build output directory (default: dist/)

## Customization

### Modifying Templates

Repository templates are in `repo_maker.py`. To add custom templates:

1. Edit the `RepoMaker` class
2. Add template-specific methods (e.g., `_create_custom_template()`)
3. Update template choices in argparse

### Custom Workflows

To add custom GitHub Actions:
1. Create workflow file in `skeleton/.github/workflows/`
2. Document in this guide
3. Copy to repo root when ready to activate

## Troubleshooting

### Script Not Executable

```bash
chmod +x script_name.sh
```

### Python Module Not Found

```bash
pip install -r requirements.txt
pip install -r requirements-devcopilot.txt
```

### Streamlit Won't Start

Check:
1. Streamlit installed: `pip install streamlit`
2. Port 8501 available
3. web_agent_app.py exists

### GitHub Action Not Running

Check:
1. Workflow file in `.github/workflows/` (repo root)
2. Valid YAML syntax
3. Repository permissions for GitHub Actions

## Support

For issues or questions:
1. Check logs in `.devcopilot/logs/`
2. Review script output
3. See main repository documentation
4. Open an issue

## License

Same as parent repository.
