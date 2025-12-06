"""
Task module for AgentFoundry.

Provides the Task class for defining work for agents.
"""

from typing import Dict, Any, Optional


class Task:
    """Represents a task for an agent to execute."""

    def __init__(
        self, name: str, description: str, parameters: Optional[Dict[str, Any]] = None
    ):
        """
        Initialize a Task.

        Args:
            name: The name of the task
            description: Description of what the task should accomplish
            parameters: Optional parameters for the task
        """
        self.name = name
        self.description = description
        self.parameters = parameters or {}

    def __str__(self) -> str:
        """String representation of the task."""
        return f"Task('{self.name}')"

    def __repr__(self) -> str:
        """Detailed representation of the task."""
        return f"Task(name='{self.name}', " f"description='{self.description}')"
