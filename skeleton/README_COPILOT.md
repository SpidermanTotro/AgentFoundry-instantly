# Dev Copilot - Offline Development Assistant

Dev Copilot is an offline-first development assistant that works with local LLMs.

## Features

- **100% Offline**: No internet required after setup
- **Local LLM**: Use your own models (Llama, GPT4All, etc.)
- **Code Generation**: Generate code snippets and functions
- **Code Review**: Get suggestions and improvements
- **Template System**: Pre-built agent templates

## Prerequisites

- Python 3.8+
- pip
- Local LLM model (optional, disabled by default)

## Installation

### 1. Install Dependencies

```bash
pip install -r requirements-devcopilot.txt
```

### 2. Configure Dev Copilot

```bash
./setup_devcopilot.sh
```

This creates the default configuration file at `.devcopilot/config.json`.

## Configuration

### Local LLM Setup (Optional)

Dev Copilot local LLM is **disabled by default**. To enable:

1. Download a local model:
   - [Llama models](https://github.com/ggerganov/llama.cpp)
   - [GPT4All](https://gpt4all.io/)
   - [Ollama](https://ollama.ai/)

2. Edit `.devcopilot/config.json`:

```json
{
  "llm": {
    "enabled": true,
    "model_path": "/path/to/your/model.bin",
    "model_type": "llama",
    "context_size": 2048,
    "temperature": 0.7
  },
  "templates_dir": "dev_copilot_templates",
  "output_dir": "generated"
}
```

3. Restart Dev Copilot

## Usage

### Basic Usage

```bash
python dev_copilot.py
```

### Generate Code from Template

```bash
python dev_copilot.py generate --template agent_stub --name MyAgent
```

### Code Review

```bash
python dev_copilot.py review --file path/to/code.py
```

### Interactive Mode

```bash
python dev_copilot.py interactive
```

## Templates

Dev Copilot includes pre-built templates:

- **agent_stub.py**: Basic agent structure
- **metadata.py**: Agent metadata handler
- **read_helper.py**: File reading utilities

Create custom templates in `dev_copilot_templates/`.

## Commands

### generate
Generate code from template:
```bash
python dev_copilot.py generate --template <name> --name <output>
```

### review
Review code and get suggestions:
```bash
python dev_copilot.py review --file <path>
```

### list-templates
List available templates:
```bash
python dev_copilot.py list-templates
```

### interactive
Start interactive mode:
```bash
python dev_copilot.py interactive
```

## Examples

### Example 1: Create New Agent

```bash
python dev_copilot.py generate \
  --template agent_stub \
  --name MyCustomAgent \
  --output ./agents/my_agent.py
```

### Example 2: Review Code

```bash
python dev_copilot.py review \
  --file ./src/main.py \
  --format markdown
```

### Example 3: Interactive Session

```bash
$ python dev_copilot.py interactive
> generate function to parse JSON
> review last output
> save to utils/json_parser.py
```

## Troubleshooting

### LLM Not Working

If local LLM is not working:
1. Check model path in config.json
2. Verify model file exists and is accessible
3. Check model compatibility
4. Review logs in `.devcopilot/logs/`

### Template Not Found

If template is not found:
1. Check `dev_copilot_templates/` directory
2. Verify template name
3. Run `python dev_copilot.py list-templates`

### Import Errors

If getting import errors:
1. Verify all dependencies installed
2. Run `pip install -r requirements-devcopilot.txt`
3. Check Python version (3.8+ required)

## Advanced Configuration

### Custom Templates

Create custom templates in `dev_copilot_templates/`:

```python
# custom_template.py
"""
Template: {{name}}
Description: {{description}}
"""

class {{class_name}}:
    def __init__(self):
        pass
```

### Environment Variables

```bash
export DEVCOPILOT_CONFIG=.devcopilot/config.json
export DEVCOPILOT_MODEL=/path/to/model
export DEVCOPILOT_LOG_LEVEL=DEBUG
```

## Privacy & Security

- **100% Local**: No data sent to external servers
- **No Telemetry**: No usage tracking
- **Your Data**: All files stay on your machine

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## License

Same as parent repository.
