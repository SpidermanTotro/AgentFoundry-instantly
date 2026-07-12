# AgentFoundry Copilot instructions

## Repository scope and source of truth

AgentFoundry's active root project is a JavaScript web and Electron desktop application. The root npm project is what .github/workflows/ci.yml validates.

- Work from the repository root unless the issue explicitly names a nested project.
- Treat package.json, package-lock.json, vite.config.js, .github/workflows/ci.yml, and currently imported source code as authoritative.
- Root status reports and feature-completion Markdown files may describe older or aspirational states. Verify claims against executable code.
- Do not edit nested prototypes such as genspark-2.0/, genspark-ai-developer/, github-2.0/, forge-spark-mvp/, or ai-suite-pro-mobile/ unless the task specifically targets them.
- Do not modify *.backup*, generated output, archives, dist/, dist-electron/, or node_modules/.
- Do not add new completion/status reports unless the issue requests that documentation.
- Trace imports before changing or documenting functionality. A module under server/ai-engine/ is not necessarily wired into the active server.

## Active stack and entry points

- CI runtime: Node.js 22 with npm and lockfile version 3.
- Docker currently uses Node.js 20; do not change that incidentally.
- Frontend: React 19, JSX, Vite 7, ES modules, Monaco Editor, and plain CSS.
- Backend: Express 5 and Socket.IO using CommonJS.
- Desktop: Electron 39 with a restricted preload bridge.
- Application source remains JavaScript/JSX. Do not convert it to TypeScript.

Important paths:

- src/main.jsx and src/App.jsx: frontend entry points.
- src/components/ChatGPT2.jsx: chat interface.
- src/components/CodeEditor.jsx: Monaco-based coding interface.
- server/index.js: Express and Socket.IO entry point.
- server/routes/: active HTTP route modules.
- server/services/: authentication and vector-memory services.
- server/ai-engine/: AI-related modules; confirm active integration before editing.
- electron.js and preload.js: Electron main process and renderer bridge.
- scripts/wait-for-server.js: dependency-free readiness helper.
- .github/workflows/ci.yml: validation source of truth.

## Installation and development

Use npm only. Do not use Yarn or pnpm.

For CI-parity installation:

~~~bash
PUPPETEER_SKIP_DOWNLOAD=true npm ci --ignore-scripts --no-audit --no-fund
~~~

Use plain npm ci when exercising native modules or Electron packaging. Do not regenerate package-lock.json unless package.json dependencies change; commit both files together when they do.

Development commands:

~~~bash
npm start
npm run server
npm run dev
npm run build
npm run preview
~~~

Current development addresses:

- Frontend: http://localhost:3000
- API and Socket.IO server: http://localhost:3001
- Health check: http://localhost:3001/api/health

Use relative frontend requests such as /api/chat; Vite proxies /api to port 3001.

electron.js currently references frontend port 3002 while Vite uses 3000. Do not silently clean up that discrepancy during unrelated work. If a task changes Electron startup, reconcile every caller and configuration file and validate the complete startup path.

Copy .env.example to .env only when optional integrations are needed. Never commit .env, tokens, credentials, or real API keys.

## Required validation

Match CI before completing a change:

~~~bash
node --check electron.js
node --check preload.js
node --check server/index.js
node --check scripts/wait-for-server.js
npm run build
~~~

Also run node --check on every changed CommonJS script.

There is currently no root unit-test or lint script. Do not run or report nonexistent npm test or npm run lint checks.

When relevant:

- Server or route change: start the server and check /api/health plus the affected endpoint.
- Frontend change: run npm start and smoke-test both chat and code-editor modes.
- Readiness-helper change: run both success and timeout scenarios from .github/workflows/ci.yml.
- Electron or preload change: build the frontend and perform a platform-appropriate Electron smoke test.
- If a check cannot run, state exactly what was not tested and why.

## Coding conventions

- Match nearby code. Most application files use two-space indentation, single quotes, and semicolons.
- Preserve module boundaries: ES module imports in frontend/Vite files; CommonJS require and module.exports in backend, Electron, and Node scripts.
- Use functional React components and hooks. Name components in PascalCase and keep component styles in plain CSS.
- Preserve relative /api calls and existing request/response field names.
- Keep Express routes focused and place reusable behavior in server/services/.
- Validate request data, use appropriate status codes, handle async failures, and return safe user-facing errors.
- Preserve existing REST and Socket.IO contracts unless the issue explicitly changes them.
- Prefer small, scoped changes over broad rewrites or repository-wide formatting.

## Architecture and safety constraints

- Preserve the offline-first goal: basic startup and local functionality must not require an API key or network access.
- Optional cloud-provider failures must degrade gracefully instead of preventing startup.
- Several frontend controls currently reference endpoints that are not mounted by server/index.js. Trace client call to route to service and test it before describing a feature as implemented.
- Do not add telemetry or transmit local files, prompts, or code without an explicit feature requirement and user-visible behavior.
- Never log tokens, passwords, private file contents, or API keys.
- Preserve Electron security defaults: nodeIntegration false, contextIsolation true, and narrow IPC channel allowlists in preload.js.
- Do not expose arbitrary filesystem, shell, process, or IPC access to renderer code.
- Avoid eval and unrestricted code execution. Validate paths, uploads, URLs, and generated commands.
- Minimize new dependencies, especially native or Electron-sensitive packages.

## Pull-request expectations

- Keep the diff limited to the issue.
- Explain the active code path affected and why the chosen files were changed.
- List every validation command actually run and its result.
- Identify untested platform-specific behavior.
- Call out changes affecting offline fallback, API contracts, persisted data, Electron IPC, ports, or secrets.
- Do not claim a feature is complete or production-ready without executable evidence.
