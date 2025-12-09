"""
Read Helper Template

Helper utilities for reading and processing data in {{ agent_name }}.
"""

from typing import Any, Dict, List, Optional, Union
from pathlib import Path
import json


class ReadHelper:
    """Helper class for reading various data formats."""
    
    def __init__(self):
        """Initialize read helper."""
        self.supported_formats = ["json", "txt", "csv", "yaml"]
    
    def read_file(self, file_path: Union[str, Path], encoding: str = "utf-8") -> Optional[str]:
        """
        Read content from file.
        
        Args:
            file_path: Path to file
            encoding: File encoding
            
        Returns:
            File content or None if error
        """
        try:
            path = Path(file_path)
            if not path.exists():
                return None
            
            with open(path, 'r', encoding=encoding) as f:
                return f.read()
        except Exception as e:
            print(f"Error reading file: {e}")
            return None
    
    def read_json(self, file_path: Union[str, Path]) -> Optional[Dict[str, Any]]:
        """
        Read and parse JSON file.
        
        Args:
            file_path: Path to JSON file
            
        Returns:
            Parsed JSON or None if error
        """
        content = self.read_file(file_path)
        if content is None:
            return None
        
        try:
            return json.loads(content)
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON: {e}")
            return None
    
    def read_lines(self, file_path: Union[str, Path]) -> Optional[List[str]]:
        """
        Read file as list of lines.
        
        Args:
            file_path: Path to file
            
        Returns:
            List of lines or None if error
        """
        content = self.read_file(file_path)
        if content is None:
            return None
        
        return content.splitlines()
    
    def read_csv_simple(self, file_path: Union[str, Path], delimiter: str = ",") -> Optional[List[List[str]]]:
        """
        Read CSV file (simple implementation).
        
        Args:
            file_path: Path to CSV file
            delimiter: CSV delimiter
            
        Returns:
            List of rows or None if error
        """
        lines = self.read_lines(file_path)
        if lines is None:
            return None
        
        return [line.split(delimiter) for line in lines]
    
    def read_config(self, config_path: Union[str, Path]) -> Dict[str, Any]:
        """
        Read configuration file (JSON format).
        
        Args:
            config_path: Path to config file
            
        Returns:
            Configuration dictionary
        """
        config = self.read_json(config_path)
        return config if config is not None else {}
    
    def validate_format(self, file_path: Union[str, Path]) -> bool:
        """
        Validate if file format is supported.
        
        Args:
            file_path: Path to file
            
        Returns:
            True if supported, False otherwise
        """
        path = Path(file_path)
        extension = path.suffix.lstrip('.')
        return extension in self.supported_formats


def create_helper() -> ReadHelper:
    """
    Factory function to create helper instance.
    
    Returns:
        ReadHelper instance
    """
    return ReadHelper()


# Convenience functions
def read_file(file_path: Union[str, Path]) -> Optional[str]:
    """Read file content."""
    helper = create_helper()
    return helper.read_file(file_path)


def read_json(file_path: Union[str, Path]) -> Optional[Dict[str, Any]]:
    """Read JSON file."""
    helper = create_helper()
    return helper.read_json(file_path)


def read_lines(file_path: Union[str, Path]) -> Optional[List[str]]:
    """Read file as lines."""
    helper = create_helper()
    return helper.read_lines(file_path)
