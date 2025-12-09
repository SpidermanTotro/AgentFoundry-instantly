---
files:
  - "server/**/*.js"
  - "!server/ai-engine/**"
---

# Backend Development Instructions

## Express.js API Guidelines

### Route Organization
- Group related routes together
- Use RESTful naming conventions
- Prefix all API routes with `/api/`
- Keep route handlers async when performing I/O operations

### Request Handling Pattern
```javascript
app.post('/api/endpoint', async (req, res) => {
  try {
    // 1. Validate input
    const { requiredField } = req.body;
    if (!requiredField) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required field' 
      });
    }
    
    // 2. Process request
    const result = await processData(requiredField);
    
    // 3. Return success response
    res.json({ 
      success: true, 
      data: result 
    });
  } catch (error) {
    // 4. Handle errors
    console.error('Error in endpoint:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});
```

### Response Format Standards
- Always use JSON responses
- Include `success` boolean field
- Success responses: `{ success: true, data: { ... } }`
- Error responses: `{ success: false, error: 'message' }`
- Use appropriate HTTP status codes:
  - 200: Success
  - 201: Created
  - 400: Bad request (validation error)
  - 404: Not found
  - 500: Server error

### Error Handling
- Always wrap async route handlers in try-catch
- Log errors to console for debugging: `console.error('Context:', error)`
- Return user-friendly error messages
- Never expose internal error details or stack traces to clients
- Validate all inputs before processing

### Input Validation
- Check for required fields
- Validate data types
- Sanitize user inputs to prevent XSS
- Use validator library for email, URL validation
- Validate file uploads (type, size)

### Database Operations (SQLite)
- Use `better-sqlite3` for synchronous operations
- Prepare statements for repeated queries
- Close database connections properly
- Use transactions for multiple related operations

Example:
```javascript
const Database = require('better-sqlite3');
const dbPath = process.env.DB_PATH || 'data/app.db';
const db = new Database(dbPath);

// Prepared statement
const stmt = db.prepare('SELECT * FROM skills WHERE id = ?');
const skill = stmt.get(skillId);

// Transaction
const insertSkill = db.transaction((name, code) => {
  const insert = db.prepare('INSERT INTO skills (name, code) VALUES (?, ?)');
  insert.run(name, code);
});

insertSkill('refactor-variables', 'function code() { ... }');
```

### CORS Configuration
- Enable CORS for frontend development: `app.use(cors())`
- In production, restrict to specific origins
- Allow credentials if needed

### Middleware Usage
- Use `body-parser` or Express built-in JSON parser
- Apply middleware in correct order
- Create custom middleware for common tasks (logging, auth)

### AI Engine Integration
- Keep AI engine code in `server/ai-engine/` directory
- Support offline, online, and hybrid modes
- Always provide fallback to offline mode
- Cache responses when appropriate
- Handle API key errors gracefully

### Environment Variables
- Load from `.env` file using `dotenv`
- Provide sensible defaults
- Never commit `.env` file (use `.env.example`)
- Access via `process.env.VARIABLE_NAME`

### Server Configuration
- Default port: 3001 (configurable via PORT env var)
- Listen on all interfaces in production: `0.0.0.0`
- Graceful shutdown handling

Example startup:
```javascript
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed');
  });
});
```

### API Endpoints Pattern
- `/api/health` - Health check endpoint
- `/api/stats` - System statistics
- `/api/analyze` - Code analysis
- `/api/complete` - Code completion
- `/api/refactor` - Code refactoring
- `/api/chat` - AI chat messages
- `/api/skills` - Skills management

### Security Best Practices
- Validate and sanitize all inputs
- Use parameterized queries (prevent SQL injection)
- Sanitize HTML output (prevent XSS)
- Don't expose sensitive server information
- Rate limit API endpoints if needed
- Use HTTPS in production

### Logging
- Log all errors with context
- Log important operations (startup, shutdown)
- Include timestamps in logs
- Don't log sensitive data (API keys, passwords)

### Testing
- Test with and without API keys (offline mode)
- Test error conditions
- Test with invalid inputs
- Verify response formats
- Test concurrent requests
