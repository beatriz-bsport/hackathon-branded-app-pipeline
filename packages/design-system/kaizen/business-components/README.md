# Kaizen Business Components - Shared Storybook

This directory contains the **shared Storybook** for all Kaizen business component packages.

## Architecture

Each business component represents a vertical, and is an **independent npm package**, but they all share **one Storybook**:

```
business-components/
├── .storybook/              ← Shared Storybook configuration
├── package.json             ← Storybook dependencies
├── scripts/ci-deploy.sh     ← Shared CI deployment
│
├── booking                  ← @bsport/kaizen-business-booking
├── cdp                      ← @bsport/kaizen-business-cdp
└── financial-services       ← @bsport/kaizen-business-financial-services
```

## Quick Start

### View all components in Storybook

```bash
cd packages/design-system/kaizen/business-components
pnpm install  # Install Storybook dependencies
pnpm run dev  # Start Storybook locally
```

### Create a new business component package

```bash
# From monorepo root
pnpm run project:create
```

When prompted:

- **Template:** Select `@bsport/kaizen-business-component`
- **Directory:** `packages/design-system/kaizen/business-components/your-vertical`

Next, navigate to your new package:

```bash
cd packages/design-system/kaizen/business-components/your-vertical
```

To generate a new component, use:

```bash
pnpm component:add MyComponent
```

You can also create components within subfolders for organization and Storybook grouping:

```bash
pnpm component:add appointment/MyComponent
```

The script lets you create components directly in nested folders, making it easier to organize your components. Feel free to move files or create folders as needed, even after generation.

## How It Works

1. **Independent Packages**: Each folder is a separate npm package

   - `@bsport/kaizen-business-booking`
   - `@bsport/kaizen-business-cdp`
   - etc.

2. **Shared Storybook**: ONE Storybook collects stories from ALL packages

   - Stories pattern: `../**/src/**/*.stories.tsx`
   - Automatically discovers new components
   - Shows all business components in one place

3. **Single Deployment**: ONE deployment URL for all components
   - Dev: https://docs.infra.bsport.io/storybook/kaizen/dev
   - Staging: https://docs.infra.bsport.io/storybook/kaizen/staging
   - Production: https://docs.infra.bsport.io/storybook/kaizen/production

## Scripts

```bash
pnpm run dev              # Start Storybook in development
pnpm run storybook:build  # Build Storybook for deployment
pnpm run ci:deploy        # Deploy to S3 (used by CI)
```

## CI/CD

The shared CI script (`scripts/ci-deploy.sh`) is automatically triggered by the monorepo CI pipeline when any business component changes.

## Adding a New Component Package

For detailed template documentation, see:

- `tools/templates/kaizen-business-component/README.md`

Or simply run `pnpm -w run project:create`, follow the prompt and select the `@bsport/kaizen-business-component` template.

## Need Help?

- [Kaizen Primitive Core](../primitive/core) - For reference on component patterns
