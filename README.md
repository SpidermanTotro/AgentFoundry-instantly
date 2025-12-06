# AgentFoundry-instantly

[![CI](https://github.com/SpidermanTotro/AgentFoundry-instantly/workflows/CI/badge.svg)](https://github.com/SpidermanTotro/AgentFoundry-instantly/actions)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful Programming AI Agent Framework for building intelligent agents instantly.

## Features

- 🤖 Easy-to-use Agent and Task abstractions
- 🚀 Fast setup and deployment
- 🔧 Extensible and customizable
- 📦 Lightweight with minimal dependencies
- ✅ Comprehensive test coverage

## Installation

```bash
pip install -e .
```

For development:
```bash
make install-dev
```

## Quick Start

```python
from agentfoundry import Agent, Task

# Create an agent
agent = Agent("MyAgent", config={"model": "gpt-4"})

# Define a task
task = Task(
    name="code_review",
    description="Review the code for best practices",
    parameters={"file": "main.py"}
)

# Execute the task
result = agent.execute(task)
print(result)
```

## Development

### Running Checks

Run all checks (lint + test):
```bash
make check
```

### Running Tests

```bash
make test
```

With coverage:
```bash
make test-coverage
```

### Code Formatting

```bash
make format
```

### Linting

```bash
make lint
```

### Repair Issues

Auto-repair code issues:
```bash
make repair
```

## Project Structure

```
AgentFoundry-instantly/
├── src/agentfoundry/    # Main package source
│   ├── __init__.py
│   ├── agent.py         # Agent class
│   └── task.py          # Task class
├── tests/               # Test suite
│   ├── test_agent.py
│   └── test_task.py
├── Makefile            # Build automation
├── setup.py            # Package configuration
├── requirements.txt    # Dependencies
└── README.md          # This file
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

SpidermanTotro

## Support

For issues and questions, please open an issue on GitHub. 
