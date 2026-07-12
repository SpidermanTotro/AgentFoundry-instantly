---
applyTo: "server/index.js,server/routes/**/*.js,server/services/**/*.js"
---

# Backend instructions

- Preserve CommonJS require and module.exports conventions.
- Keep server/index.js focused on middleware, route mounting, Socket.IO setup, lifecycle, and shared error handling.
- Put HTTP handlers in server/routes/ and reusable behavior in server/services/.
- Prefix API routes with /api and confirm every new route is mounted from server/index.js.
- Validate required fields, types, ranges, paths, URLs, and upload limits before processing.
- Use async/await with explicit error handling for I/O operations.
- Preserve established response fields and Socket.IO event names unless the issue explicitly changes the contract.
- Use appropriate HTTP status codes and safe user-facing messages. Do not return stack traces or secrets.
- Never log passwords, tokens, API keys, private prompts, or uploaded file contents.
- Use parameterized database operations and transactions for related writes.
- Preserve offline and in-memory fallbacks when optional providers or databases are unavailable.
- Do not assume modules in server/ai-engine/ are active; trace imports from the current server entry point.
- The API and Socket.IO server use port 3001 by default. Keep CORS changes explicit and narrowly scoped.
- For backend changes, run node --check on every changed CommonJS file, start the server, check /api/health, and exercise the affected endpoint.
