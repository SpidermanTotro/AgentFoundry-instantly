# GenSpark 2.0 Unified Platform - Integration Examples

This document provides comprehensive examples of using the unified ChatGPT 2.0 + Kimi + GenSpark platform.

## Table of Contents

1. [Unified Chat](#unified-chat)
2. [Long Context Processing (Kimi)](#long-context-processing)
3. [Document Analysis (Kimi)](#document-analysis)
4. [Mathematical Computation (Kimi)](#mathematical-computation)
5. [Web Search (Kimi)](#web-search)
6. [GitHub Integration (ChatGPT 2.0)](#github-integration)
7. [File Operations (ChatGPT 2.0)](#file-operations)
8. [Code Execution (Kimi + ChatGPT)](#code-execution)
9. [Image Generation (GenSpark)](#image-generation)
10. [Auto-Routing](#auto-routing)

---

## Unified Chat

The unified chat endpoint intelligently routes your message to the best AI engine.

```bash
curl -X POST http://localhost:3001/api/unified/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explain quantum computing",
    "personality": "assistant"
  }'
```

**JavaScript Example:**
```javascript
const response = await fetch('http://localhost:3001/api/unified/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Write a Python function to calculate fibonacci numbers',
    personality: 'code'
  })
});

const data = await response.json();
console.log(data.message);
```

---

## Long Context Processing

Process ultra-long conversations with Kimi's 200K token context window.

```bash
curl -X POST http://localhost:3001/api/unified/long-context \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Tell me about AI"},
      {"role": "assistant", "content": "AI stands for..."},
      {"role": "user", "content": "What about machine learning?"}
    ],
    "options": {
      "preserveHistory": true,
      "summarize": false
    }
  }'
```

**JavaScript Example:**
```javascript
const messages = [];
for (let i = 0; i < 50; i++) {
  messages.push({
    role: 'user',
    content: `Question ${i}: Tell me more about topic ${i}`
  });
  messages.push({
    role: 'assistant',
    content: `Answer ${i}: Here's information about topic ${i}...`
  });
}

const response = await fetch('http://localhost:3001/api/unified/long-context', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages })
});

const data = await response.json();
console.log(`Processed ${data.tokenCount} tokens`);
```

---

## Document Analysis

Analyze PDF, DOCX, and text documents with Kimi's document processing.

```bash
curl -X POST http://localhost:3001/api/unified/analyze-document \
  -H "Content-Type: application/json" \
  -d '{
    "filePath": "/path/to/document.pdf",
    "options": {
      "extractText": true,
      "summarize": true,
      "extractTables": false
    }
  }'
```

**JavaScript Example:**
```javascript
const response = await fetch('http://localhost:3001/api/unified/analyze-document', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    filePath: './research-paper.pdf',
    options: {
      extractText: true,
      summarize: true
    }
  })
});

const data = await response.json();
console.log(`Document has ${data.wordCount} words`);
console.log(data.content);
```

---

## Mathematical Computation

Perform advanced mathematical calculations with Kimi.

```bash
curl -X POST http://localhost:3001/api/unified/compute-math \
  -H "Content-Type: application/json" \
  -d '{
    "expression": "sqrt(144) + log(100, 10) * 5",
    "options": {
      "precision": 10
    }
  }'
```

**JavaScript Example:**
```javascript
const expressions = [
  '2 + 2',
  'sqrt(16)',
  'sin(pi/2)',
  'log(100)',
  '(5 + 3) * 2 - 4 / 2'
];

for (const expr of expressions) {
  const response = await fetch('http://localhost:3001/api/unified/compute-math', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expression: expr })
  });
  
  const data = await response.json();
  console.log(`${expr} = ${data.result}`);
}
```

---

## Web Search

Search the web with Kimi's advanced search capabilities.

```bash
curl -X POST http://localhost:3001/api/unified/web-search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Latest AI developments 2024",
    "options": {
      "maxResults": 10,
      "includeSnippets": true
    }
  }'
```

**JavaScript Example:**
```javascript
const response = await fetch('http://localhost:3001/api/unified/web-search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'Best practices for React 19',
    options: {
      maxResults: 5,
      language: 'en'
    }
  })
});

const data = await response.json();
data.results.forEach(result => {
  console.log(`${result.title}: ${result.url}`);
  console.log(result.snippet);
});
```

---

## GitHub Integration

Interact with GitHub repositories using ChatGPT 2.0.

```bash
# List repositories
curl -X POST http://localhost:3001/api/unified/github \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "list_repos",
    "params": {
      "username": "octocat"
    }
  }'

# Create an issue
curl -X POST http://localhost:3001/api/unified/github \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "create_issue",
    "params": {
      "owner": "octocat",
      "repo": "Hello-World",
      "title": "Bug report",
      "body": "Found a bug in feature X"
    }
  }'
```

**JavaScript Example:**
```javascript
// Get repository information
const repoResponse = await fetch('http://localhost:3001/api/unified/github', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    operation: 'get_repo',
    params: {
      owner: 'facebook',
      repo: 'react'
    }
  })
});

const repoData = await repoResponse.json();
console.log(`Stars: ${repoData.stars}, Forks: ${repoData.forks}`);
```

---

## File Operations

Read and write files using ChatGPT 2.0's file system access.

```bash
# Read a file
curl -X POST http://localhost:3001/api/unified/file-operation \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "read",
    "path": "./package.json"
  }'

# Write a file
curl -X POST http://localhost:3001/api/unified/file-operation \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "write",
    "path": "./output.txt",
    "content": "Generated by GenSpark 2.0 Unified"
  }'
```

**JavaScript Example:**
```javascript
// Read file
const readResponse = await fetch('http://localhost:3001/api/unified/file-operation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    operation: 'read',
    path: './README.md'
  })
});

const fileData = await readResponse.json();
console.log('File content:', fileData.content);

// Write file
const writeResponse = await fetch('http://localhost:3001/api/unified/file-operation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    operation: 'write',
    path: './generated.txt',
    content: 'This was generated by the unified AI system'
  })
});

console.log('Write result:', await writeResponse.json());
```

---

## Code Execution

Execute code using Kimi or ChatGPT 2.0's code interpreters.

```bash
curl -X POST http://localhost:3001/api/unified/execute-code \
  -H "Content-Type: application/json" \
  -d '{
    "code": "const sum = (a, b) => a + b; sum(5, 3);",
    "language": "javascript"
  }'
```

**JavaScript Example:**
```javascript
const pythonCode = `
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

factorial(5)
`;

const response = await fetch('http://localhost:3001/api/unified/execute-code', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: pythonCode,
    language: 'python'
  })
});

const data = await response.json();
console.log('Execution result:', data.output);
```

---

## Image Generation

Generate images using GenSpark's multi-modal capabilities.

```bash
curl -X POST http://localhost:3001/api/unified/generate-image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A beautiful sunset over mountains with vibrant colors",
    "options": {
      "width": 1024,
      "height": 1024,
      "style": "realistic"
    }
  }'
```

**JavaScript Example:**
```javascript
const response = await fetch('http://localhost:3001/api/unified/generate-image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'A futuristic cityscape at night with neon lights',
    options: {
      width: 1024,
      height: 1024,
      style: 'cyberpunk'
    }
  })
});

const data = await response.json();
console.log('Image URL:', data.imageUrl);
```

---

## Auto-Routing

Let the orchestrator automatically detect and route to the best engine.

```bash
# Document-related task → Kimi
curl -X POST http://localhost:3001/api/unified/auto \
  -H "Content-Type: application/json" \
  -d '{
    "task": {
      "description": "Analyze this PDF document",
      "filePath": "./document.pdf"
    }
  }'

# GitHub-related task → ChatGPT 2.0
curl -X POST http://localhost:3001/api/unified/auto \
  -H "Content-Type: application/json" \
  -d '{
    "task": {
      "description": "List my GitHub repositories"
    }
  }'

# Image generation task → GenSpark
curl -X POST http://localhost:3001/api/unified/auto \
  -H "Content-Type: application/json" \
  -d '{
    "task": {
      "description": "Generate an image of a cat",
      "prompt": "A cute cat playing with yarn"
    }
  }'
```

**JavaScript Example:**
```javascript
// The orchestrator auto-detects the task type
const tasks = [
  { description: 'Calculate 2^10 + sqrt(144)' },  // → Kimi (math)
  { description: 'Create GitHub issue', repo: 'my-repo' },  // → ChatGPT 2.0
  { description: 'Generate landscape image', prompt: 'Mountains' }  // → GenSpark
];

for (const task of tasks) {
  const response = await fetch('http://localhost:3001/api/unified/auto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task })
  });
  
  const data = await response.json();
  console.log(`Task routed to: ${data.metadata.engine}`);
  console.log(`Task type: ${data.metadata.taskType}`);
}
```

---

## Get System Capabilities

Check what capabilities are available in the unified system.

```bash
curl http://localhost:3001/api/unified/capabilities
```

**JavaScript Example:**
```javascript
const response = await fetch('http://localhost:3001/api/unified/capabilities');
const data = await response.json();

console.log('Available engines:', Object.keys(data.capabilities.engines));
console.log('ChatGPT 2.0 features:', data.capabilities.engines.chatgpt);
console.log('Kimi features:', data.capabilities.engines.kimi);
console.log('GenSpark features:', data.capabilities.engines.genspark);
```

---

## Get System Statistics

Monitor the unified system's performance and usage.

```bash
curl http://localhost:3001/api/unified/stats
```

**JavaScript Example:**
```javascript
const response = await fetch('http://localhost:3001/api/unified/stats');
const data = await response.json();

console.log('Total engines:', data.stats.orchestrator.totalEngines);
console.log('Active engines:', data.stats.orchestrator.activeEngines);
console.log('Kimi context usage:', data.stats.engines.kimi.utilizationPercent + '%');
```

---

## Complete Workflow Example

A comprehensive example showing multiple integrated features:

```javascript
async function completeWorkflow() {
  // 1. Search for information
  const searchResult = await fetch('http://localhost:3001/api/unified/web-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'React 19 new features' })
  }).then(r => r.json());
  
  console.log('Search results:', searchResult.results.length);
  
  // 2. Analyze a document
  const docResult = await fetch('http://localhost:3001/api/unified/analyze-document', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filePath: './tech-report.pdf' })
  }).then(r => r.json());
  
  console.log('Document analysis:', docResult.wordCount, 'words');
  
  // 3. Perform calculations
  const mathResult = await fetch('http://localhost:3001/api/unified/compute-math', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expression: '(100 * 1.15) - 20' })
  }).then(r => r.json());
  
  console.log('Calculation result:', mathResult.result);
  
  // 4. Execute code
  const codeResult = await fetch('http://localhost:3001/api/unified/execute-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: 'console.log("Hello from unified platform"); 42;',
      language: 'javascript'
    })
  }).then(r => r.json());
  
  console.log('Code execution:', codeResult.output);
  
  // 5. Get final statistics
  const stats = await fetch('http://localhost:3001/api/unified/stats')
    .then(r => r.json());
  
  console.log('Workflow complete. System stats:', stats);
}

completeWorkflow();
```

---

## Best Practices

1. **Use Auto-Routing**: Let the orchestrator choose the best engine for you
2. **Check Capabilities**: Query `/capabilities` to see what's available
3. **Monitor Stats**: Use `/stats` to track system performance
4. **Handle Fallbacks**: The system automatically falls back to alternative engines
5. **Specify Preferences**: Use `preferredEngine` option when you know which engine is best
6. **Preserve Context**: Use Kimi's long context for multi-turn conversations
7. **Cache Results**: Document and search results are automatically cached

---

## Error Handling

```javascript
async function safeApiCall(endpoint, data) {
  try {
    const response = await fetch(`http://localhost:3001/api/unified/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Operation failed');
    }
    
    return result;
    
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error.message);
    throw error;
  }
}

// Usage
try {
  const result = await safeApiCall('chat', {
    message: 'Hello unified system!'
  });
  console.log(result);
} catch (error) {
  console.error('Error:', error);
}
```

---

## Environment Configuration

Add these to your `.env` file for full functionality:

```bash
# AI Provider API Keys (Optional - works without them)
GOOGLE_API_KEY=your_google_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
COHERE_API_KEY=your_cohere_api_key

# GitHub Integration (Required for GitHub features)
GITHUB_TOKEN=your_github_personal_access_token

# Server Configuration
PORT=3001
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

---

## Testing the Integration

```bash
# Run the server
npm run server

# Test health endpoint
curl http://localhost:3001/api/health

# Test unified health
curl http://localhost:3001/api/unified/health

# Test capabilities
curl http://localhost:3001/api/unified/capabilities

# Test chat
curl -X POST http://localhost:3001/api/unified/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello unified world!"}'
```

---

**Last Updated**: December 8, 2024  
**Version**: 1.0.0  
**Platform**: GenSpark 2.0 Unified (ChatGPT 2.0 + Kimi + GenSpark)
