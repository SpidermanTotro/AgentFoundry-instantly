#!/usr/bin/env python3
"""
Agent Stub Template

Template for creating new agent implementations.
Name: {{name}}
"""

class {{class_name}}:
    """
    {{name}} agent implementation
    
    This is a basic agent stub that can be extended with custom functionality.
    """
    
    def __init__(self, config=None):
        """
        Initialize the agent
        
        Args:
            config: Optional configuration dictionary
        """
        self.config = config or {}
        self.name = "{{name}}"
        self.version = "0.1.0"
        self.state = {}
    
    def initialize(self):
        """Initialize agent state and resources"""
        print(f"Initializing {self.name} agent...")
        self.state = {
            'initialized': True,
            'ready': True
        }
    
    def process(self, input_data):
        """
        Process input data
        
        Args:
            input_data: Input data to process
            
        Returns:
            Processed output
        """
        # TODO: Implement processing logic
        return {
            'status': 'success',
            'agent': self.name,
            'input': input_data,
            'output': None
        }
    
    def execute(self, task):
        """
        Execute a task
        
        Args:
            task: Task description or configuration
            
        Returns:
            Task execution result
        """
        # TODO: Implement task execution
        return {
            'task': task,
            'status': 'completed',
            'result': None
        }
    
    def get_state(self):
        """Get current agent state"""
        return self.state
    
    def shutdown(self):
        """Cleanup and shutdown agent"""
        print(f"Shutting down {self.name} agent...")
        self.state['ready'] = False

def main():
    """Example usage"""
    agent = {{class_name}}()
    agent.initialize()
    
    # Example task execution
    result = agent.execute("example_task")
    print(f"Result: {result}")
    
    agent.shutdown()

if __name__ == '__main__':
    main()
