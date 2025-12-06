"""
Agent module for AgentFoundry.

Provides the base Agent class for creating AI programming agents.
"""

from __future__ import annotations
from typing import Dict, Any, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from .task import Task


class Agent:
    """Base class for AI programming agents."""

    def __init__(self, name: str, config: Optional[Dict[str, Any]] = None):
        """
        Initialize an Agent.

        Args:
            name: The name of the agent
            config: Optional configuration dictionary
        """
        self.name = name
        self.config = config or {}

    def execute(self, task: Task) -> Dict[str, Any]:
        """
        Execute a task.

        Args:
            task: The task to execute

        Returns:
            Dictionary containing execution results
        """
        return {
            "status": "success",
            "agent": self.name,
            "task": str(task),
        }

    def __repr__(self) -> str:
        """String representation of the agent."""
        return f"Agent(name='{self.name}')"
