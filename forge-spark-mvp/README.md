# 🔥 Forge Spark MVP

A REAL, WORKING AI development platform starter kit that you can install and run on Linux TODAY.

## What Works NOW

✅ AI-powered code completion API  
✅ FastAPI backend server  
✅ Hugging Face model integration  
✅ Docker deployment  
✅ WebSocket support  
✅ Demo web interface  

## Quick Start

```bash
# 1. Make install script executable
chmod +x install.sh

# 2. Install (may require sudo)
./install.sh

# 3. Start the server
docker-compose up -d

# 4. Test it
curl http://localhost:8000/health

# 5. Open demo
open http://localhost:8000/demo
```

## Alternative: Run Without Docker

```bash
# 1. Create Python virtual environment
python3 -m venv venv
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run the server
cd src && uvicorn main:app --reload --port 8000
```

## API Endpoints

- `GET /` - API info
- `GET /health` - Health check
- `POST /api/completion` - Code completion
- `POST /api/chat` - AI chat
- `GET /demo` - Demo page
- `WS /ws/completion` - WebSocket completion

## Example API Call

```bash
curl -X POST http://localhost:8000/api/completion \
  -H "Content-Type: application/json" \
  -d '{
    "code": "def fibonacci(n):\n    # Complete this",
    "language": "python"
  }'
```

## Tech Stack

- **Python 3.11+** (FastAPI)
- **Hugging Face Transformers**
- **Docker & Docker Compose**
- **PyTorch** (CPU or GPU)

## Extend It

This MVP provides the foundation. You can add:

- More AI models (GPT-2, CodeLlama, etc.)
- Better UI (Monaco editor)
- GitHub integration
- Database storage
- User authentication
- IDE features
- Reverse engineering tools
- Game asset extraction
- Team collaboration

## File Structure

```
forge-spark-mvp/
├── install.sh              # Installation script
├── docker-compose.yml      # Docker configuration
├── Dockerfile             # Container definition
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables
├── .gitignore            # Git ignore
├── README.md             # This file
└── src/
    ├── __init__.py       # Package init
    ├── main.py           # Main API server
    ├── ai_engine.py      # AI model loader
    └── code_completion.py # Code completion service
```

## System Requirements

- **OS**: Linux (Ubuntu/Debian)
- **RAM**: 4GB minimum (8GB+ recommended)
- **Storage**: 10GB (for AI models)
- **Python**: 3.11+
- **Docker**: Latest version
- **GPU**: Optional (runs on CPU)

## Cost

**$0** - Completely free and open source

## License

MIT

## Next Steps

This is a working MVP that demonstrates the core concepts. To build the full Forge Spark platform with all features (reverse engineering, game tools, etc.), see the comprehensive specification documents.

---

**Made with 🔥 by the Forge Spark community**
