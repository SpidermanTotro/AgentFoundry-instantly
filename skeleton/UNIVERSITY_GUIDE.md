# University Guide - AgentFoundry for Academic Use

Guide for using AgentFoundry and skeleton tools in university courses and research.

## Overview

AgentFoundry provides excellent tools for:
- AI/ML courses
- Software engineering education
- Research projects
- Student capstone projects

## Academic Use Cases

### 1. AI/ML Courses

**Course**: Introduction to Machine Learning

**Use Cases**:
- Training simple agents
- Experimenting with different algorithms
- Visualizing training progress
- Understanding agent architectures

**Setup**:
```bash
# Student workspace
git clone https://github.com/SpidermanTotro/AgentFoundry-instantly.git
cd AgentFoundry-instantly/skeleton
./setup_devcopilot.sh
./start_dev_lab.sh
```

**Assignments**:
1. Create custom agent using templates
2. Train agent on provided dataset
3. Evaluate and compare results
4. Document findings

### 2. Software Engineering

**Course**: Software Development Practices

**Use Cases**:
- Learning version control (Git)
- Automated testing
- CI/CD with GitHub Actions
- Code review practices

**Labs**:

**Lab 1: Version Control**
```bash
# Create feature branch
git checkout -b feature/student-name-assignment1

# Make changes
python dev_copilot.py generate --template agent_stub --name StudentAgent

# Commit and push
git add .
git commit -m "feat: add student agent"
git push origin feature/student-name-assignment1
```

**Lab 2: Automated Testing**
```bash
# Write tests
cd tests/
# ... create test_student_agent.py

# Run tests
cd ../skeleton
./run_tests.sh
```

**Lab 3: CI/CD**
- Enable GitHub Actions
- Observe automated checks
- Fix issues identified by automation

### 3. Research Projects

**Use Cases**:
- Rapid prototyping of agent ideas
- Experiment tracking
- Reproducible research
- Collaboration between researchers

**Research Workflow**:

1. **Hypothesis**: Create new agent architecture
2. **Implementation**: Use Dev Copilot templates
3. **Experimentation**: Use web lab for training
4. **Analysis**: Review results in reminder panel
5. **Documentation**: Auto-generate with tools
6. **Publication**: Package and share agents

### 4. Capstone Projects

**Project Ideas**:
- Custom agent for specific domain
- Enhanced training pipeline
- Agent collaboration system
- Performance optimization

**Project Structure**:
```
capstone-project/
├── skeleton/           # Tools (provided)
├── agents/            # Student implementations
├── datasets/          # Training data
├── experiments/       # Experiment logs
├── docs/             # Documentation
└── presentation/     # Final presentation
```

## Classroom Setup

### For Instructors

#### 1. Course Repository

Create a course-specific fork:

```bash
# Fork AgentFoundry-instantly
# Clone to course organization
git clone https://github.com/university/course-agentfoundry.git

# Add starter code
cd course-agentfoundry/skeleton
# ... customize for course

# Students fork from course repo
```

#### 2. Assignment Templates

Create assignment branches:

```bash
# Assignment 1
git checkout -b assignment-1-agents
# ... add assignment files and instructions
git push origin assignment-1-agents

# Assignment 2
git checkout main
git checkout -b assignment-2-training
# ... add assignment files
git push origin assignment-2-training
```

#### 3. Grading Automation

Use GitHub Actions for automated grading:

```yaml
# .github/workflows/grade.yml
name: Auto-Grade

on:
  pull_request:
    branches: [main]

jobs:
  grade:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Tests
        run: |
          cd skeleton
          ./run_tests.sh
      - name: Check Code Style
        run: |
          pip install flake8
          flake8 agents/
```

### For Students

#### 1. Getting Started

```bash
# Clone course repository
git clone https://github.com/university/course-agentfoundry.git
cd course-agentfoundry

# Setup environment
cd skeleton
./setup_devcopilot.sh
pip install -r requirements.txt

# Verify setup
python dev_copilot.py list-templates
```

#### 2. Working on Assignments

```bash
# Create branch for assignment
git checkout -b assignment-1/your-name

# Start development lab
./start_dev_lab.sh

# Make changes, test, commit
git add .
git commit -m "feat: complete assignment 1"
git push origin assignment-1/your-name

# Create pull request on GitHub
```

#### 3. Collaboration

Group projects:

```bash
# Team member 1
git checkout -b feature/agent-architecture

# Team member 2
git checkout -b feature/training-pipeline

# Merge via pull requests
```

## Example Assignments

### Assignment 1: Basic Agent

**Objective**: Create and deploy a simple agent

**Tasks**:
1. Generate agent from template
2. Customize behavior
3. Write tests
4. Document usage

**Grading**:
- Code quality: 40%
- Tests passing: 30%
- Documentation: 20%
- Creativity: 10%

### Assignment 2: Training Pipeline

**Objective**: Implement training for your agent

**Tasks**:
1. Prepare dataset
2. Implement training logic
3. Evaluate performance
4. Visualize results

**Deliverables**:
- Training script
- Results report
- Performance graphs

### Assignment 3: Agent Deployment

**Objective**: Package and deploy agent

**Tasks**:
1. Package agent using tools
2. Create deployment documentation
3. Demo in web lab

**Grading**:
- Packaging: 30%
- Documentation: 30%
- Demo quality: 40%

## Research Applications

### Experiment Tracking

Use reminder panel for experiment management:

```python
# Log experiment
experiment = {
    'name': 'Agent Architecture A vs B',
    'date': '2024-01-15',
    'parameters': {...},
    'results': {...}
}

# Track in web lab
```

### Reproducibility

Ensure reproducible research:

```bash
# Document environment
pip freeze > requirements-research.txt

# Version control code
git tag -a v1.0-experiment1 -m "Experiment 1 code"

# Archive results
./package_agentpacks.sh agents results/experiment1 1.0
```

### Collaboration

Multi-researcher projects:

```bash
# Researcher 1: Algorithm development
git checkout -b research/new-algorithm

# Researcher 2: Evaluation
git checkout -b research/evaluation

# Merge and validate together
```

## Best Practices for Education

### 1. Start Simple

Week 1: Basic tools
```bash
python dev_copilot.py list-templates
python dev_copilot.py generate --template agent_stub --name FirstAgent
```

Week 2-3: Web interface
```bash
./start_dev_lab.sh
# Explore interface
```

Week 4+: Advanced features

### 2. Provide Examples

Include example agents:
```
examples/
├── simple_agent.py
├── trained_agent.py
└── advanced_agent.py
```

### 3. Incremental Complexity

- Assignment 1: Use existing templates
- Assignment 2: Modify templates
- Assignment 3: Create from scratch
- Final project: Original implementation

### 4. Peer Review

Enable peer code review:
```bash
# Student reviews peer's PR
# Provides feedback on GitHub
# Learn from each other
```

## Resources for Educators

### Lecture Materials

Topics to cover:
1. Introduction to agents
2. Git and version control
3. Automated testing
4. CI/CD basics
5. Code quality
6. Documentation

### Lab Sessions

Structured lab activities:
- Lab 1: Environment setup
- Lab 2: First agent
- Lab 3: Training
- Lab 4: Testing
- Lab 5: Deployment

### Grading Rubrics

Suggested rubrics available in:
- Code quality
- Test coverage
- Documentation
- Functionality
- Innovation

## Support

### For Instructors

Contact repository maintainers for:
- Course setup assistance
- Custom features
- Bulk account setup

### For Students

Resources:
- Course-specific documentation
- Office hours
- Peer study groups
- Online forums

## Privacy and Security

### Student Work

Recommendations:
- Private course repositories
- Individual branches per student
- Protected main branch
- Automated backup

### Grading Data

Keep grades separate:
- Don't commit grades to repo
- Use separate grading system
- Follow FERPA guidelines

## License Compliance

AgentFoundry is ISC licensed:
- Free for academic use
- Can modify and distribute
- Maintain license notice
- Attribute original authors

## Success Stories

Example courses using AgentFoundry:
- CS 401: Advanced AI
- ENGR 501: Software Engineering
- RESEARCH 601: ML Research Methods

## Getting Help

Academic support:
- Check documentation
- Course-specific forums
- Instructor office hours
- GitHub issues for bugs

## Contributing Back

Encourage students to contribute:
- Bug fixes
- New templates
- Documentation improvements
- Feature suggestions

Students get:
- Real-world experience
- Portfolio contributions
- Open source involvement

Thank you for using AgentFoundry in education! 📚
