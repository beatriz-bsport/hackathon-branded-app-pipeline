<!-- @indication: Remove this first part in your own README. The second part can be kept and completed. -->

# Kaizen Business Component Template

This template creates business component packages in the Kaizen design system.

## Architecture

**Independent Packages + Unified Storybook:**

- Each business component is a **separate npm package** (`@bsport/kaizen-business-{name}`)
- **ONE unified Storybook** at `kaizen/storybook/` shows ALL Kaizen components (primitive + business)
- Local storybooks at `business-components/` and `primitive/core/` for faster local dev
- Stories are automatically discovered from all packages
- Single deployment showing primitive and business components together

## How to use the template to create a new business component package

Create your business component package by running the following command:

```sh
pnpm run -w project:create
```

When prompted, enter:

- **Project name:** `your-component` (lowercase, hyphen-separated)
- **Project title:** `Your Component` (display name)
- **Directory:** `packages/design-system/kaizen/business-components/your-component` (full path including component name)
- **Template:** Select `@bsport/kaizen-business-component`

## Development Workflow

**Note:** Individual packages don't have `pnpm dev`. All business components share storybooks at the parent level.

```bash
# View your components in Storybook:

# Local storybook (all business components)
cd packages/design-system/kaizen/business-components
pnpm run dev

# Unified storybook (all Kaizen - what gets deployed)
cd packages/design-system/kaizen/storybook
pnpm run dev
```

---

<!-- @indication: Replace "[VERTICAL_NAME]" with your business vertical -->

# Kaizen Business Component - [VERTICAL_NAME]

## Todo list after initialization

- [ ] Remove the first part of this README (above the separator)
- [ ] Replace `[VERTICAL_NAME]` with your business vertical (e.g., "Financial Services", "Booking", "CDP")
- [ ] Describe your business domain below
- [ ] Document your components

## About

Business components for the **[VERTICAL_NAME]** domain (e.g., `booking`, `cdp`, `financial-services`).

## Package Scope

**One package = one business vertical**, not one component!

Organize components in subfolders that reflect your domain:

```
financial-services/src/components/
├── payment/
│   ├── BillingFlow/
│   ├── PaymentFlow/
│   └── ...
└── invoice/
    └── InvoiceList/
```

**Storybook hierarchy:**

- Business Components/Financial-services/payment/BillingFlow
- Business Components/Financial-services/payment/PaymentMethod
- Business Components/Financial-services/invoice/InvoiceList

Nest folders as needed - Storybook follows your `src/components/` structure.

## Installation

Add to your application's `package.json`:

```json
{
  "dependencies": {
    "@bsport/kaizen-business-[your-component]": "workspace:*"
  }
}
```

Then run `pnpm install`.

## Components

### [ComponentName]

[Description of what this component does]

```tsx
import { ComponentName } from "@bsport/kaizen-business-[your-component]";

function MyApp() {
  return <ComponentName />;
}
```

## Development

### Adding a new component

To scaffold a new component:

```bash
pnpm run component:add
```

This will:

1. Create the component file (`src/components/YourComponent/YourComponent.tsx`)
2. Create a Storybook story (`src/components/YourComponent/YourComponent.stories.tsx`)
3. Create an index file for exports
4. Automatically add the export to `src/index.ts`

### Project structure

```
kaizen/
├── storybook/                  # Unified Storybook (DEPLOYED)
│   ├── .storybook/            # Aggregates primitive + business components
│   ├── scripts/ci-deploy.sh  # CI deployment
│   └── package.json
│
├── business-components/        # Business components packages
│   ├── .storybook/            # Local storybook (dev only, faster)
│   ├── package.json           # Storybook dependencies
│   │
│   ├── your-component/        # Your business component package
│   │   ├── _templates/       # Hygen templates
│   │   ├── public/locales/   # Built translations
│   │   ├── scripts/
│   │   │   └── pre-commit.sh
│   │   ├── src/
│   │   │   ├── components/   # Your components with *.stories.tsx
│   │   │   ├── i18n/         # Package i18n
│   │   │   ├── globals.css
│   │   │   └── index.ts
│   │   ├── package.json      # @bsport/kaizen-business-your-component
│   │   └── vite.config.ts
│   │
│   └── another-component/     # Another independent package
│       └── ...
│
└── primitive/core/            # Primitive components
    ├── .storybook/            # Local storybook (dev only)
    └── src/components/
```

**Key Points:**

- Each business component is an **independent package** (`@bsport/kaizen-business-{name}`)
- **Unified storybook** (`kaizen/storybook/`) shows ALL components (deployed)
- **Local storybooks** for faster dev (business-components/, primitive/core/)
- Stories (`*.stories.tsx`) are auto-discovered from all packages

### Scripts

**In your component package:**

- `pnpm run build` - Build the library
- `pnpm run component:add` - Generate a new component (NOTE: you can generate a component within a folder => `pnpm run component add payment/PaymentFlow`)
- `pnpm run lint` - Lint the code
- `pnpm run lint:fix` - Lint and fix issues
- `pnpm run format` - Format code with Prettier
- `pnpm run translation:update` - Update translations

**Storybook commands:**

```bash
# Local storybook (faster, business components only)
cd ../business-components
pnpm run dev

# Unified storybook (all components - what gets deployed)
cd ../../storybook
pnpm run dev
pnpm run build  # Build for deployment
```

### Adding translations

1. Add your translation keys to `src/i18n/source/default.json` (English)
2. Run `pnpm run translation:update` from the workspace root to sync translations

### Using the component in other apps

1. Import the package in your app's `package.json`:

```json
{
  "dependencies": {
    "@bsport/kaizen-business-your-component": "workspace:*"
  }
}
```

2. Import and use the component:

```tsx
import { YourComponent } from "@bsport/kaizen-business-your-component";

function MyApp() {
  return <YourComponent />;
}
```

## Storybook & CI/CD

**Unified Storybook (Deployed):**

- Located at `packages/design-system/kaizen/storybook/`
- Automatically discovers stories from ALL Kaizen packages (primitive + business)
- Single deployment showing all components together
- URL: https://docs.bsport.io/storybook/kaizen/

**Local Storybooks (Dev Only):**

- `business-components/` - Business components only
- `primitive/core/` - Primitive components only
- Not deployed, only for local development

**CI Deployment:**

- Deployment script at `kaizen/storybook/scripts/ci-deploy.sh`
- Auto-detected by Nx affected when changes are made
- Deploys unified storybook to S3
- No manual configuration needed per business component package
