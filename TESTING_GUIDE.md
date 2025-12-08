# Testing the Unified Platform Integration

## Prerequisites

Before testing, ensure you have:

1. Node.js 16+ installed
2. All dependencies installed: `npm install`
3. Server running: `npm run server`

## Quick Verification

### 1. Check Package Dependencies

Ensure `mathjs` is in package.json:

```bash
grep "mathjs" package.json
```

Should show:
```
"mathjs": "^12.0.0",
```

### 2. Verify Server Files

Check that all new files are in place:

```bash
# Check KimiAI module
ls -la server/ai-engine/KimiAI.js

# Check UnifiedAIOrchestrator
ls -la server/ai-engine/UnifiedAIOrchestrator.js

# Check unified routes
ls -la server/routes/unified.js

# Check tests
ls -la tests/unified-integration.test.js
```

### 3. Start the Server

```bash
npm run server
```

Expected output should include:
```
🚀 Initializing Unified AI Orchestrator...
✅ ChatGPT 2.0 UNRESTRICTED loaded
✅ Kimi AI loaded
✅ GenSpark AI loaded
✅ Local AI Engine loaded
✨ Unified AI Orchestrator ready!

🚀 GenSpark 2.0 UNIFIED - Server ONLINE
Mode: Unified AI Platform (ChatGPT 2.0 + Kimi + GenSpark)
```

### 4. Test Health Endpoints

```bash
# Main health check
curl http://localhost:3001/api/health

# Unified health check
curl http://localhost:3001/api/unified/health
```

### 5. Test Capabilities

```bash
# Get all capabilities
curl http://localhost:3001/api/unified/capabilities | jq

# Get statistics
curl http://localhost:3001/api/unified/stats | jq
```

### 6. Test Individual Features

#### Test Math Computation (Kimi)

```bash
curl -X POST http://localhost:3001/api/unified/compute-math \
  -H "Content-Type: application/json" \
  -d '{"expression": "2 + 2 * 3"}' | jq
```

Expected:
```json
{
  "success": true,
  "expression": "2 + 2 * 3",
  "result": 8,
  "metadata": {
    "engine": "kimi",
    "taskType": "math_computation"
  }
}
```

#### Test Web Search (Kimi)

```bash
curl -X POST http://localhost:3001/api/unified/web-search \
  -H "Content-Type: application/json" \
  -d '{"query": "Latest AI news"}' | jq
```

#### Test Unified Chat

```bash
curl -X POST http://localhost:3001/api/unified/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello unified system!"}' | jq
```

#### Test Auto-Routing

```bash
# Math task should route to Kimi
curl -X POST http://localhost:3001/api/unified/auto \
  -H "Content-Type: application/json" \
  -d '{"task": {"description": "Calculate 10 * 5"}}' | jq
```

### 7. Run Integration Tests

```bash
# Start server first
npm run server &

# Wait a few seconds for startup
sleep 5

# Run tests
node tests/unified-integration.test.js
```

Expected output:
```
🧪 Starting GenSpark 2.0 Unified Platform Tests

Testing Health Check... ✅ PASSED
Testing Get Capabilities... ✅ PASSED
Testing Unified Chat... ✅ PASSED
Testing Long Context Processing... ✅ PASSED
Testing Document Analysis... ✅ PASSED
Testing Mathematical Computation... ✅ PASSED
Testing Web Search... ✅ PASSED
Testing Code Execution... ✅ PASSED
Testing Auto-Routing... ✅ PASSED
Testing Get Statistics... ✅ PASSED

📊 Test Summary:
   Total Tests: 10
   ✅ Passed: 10
   ❌ Failed: 0
   Success Rate: 100.0%

🎉 All tests passed! Integration is working correctly.
```

## Manual Testing Scenarios

### Scenario 1: Long Context Processing

Test Kimi's ability to handle ultra-long conversations:

```javascript
// Create a test with 100 messages
const messages = [];
for (let i = 0; i < 100; i++) {
  messages.push({
    role: 'user',
    content: `Message ${i}: This is a test message`
  });
}

fetch('http://localhost:3001/api/unified/long-context', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages })
})
  .then(r => r.json())
  .then(data => console.log(`Processed ${data.tokenCount} tokens`));
```

### Scenario 2: Document Analysis

Test Kimi's document processing:

```bash
# Create a test document
echo "This is a test document with some content for analysis." > test.txt

# Analyze it
curl -X POST http://localhost:3001/api/unified/analyze-document \
  -H "Content-Type: application/json" \
  -d '{"filePath": "./test.txt"}' | jq

# Cleanup
rm test.txt
```

### Scenario 3: Routing Intelligence

Test the auto-routing feature:

```bash
# Different tasks should route to different engines

# Math → Kimi
curl -X POST http://localhost:3001/api/unified/auto \
  -H "Content-Type: application/json" \
  -d '{"task": {"expression": "sqrt(144)"}}' | jq '.metadata.engine'

# Document → Kimi
curl -X POST http://localhost:3001/api/unified/auto \
  -H "Content-Type: application/json" \
  -d '{"task": {"filePath": "./doc.pdf"}}' | jq '.metadata.engine'

# Image → GenSpark
curl -X POST http://localhost:3001/api/unified/auto \
  -H "Content-Type: application/json" \
  -d '{"task": {"description": "generate image"}}' | jq '.metadata.engine'
```

## Troubleshooting

### Issue: Server won't start

**Check:**
1. Port 3001 is not in use: `lsof -i :3001`
2. All dependencies installed: `npm install`
3. No syntax errors: `node server/index.js --check`

### Issue: Tests fail

**Check:**
1. Server is running: `curl http://localhost:3001/api/health`
2. All modules exist: Check files listed in "Verify Server Files" above
3. Dependencies installed: `npm list mathjs`

### Issue: Math computation fails

**Check:**
1. mathjs is installed: `npm list mathjs`
2. If not: `npm install mathjs`
3. Restart server

### Issue: Module not found errors

**Check:**
1. File paths in require() statements
2. Run from project root directory
3. All new files committed: `git status`

## Expected Behavior

When everything is working correctly:

1. **Server starts** with no errors
2. **All 4 engines initialize**: ChatGPT 2.0, Kimi, GenSpark, Local AI
3. **Health endpoint** shows `unifiedAI: true`
4. **Capabilities endpoint** lists all engines
5. **Math computation** returns correct results
6. **Auto-routing** selects appropriate engines
7. **All tests pass** with 100% success rate

## Performance Benchmarks

Typical response times (on local machine):

- **Health check**: <10ms
- **Capabilities**: <20ms
- **Math computation**: <50ms
- **Chat routing**: <100ms
- **Document analysis**: <500ms (depends on file size)
- **Web search**: 1-3 seconds (depends on network)

## Next Steps

After successful testing:

1. Read [UNIFIED_PLATFORM_GUIDE.md](./UNIFIED_PLATFORM_GUIDE.md) for complete documentation
2. Try examples from [UNIFIED_INTEGRATION_EXAMPLES.md](./UNIFIED_INTEGRATION_EXAMPLES.md)
3. Explore the API with your own use cases
4. Customize routing rules if needed
5. Add your own AI engines to the orchestrator

## Support

If you encounter issues:

1. Check server logs for detailed error messages
2. Verify all files are present and correct
3. Ensure dependencies are installed
4. Review this testing guide
5. Check the main documentation

---

**Last Updated**: December 8, 2024  
**Version**: 1.0.0  
**Status**: ✅ Integration Complete
