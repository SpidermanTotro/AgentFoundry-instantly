#!/usr/bin/env python3
"""
Dev Copilot - Offline Development Assistant CLI

A command-line interface for offline development assistance with local LLM support.
"""

import os
import sys
import json
import argparse
from pathlib import Path
from typing import Optional, Dict, Any

# Default configuration
DEFAULT_CONFIG = {
    "llm": {
        "enabled": False,
        "model_path": "",
        "model_type": "llama",
        "context_size": 2048,
        "temperature": 0.7
    },
    "templates_dir": "dev_copilot_templates",
    "output_dir": "generated"
}

class DevCopilot:
    """Main Dev Copilot class"""
    
    def __init__(self, config_path: str = ".devcopilot/config.json"):
        self.config_path = config_path
        self.config = self.load_config()
        self.templates_dir = Path(self.config.get("templates_dir", "dev_copilot_templates"))
        
    def load_config(self) -> Dict[str, Any]:
        """Load configuration from file"""
        if os.path.exists(self.config_path):
            try:
                with open(self.config_path, 'r') as f:
                    return json.load(f)
            except Exception as e:
                print(f"Warning: Could not load config: {e}", file=sys.stderr)
                return DEFAULT_CONFIG
        return DEFAULT_CONFIG
    
    def save_config(self):
        """Save configuration to file"""
        config_dir = os.path.dirname(self.config_path)
        if config_dir and not os.path.exists(config_dir):
            os.makedirs(config_dir)
        
        with open(self.config_path, 'w') as f:
            json.dump(self.config, f, indent=2)
    
    def list_templates(self):
        """List available templates"""
        print("Available templates:")
        if not self.templates_dir.exists():
            print("  No templates directory found")
            return
        
        templates = list(self.templates_dir.glob("*.py"))
        if not templates:
            print("  No templates found")
            return
        
        for template in templates:
            print(f"  - {template.stem}")
    
    def generate(self, template_name: str, output_name: str, output_path: Optional[str] = None):
        """Generate code from template"""
        template_file = self.templates_dir / f"{template_name}.py"
        
        if not template_file.exists():
            print(f"Error: Template '{template_name}' not found", file=sys.stderr)
            return False
        
        # Read template
        with open(template_file, 'r') as f:
            template_content = f.read()
        
        # Simple variable substitution
        output_content = template_content.replace("{{name}}", output_name)
        output_content = output_content.replace("{{class_name}}", output_name.replace("_", " ").title().replace(" ", ""))
        
        # Determine output path
        if output_path:
            output_file = Path(output_path)
        else:
            output_dir = Path(self.config.get("output_dir", "generated"))
            output_dir.mkdir(exist_ok=True)
            output_file = output_dir / f"{output_name}.py"
        
        # Write output
        output_file.parent.mkdir(parents=True, exist_ok=True)
        with open(output_file, 'w') as f:
            f.write(output_content)
        
        print(f"Generated: {output_file}")
        return True
    
    def review(self, file_path: str, format: str = "text"):
        """Review code file"""
        if not os.path.exists(file_path):
            print(f"Error: File '{file_path}' not found", file=sys.stderr)
            return False
        
        with open(file_path, 'r') as f:
            content = f.read()
        
        print(f"Code Review: {file_path}")
        print("=" * 60)
        
        # Basic static analysis
        suggestions = []
        
        lines = content.split('\n')
        for i, line in enumerate(lines, 1):
            # Check for common issues
            if len(line) > 100:
                suggestions.append(f"Line {i}: Line too long ({len(line)} chars)")
            if 'TODO' in line or 'FIXME' in line:
                suggestions.append(f"Line {i}: Contains TODO/FIXME")
            if line.strip().endswith(';') and file_path.endswith('.py'):
                suggestions.append(f"Line {i}: Unnecessary semicolon in Python")
        
        if suggestions:
            print("\nSuggestions:")
            for suggestion in suggestions:
                print(f"  - {suggestion}")
        else:
            print("\nNo issues found!")
        
        return True
    
    def interactive(self):
        """Start interactive mode"""
        print("Dev Copilot Interactive Mode")
        print("Type 'help' for commands, 'exit' to quit")
        print()
        
        while True:
            try:
                command = input("> ").strip()
                
                if not command:
                    continue
                
                if command == 'exit' or command == 'quit':
                    break
                
                if command == 'help':
                    print("Commands:")
                    print("  list-templates - List available templates")
                    print("  generate <template> <name> - Generate from template")
                    print("  review <file> - Review code file")
                    print("  exit - Exit interactive mode")
                    continue
                
                if command == 'list-templates':
                    self.list_templates()
                    continue
                
                parts = command.split()
                if parts[0] == 'generate' and len(parts) >= 3:
                    self.generate(parts[1], parts[2])
                    continue
                
                if parts[0] == 'review' and len(parts) >= 2:
                    self.review(parts[1])
                    continue
                
                print(f"Unknown command: {command}")
                
            except KeyboardInterrupt:
                print("\nUse 'exit' to quit")
            except Exception as e:
                print(f"Error: {e}", file=sys.stderr)

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="Dev Copilot - Offline Development Assistant")
    subparsers = parser.add_subparsers(dest='command', help='Commands')
    
    # list-templates command
    subparsers.add_parser('list-templates', help='List available templates')
    
    # generate command
    generate_parser = subparsers.add_parser('generate', help='Generate code from template')
    generate_parser.add_argument('--template', required=True, help='Template name')
    generate_parser.add_argument('--name', required=True, help='Output name')
    generate_parser.add_argument('--output', help='Output file path')
    
    # review command
    review_parser = subparsers.add_parser('review', help='Review code file')
    review_parser.add_argument('--file', required=True, help='File to review')
    review_parser.add_argument('--format', default='text', choices=['text', 'markdown'], help='Output format')
    
    # interactive command
    subparsers.add_parser('interactive', help='Start interactive mode')
    
    args = parser.parse_args()
    
    copilot = DevCopilot()
    
    if args.command == 'list-templates':
        copilot.list_templates()
    elif args.command == 'generate':
        copilot.generate(args.template, args.name, args.output)
    elif args.command == 'review':
        copilot.review(args.file, args.format)
    elif args.command == 'interactive':
        copilot.interactive()
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
