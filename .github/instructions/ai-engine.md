---
files:
  - "server/ai-engine/**/*.js"
---

# AI Engine Development Instructions

## AI Engine Architecture

The AI engine supports three modes:
1. **Offline Mode** (default): 100% local, AST-based analysis
2. **Online Mode**: Cloud AI providers (Gemini, Claude, Cohere)
3. **Hybrid Mode**: Smart switching with fallback

## LocalAIEngine.js (Offline Mode)

### AST-Based Code Analysis
- Use `@babel/parser` for parsing JavaScript/JSX
- Use `@babel/traverse` for AST traversal
- No external API dependencies
- Must work without internet

### Code Analysis Functions
```javascript
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

function analyzeCode(code) {
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  });
  
  const analysis = {
    functions: [],
    variables: [],
    complexity: 0
  };
  
  traverse(ast, {
    FunctionDeclaration(path) {
      analysis.functions.push(path.node.id.name);
    },
    VariableDeclaration(path) {
      path.node.declarations.forEach(decl => {
        analysis.variables.push(decl.id.name);
      });
    }
  });
  
  return analysis;
}
```

### Complexity Analysis
- Calculate cyclomatic complexity
- Count function parameters
- Measure nesting depth
- Identify code smells

### Code Suggestions
- Pattern matching for common improvements
- Variable naming suggestions
- Function extraction opportunities
- Performance optimization hints

### Response Format
```javascript
{
  success: true,
  mode: 'offline',
  data: {
    analysis: { ... },
    suggestions: [ ... ],
    complexity: { ... }
  }
}
```

## GenSparkAI.js (Online/Hybrid Mode)

### Multi-Provider Support
- Google Gemini: `@google/generative-ai`
- Anthropic Claude: `@anthropic-ai/sdk`
- Cohere: `cohere`

### Provider Selection Logic
1. Check API key availability
2. Try primary provider (Google Gemini)
3. Fallback to secondary (Claude)
4. Fallback to tertiary (Cohere)
5. Final fallback to offline mode

### API Client Initialization
```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Anthropic = require('@anthropic-ai/sdk');
const { CohereClient } = require('cohere');

// Initialize clients only if API keys available
const gemini = process.env.GOOGLE_API_KEY 
  ? new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
  : null;

const claude = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const cohere = process.env.COHERE_API_KEY
  ? new CohereClient({ token: process.env.COHERE_API_KEY })
  : null;
```

### Error Handling
- Catch network errors
- Catch API key errors
- Catch rate limit errors
- Always fallback gracefully
- Log errors for debugging

### Caching Strategy
- Cache successful responses
- Use request hash as cache key
- Implement TTL (time to live)
- Clear cache on low memory

### Prompt Engineering
- Include relevant context
- Specify output format
- Add examples when helpful
- Keep prompts concise
- Request JSON responses when possible

## CodeIntelligence.js

### Refactoring Operations
1. **Extract Function**: Identify code blocks to extract
2. **Rename Variable**: Find all references
3. **Simplify Conditionals**: Reduce complexity
4. **Remove Dead Code**: Identify unused code
5. **Optimize Performance**: Suggest improvements

### Security Scanning
- Detect `eval()` usage
- Identify XSS vulnerabilities
- Check for SQL injection risks
- Find hardcoded credentials
- Detect unsafe regex patterns

### Code Metrics
- Lines of code (LOC)
- Cyclomatic complexity
- Cognitive complexity
- Maintainability index
- Halstead metrics

## PluginSystem.js

### Skill Management
- Store skills in SQLite database
- Each skill has: name, description, code, success_rate
- Support CRUD operations
- Track skill usage statistics

### Skill Structure
```javascript
{
  id: 1,
  name: 'refactor-variables',
  description: 'Refactor variable names for clarity',
  code: 'function(ast) { ... }',
  success_rate: 0.85,
  usage_count: 42,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-02T00:00:00Z'
}
```

### Skill Execution
- Safely execute skill code
- Validate inputs
- Catch execution errors
- Update success metrics
- Learn from failures

### Self-Learning
- Track skill success/failure
- Update success rates
- Identify improving skills
- Archive low-performing skills
- Generate new skills from patterns

## Performance Guidelines

### Response Time Targets
- Offline operations: < 500ms
- Online operations: < 3s
- Complexity analysis: < 100ms
- Code suggestions: < 50ms

### Optimization Strategies
- Parse code once, cache AST
- Reuse traversal results
- Limit AST traversal depth
- Use streaming for large responses
- Implement request throttling

## Testing AI Features

### Offline Mode Testing
- Test without internet connection
- Test without API keys
- Verify AST parsing accuracy
- Check suggestion quality

### Online Mode Testing
- Test with valid API keys
- Test with invalid API keys
- Test network failures
- Verify fallback behavior

### Hybrid Mode Testing
- Test mode switching
- Verify cache behavior
- Test provider failover
- Check performance impact

## Common Patterns

### Safe API Call
```javascript
async function callAI(prompt) {
  try {
    if (gemini) {
      const model = gemini.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(prompt);
      return result.response.text();
    }
  } catch (error) {
    console.error('Online AI failed:', error);
  }
  
  // Fallback to offline
  return offlineAnalysis(prompt);
}
```

### Graceful Degradation
Always maintain functionality even when:
- API keys are missing
- Network is unavailable
- Providers are down
- Rate limits are hit
