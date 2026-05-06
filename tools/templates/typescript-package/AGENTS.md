# AGENTS.md — Template: TypeScript package

This file ships with generated TypeScript packages.

## Conventions

- Keep the package minimal.
- Match existing build/lint/format script patterns.
- Prefer `#src/*` if this package defines the alias.
- Add README usage notes if the package is meant for reuse.

## First checks after generation

- Replace placeholder metadata.
- Confirm the package path is covered by `pnpm-workspace.yaml`.
- Run `lint`, `ci:compile`, and `build`.
