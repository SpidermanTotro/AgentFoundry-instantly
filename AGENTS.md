# AGENTS.md - Developer Context for AI Agents

This file provides additional context and conventions for AI coding agents (like GitHub Copilot) working on the AgentFoundry project.

## Project Philosophy

### Offline-First Design
This is the **core principle** of the entire project. Every feature must:
- Work completely offline by default
- Degrade gracefully when online features are unavailable
- Never require API keys for basic functionality
- Maintain full privacy (no telemetry, no tracking)

### Zero Configuration
- Works out of the box with `npm ci && npm start`
- No mandatory environment variables
- Sensible defaults for everything
- Optional enhancements via `.env` file

### No Breaking Changes
- Maintain backward compatibility always
- Preserve existing API contracts
- Keep database schema compatible
- Support migration paths for changes

## Development Workflow

### Making Changes

1. **Understand First**: Read the active code path and current configuration before changing it
2. **Match CI**: Run syntax checks and the Vite build from `.github/workflows/ci.yml`
3. **Test Offline Mode**: Verify offline behavior when the affected feature has an offline path
4. **Test Provider Fallbacks**: Test with and without API keys when changing provider integration
5. **Target Manual Testing**: Smoke-test only the frontend, backend, or Electron paths affected by the change

### Testing Checklist

Before considering any change complete:
- [ ] CI-equivalent syntax checks pass for changed CommonJS files
- [ ] `npm run build` succeeds
- [ ] Frontend loads without errors when frontend behavior changed
- [ ] Backend starts successfully when backend behavior changed
- [ ] Offline fallback works when the change affects optional online features
- [ ] Configured provider path works when provider integration changed
- [ ] Provider failure degrades gracefully when fallback logic changed
- [ ] No console errors
- [ ] Performance is acceptable (<500ms offline)
- [ ] UI is responsive
- [ ] Desktop app builds (if Electron changes)

## Code Quality Standards

### Readability Over Cleverness
- Write clear, simple code
- Avoid complex one-liners
- Prefer explicit over implicit
- Comment only complex logic

### Error Messages
- Be specific about what went wrong
- Suggest how to fix the issue
- Never expose internal errors to users
- Log detailed errors to console

### Performance Considerations
- Offline operations must be fast (<500ms)
- Cache expensive computations
- Avoid unnecessary re-renders in React
- Minimize bundle size

## Common Pitfalls to Avoid

### ❌ Don't Do This

1. **Adding TypeScript**
   - Project explicitly uses JavaScript only
   - No .ts or .tsx files

2. **Requiring API Keys**
   - Never make API keys mandatory
   - Always provide offline fallback

3. **Breaking Offline Mode**
   - No network calls in core functionality
   - AST-based analysis must work offline

4. **Changing Response Formats**
   - API responses are contracts
   - Breaking them affects frontend

5. **Adding Heavy Dependencies**
   - Keep bundle size reasonable
   - Verify Electron compatibility
   - Match Node.js 22 used by CI; preserve Docker's current Node.js 20 compatibility when relevant

6. **Removing Error Handling**
   - Every async operation needs try-catch
   - Always handle network failures

### ✅ Do This Instead

1. **Use Modern JavaScript**
   - ES6+ features are encouraged
   - Async/await over promises
   - Destructuring and spread operators

2. **Implement Graceful Degradation**
   - Check for API key availability
   - Fallback to offline mode
   - Show user-friendly messages

3. **Maintain AST Analysis**
   - Keep offline engine functional
   - Improve pattern matching
   - Add more code analysis features

4. **Keep Responses Consistent**
   - `{ success: true, data: {...} }`
   - `{ success: false, error: 'message' }`

5. **Optimize Before Adding**
   - Improve existing code first
   - Only add dependencies when necessary
   - Use native features when possible

6. **Handle All Error Cases**
   - Network failures
   - Invalid inputs
   - Missing API keys
   - Malformed code

## Architecture Decisions

### Why Three AI Modes?

1. **Offline**: Core functionality, privacy-focused, fast
2. **Online**: Enhanced capabilities, latest models, multi-modal
3. **Hybrid**: Best of both worlds, smart switching

### Why SQLite?

- No server setup required
- File-based (portable)
- Excellent performance for this use case
- Simple backup/restore

### Why Monaco Editor?

- Same engine as VS Code
- Excellent language support
- Built-in IntelliSense
- Proven and reliable

### Current Validation

- GitHub Actions runs on Node.js 22
- CI installs from the committed npm lockfile with `npm ci`
- CI checks runtime script syntax and builds the Vite application
- CI tests both success and timeout paths of `scripts/wait-for-server.js`
- There is currently no root unit-test or lint script; do not report nonexistent checks
- Add focused automated tests when a change introduces logic that can be tested reliably

## Security Mindset

### Always Validate Inputs
- Don't trust user input
- Sanitize before processing
- Validate types and ranges
- Check for malicious patterns

### Prevent XSS
- Use `dompurify`, `xss`, or `sanitize-html`
- Escape HTML in user content
- Set proper Content-Security-Policy headers
- Sanitize before inserting into DOM

### Protect API Keys
- Never commit to git
- Use environment variables
- Don't log API keys
- Don't send to client

### Safe Code Execution
- Avoid `eval()` when possible
- Sanitize code before execution
- Run in isolated context if needed
- Timeout long-running operations

## UI/UX Guidelines

### User Feedback
- Show loading states
- Display error messages clearly
- Provide success confirmations
- Use progressive disclosure

### Accessibility
- Semantic HTML
- Keyboard navigation
- ARIA labels for icons
- Proper heading hierarchy

### Consistency
- Follow GitHub Copilot UI patterns
- Use consistent spacing
- Maintain color scheme
- Keep interactions predictable

## Contribution Guidelines

### Good Pull Requests

- Focus on one thing
- Include clear description
- Test thoroughly
- Update documentation
- Maintain code style

### Code Review Checklist

- [ ] Follows coding standards
- [ ] Works offline
- [ ] No breaking changes
- [ ] Proper error handling
- [ ] Security considerations addressed
- [ ] Performance is acceptable
- [ ] Documentation updated

## Getting Help

When stuck:
1. Read the imported source and current configuration
2. Check `.github/copilot-instructions.md` and matching path-specific instructions
3. Treat `package.json`, `package-lock.json`, `vite.config.js`, and CI as authoritative when prose is stale
4. Look at similar active implementations and test in isolation
5. Ask specific questions in issues

## Remember

- **Offline First**: This is non-negotiable
- **Privacy Matters**: No tracking, no telemetry
- **Users First**: Make it easy and intuitive
- **Quality Over Speed**: Take time to do it right
- **Learn and Improve**: Each change is an opportunity to make the project better

---

*Preserve the project's offline-first goal, but verify implemented behavior against the active code path before making completion claims.*
