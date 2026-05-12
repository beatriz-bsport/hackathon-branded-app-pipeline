# Back-office Design system

Kaizen is the design system used for bsport's back-office. It encompasses primitive components, business components, and a library of design tokens.

## Agent Playbook

- Start with existing Kaizen packages before building local UI.
- Root generator: `pnpm new:kaizen-component -- --target primitive|business`.
- Package-local generator: `pnpm component:add` in `primitive/core` or `business`.
- Every shared component should keep Storybook coverage current.
- Canonical overlay for this area: [`AGENTS.md`](./AGENTS.md).

## Structure

```
kaizen/
├── _templates/          # Shared Hygen templates for component generation
├── primitive/
│   └── core/
│       ├── _templates/  # Symlink to ../../_templates
│       ├── .storybook/  # Local storybook for faster primitive dev
│       └── src/         # Primitive UI components
├── business/
│   └── .storybook/      # Local storybook for faster business dev
├── storybook/           # Unified storybook (aggregates all stories)
│   ├── .storybook/
│   └── scripts/
│       └── ci-deploy.sh # Deployment script
└── tokens/              # Design tokens
```

## Development Workflows

### Developing Primitive Components

```bash
cd primitive/core
pnpm dev  # Starts local storybook (faster, only primitive components)
```

### Developing Business Components

```bash
cd business
pnpm dev  # Starts local storybook (faster, only business components)
```

### Viewing All Components Together

```bash
cd storybook
pnpm dev  # Starts unified storybook (all components)
```

## Why Multiple Storybooks?

- **Local storybooks** (`primitive/core`, `business`): Faster local development with hot reload. Only load relevant components.
- **Unified storybook** (`storybook/`): Single deployment point. Shows all Kaizen components together for better discoverability.

## Component Generation

Shared templates are located in `_templates/`. Both primitive and business components can use these templates:

```bash
# In primitive/core or any business component package
pnpm component:add
```

## Deployment

The unified storybook is automatically deployed via CI/CD:

```bash
cd storybook
pnpm ci:deploy <environment>
```

Environments: `dev`, `staging`, `production`

## Links

- [Unified Storybook Documentation](./storybook/README.md)
- [Primitive Components](./primitive/core/README.md)
- [Design Tokens](./tokens/README.md)
