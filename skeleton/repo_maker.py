#!/usr/bin/env python3
"""
Repository Maker - Automated Repository Scaffolding

Creates new repositories from templates with automated setup.
"""

import os
import sys
import argparse
import json
import subprocess
from pathlib import Path
from typing import Dict, Any, Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class RepoMaker:
    """Automated repository scaffolding and setup."""
    
    def __init__(self, repo_name: str, template: str = "default"):
        """Initialize repository maker."""
        self.repo_name = repo_name
        self.template = template
        self.repo_path = Path(repo_name)
        
    def create_directory_structure(self) -> bool:
        """Create basic directory structure."""
        logger.info(f"Creating directory structure for: {self.repo_name}")
        
        directories = [
            "src",
            "tests",
            "docs",
            "scripts",
            ".github/workflows",
            ".github/ISSUE_TEMPLATE",
            "data",
            "config"
        ]
        
        try:
            self.repo_path.mkdir(parents=True, exist_ok=True)
            
            for directory in directories:
                (self.repo_path / directory).mkdir(parents=True, exist_ok=True)
                logger.info(f"  ✓ Created: {directory}")
            
            return True
        except Exception as e:
            logger.error(f"Error creating directories: {e}")
            return False
    
    def create_readme(self) -> bool:
        """Create README.md."""
        readme_content = f"""# {self.repo_name}

## Overview

This repository was created using AgentFoundry Repository Maker.

## Quick Start

```bash
pip install -r requirements.txt
```

## Structure

- `src/` - Source code
- `tests/` - Test files
- `docs/` - Documentation
- `scripts/` - Utility scripts
- `config/` - Configuration files

## Development

```bash
# Run tests
pytest

# Run linting
flake8 src/ tests/
```

## License

See LICENSE file.
"""
        
        try:
            readme_path = self.repo_path / "README.md"
            with open(readme_path, 'w') as f:
                f.write(readme_content)
            logger.info("  ✓ Created README.md")
            return True
        except Exception as e:
            logger.error(f"Error creating README: {e}")
            return False
    
    def create_gitignore(self) -> bool:
        """Create .gitignore."""
        gitignore_content = """# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# IDEs
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Project
.env
.env.local
config/local.json
data/local/
*.log
"""
        
        try:
            gitignore_path = self.repo_path / ".gitignore"
            with open(gitignore_path, 'w') as f:
                f.write(gitignore_content)
            logger.info("  ✓ Created .gitignore")
            return True
        except Exception as e:
            logger.error(f"Error creating .gitignore: {e}")
            return False
    
    def create_requirements(self) -> bool:
        """Create requirements.txt."""
        requirements_content = """# Core dependencies
requests>=2.31.0
python-dotenv>=1.0.0
pyyaml>=6.0.1

# Development dependencies
pytest>=7.4.0
pytest-cov>=4.1.0
black>=23.7.0
flake8>=6.1.0
mypy>=1.5.0
"""
        
        try:
            requirements_path = self.repo_path / "requirements.txt"
            with open(requirements_path, 'w') as f:
                f.write(requirements_content)
            logger.info("  ✓ Created requirements.txt")
            return True
        except Exception as e:
            logger.error(f"Error creating requirements.txt: {e}")
            return False
    
    def initialize_git(self) -> bool:
        """Initialize git repository."""
        try:
            subprocess.run(
                ["git", "init"],
                cwd=self.repo_path,
                check=True,
                capture_output=True
            )
            logger.info("  ✓ Initialized git repository")
            return True
        except subprocess.CalledProcessError as e:
            logger.error(f"Error initializing git: {e}")
            return False
    
    def create_repository(self) -> bool:
        """Create complete repository."""
        logger.info(f"\n🏗️  Creating repository: {self.repo_name}")
        logger.info(f"   Template: {self.template}\n")
        
        steps = [
            ("Directory structure", self.create_directory_structure),
            ("README.md", self.create_readme),
            (".gitignore", self.create_gitignore),
            ("requirements.txt", self.create_requirements),
            ("Git repository", self.initialize_git)
        ]
        
        for step_name, step_func in steps:
            if not step_func():
                logger.error(f"❌ Failed at: {step_name}")
                return False
        
        logger.info(f"\n✅ Successfully created repository: {self.repo_name}")
        logger.info(f"   Path: {self.repo_path.absolute()}\n")
        return True


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="AgentFoundry Repository Maker"
    )
    parser.add_argument("name", help="Repository name")
    parser.add_argument(
        "--template",
        default="default",
        help="Template to use (default: default)"
    )
    
    args = parser.parse_args()
    
    maker = RepoMaker(args.name, args.template)
    success = maker.create_repository()
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
