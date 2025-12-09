#!/usr/bin/env python3
"""
AgentFoundry Dev Copilot - Offline-First AI Coding Assistant

This tool provides template-driven code generation and scaffolding
for AgentFoundry development without requiring internet connectivity.
"""

import os
import sys
import json
import argparse
from pathlib import Path
from typing import Dict, Any, Optional
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class DevCopilot:
    """Offline-first development copilot for AgentFoundry."""
    
    def __init__(self, config_path: str = ".devcopilot/config.json"):
        """Initialize Dev Copilot with configuration."""
        self.config_path = Path(config_path)
        self.config = self.load_config()
        self.template_dir = Path(self.config.get("template_directory", "dev_copilot_templates"))
        self.output_dir = Path(self.config.get("output_directory", "generated"))
        
        # Ensure output directory exists
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
    def load_config(self) -> Dict[str, Any]:
        """Load configuration from JSON file."""
        if not self.config_path.exists():
            logger.warning(f"Config file not found: {self.config_path}")
            return self.get_default_config()
        
        try:
            with open(self.config_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading config: {e}")
            return self.get_default_config()
    
    def get_default_config(self) -> Dict[str, Any]:
        """Return default configuration."""
        return {
            "version": "1.0.0",
            "enable_local_llm": False,
            "offline_mode": True,
            "template_directory": "dev_copilot_templates",
            "output_directory": "generated",
            "features": {
                "code_generation": True,
                "template_scaffolding": True,
                "syntax_checking": True
            }
        }
    
    def generate_from_template(self, template_name: str, output_name: str, 
                               context: Optional[Dict[str, Any]] = None) -> bool:
        """Generate code from template."""
        template_path = self.template_dir / f"{template_name}.py"
        
        if not template_path.exists():
            logger.error(f"Template not found: {template_path}")
            return False
        
        try:
            # Read template
            with open(template_path, 'r') as f:
                template_content = f.read()
            
            # Simple variable substitution if context provided
            if context:
                for key, value in context.items():
                    template_content = template_content.replace(f"{{{{ {key} }}}}", str(value))
            
            # Write output
            output_path = self.output_dir / output_name
            with open(output_path, 'w') as f:
                f.write(template_content)
            
            logger.info(f"Generated: {output_path}")
            return True
            
        except Exception as e:
            logger.error(f"Error generating from template: {e}")
            return False
    
    def scaffold_agent(self, agent_name: str, agent_type: str = "default") -> bool:
        """Scaffold a new agent with all necessary files."""
        logger.info(f"Scaffolding agent: {agent_name} (type: {agent_type})")
        
        context = {
            "agent_name": agent_name,
            "agent_type": agent_type,
            "class_name": "".join(word.capitalize() for word in agent_name.split("_"))
        }
        
        # Generate main agent file
        success = self.generate_from_template("agent_stub", f"{agent_name}.py", context)
        
        # Generate metadata
        if success:
            success = self.generate_from_template("metadata", f"{agent_name}_metadata.py", context)
        
        # Generate helper
        if success:
            success = self.generate_from_template("read_helper", f"{agent_name}_helper.py", context)
        
        if success:
            logger.info(f"✓ Successfully scaffolded agent: {agent_name}")
        
        return success
    
    def list_templates(self) -> None:
        """List available templates."""
        if not self.template_dir.exists():
            logger.warning(f"Template directory not found: {self.template_dir}")
            return
        
        templates = list(self.template_dir.glob("*.py"))
        
        print("\n📋 Available Templates:")
        print("-" * 50)
        for template in sorted(templates):
            print(f"  • {template.stem}")
        print()
    
    def show_config(self) -> None:
        """Display current configuration."""
        print("\n⚙️  Dev Copilot Configuration:")
        print("-" * 50)
        print(json.dumps(self.config, indent=2))
        print()


def main():
    """Main entry point for Dev Copilot CLI."""
    parser = argparse.ArgumentParser(
        description="AgentFoundry Dev Copilot - Offline-First AI Coding Assistant"
    )
    parser.add_argument(
        "--config",
        default=".devcopilot/config.json",
        help="Path to configuration file"
    )
    
    subparsers = parser.add_subparsers(dest="command", help="Available commands")
    
    # Scaffold command
    scaffold_parser = subparsers.add_parser("scaffold", help="Scaffold new agent")
    scaffold_parser.add_argument("name", help="Agent name")
    scaffold_parser.add_argument("--type", default="default", help="Agent type")
    
    # Generate command
    generate_parser = subparsers.add_parser("generate", help="Generate from template")
    generate_parser.add_argument("template", help="Template name")
    generate_parser.add_argument("output", help="Output file name")
    
    # List command
    subparsers.add_parser("list", help="List available templates")
    
    # Config command
    subparsers.add_parser("config", help="Show configuration")
    
    args = parser.parse_args()
    
    # Initialize copilot
    copilot = DevCopilot(config_path=args.config)
    
    # Execute command
    if args.command == "scaffold":
        success = copilot.scaffold_agent(args.name, args.type)
        sys.exit(0 if success else 1)
    
    elif args.command == "generate":
        success = copilot.generate_from_template(args.template, args.output)
        sys.exit(0 if success else 1)
    
    elif args.command == "list":
        copilot.list_templates()
    
    elif args.command == "config":
        copilot.show_config()
    
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
