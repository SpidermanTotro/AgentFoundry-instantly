"""Tests for the Task class."""

from agentfoundry import Task


class TestTask:
    """Test cases for the Task class."""

    def test_task_creation(self):
        """Test creating a task."""
        task = Task("TestTask", "A test task description")
        assert task.name == "TestTask"
        assert task.description == "A test task description"
        assert task.parameters == {}

    def test_task_with_parameters(self):
        """Test creating a task with parameters."""
        params = {"input": "data", "output": "result"}
        task = Task("ParamTask", "Task with params", parameters=params)
        assert task.name == "ParamTask"
        assert task.parameters == params

    def test_task_str(self):
        """Test task string representation."""
        task = Task("StrTask", "String test")
        assert str(task) == "Task('StrTask')"

    def test_task_repr(self):
        """Test task detailed representation."""
        task = Task("ReprTask", "Repr test")
        assert repr(task) == "Task(name='ReprTask', description='Repr test')"
