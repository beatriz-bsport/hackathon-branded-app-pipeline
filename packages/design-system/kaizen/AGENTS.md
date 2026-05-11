# AGENTS.md — Kaizen

## Scope

Modern design system for Studio Manager UI: primitives, business components, tokens, Storybook.

## Choose the right layer

- `primitive/core` — generic reusable UI building blocks
- `business` — shared business logic components with multiple consumers
- `tokens` — design tokens only

## Existing generators

- Primitive component: `pnpm new:kaizen-component -- --target primitive`
- Business component: `pnpm new:kaizen-component -- --target business`
- Package-local equivalent: `pnpm component:add`

## Conventions

- Prefer Kaizen over one-off local UI when the pattern is reusable.
- New shared components should include Storybook coverage.
- Business components should justify shared business logic; do not extract single-use code prematurely.
- Keep exports aligned with each package’s existing entrypoint strategy.

## Dev loops

- Primitive Storybook: `cd packages/design-system/kaizen/primitive/core && pnpm dev`
- Business Storybook: `cd packages/design-system/kaizen/business && pnpm dev`
- Unified Storybook: `cd packages/design-system/kaizen/storybook && pnpm dev`

## Related docs

- `README.md`
- `primitive/core/README.md`
- `business/README.md`
- `../../../CONVENTIONS.md`
