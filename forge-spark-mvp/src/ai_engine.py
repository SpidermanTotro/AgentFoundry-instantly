"""
AI Engine - Handles loading and running Hugging Face models
This is REAL working code that loads and uses AI models
"""

from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
import torch
import os
from typing import Optional

class AIEngine:
    def __init__(self, cache_dir: str = "./models"):
        self.cache_dir = cache_dir
        self.model = None
        self.tokenizer = None
        self.current_model = "distilgpt2"  # Start with small, fast model
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
        # Create cache directory if it doesn't exist
        os.makedirs(cache_dir, exist_ok=True)
        
        print(f"🤖 AI Engine initialized")
        print(f"   Device: {self.device}")
        print(f"   Cache: {cache_dir}")
        
    def is_loaded(self) -> bool:
        """Check if model is loaded"""
        return self.model is not None
    
    def load_model(self, model_name: str = "distilgpt2"):
        """
        Load a Hugging Face model
        
        Free models you can use:
        - distilgpt2 (small, fast, 80MB) - RECOMMENDED for testing
        - gpt2 (medium, 500MB)
        - bigcode/tiny_starcoder_py (code, 164MB)
        - Salesforce/codegen-350M-mono (code, 350MB)
        """
        try:
            print(f"📥 Loading model: {model_name}")
            
            self.tokenizer = AutoTokenizer.from_pretrained(
                model_name,
                cache_dir=self.cache_dir
            )
            
            # Set pad token if not set
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token
            
            self.model = AutoModelForCausalLM.from_pretrained(
                model_name,
                cache_dir=self.cache_dir,
                torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
                low_cpu_mem_usage=True
            ).to(self.device)
            
            self.current_model = model_name
            print(f"✅ Model loaded: {model_name}")
            return True
            
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            return False
    
    async def generate_completion(self, prompt: str, max_length: int = 100) -> str:
        """Generate text completion"""
        if not self.is_loaded():
            print("Loading default model...")
            self.load_model()
        
        try:
            inputs = self.tokenizer(
                prompt,
                return_tensors="pt",
                padding=True,
                truncation=True,
                max_length=512
            ).to(self.device)
            
            outputs = self.model.generate(
                **inputs,
                max_length=len(inputs.input_ids[0]) + max_length,
                num_return_sequences=1,
                temperature=0.7,
                do_sample=True,
                top_p=0.95,
                pad_token_id=self.tokenizer.eos_token_id
            )
            
            completion = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            # Return only the new generated text
            return completion[len(prompt):]
            
        except Exception as e:
            print(f"Error generating completion: {e}")
            return f"# Error: {str(e)}"
    
    async def chat(self, message: str, context: Optional[str] = None) -> str:
        """Chat with AI about coding"""
        if not self.is_loaded():
            self.load_model()
        
        # Create a prompt for coding assistance
        prompt = f"Question: {message}\n\nAnswer:"
        if context:
            prompt = f"Context: {context}\n\n{prompt}"
        
        response = await self.generate_completion(prompt, max_length=200)
        return response.strip()
