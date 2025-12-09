#!/usr/bin/env python3
"""
Repository Maker - Automated repository creation tool

Creates new repositories with standard structure and configuration.
"""

import os
import sys
import json
import argparse
from pathlib import Path
from datetime import datetime

class RepoMaker:
    """Repository creation and initialization"""
    
    def __init__(self, name: str, description: str = "", template: str = "basic"):
        self.name = name
        self.description = description
        self.template = template
        self.repo_path = Path(name)
    
    def create(self):
        """Create repository structure"""
        print(f"Creating repository: {self.name}")
        
        # Create base directory
        self.repo_path.mkdir(exist_ok=True)
        
        # Create standard directories
        dirs = [
            'src',
            'tests',
            'docs',
            'scripts',
            '.github/workflows',
            '.github/ISSUE_TEMPLATE'
        ]
        
        for dir_name in dirs:
            (self.repo_path / dir_name).mkdir(parents=True, exist_ok=True)
        
        # Create README
        self._create_readme()
        
        # Create .gitignore
        self._create_gitignore()
        
        # Create LICENSE
        self._create_license()
        
        # Create package.json or setup.py based on template
        if self.template == "node":
            self._create_package_json()
        elif self.template == "python":
            self._create_setup_py()
        
        print(f"Repository created at: {self.repo_path}")
    
    def _create_readme(self):
        """Create README.md"""
        content = f"""# {self.name}

{self.description}

## Installation

```bash
# Installation instructions
```

## Usage

```bash
# Usage examples
```

## License

ISC License

## Contributing

Contributions welcome! Please read CONTRIBUTING.md first.
"""
        (self.repo_path / "README.md").write_text(content)
    
    def _create_gitignore(self):
        """Create .gitignore"""
        content = """# Dependencies
node_modules/
__pycache__/
*.pyc
venv/
env/

# Build outputs
dist/
build/
*.egg-info/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Environment
.env
.env.local
"""
        (self.repo_path / ".gitignore").write_text(content)
    
    def _create_license(self):
        """Create LICENSE"""
        content = f"""ISC License

Copyright (c) {datetime.now().year}

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
"""
        (self.repo_path / "LICENSE").write_text(content)
    
    def _create_package_json(self):
        """Create package.json for Node.js projects"""
        package = {
            "name": self.name,
            "version": "0.1.0",
            "description": self.description,
            "main": "src/index.js",
            "scripts": {
                "test": "echo \"Error: no test specified\" && exit 1"
            },
            "keywords": [],
            "author": "",
            "license": "ISC"
        }
        
        (self.repo_path / "package.json").write_text(json.dumps(package, indent=2))
    
    def _create_setup_py(self):
        """Create setup.py for Python projects"""
        content = f"""from setuptools import setup, find_packages

setup(
    name="{self.name}",
    version="0.1.0",
    description="{self.description}",
    packages=find_packages(),
    install_requires=[],
    python_requires=">=3.8",
)
"""
        (self.repo_path / "setup.py").write_text(content)

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="Repository Maker")
    parser.add_argument('name', help='Repository name')
    parser.add_argument('--description', default='', help='Repository description')
    parser.add_argument('--template', default='basic', choices=['basic', 'node', 'python'], 
                       help='Repository template')
    
    args = parser.parse_args()
    
    maker = RepoMaker(args.name, args.description, args.template)
    maker.create()

if __name__ == '__main__':
    main()
