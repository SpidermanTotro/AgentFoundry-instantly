"""
Agent Metadata Template

Metadata descriptor for {{ agent_name }}.
"""

from typing import Dict, Any, List


# Agent metadata
AGENT_METADATA = {
    "name": "{{ agent_name }}",
    "version": "1.0.0",
    "type": "{{ agent_type }}",
    "description": "Agent created from AgentFoundry template",
    "author": "AgentFoundry",
    "license": "MIT",
    "tags": ["agent", "{{ agent_type }}", "generated"],
    
    "capabilities": [
        "process_data",
        "execute_task",
        "generate_response"
    ],
    
    "requirements": {
        "python": ">=3.8",
        "dependencies": [
            "requests>=2.31.0",
            "python-dotenv>=1.0.0"
        ]
    },
    
    "configuration": {
        "schema": {
            "type": "object",
            "properties": {
                "timeout": {
                    "type": "integer",
                    "default": 30,
                    "description": "Operation timeout in seconds"
                },
                "max_retries": {
                    "type": "integer",
                    "default": 3,
                    "description": "Maximum number of retries"
                },
                "log_level": {
                    "type": "string",
                    "enum": ["DEBUG", "INFO", "WARNING", "ERROR"],
                    "default": "INFO",
                    "description": "Logging level"
                }
            }
        }
    },
    
    "api": {
        "version": "1.0",
        "endpoints": [
            {
                "name": "initialize",
                "description": "Initialize the agent",
                "parameters": [],
                "returns": "bool"
            },
            {
                "name": "process",
                "description": "Process input data",
                "parameters": ["input_data: Any"],
                "returns": "Any"
            },
            {
                "name": "execute",
                "description": "Execute a task",
                "parameters": ["task: str", "params: Optional[Dict]"],
                "returns": "Dict[str, Any]"
            },
            {
                "name": "get_capabilities",
                "description": "Get agent capabilities",
                "parameters": [],
                "returns": "List[str]"
            },
            {
                "name": "get_state",
                "description": "Get current state",
                "parameters": [],
                "returns": "Dict[str, Any]"
            },
            {
                "name": "shutdown",
                "description": "Shutdown the agent",
                "parameters": [],
                "returns": "bool"
            }
        ]
    }
}


def get_metadata() -> Dict[str, Any]:
    """
    Get agent metadata.
    
    Returns:
        Dictionary containing agent metadata
    """
    return AGENT_METADATA


def get_capabilities() -> List[str]:
    """
    Get list of agent capabilities.
    
    Returns:
        List of capability identifiers
    """
    return AGENT_METADATA["capabilities"]


def get_version() -> str:
    """
    Get agent version.
    
    Returns:
        Version string
    """
    return AGENT_METADATA["version"]


def validate_config(config: Dict[str, Any]) -> bool:
    """
    Validate configuration against schema.
    
    Args:
        config: Configuration to validate
        
    Returns:
        True if valid, False otherwise
    """
    # Add validation logic here
    return True
