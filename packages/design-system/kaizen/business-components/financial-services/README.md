# Kaizen Business Component - Financial Services

## About

Business components for the **Financial Services** domain. This package contains reusable components for billing, invoicing, and payment-related workflows in the bsport back-office.

## Package Scope

**One package = one business vertical**, not one component!

Organize components in subfolders that reflect your domain:

```
financial-services/src/components/
├── billing/
│   ├── BillingFlowModal/
│   │   ├── BillingFlowModal.tsx
│   │   ├── BillingFlowModal.stories.tsx
│   │   ├── useBillingFlowForm.ts
│   │   └── types.ts
│   ├── MemberCard/
│   ├── AddItemSection/
│   └── InvoiceSummary/
└── payment/
    └── ...
```

**Storybook hierarchy:**

- Business Components/Financial-services/billing/BillingFlowModal
- Business Components/Financial-services/billing/MemberCard
- Business Components/Financial-services/billing/InvoiceSummary

Nest folders as needed - Storybook follows your `src/components/` structure.

## Installation

Add to your application's `package.json`:

```json
{
  "dependencies": {
    "@bsport/kaizen-business-financial-services": "workspace:*"
  }
}
```

Then run `pnpm install`.

## Components

### BillingFlowModal

A comprehensive modal component for creating and managing invoices. Allows users to:

- Select a member for the invoice
- Add multiple items (Passes, Appointment Passes, Products, Packs, Gift Cards, Subscriptions)
- Edit item prices and apply discounts
- Apply promo codes
- Add invoice footnotes
- Create and finalize invoices

```tsx
import { BillingFlowModal } from "@bsport/kaizen-business-financial-services";

function MyApp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <BillingFlowModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      memberId={123} // Optional: pre-select a member
    />
  );
}
```

**Props:**

- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Callback when modal is closed
- `memberId?: number` - Optional pre-selected member ID

**Note:** This component is currently under development. See the [Billing Flow Documentation](https://www.notion.so/bright-shovel-41b/Backoffice-Revamp-Billing-flow-2d3137e4c640809a81d4cee04918dcf2) for detailed specifications.

## Development

### Adding a new component

To scaffold a new component:

**Important:** You must either:

- Filter to the correct project: `pnpm --filter @bsport/kaizen-business-financial-services run component:add`
- Or be in the `packages/design-system/kaizen/business-components/financial-services/` directory when running the command

```bash
# Create a component in the root of components/
pnpm run component:add

# Create a component in a subfolder (recommended)
pnpm run component:add billing/BillingFlowModal
pnpm run component:add billing/MemberCard
```

This will:

1. Create the component file (`src/components/billing/BillingFlowModal/BillingFlowModal.tsx`)
2. Create a Storybook story (`src/components/billing/BillingFlowModal/BillingFlowModal.stories.tsx`)
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
- `pnpm run component:add` - Generate a new component (NOTE: you can generate a component within a folder => `pnpm run component:add payment/PaymentFlow`)
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
    "@bsport/kaizen-business-financial-services": "workspace:*"
  }
}
```

2. Import and use the component:

```tsx
import { BillingFlowModal } from "@bsport/kaizen-business-financial-services";

function MyApp() {
  return <BillingFlowModal isOpen={isOpen} onClose={() => setIsOpen(false)} />;
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
