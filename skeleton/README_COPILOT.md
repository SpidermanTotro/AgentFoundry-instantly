# Dev Copilot Usage Guide

## Introduction

Dev Copilot is an offline-first AI coding assistant specifically designed for AgentFoundry development. It provides template-driven code generation, agent scaffolding, and development automation without requiring internet connectivity or external API calls.

## Features

- 🔌 **Offline-First**: Works without internet connection
- 🚀 **Template-Driven**: Rapid scaffolding from templates
- 🤖 **Agent Generation**: Create complete agents with boilerplate
- 📝 **Metadata Management**: Auto-generate agent metadata
- 🛠️ **Helper Utilities**: Create read/write helpers
- ⚙️ **Configurable**: JSON-based configuration
- 🔒 **Secure**: Local LLM disabled by default

## Installation

### Quick Setup

```bash
chmod +x skeleton/setup_devcopilot.sh
./skeleton/setup_devcopilot.sh
```

### Manual Setup

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r skeleton/requirements-devcopilot.txt

# Verify installation
python3 skeleton/dev_copilot.py config
```

## Configuration

Configuration file: `skeleton/.devcopilot/config.json`

### Default Settings

```json
{
  "version": "1.0.0",
  "enable_local_llm": false,
  "offline_mode": true,
  "template_directory": "dev_copilot_templates",
  "output_directory": "generated",
  "features": {
    "code_generation": true,
    "template_scaffolding": true,
    "syntax_checking": true
  }
}
```

### Key Options

- **enable_local_llm**: Enable local language model (requires additional setup)
- **offline_mode**: Disable all network requests
- **template_directory**: Location of code templates
- **output_directory**: Where generated files are saved

## Usage

### Command-Line Interface

#### List Available Templates

```bash
python3 skeleton/dev_copilot.py list
```

Output:
```
📋 Available Templates:
--------------------------------------------------
  • agent_stub
  • metadata
  • read_helper
```

#### Scaffold New Agent

```bash
python3 skeleton/dev_copilot.py scaffold my_awesome_agent
```

This creates:
- `generated/my_awesome_agent.py` - Main agent class
- `generated/my_awesome_agent_metadata.py` - Agent metadata
- `generated/my_awesome_agent_helper.py` - Helper utilities

With agent type:
```bash
python3 skeleton/dev_copilot.py scaffold data_processor --type data_processor
```

#### Generate from Specific Template

```bash
python3 skeleton/dev_copilot.py generate agent_stub custom_agent.py
```

#### View Configuration

```bash
python3 skeleton/dev_copilot.py config
```

### Web Interface

Launch the Streamlit-based web interface:

```bash
streamlit run skeleton/web_agent_app.py
```

Navigate to http://localhost:8501

**Web UI Features**:
- Visual agent scaffolding
- Template browser with preview
- Configuration editor
- Integrated test runner

## Templates

### Agent Stub Template

**Purpose**: Generate complete agent class with standard methods

**Methods Included**:
- `__init__`: Initialization
- `initialize`: Setup logic
- `process`: Data processing
- `execute`: Task execution
- `get_capabilities`: List capabilities
- `get_state`: State management
- `shutdown`: Cleanup

**Usage**:
```python
from my_agent import create_agent

agent = create_agent()
agent.initialize()
result = agent.process(data)
```

### Metadata Template

**Purpose**: Generate agent metadata and configuration schemas

**Includes**:
- Version information
- Capability list
- Configuration schema
- API documentation
- Dependency requirements

### Read Helper Template

**Purpose**: Generate file reading utilities

**Methods**:
- `read_file`: Read text files
- `read_json`: Parse JSON files
- `read_lines`: Read as line list
- `read_csv_simple`: Basic CSV parsing
- `read_config`: Configuration files

## Advanced Usage

### Custom Templates

Create your own templates in `skeleton/dev_copilot_templates/`:

```python
# custom_template.py
"""
Custom Template

This is a custom template with placeholders.
"""

class {{ class_name }}:
    """{{ description }}"""
    
    def __init__(self):
        self.name = "{{ name }}"
```

Use with:
```bash
python3 skeleton/dev_copilot.py generate custom_template output.py
```

### Programmatic Usage

```python
from dev_copilot import DevCopilot

# Initialize
copilot = DevCopilot(config_path=".devcopilot/config.json")

# Scaffold agent
success = copilot.scaffold_agent("my_agent", "conversational")

# Generate from template
context = {"class_name": "MyClass", "name": "my_instance"}
copilot.generate_from_template("agent_stub", "output.py", context)

# List templates
copilot.list_templates()
```

### Integration with Editors

#### VS Code

Add to `.vscode/tasks.json`:
```json
{
  "label": "Scaffold Agent",
  "type": "shell",
  "command": "python3 skeleton/dev_copilot.py scaffold ${input:agentName}"
}
```

#### Vim

Add to `.vimrc`:
```vim
command! -nargs=1 ScaffoldAgent !python3 skeleton/dev_copilot.py scaffold <args>
```

## Workflow Examples

### Creating a New Agent

1. **Scaffold the agent**:
   ```bash
   python3 skeleton/dev_copilot.py scaffold data_processor --type data_processor
   ```

2. **Review generated files**:
   ```bash
   ls -l skeleton/generated/
   ```

3. **Customize the agent**:
   Edit `skeleton/generated/data_processor.py`

4. **Test the agent**:
   ```bash
   python3 -c "from skeleton.generated.data_processor import create_agent; agent = create_agent(); print(agent.get_capabilities())"
   ```

### Batch Generation

Create multiple agents:
```bash
for agent in user_manager auth_handler data_validator; do
    python3 skeleton/dev_copilot.py scaffold $agent
done
```

### Template Development

1. **Create template**: `skeleton/dev_copilot_templates/my_template.py`
2. **Add placeholders**: Use `{{ variable }}` syntax
3. **Test generation**:
   ```bash
   python3 skeleton/dev_copilot.py generate my_template test_output.py
   ```

## Best Practices

1. **Use semantic names**: `user_authentication_agent` vs `agent1`
2. **Choose appropriate types**: Match agent type to purpose
3. **Review generated code**: Always customize for your use case
4. **Keep templates updated**: Maintain template quality
5. **Version your agents**: Use metadata versioning
6. **Test generated code**: Don't assume it works without testing

## Troubleshooting

### "Template not found"

**Cause**: Template doesn't exist or wrong name

**Solution**:
```bash
# List available templates
python3 skeleton/dev_copilot.py list

# Verify template directory
ls skeleton/dev_copilot_templates/
```

### "Config file not found"

**Cause**: Missing configuration file

**Solution**:
```bash
# Recreate config
mkdir -p skeleton/.devcopilot
cp skeleton/.devcopilot/config.json.example skeleton/.devcopilot/config.json
```

### Generated files not appearing

**Cause**: Wrong output directory or permissions

**Solution**:
```bash
# Check/create output directory
mkdir -p skeleton/generated

# Verify write permissions
ls -ld skeleton/generated/
```

### Import errors with generated code

**Cause**: Python path not set correctly

**Solution**:
```python
import sys
sys.path.insert(0, 'skeleton/generated')
from my_agent import create_agent
```

## Performance Tips

1. **Use CLI for batch operations**: Faster than web UI
2. **Disable logging for production**: Set level to ERROR
3. **Cache templates**: Templates are loaded once per session
4. **Use virtual environment**: Faster module imports

## Security

- **Offline mode enabled**: No external network requests
- **Local LLM disabled**: Prevents unintended API calls
- **Input validation**: All inputs validated before processing
- **No credential storage**: Never stores API keys or tokens
- **Sandbox mode available**: Restrict file system access

## FAQ

**Q: Can I use this with external LLMs?**
A: Yes, set `enable_local_llm: true` and configure LLM settings (requires additional setup)

**Q: How do I add custom templates?**
A: Add `.py` files to `skeleton/dev_copilot_templates/` with template syntax

**Q: Does this work on Windows?**
A: Yes, but use `python` instead of `python3` and adjust path separators

**Q: Can I integrate with CI/CD?**
A: Yes, Dev Copilot is CLI-friendly and works in automated pipelines

**Q: What Python version is required?**
A: Python 3.8 or higher

## Support

- Documentation: `skeleton/AUTOMATION_README.md`
- Issues: GitHub Issues
- Examples: `skeleton/dev_copilot_templates/`

## License

Same as parent repository - see main LICENSE file.
