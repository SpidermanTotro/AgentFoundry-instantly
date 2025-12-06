"""
Forge Spark MVP - Main API Server
This is a REAL working FastAPI server with AI code completion
"""

from fastapi import FastAPI, WebSocket, HTTPException, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import uvicorn
import os
from typing import Optional

# Import our modules
from .ai_engine import AIEngine
from .code_completion import CodeCompletionService

# Initialize FastAPI
app = FastAPI(
    title="Forge Spark MVP",
    description="Free AI Development Platform - Real Working Implementation",
    version="0.1.0"
)

# Initialize AI engine
ai_engine = AIEngine(cache_dir="./models")
code_service = CodeCompletionService(ai_engine)

# Request models
class CompletionRequest(BaseModel):
    code: str
    language: str = "python"
    cursor_position: Optional[int] = None

class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None

# Health check endpoint
@app.get("/")
async def root():
    """Root endpoint with API info"""
    return {
        "name": "Forge Spark MVP",
        "version": "0.1.0",
        "status": "running",
        "message": "🔥 Real AI Development Platform",
        "endpoints": {
            "docs": "/docs",
            "completion": "/api/completion",
            "chat": "/api/chat",
            "health": "/health",
            "demo": "/demo"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "ai_models_loaded": ai_engine.is_loaded(),
        "cache_dir": ai_engine.cache_dir,
        "current_model": ai_engine.current_model
    }

@app.post("/api/completion")
async def code_completion(request: CompletionRequest):
    """
    AI-powered code completion endpoint
    
    Example:
    ```
    POST /api/completion
    {
        "code": "def calculate_fibonacci(",
        "language": "python",
        "cursor_position": 23
    }
    ```
    """
    try:
        cursor_pos = request.cursor_position if request.cursor_position is not None else len(request.code)
        
        completion = await code_service.get_completion(
            code=request.code,
            language=request.language,
            cursor_position=cursor_pos
        )
        
        return {
            "completion": completion,
            "language": request.language,
            "model": ai_engine.current_model
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat(request: ChatRequest):
    """
    AI chat endpoint for coding help
    
    Example:
    ```
    POST /api/chat
    {
        "message": "How do I create a REST API in Python?",
        "context": "Using FastAPI framework"
    }
    ```
    """
    try:
        response = await ai_engine.chat(
            message=request.message,
            context=request.context
        )
        
        return {
            "response": response,
            "model": ai_engine.current_model
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/completion")
async def websocket_completion(websocket: WebSocket):
    """WebSocket endpoint for real-time code completion"""
    await websocket.accept()
    
    try:
        while True:
            data = await websocket.receive_json()
            
            cursor_pos = data.get("cursor_position", len(data.get("code", "")))
            
            completion = await code_service.get_completion(
                code=data.get("code", ""),
                language=data.get("language", "python"),
                cursor_position=cursor_pos
            )
            
            await websocket.send_json({
                "completion": completion,
                "timestamp": data.get("timestamp"),
                "model": ai_engine.current_model
            })
    except WebSocketDisconnect:
        print("WebSocket disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")

@app.get("/demo", response_class=HTMLResponse)
async def demo_page():
    """Simple demo web page"""
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Forge Spark MVP Demo</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                max-width: 900px;
                margin: 50px auto;
                padding: 20px;
                background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
                color: #ffffff;
            }
            h1 {
                color: #00d4ff;
                text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
            }
            h2 {
                color: #00a8cc;
                margin-top: 30px;
            }
            textarea {
                width: 100%;
                height: 200px;
                background: #2d2d2d;
                color: #ffffff;
                border: 2px solid #00d4ff;
                border-radius: 8px;
                padding: 15px;
                font-family: 'Courier New', monospace;
                font-size: 14px;
                box-sizing: border-box;
            }
            button {
                background: linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%);
                color: #000;
                border: none;
                padding: 12px 30px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                margin-top: 10px;
                border-radius: 6px;
                transition: transform 0.2s;
            }
            button:hover {
                transform: scale(1.05);
            }
            button:active {
                transform: scale(0.95);
            }
            #result {
                margin-top: 20px;
                padding: 20px;
                background: #2d2d2d;
                border-left: 4px solid #00d4ff;
                border-radius: 6px;
                white-space: pre-wrap;
                font-family: 'Courier New', monospace;
                min-height: 100px;
            }
            .info-box {
                background: rgba(0, 212, 255, 0.1);
                border: 1px solid #00d4ff;
                border-radius: 6px;
                padding: 15px;
                margin: 20px 0;
            }
            .status {
                display: inline-block;
                padding: 4px 12px;
                background: #00d4ff;
                color: #000;
                border-radius: 4px;
                font-weight: bold;
                margin-left: 10px;
            }
            .loading {
                color: #ffaa00;
            }
        </style>
    </head>
    <body>
        <h1>🔥 Forge Spark MVP Demo</h1>
        <div class="info-box">
            <p>This is a <strong>REAL</strong> working AI code completion demo powered by Hugging Face models!</p>
            <p>Status: <span class="status" id="status">Ready</span></p>
        </div>

        <h2>Try AI Code Completion:</h2>
        <textarea id="code" placeholder="Type some code here...">def fibonacci(n):
    # Complete this function to calculate fibonacci numbers</textarea>
        <br>
        <button onclick="getCompletion()">✨ Get AI Completion</button>
        <button onclick="getExplanation()">📖 Explain Code</button>
        <button onclick="clearResult()">🗑️ Clear</button>

        <h2>Result:</h2>
        <div id="result">Click "Get AI Completion" to see AI-generated code suggestions...</div>

        <script>
            async function getCompletion() {
                const code = document.getElementById('code').value;
                const result = document.getElementById('result');
                const status = document.getElementById('status');
                
                status.textContent = 'Generating...';
                status.className = 'status loading';
                result.textContent = '⏳ Generating AI completion...';

                try {
                    const response = await fetch('/api/completion', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            code: code,
                            language: 'python',
                            cursor_position: code.length
                        })
                    });

                    const data = await response.json();
                    
                    result.textContent = '✅ AI Completion:\\n\\n' + 
                                       'Original Code:\\n' + code + '\\n\\n' +
                                       'AI Suggestion:\\n' + data.completion + '\\n\\n' +
                                       'Model: ' + data.model;
                    
                    status.textContent = 'Ready';
                    status.className = 'status';
                } catch (error) {
                    result.textContent = '❌ Error: ' + error.message;
                    status.textContent = 'Error';
                    status.className = 'status';
                }
            }

            async function getExplanation() {
                const code = document.getElementById('code').value;
                const result = document.getElementById('result');
                const status = document.getElementById('status');
                
                status.textContent = 'Analyzing...';
                status.className = 'status loading';
                result.textContent = '⏳ AI is analyzing your code...';

                try {
                    const response = await fetch('/api/chat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            message: 'Explain this code: ' + code
                        })
                    });

                    const data = await response.json();
                    
                    result.textContent = '📖 AI Explanation:\\n\\n' + data.response;
                    
                    status.textContent = 'Ready';
                    status.className = 'status';
                } catch (error) {
                    result.textContent = '❌ Error: ' + error.message;
                    status.textContent = 'Error';
                    status.className = 'status';
                }
            }

            function clearResult() {
                document.getElementById('result').textContent = 'Click "Get AI Completion" to see AI-generated code suggestions...';
            }
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
