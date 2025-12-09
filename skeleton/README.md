# AgentFoundry Skeleton - Offline-First Developer Tooling

This directory contains offline-first developer tools and automation scripts for AgentFoundry development.

## 🚀 Quick Start

1. **Setup Dev Copilot** (offline-first AI assistant):
   ```bash
   chmod +x skeleton/setup_devcopilot.sh
   ./skeleton/setup_devcopilot.sh
   ```

2. **Start Development Lab** (Streamlit-based testing):
   ```bash
   chmod +x skeleton/start_dev_lab.sh
   ./skeleton/start_dev_lab.sh
   ```

3. **Run Tests**:
   ```bash
   chmod +x skeleton/run_tests.sh
   ./skeleton/run_tests.sh
   ```

## 📂 Contents

### Core Tools
- **dev_copilot.py** - Offline-first AI coding assistant with template generation
- **web_agent_app.py** - Streamlit web interface for agent development and testing
- **train_agent.py** - Agent training and fine-tuning utilities
- **repo_maker.py** - Automated repository scaffolding and setup

### Templates
- **dev_copilot_templates/** - Code generation templates for agents, metadata, and helpers

### Automation Scripts
- **setup_devcopilot.sh** - One-command setup for dev copilot environment
- **create_repo.sh** - Automated repository creation from templates
- **package_agentpacks.sh** - Package agents for distribution
- **git_release.sh** - Automated git release workflow
- **start_dev_lab.sh** - Launch Streamlit development lab
- **run_tests.sh** - Execute test suite

### Documentation
- **AUTOMATION_README.md** - Automation system documentation
- **README_COPILOT.md** - Dev Copilot usage guide
- **MIGRATION_GUIDE.md** - Guide for migrating existing projects
- **CONTRIBUTING.md** - Contribution guidelines
- **UNIVERSITY_GUIDE.md** - Educational resources for students
- **CLASSROOM_UPGRADE_INTRO.md** - Classroom deployment guide

### Configuration
- **.devcopilot/config.json** - Dev Copilot configuration (local LLM disabled by default)

### GitHub Automation
- **.github/workflows/repo_health_check.yml** - Scheduled repository health monitoring
- **.github/ISSUE_TEMPLATE/update_repo.md** - Issue template for repository updates

## 🔧 Requirements

Install dependencies:
```bash
pip install -r skeleton/requirements.txt
```

For Dev Copilot features:
```bash
pip install -r skeleton/requirements-devcopilot.txt
```

## 🎯 Features

- **Offline-First**: Tools work without internet connectivity
- **Template-Driven**: Rapid agent and component scaffolding
- **Web Interface**: Browser-based development lab with Streamlit
- **Automated Testing**: Integrated test runners and validation
- **Repository Health**: Automated staleness detection and issue creation
- **Educational**: University and classroom resources included

## 📋 Testing the Skeleton

1. Apply the skeleton as a patch:
   ```bash
   git apply --check skeleton/
   ```

2. Make scripts executable:
   ```bash
   chmod +x skeleton/*.sh
   ```

3. Install dependencies:
   ```bash
   pip install -r skeleton/requirements.txt
   ```

4. Run the development lab:
   ```bash
   streamlit run skeleton/web_agent_app.py
   ```

## 🔒 Security

- Local LLM integration disabled by default (configure in `.devcopilot/config.json`)
- All network requests are opt-in
- Secrets are never logged or stored in plain text

## 📖 Learn More

- See [AUTOMATION_README.md](AUTOMATION_README.md) for automation details
- See [README_COPILOT.md](README_COPILOT.md) for Dev Copilot guide
- See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for migration instructions
- See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines

## 🎓 Education

- [UNIVERSITY_GUIDE.md](UNIVERSITY_GUIDE.md) - Resources for university courses
- [CLASSROOM_UPGRADE_INTRO.md](CLASSROOM_UPGRADE_INTRO.md) - Classroom deployment

## 📝 License

Same as parent repository - see main LICENSE file.
