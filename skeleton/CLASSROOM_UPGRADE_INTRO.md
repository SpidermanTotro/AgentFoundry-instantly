# Classroom Upgrade Introduction

Welcome to the AgentFoundry Classroom Edition!

## What's New for Classrooms?

The skeleton tooling brings powerful features designed for educational environments:

### 🎓 For Students

**Easy Start**
- One-command setup
- Web-based interface (no complex CLI)
- Visual agent management
- Interactive learning environment

**Learn by Doing**
- Pre-built templates to study
- Instant feedback via testing
- See results immediately in web lab
- Experiment safely in isolated environment

**Professional Tools**
- Industry-standard Git workflow
- Automated testing practices
- Code review processes
- CI/CD experience

### 👨‍🏫 For Instructors

**Simple Course Setup**
```bash
# One-time setup for course
git clone https://github.com/SpidermanTotro/AgentFoundry-instantly.git
cd AgentFoundry-instantly/skeleton
./setup_devcopilot.sh

# Share with students
```

**Automated Grading**
- GitHub Actions for automated checks
- Test-based grading
- Code quality metrics
- Consistency across submissions

**Track Progress**
- Web dashboard shows student work
- Reminder panel for deadlines
- Training metrics visible
- Easy to see who needs help

## Quick Start for Classrooms

### Instructor Setup (5 minutes)

```bash
# 1. Fork repository to course organization
# (Do this on GitHub)

# 2. Clone to your machine
git clone https://github.com/YOUR_UNIVERSITY/AgentFoundry-classroom.git
cd AgentFoundry-classroom/skeleton

# 3. Setup environment
./setup_devcopilot.sh
chmod +x *.sh

# 4. Test the lab
./start_dev_lab.sh
# Open http://localhost:8501

# 5. Customize for your course (optional)
# - Add example agents
# - Configure grading workflows
# - Add course-specific documentation
```

### Student Setup (3 minutes)

```bash
# 1. Fork course repository
# (Do this on GitHub from instructor's repo)

# 2. Clone to your machine
git clone https://github.com/YOUR_USERNAME/AgentFoundry-classroom.git
cd AgentFoundry-classroom/skeleton

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the lab
./start_dev_lab.sh
# Open http://localhost:8501

# 5. Start learning!
```

## First Assignment (30 minutes)

Perfect first exercise for students:

### Task: Create Your First Agent

**Step 1: Generate Agent**
```bash
python dev_copilot.py generate --template agent_stub --name MyFirstAgent
```

**Step 2: Customize**
Open `generated/MyFirstAgent.py` and modify the `process()` method

**Step 3: Test in Lab**
```bash
./start_dev_lab.sh
# Use Agent Manager to load and test
```

**Step 4: Submit**
```bash
git add generated/MyFirstAgent.py
git commit -m "feat: my first agent"
git push origin main
```

**Learning Outcomes**:
- ✅ Used code generation tool
- ✅ Modified Python code
- ✅ Tested in web interface
- ✅ Used Git workflow

## Key Features for Learning

### 1. Visual Interface

No need to learn complex CLI first:
- Point-and-click agent management
- Visual training progress
- Interactive chat interface
- Drag-and-drop friendly

### 2. Instant Feedback

See results immediately:
- Run agents in browser
- View output in real-time
- Training graphs update live
- Errors clearly displayed

### 3. Safe Experimentation

Students can't break anything:
- Sandboxed environment
- Easy to reset
- Templates always available
- Git allows undoing mistakes

### 4. Professional Practices

Learn industry tools:
- Git version control
- Pull request workflow
- Code review process
- Automated testing
- Continuous integration

## Course Integration Ideas

### Week 1: Introduction
- Setup environment
- Explore web interface
- Generate first agent from template
- Learn basic Git

### Week 2-3: Fundamentals
- Modify agent behavior
- Write simple tests
- Use code review
- Understand agent architecture

### Week 4-6: Intermediate
- Create custom agents
- Implement training
- Work in teams
- Use advanced Git features

### Week 7-10: Advanced
- Original agent designs
- Complex training pipelines
- Deploy and package agents
- Present final projects

## Sample Assignment Structure

### Assignment Template

```markdown
# Assignment 1: Hello Agent

## Objectives
- Create an agent using templates
- Customize agent behavior
- Test your agent
- Submit via Git

## Tasks
1. Generate agent: `python dev_copilot.py generate --template agent_stub --name HelloAgent`
2. Modify to print "Hello, [your name]!"
3. Test in web lab
4. Write unit test
5. Submit pull request

## Grading (100 points)
- Agent works correctly: 40 pts
- Tests pass: 30 pts
- Code quality: 20 pts
- Documentation: 10 pts

## Due Date
[Your date here]

## Submission
Pull request to main branch with title: "Assignment 1 - [Your Name]"
```

## Grading with GitHub Actions

Automate repetitive grading:

```yaml
# .github/workflows/assignment-check.yml
name: Assignment Check

on:
  pull_request:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.8'
      
      - name: Install dependencies
        run: |
          cd skeleton
          pip install -r requirements.txt
      
      - name: Run tests
        run: |
          cd skeleton
          ./run_tests.sh
      
      - name: Check code style
        run: |
          pip install flake8
          flake8 agents/ --max-line-length=100
```

Students see results automatically!

## Common Questions

### Q: Do students need prior coding experience?

**A**: Basic Python recommended, but templates help beginners. Start with simple modifications before creating from scratch.

### Q: How much time does setup take?

**A**: Instructor: ~30 min first time, 5 min after. Students: ~10 min first time, 1 min after.

### Q: Can this work for large classes?

**A**: Yes! GitHub supports unlimited public repositories. Use GitHub Classroom for organization.

### Q: What if students don't have powerful computers?

**A**: Can run on modest hardware. Web interface is lightweight. Cloud options available (GitHub Codespaces, etc.).

### Q: Is internet required?

**A**: For setup: yes. For development: optional. Local LLM features work offline.

### Q: Can students collaborate?

**A**: Yes! Git branches and pull requests enable team projects.

## Success Tips

### For Instructors

1. **Do it yourself first** - Complete assignments before assigning
2. **Provide examples** - Include sample solutions (reference implementations)
3. **Start simple** - Begin with template modifications, build to creation
4. **Use peer review** - Students review each other's PRs
5. **Automate checks** - Use GitHub Actions for immediate feedback

### For Students

1. **Explore first** - Click around the web interface
2. **Read the errors** - Error messages help you learn
3. **Use Git properly** - Commit often, write clear messages
4. **Ask for help** - Use GitHub issues or course forums
5. **Experiment** - Safe to try things, easy to undo

## Additional Resources

### Documentation
- [README_COPILOT.md](README_COPILOT.md) - Dev Copilot guide
- [AUTOMATION_README.md](AUTOMATION_README.md) - Automation tools
- [UNIVERSITY_GUIDE.md](UNIVERSITY_GUIDE.md) - Detailed academic guide
- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Integration guide

### Templates
All in `dev_copilot_templates/`:
- `agent_stub.py` - Basic agent
- `metadata.py` - Metadata handling
- `read_helper.py` - File utilities

### Tools
- `dev_copilot.py` - Code generation CLI
- `web_agent_app.py` - Visual interface
- `train_agent.py` - Training tool
- Shell scripts for automation

## Getting Help

### Instructor Support
- Check UNIVERSITY_GUIDE.md
- Review existing issues on GitHub
- Contact maintainers for course setup

### Student Support  
- Course-specific documentation
- Instructor office hours
- Peer study groups
- GitHub issues for technical problems

## Next Steps

### For Instructors
1. ✅ Complete setup (above)
2. ✅ Try the first assignment yourself
3. ✅ Customize for your course
4. ✅ Share with students

### For Students
1. ✅ Complete setup (above)
2. ✅ Explore the web interface
3. ✅ Try generating an agent
4. ✅ Complete first assignment

## Welcome Aboard!

AgentFoundry provides professional-grade tools in an education-friendly package. Students learn real-world skills while instructors maintain control and visibility.

**Questions?** Open an issue or check the documentation.

**Ready to start?** Run `./start_dev_lab.sh` and open http://localhost:8501

Happy teaching and learning! 🚀📚
