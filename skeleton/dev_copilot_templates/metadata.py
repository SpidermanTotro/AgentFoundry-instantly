#!/usr/bin/env python3
"""
Metadata Handler Template

Template for handling agent metadata.
"""

import json
import os
from datetime import datetime
from typing import Dict, Any, Optional

class MetadataHandler:
    """
    Handler for agent metadata
    
    Manages loading, saving, and updating agent metadata.
    """
    
    def __init__(self, metadata_file: str = "metadata.json"):
        """
        Initialize metadata handler
        
        Args:
            metadata_file: Path to metadata file
        """
        self.metadata_file = metadata_file
        self.metadata = self.load()
    
    def load(self) -> Dict[str, Any]:
        """
        Load metadata from file
        
        Returns:
            Metadata dictionary
        """
        if os.path.exists(self.metadata_file):
            try:
                with open(self.metadata_file, 'r') as f:
                    return json.load(f)
            except Exception as e:
                print(f"Warning: Could not load metadata: {e}")
                return self._default_metadata()
        return self._default_metadata()
    
    def save(self):
        """Save metadata to file"""
        try:
            with open(self.metadata_file, 'w') as f:
                json.dump(self.metadata, f, indent=2)
        except Exception as e:
            print(f"Error: Could not save metadata: {e}")
    
    def _default_metadata(self) -> Dict[str, Any]:
        """
        Get default metadata structure
        
        Returns:
            Default metadata dictionary
        """
        return {
            'version': '0.1.0',
            'created': datetime.now().isoformat(),
            'updated': datetime.now().isoformat(),
            'author': '',
            'description': '',
            'tags': [],
            'dependencies': [],
            'config': {}
        }
    
    def update(self, key: str, value: Any):
        """
        Update metadata field
        
        Args:
            key: Metadata key
            value: New value
        """
        self.metadata[key] = value
        self.metadata['updated'] = datetime.now().isoformat()
        self.save()
    
    def get(self, key: str, default: Any = None) -> Any:
        """
        Get metadata field
        
        Args:
            key: Metadata key
            default: Default value if key not found
            
        Returns:
            Metadata value or default
        """
        return self.metadata.get(key, default)
    
    def add_tag(self, tag: str):
        """
        Add tag to metadata
        
        Args:
            tag: Tag to add
        """
        if 'tags' not in self.metadata:
            self.metadata['tags'] = []
        if tag not in self.metadata['tags']:
            self.metadata['tags'].append(tag)
            self.save()
    
    def remove_tag(self, tag: str):
        """
        Remove tag from metadata
        
        Args:
            tag: Tag to remove
        """
        if 'tags' in self.metadata and tag in self.metadata['tags']:
            self.metadata['tags'].remove(tag)
            self.save()
    
    def add_dependency(self, dependency: str):
        """
        Add dependency to metadata
        
        Args:
            dependency: Dependency to add
        """
        if 'dependencies' not in self.metadata:
            self.metadata['dependencies'] = []
        if dependency not in self.metadata['dependencies']:
            self.metadata['dependencies'].append(dependency)
            self.save()

def main():
    """Example usage"""
    handler = MetadataHandler()
    
    # Update metadata
    handler.update('author', 'Developer Name')
    handler.update('description', 'Example agent')
    handler.add_tag('experimental')
    handler.add_dependency('numpy')
    
    print(f"Metadata: {json.dumps(handler.metadata, indent=2)}")

if __name__ == '__main__':
    main()
