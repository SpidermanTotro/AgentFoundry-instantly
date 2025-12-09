#!/usr/bin/env python3
"""
Read Helper Template

Template for file reading utilities.
"""

import os
import json
import csv
from typing import List, Dict, Any, Optional
from pathlib import Path

class ReadHelper:
    """
    Helper for reading various file formats
    
    Provides utilities for reading text, JSON, CSV, and other file types.
    """
    
    @staticmethod
    def read_text(file_path: str, encoding: str = 'utf-8') -> str:
        """
        Read text file
        
        Args:
            file_path: Path to file
            encoding: File encoding
            
        Returns:
            File content as string
        """
        with open(file_path, 'r', encoding=encoding) as f:
            return f.read()
    
    @staticmethod
    def read_lines(file_path: str, encoding: str = 'utf-8') -> List[str]:
        """
        Read file lines
        
        Args:
            file_path: Path to file
            encoding: File encoding
            
        Returns:
            List of lines
        """
        with open(file_path, 'r', encoding=encoding) as f:
            return f.readlines()
    
    @staticmethod
    def read_json(file_path: str, encoding: str = 'utf-8') -> Dict[str, Any]:
        """
        Read JSON file
        
        Args:
            file_path: Path to JSON file
            encoding: File encoding
            
        Returns:
            Parsed JSON data
        """
        with open(file_path, 'r', encoding=encoding) as f:
            return json.load(f)
    
    @staticmethod
    def read_csv(file_path: str, encoding: str = 'utf-8') -> List[Dict[str, Any]]:
        """
        Read CSV file
        
        Args:
            file_path: Path to CSV file
            encoding: File encoding
            
        Returns:
            List of dictionaries (one per row)
        """
        with open(file_path, 'r', encoding=encoding) as f:
            reader = csv.DictReader(f)
            return list(reader)
    
    @staticmethod
    def read_binary(file_path: str) -> bytes:
        """
        Read binary file
        
        Args:
            file_path: Path to file
            
        Returns:
            File content as bytes
        """
        with open(file_path, 'rb') as f:
            return f.read()
    
    @staticmethod
    def file_exists(file_path: str) -> bool:
        """
        Check if file exists
        
        Args:
            file_path: Path to file
            
        Returns:
            True if file exists, False otherwise
        """
        return os.path.exists(file_path)
    
    @staticmethod
    def get_file_size(file_path: str) -> int:
        """
        Get file size in bytes
        
        Args:
            file_path: Path to file
            
        Returns:
            File size in bytes
        """
        return os.path.getsize(file_path)
    
    @staticmethod
    def list_files(directory: str, pattern: str = '*') -> List[str]:
        """
        List files in directory
        
        Args:
            directory: Directory path
            pattern: File pattern (e.g., '*.py')
            
        Returns:
            List of file paths
        """
        path = Path(directory)
        return [str(f) for f in path.glob(pattern) if f.is_file()]
    
    @staticmethod
    def read_safe(file_path: str, default: Any = None) -> Optional[str]:
        """
        Safely read file with error handling
        
        Args:
            file_path: Path to file
            default: Default value if read fails
            
        Returns:
            File content or default value
        """
        try:
            return ReadHelper.read_text(file_path)
        except Exception as e:
            print(f"Warning: Could not read {file_path}: {e}")
            return default

def main():
    """Example usage"""
    # Example: Read text file
    try:
        content = ReadHelper.read_text('example.txt')
        print(f"Content: {content[:100]}...")
    except FileNotFoundError:
        print("Example file not found")
    
    # Example: Read JSON file
    try:
        data = ReadHelper.read_json('config.json')
        print(f"JSON data: {data}")
    except FileNotFoundError:
        print("Config file not found")
    
    # Example: List Python files
    py_files = ReadHelper.list_files('.', '*.py')
    print(f"Python files: {py_files}")

if __name__ == '__main__':
    main()
