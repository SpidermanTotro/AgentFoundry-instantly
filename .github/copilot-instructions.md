# GitHub Copilot Instructions

This document provides guidance for GitHub Copilot coding agent to effectively work with this repository.

## Project Overview

**AI Copilot Pro** is a complete, professional-grade AI coding assistant that combines the features of GitHub Copilot and GenSpark AI with 100% offline capability. It's a full-stack application built with React (frontend) and Express.js (backend), offering code intelligence, AI-powered assistance, and multi-modal AI capabilities.

### Key Features
- **Three Operation Modes**: Offline (default), Online (cloud AI), and Hybrid (best of both)
- **Code Intelligence**: AST-based code analysis, completion, refactoring, bug detection
- **Multi-Modal AI**: Text, image, document processing, web search
- **Desktop Applications**: Electron-based apps for Windows, macOS, and Linux
- **Self-Learning Skills**: Plugin system with 8 built-in refactoring skills

## Technology Stack

### Frontend
- **React 19** with JSX
- **Vite** for build tooling and dev server
- **Monaco Editor** (VS Code editor engine)
- **React Icons** for UI icons
- **React Markdown** for rendering markdown content
- **Syntax Highlighting** via Prism React Renderer

### Backend
- **Node.js 16+**
- **Express.js 5** REST API server
- **Socket.IO** for WebSocket communication
- **SQLite3/Better-SQLite3** for local database
- **Babel Parser** for AST-based code analysis

### AI Engines
- **LocalAIEngine.js**: Offline AST-based analysis (no API keys needed)
- **GenSparkAI.js**: Online multi-provider AI (Google Gemini, Anthropic Claude, Cohere)
- **CodeIntelligence.js**: Advanced code analysis and refactoring
- **PluginSystem.js**: Self-learning skill management

### Build & Deployment
- **Electron** for desktop applications (cross-platform)
- **Docker** with docker-compose for containerized deployment
- **electron-builder** for packaging desktop apps

## Project Structure

```
├── .github/                    # GitHub configuration (you are here!)
├── server/                     # Backend Express.js server
│   ├── index.js               # Main server entry point
│   ├── ai-engine/             # AI engine implementations
│   │   ├── LocalAIEngine.js   # Offline AI (AST-based)
│   │   ├── GenSparkAI.js      # Online/Hybrid AI
│   │   ├── CodeIntelligence.js # Code analysis
│   │   └── PluginSystem.js    # Self-learning skills
│   ├── routes/                # API route handlers
│   └── services/              # Business logic services
├── src/                       # Frontend React application
│   ├── App.jsx                # Main application component
│   ├── components/            # React components
│   │   ├── CodeAssistant.jsx  # Monaco editor integration
│   │   ├── ChatPanel.jsx      # AI chat interface
│   │   ├── SkillsPanel.jsx    # Skills management UI
│   │   └── StatusBar.jsx      # Live metrics display
│   ├── hooks/                 # Custom React hooks
│   └── utils/                 # Utility functions
├── public/                    # Static assets
├── electron.js                # Electron main process
├── preload.js                 # Electron preload script
├── package.json               # Dependencies and scripts
├── vite.config.js            # Vite configuration
├── docker-compose.yml        # Docker Compose setup
└── Dockerfile                # Docker image definition
```

## Development Setup

### Prerequisites
- Node.js 16.0.0 or higher
- npm or yarn package manager
- Git

### Installation
```bash
# Clone and install
git clone https://github.com/SpidermanTotro/AgentFoundry-instantly.git
cd AgentFoundry-instantly
npm install
```

### Environment Configuration
1. Copy `.env.example` to `.env`
2. Configure API keys (optional - only needed for online mode):
   - `GOOGLE_AI_API_KEY`: Google Gemini AI
   - `ANTHROPIC_API_KEY`: Anthropic Claude
   - `OPENAI_API_KEY`: OpenAI GPT-4
   - Other optional services (see `.env.example`)
3. The application works 100% offline without any API keys by default

## Build, Test, and Lint Commands

### Development
```bash
# Start full development environment (frontend + backend)
npm start

# Start only frontend dev server (Vite)
npm run dev

# Start only backend server
npm run server
```

### Building
```bash
# Build frontend for production
npm run build

# Preview production build
npm run preview

# Build Electron desktop apps
npm run electron:build          # All platforms
npm run electron:build:linux   # Linux only
npm run electron:build:win     # Windows only
npm run electron:build:mac     # macOS only
```

### Electron Development
```bash
# Run Electron in development mode
npm run electron:dev

# Run Electron with current build
npm run electron
```

### Docker
```bash
# Build Docker image
npm run docker:build

# Start Docker containers
npm run docker:run

# Stop Docker containers
npm run docker:stop

# View Docker logs
npm run docker:logs
```

### Testing
Currently, there are no automated tests configured. When adding tests:
- Place unit tests alongside source files with `.test.js` or `.spec.js` suffix
- Place integration tests in a `tests/` directory
- Use Jest or Vitest (already compatible with Vite)

### Linting
ESLint is included in dependencies but not configured with npm scripts. To run:
```bash
npx eslint src/ server/
```

## Coding Standards and Conventions

### General Guidelines
- **ES6+ JavaScript**: Use modern JavaScript features (arrow functions, async/await, destructuring)
- **Modular Code**: Keep functions and components small and focused
- **Clear Naming**: Use descriptive variable and function names
- **Comments**: Add comments for complex logic, but prefer self-documenting code

### React/JSX
- **Functional Components**: Use function components with hooks (not class components)
- **Hooks**: Use React hooks (`useState`, `useEffect`, `useCallback`, etc.)
- **Component Files**: One component per file, named after the component
- **Styling**: CSS modules or separate `.css` files (see existing pattern in `components/`)
- **Props**: Destructure props in function parameters

### Backend/Node.js
- **Async/Await**: Prefer async/await over callbacks and raw promises
- **Error Handling**: Always use try/catch blocks for async operations
- **Middleware**: Keep middleware functions focused and composable
- **Route Handlers**: Place route handlers in `routes/` directory
- **Business Logic**: Place complex logic in `services/` directory
- **API Responses**: Return consistent JSON structure with proper HTTP status codes

### File Naming
- **Components**: PascalCase (e.g., `CodeAssistant.jsx`)
- **Utilities**: camelCase (e.g., `apiClient.js`)
- **Services**: PascalCase (e.g., `AuthService.js`)
- **Routes**: lowercase (e.g., `auth.js`)

### Code Organization
- Import statements order:
  1. Node.js built-ins (e.g., `http`, `path`)
  2. External packages (e.g., `express`, `react`)
  3. Internal modules (e.g., `./services/AuthService`)
- Export at the bottom of files (or use named exports inline)

### Environment Variables
- Never commit `.env` files
- Always provide `.env.example` with all required variables
- Use `process.env.VARIABLE_NAME` to access environment variables
- Provide sensible defaults where possible

## Common Workflows

### Adding a New API Endpoint
1. Create route handler in `server/routes/`
2. Import and register route in `server/index.js`
3. Implement business logic in `server/services/` if complex
4. Update API documentation if user-facing

### Adding a New React Component
1. Create component file in `src/components/`
2. Create accompanying CSS file if needed
3. Import and use in parent component
4. Follow existing patterns for state management

### Adding AI Engine Functionality
1. Modify appropriate engine in `server/ai-engine/`:
   - `LocalAIEngine.js` for offline features
   - `GenSparkAI.js` for online features
   - `CodeIntelligence.js` for code analysis
   - `PluginSystem.js` for new skills
2. Update API endpoints to expose new functionality
3. Update frontend components to use new features

### Updating Dependencies
```bash
# Check for updates
npm outdated

# Update specific package
npm update package-name

# Update all packages (be careful!)
npm update

# Update package.json and install
npm install package-name@latest
```

## Architecture Patterns

### AI Mode Selection
The application supports three modes:
- **Offline Mode**: Uses `LocalAIEngine.js` with AST-based analysis
- **Online Mode**: Uses `GenSparkAI.js` with cloud AI providers
- **Hybrid Mode**: Automatically switches between offline and online based on availability

### State Management
- **Frontend**: React hooks (`useState`, `useEffect`) for component state
- **Backend**: Express middleware and services for business logic
- **Real-time**: Socket.IO for bidirectional communication

### Error Handling
- Frontend: Display user-friendly error messages, log details to console
- Backend: Return appropriate HTTP status codes with error messages
- Never expose internal errors or stack traces to end users

### Security Considerations
- All API keys stored in environment variables (never in code)
- Input validation on all user inputs
- Sanitize HTML/markdown content before rendering
- CORS properly configured for allowed origins
- Rate limiting enabled by default (configurable in `.env`)

## Deployment Options

### Local Development
Use `npm start` for full local development environment

### Docker Deployment
```bash
docker-compose up -d
```
Access at `http://localhost:3002` (frontend) and `http://localhost:3001` (backend API)

### Desktop Application
Build with `npm run electron:build` and distribute the generated installers

### Production Server
1. Build frontend: `npm run build`
2. Set `NODE_ENV=production`
3. Start server: `npm run server`
4. Serve frontend build from `dist/` directory

## Important Notes for AI Agents

### What to Focus On
- **Code Quality**: Maintain existing code quality and patterns
- **Consistency**: Follow established conventions in the codebase
- **Documentation**: Update relevant documentation when making changes
- **Testing**: Add tests when introducing new features (when test infrastructure exists)
- **Error Handling**: Always include proper error handling

### What to Avoid
- **Breaking Changes**: Don't modify core AI engine logic without understanding impact
- **Dependency Changes**: Don't add/update dependencies unless necessary
- **Configuration Changes**: Don't modify `.env.example` or config files without good reason
- **Removing Features**: Don't remove working functionality unless explicitly requested
- **Over-Engineering**: Keep solutions simple and maintainable

### When Making Changes
1. Understand the existing code pattern first
2. Make minimal, focused changes
3. Test changes in both offline and online modes if applicable
4. Verify no breaking changes to existing functionality
5. Update documentation if user-facing behavior changes

## Additional Resources

- **Main README**: `README.md` - Project overview and quick start
- **Installation Guide**: `INSTALL.md` - Detailed installation instructions
- **Features Documentation**: `GENSPARK_FEATURES.md` - Complete feature list
- **Live Demo**: Check README for current demo URLs
- **API Documentation**: Available at `http://localhost:3001/api` when server running

## Questions?

If you encounter unclear aspects of the codebase:
1. Check existing similar implementations in the codebase
2. Review the README and related documentation
3. Look for inline comments explaining complex logic
4. When in doubt, ask for clarification rather than making assumptions
