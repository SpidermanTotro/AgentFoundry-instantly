"""Tests for the Agent class."""

from agentfoundry import Agent, Task


class TestAgent:
    """Test cases for the Agent class."""

    def test_agent_creation(self):
        """Test creating an agent."""
        agent = Agent("TestAgent")
        assert agent.name == "TestAgent"
        assert agent.config == {}

    def test_agent_with_config(self):
        """Test creating an agent with configuration."""
        config = {"model": "gpt-4", "temperature": 0.7}
        agent = Agent("ConfigAgent", config=config)
        assert agent.name == "ConfigAgent"
        assert agent.config == config

    def test_agent_execute(self):
        """Test agent execution."""
        agent = Agent("ExecuteAgent")
        task = Task("test_task", "A test task")
        result = agent.execute(task)

        assert result["status"] == "success"
        assert result["agent"] == "ExecuteAgent"
        assert "Task('test_task')" in result["task"]

    def test_agent_repr(self):
        """Test agent string representation."""
        agent = Agent("ReprAgent")
        assert repr(agent) == "Agent(name='ReprAgent')"
