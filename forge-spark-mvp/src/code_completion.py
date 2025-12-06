"""
Code Completion Service
Provides AI-powered code completions for various programming languages
"""

from .ai_engine import AIEngine
from typing import Optional

class CodeCompletionService:
    def __init__(self, ai_engine: AIEngine):
        self.ai_engine = ai_engine
    
    async def get_completion(
        self,
        code: str,
        language: str = "python",
        cursor_position: int = 0
    ) -> str:
        """
        Get AI code completion
        
        Args:
            code: The code to complete
            language: Programming language
            cursor_position: Where the cursor is
            
        Returns:
            Completed code suggestion
        """
        # Get code up to cursor
        code_before_cursor = code[:cursor_position] if cursor_position > 0 else code
        
        # Add language context
        prompt = f"# Language: {language}\n{code_before_cursor}"
        
        # Generate completion
        completion = await self.ai_engine.generate_completion(
            prompt=prompt,
            max_length=50
        )
        
        return completion
    
    async def explain_code(self, code: str) -> str:
        """Explain what code does"""
        prompt = f"Explain this code:\n\n{code}\n\nExplanation:"
        explanation = await self.ai_engine.generate_completion(prompt, max_length=150)
        return explanation
    
    async def fix_code(self, code: str, error: str) -> str:
        """Suggest fix for code error"""
        prompt = f"Code:\n{code}\n\nError: {error}\n\nFixed code:"
        fix = await self.ai_engine.generate_completion(prompt, max_length=100)
        return fix
    
    async def refactor_code(self, code: str) -> str:
        """Suggest refactored version of code"""
        prompt = f"Refactor this code to be better:\n\n{code}\n\nRefactored code:"
        refactored = await self.ai_engine.generate_completion(prompt, max_length=150)
        return refactored
