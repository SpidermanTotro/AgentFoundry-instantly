# GitHub Copilot instructions

GitHub Copilot uses the repository-wide guidance in ../copilot-instructions.md together with the matching path-specific files in this directory.

## Path-specific files

- frontend.instructions.md applies to React, CSS, index.html, and Vite configuration.
- backend.instructions.md applies to the active Express entry point, routes, and services.
- ai-engine.instructions.md applies to modules under server/ai-engine/.

Each path-specific filename ends in .instructions.md and uses an applyTo glob in YAML frontmatter, as required by GitHub Copilot.

AGENTS.md contains broader project principles. When prose documentation conflicts with current executable configuration, package.json, package-lock.json, vite.config.js, .github/workflows/ci.yml, and imported source code take precedence.
