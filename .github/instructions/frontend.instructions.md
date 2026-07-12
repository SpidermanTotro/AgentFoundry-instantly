---
applyTo: "src/**/*.jsx,src/**/*.css,index.html,vite.config.js"
---

# Frontend instructions

- Use JavaScript/JSX, React functional components, and hooks. Do not introduce TypeScript into the application source.
- Match nearby formatting: two-space indentation, single quotes, and semicolons.
- Keep components in src/components/ with PascalCase filenames.
- Use plain CSS and preserve the existing class naming and theme variables.
- Keep state close to the component that owns it; extract reusable behavior only when it has more than one consumer.
- Preserve accessibility: semantic elements, keyboard operation, visible focus, labels for icon buttons, and alt text.
- Use @monaco-editor/react for editor work and keep the editor instance in a ref when imperative access is required.
- Use relative requests such as fetch('/api/chat'). Vite proxies /api to the Express server.
- Show loading and failure states for asynchronous UI actions. Do not expose raw server errors or secrets.
- Before adding a client call, confirm that server/index.js mounts the corresponding route. Several existing controls refer to endpoints that are not active.
- Avoid speculative memoization. Use React.memo, useMemo, and useCallback only when rendering or referential stability justifies them.
- Vite serves development traffic on port 3000 and proxies API traffic to port 3001.
- For frontend changes, run npm run build and smoke-test the affected mode with npm start.
