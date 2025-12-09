# GitHub Copilot Instructions

This directory contains granular instructions for different areas of the codebase. Each file has YAML frontmatter specifying which files it applies to.

## Instruction Files

- **frontend.md**: React components, Vite config, UI development
- **backend.md**: Express.js server, API routes, middleware
- **ai-engine.md**: AI engines (offline/online/hybrid), code analysis

## How It Works

GitHub Copilot reads these instructions based on which files you're working on:

- Working on `src/components/ChatPanel.jsx`? → Uses `frontend.md`
- Working on `server/index.js`? → Uses `backend.md`
- Working on `server/ai-engine/LocalAIEngine.js`? → Uses `ai-engine.md`

## Main Instructions

The main project-wide instructions are in `.github/copilot-instructions.md`.

## Additional Context

See `AGENTS.md` in the root directory for:
- Project philosophy and principles
- Development workflow
- Common pitfalls to avoid
- Security guidelines
- Architecture decisions
