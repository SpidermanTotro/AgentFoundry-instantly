# Skeleton - Offline-First Developer Tooling

This directory contains offline-first developer tooling and automation for AgentFoundry projects.

## Overview

The skeleton provides:

- **Dev Copilot CLI**: Offline development assistant with local LLM support
- **Web Agent App**: Streamlit-based agent manager and training lab
- **Automation Scripts**: Repository creation, packaging, and release tools
- **GitHub Actions**: Automated repository health checks

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
pip install -r requirements-devcopilot.txt
```

### 2. Make Scripts Executable

```bash
chmod +x skeleton/*.sh
```

### 3. Start the Dev Lab

```bash
cd skeleton
./start_dev_lab.sh
```

Then open http://localhost:8501 in your browser.

## Directory Structure

```
skeleton/
├── README.md                    # This file
├── README_COPILOT.md           # Dev Copilot documentation
├── MIGRATION_GUIDE.md          # Migration guide
├── CONTRIBUTING.md             # Contribution guidelines
├── UNIVERSITY_GUIDE.md         # Academic usage guide
├── CLASSROOM_UPGRADE_INTRO.md  # Classroom setup guide
├── AUTOMATION_README.md        # Automation documentation
├── dev_copilot.py              # Offline Dev Copilot CLI
├── web_agent_app.py            # Streamlit agent manager
├── reminder_panel.py           # Training reminder panel
├── train_agent.py              # Agent training tool
├── repo_maker.py               # Repository creation tool
├── requirements.txt            # Python dependencies
├── requirements-devcopilot.txt # Dev Copilot dependencies
├── setup_devcopilot.sh         # Dev Copilot setup script
├── create_repo.sh              # Repository creation script
├── package_agentpacks.sh       # Agent packaging script
├── git_release.sh              # Release automation script
├── start_dev_lab.sh            # Lab startup script
├── run_tests.sh                # Test runner script
├── dev_copilot_templates/      # Agent templates
│   ├── agent_stub.py
│   ├── metadata.py
│   └── read_helper.py
├── .devcopilot/                # Dev Copilot config
│   └── config.json
├── .github/                    # GitHub automation
│   ├── workflows/
│   │   └── repo_health_check.yml
│   └── ISSUE_TEMPLATE/
│       └── update_repo.md
└── assets/                     # Assets
    └── highres_screenshot.svg
```

## Components

### Dev Copilot CLI
Offline development assistant that works with local LLMs. Disabled by default - requires manual model download and configuration.

See [README_COPILOT.md](README_COPILOT.md) for setup instructions.

### Web Agent App
Streamlit-based development lab providing:
- Agent manager
- Assistant interface
- Training tools
- Reminder panel

### Automation Scripts
Collection of shell scripts for common development tasks:
- Repository creation
- Agent packaging
- Git releases
- Testing

### GitHub Actions
Automated repository health checks that create issues for stale repositories.

## Configuration

### Dev Copilot
Edit `.devcopilot/config.json` to configure local LLM settings.

### GitHub Action
The health check runs on a schedule (default: weekly) and creates issues for repositories inactive for 30+ days.

## Usage

See individual component documentation for detailed usage:
- [Dev Copilot Guide](README_COPILOT.md)
- [Migration Guide](MIGRATION_GUIDE.md)
- [Contributing Guide](CONTRIBUTING.md)
- [University Guide](UNIVERSITY_GUIDE.md)
- [Automation Guide](AUTOMATION_README.md)

## License

Same as parent repository.
