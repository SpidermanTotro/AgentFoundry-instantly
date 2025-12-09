# GitHub Copilot Instructions for AgentFoundry (AI Copilot Pro)

## Project Overview

AgentFoundry is a complete, professional-grade AI coding suite that combines the capabilities of GitHub Copilot and GenSpark AI with 100% offline functionality. It's a full-stack web application built with React and Node.js, offering AI-powered code assistance, multi-modal AI capabilities, and self-learning features.

## Architecture

### Technology Stack

**Frontend:**
- React 19 with Vite for fast development
- Monaco Editor (VS Code's editor engine)
- Modern ES6+ JavaScript (no TypeScript)
- CSS for styling (no CSS frameworks)

**Backend:**
- Node.js with Express.js 5.x
- SQLite for data persistence
- Multiple AI providers (Google Gemini, Anthropic Claude, Cohere)
- AST-based code analysis using @babel/parser

**Desktop:**
- Electron for cross-platform desktop apps
- Supports Windows, macOS, and Linux

### Project Structure

```
/
├── server/                    # Backend Express.js application
│   ├── index.js              # Main server entry point
│   └── ai-engine/            # AI processing engines
│       ├── LocalAIEngine.js  # Offline AI (AST-based)
│       ├── GenSparkAI.js     # Online/hybrid AI
│       ├── CodeIntelligence.js
│       └── PluginSystem.js
├── src/                      # Frontend React application
│   ├── App.jsx              # Main app component
│   ├── App.css              # Main styles
│   └── components/          # React components
├── public/                  # Static assets
├── electron.js             # Electron entry point
├── package.json            # Dependencies and scripts
└── vite.config.js         # Vite configuration
```

## Coding Standards and Conventions

### General Guidelines

1. **Language**: Use modern JavaScript (ES6+) - **NO TypeScript**
2. **Code Style**: 
   - Use 2-space indentation
   - Use single quotes for strings
   - Use camelCase for variables and functions
   - Use PascalCase for React components and classes
   - Add semicolons at the end of statements

3. **File Naming**:
   - React components: PascalCase with `.jsx` extension (e.g., `CodeAssistant.jsx`)
   - Regular JS files: camelCase with `.js` extension (e.g., `localAIEngine.js`)
   - CSS files: match component name (e.g., `CodeAssistant.css` or global `App.css`)

4. **Comments**:
   - Add JSDoc comments for functions and classes
   - Use inline comments sparingly, only for complex logic
   - Keep comments concise and meaningful

### React Conventions

1. **Component Structure**:
   - Prefer functional components with hooks
   - Use `useState`, `useEffect`, `useCallback`, `useMemo` as needed
   - Avoid class components unless absolutely necessary

2. **Props and State**:
   - Destructure props in function parameters
   - Use meaningful prop names
   - Keep component state minimal and focused

3. **Imports**:
   - Group imports: React first, then third-party libraries, then local imports
   - Use named imports when possible

Example:
```javascript
import React, { useState, useEffect } from 'react';
import { IconName } from 'react-icons/fa';
import { helperFunction } from '../utils/helpers';
```

### Backend Conventions

1. **Express Routes**:
   - Keep routes in logical groups
   - Use async/await for asynchronous operations
   - Always handle errors with try-catch blocks

2. **Error Handling**:
   - Return appropriate HTTP status codes
   - Provide meaningful error messages
   - Log errors to console for debugging

3. **API Responses**:
   - Use consistent JSON response format
   - Include success/error status
   - Provide clear error messages

Example:
```javascript
app.post('/api/endpoint', async (req, res) => {
  try {
    const result = await someOperation();
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
```

## Build and Development

### Installation

```bash
npm install
```

### Development Commands

- `npm run dev` - Start frontend dev server (Vite on port 5173)
- `npm run server` - Start backend server (Express on port 3001)
- `npm start` - Start both frontend and backend concurrently
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build

### Desktop App Development

- `npm run electron:dev` - Run desktop app in development mode
- `npm run electron:build` - Build desktop app for current platform
- `npm run electron:build:linux` - Build for Linux
- `npm run electron:build:win` - Build for Windows
- `npm run electron:build:mac` - Build for macOS

### Docker

- `npm run docker:build` - Build Docker image
- `npm run docker:run` - Start with docker-compose
- `npm run docker:stop` - Stop docker containers
- `npm run docker:logs` - View container logs

### Environment Variables

Optional `.env` file for online AI features:
```bash
GOOGLE_API_KEY=your_key          # Google Gemini (optional)
ANTHROPIC_API_KEY=your_key       # Claude 3 (optional)
COHERE_API_KEY=your_key          # Cohere (optional)
AI_MODE=hybrid                   # offline, online, hybrid
PORT=3001                        # Backend port
```

**Note**: The application works fully offline without any API keys.

## Key Features and Modules

### AI Modes

1. **Offline Mode** (Default): 100% local, AST-based code analysis
2. **Online Mode**: Uses cloud AI providers (Gemini, Claude, Cohere)
3. **Hybrid Mode**: Smart switching between offline and online

### Core Components

1. **CodeAssistant** (`src/components/CodeAssistant.jsx`):
   - Monaco editor integration
   - Code completion and suggestions
   - Syntax highlighting

2. **ChatPanel** (`src/components/ChatPanel.jsx`):
   - AI chat interface
   - Message history
   - Multi-turn conversations

3. **SkillsPanel** (`src/components/SkillsPanel.jsx`):
   - Self-learning skills management
   - 8 built-in refactoring skills

4. **StatusBar** (`src/components/StatusBar.jsx`):
   - Real-time metrics
   - System status indicators

### Backend AI Engines

1. **LocalAIEngine.js**: 
   - Offline code analysis
   - AST parsing with @babel/parser
   - No external API dependencies

2. **GenSparkAI.js**:
   - Multi-provider AI integration
   - Fallback handling
   - Response caching

3. **CodeIntelligence.js**:
   - Code analysis and refactoring
   - Complexity metrics
   - Security scanning

4. **PluginSystem.js**:
   - Self-learning skills
   - Skill storage and retrieval

## Testing and Quality

- **Manual Testing**: Test both frontend and backend after changes
- **No Test Suite**: Currently no automated tests - validate changes manually
- **Browser Testing**: Test in modern browsers (Chrome, Firefox, Edge)
- **Electron Testing**: Test desktop builds on target platforms

## Dependencies

### Key Dependencies

- `react` & `react-dom`: UI framework (v19.x)
- `express`: Web server (v5.x)
- `@monaco-editor/react`: Code editor
- `@babel/parser` & `@babel/traverse`: Code analysis
- `better-sqlite3`: Database
- `electron`: Desktop app framework
- `vite`: Build tool and dev server
- AI SDKs: `@google/generative-ai`, `@anthropic-ai/sdk`, `cohere`

### Adding New Dependencies

1. Use `npm install <package>` (not yarn or pnpm)
2. Verify compatibility with Node.js 16+
3. Check if the package works in Electron environment if needed
4. Update documentation if adding major dependencies

## Common Tasks

### Adding a New React Component

1. Create file in `src/components/` with PascalCase name
2. Use functional component with hooks
3. Import and use in parent component
4. Add CSS file if needed (same name as component)

### Adding a New API Endpoint

1. Add route in `server/index.js`
2. Use async/await with try-catch
3. Return consistent JSON response format
4. Test with both online and offline modes if applicable

### Working with AI Features

1. **Offline**: Changes to `server/ai-engine/LocalAIEngine.js`
2. **Online**: Changes to `server/ai-engine/GenSparkAI.js`
3. Always maintain fallback behavior for offline mode
4. Test with and without API keys

## Important Notes

1. **Offline-First Philosophy**: All core features must work without internet
2. **No Breaking Changes**: Maintain backward compatibility
3. **Performance**: Keep responses under 500ms for offline operations
4. **Privacy**: No telemetry or tracking - all data stays local
5. **Cross-Platform**: Test changes on Windows, macOS, and Linux if modifying Electron code

## Documentation Files

- `README.md`: Main project documentation
- `INSTALL.md`: Installation instructions
- `GENSPARK_FEATURES.md`: Feature documentation
- Various status and guide files (*.md) in root directory

## Getting Help

- Repository: https://github.com/SpidermanTotro/AgentFoundry-instantly
- Issues: Create GitHub issues for bugs or feature requests
- Main branch: `genspark_ai_developer`

## When Making Changes

1. **Understand Context**: Review related files before making changes
2. **Minimal Changes**: Make the smallest change necessary
3. **Test Thoroughly**: Test both frontend and backend
4. **Offline Mode**: Ensure offline functionality still works
5. **Documentation**: Update README.md or other docs if needed
6. **No Breaking Changes**: Maintain API compatibility
7. **Error Handling**: Always include proper error handling
8. **Performance**: Consider impact on load times and response times

## Security Considerations

1. **Input Validation**: Validate all user inputs
2. **XSS Prevention**: Sanitize HTML content (use `dompurify`, `xss`, or `sanitize-html`)
3. **API Keys**: Never commit API keys - use environment variables
4. **Dependencies**: Keep dependencies updated for security patches
5. **Code Execution**: Be careful with eval() or dynamic code execution
