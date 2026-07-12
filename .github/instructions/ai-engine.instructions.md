---
applyTo: "server/ai-engine/**/*.js"
---

# AI engine instructions

- These files are not automatically part of the active server. Trace imports and call sites before changing or documenting integration.
- Preserve CommonJS conventions and the existing public method signatures.
- Offline behavior is the required fallback; missing keys, network failures, rate limits, and provider errors must not prevent basic startup.
- Initialize cloud clients only when the matching environment variable is present.
- Never commit, print, cache, or return provider credentials.
- Keep provider selection and fallback behavior explicit and deterministic.
- Validate source text and parser options before AST processing. Handle malformed and unsupported code without crashing the server.
- Avoid eval and unrestricted execution of generated or stored code.
- Bound work by input size, traversal depth, timeout, and cache size where relevant.
- Do not promise latency, accuracy, provider support, or endpoint availability without executable evidence.
- Preserve response shapes used by current callers.
- Test offline behavior without keys first; then test configured-provider and provider-failure paths when the task affects them.
- Run node --check on changed files and npm run build before completion.
