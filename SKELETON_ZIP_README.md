# AgentFoundry Skeleton - Distribution Package

## 📦 What's Included

This zip file contains the complete AgentFoundry Skeleton toolkit - a comprehensive offline-first developer tooling system.

### Contents

- **27 skeleton files** - Complete development toolkit
- **Core Tools** - Python scripts for agent development
- **Automation Scripts** - Shell scripts for common tasks
- **Templates** - Code generation templates
- **Documentation** - Comprehensive guides
- **Configuration** - Pre-configured settings
- **GitHub Workflows** - Repository health monitoring

## 🚀 Quick Start

### 1. Extract the Archive

```bash
unzip agentfoundry-skeleton.zip
cd skeleton
```

### 2. Setup Environment

```bash
chmod +x *.sh
./setup_devcopilot.sh
```

### 3. Start Development Lab

```bash
source venv/bin/activate  # If using virtual environment
./start_dev_lab.sh
```

Access the web UI at: http://localhost:8501

## 📋 What You Get

### Core Tools (Python)
- `dev_copilot.py` - Offline AI coding assistant
- `web_agent_app.py` - Streamlit development lab
- `repo_maker.py` - Repository scaffolding
- `train_agent.py` - Agent training utilities
- `reminder_panel.py` - UI component

### Templates
- `agent_stub.py` - Agent class template
- `metadata.py` - Metadata template
- `read_helper.py` - Helper utilities template

### Automation Scripts (Shell)
- `setup_devcopilot.sh` - Environment setup
- `create_repo.sh` - Create new repositories
- `package_agentpacks.sh` - Package agents
- `git_release.sh` - Release automation
- `start_dev_lab.sh` - Launch web lab
- `run_tests.sh` - Run test suite

### Documentation
- `README.md` - Overview and quick start
- `AUTOMATION_README.md` - System documentation
- `README_COPILOT.md` - Dev Copilot guide
- `MIGRATION_GUIDE.md` - Integration guide
- `CONTRIBUTING.md` - Contribution guidelines
- `UNIVERSITY_GUIDE.md` - Educational resources
- `CLASSROOM_UPGRADE_INTRO.md` - Classroom guide

### GitHub Automation
- `.github/workflows/repo_health_check.yml` - Health monitoring
- `.github/ISSUE_TEMPLATE/update_repo.md` - Issue template

## 🔧 System Requirements

- **Python**: 3.8 or higher
- **OS**: Linux, macOS, or Windows (WSL recommended)
- **RAM**: 2GB minimum, 4GB recommended
- **Disk**: 500MB free space

## 📖 Usage Examples

### Generate New Agent

```bash
python3 dev_copilot.py scaffold my_agent --type conversational
```

Creates:
- `generated/my_agent.py`
- `generated/my_agent_metadata.py`
- `generated/my_agent_helper.py`

### Create New Repository

```bash
./create_repo.sh my-new-project
```

### Package Agents for Distribution

```bash
./package_agentpacks.sh
```

Output: `dist/agentpacks/*.tar.gz`

### Launch Web Interface

```bash
./start_dev_lab.sh
```

## 🔒 Security & Privacy

- **Offline-First**: Works without internet
- **No External APIs**: Local LLM disabled by default
- **No Telemetry**: No usage data collected
- **Open Source**: Inspect and modify all code

## 📚 Documentation

All documentation is included in the package:

1. **Getting Started**: `README.md`
2. **Automation Guide**: `AUTOMATION_README.md`
3. **Dev Copilot Manual**: `README_COPILOT.md`
4. **Integration**: `MIGRATION_GUIDE.md`
5. **Education**: `UNIVERSITY_GUIDE.md`
6. **Classroom Setup**: `CLASSROOM_UPGRADE_INTRO.md`

## 🎯 Configuration

Default configuration in `.devcopilot/config.json`:

```json
{
  "enable_local_llm": false,
  "offline_mode": true,
  "template_directory": "dev_copilot_templates",
  "output_directory": "generated"
}
```

## 🐛 Troubleshooting

### Scripts Won't Execute
```bash
chmod +x *.sh
```

### Python Module Not Found
```bash
pip install -r requirements.txt
```

### Streamlit Won't Start
```bash
pip install streamlit
./start_dev_lab.sh
```

### Permission Denied
Run with appropriate permissions or use `sudo` where needed.

## 🤝 Contributing

See `CONTRIBUTING.md` for guidelines on:
- Code style
- Testing requirements
- Pull request process
- Community standards

## 📄 License

Same license as the parent AgentFoundry repository.

## 🆘 Support

For issues or questions:
1. Check the included documentation
2. Review README files in each directory
3. Visit the GitHub repository
4. Open an issue with detailed information

## 🎓 Educational Use

Perfect for:
- University courses (CS, AI, Software Engineering)
- Coding bootcamps
- Self-learning
- Team workshops

See `UNIVERSITY_GUIDE.md` for:
- Assignment templates
- Lab exercises
- Grading rubrics
- Course integration

## 📦 What's NOT Included

This is a standalone toolkit. You may need to separately install:
- Git (for version control)
- Python 3.8+ (runtime)
- Text editor or IDE
- Additional Python packages (via pip)

## ⚡ Quick Commands

```bash
# Setup
./setup_devcopilot.sh

# Create agent
python3 dev_copilot.py scaffold agent_name

# Start web UI
./start_dev_lab.sh

# Run tests
./run_tests.sh

# Create repo
./create_repo.sh repo-name

# Package agents
./package_agentpacks.sh
```

## 🌟 Features Highlights

✅ Offline-first operation  
✅ Template-driven development  
✅ Web-based UI with Streamlit  
✅ Automated scaffolding  
✅ Repository health monitoring  
✅ Educational resources included  
✅ Production-ready scripts  
✅ Comprehensive documentation  

## 📊 File Count

- Total files: 27
- Python scripts: 5
- Shell scripts: 6
- Templates: 3
- Documentation: 7
- Configuration: 2
- GitHub templates: 2
- Assets: 1

## 🔄 Updates

To get updates:
1. Visit the GitHub repository
2. Download latest release
3. Extract and replace old files
4. Review CHANGELOG (if available)

## 💡 Tips

1. **Start with the web UI** - Easier for beginners
2. **Read the docs** - Comprehensive guides included
3. **Customize templates** - Adapt to your needs
4. **Use virtual environments** - Keep dependencies isolated
5. **Enable workflows** - Copy `.github/` to your repo root

---

**Package Version**: 1.0.0  
**Last Updated**: 2024  
**Maintained By**: AgentFoundry Team  

For the latest version, visit: https://github.com/SpidermanTotro/AgentFoundry-instantly
