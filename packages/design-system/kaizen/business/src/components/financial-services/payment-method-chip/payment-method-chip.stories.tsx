import type { Meta, StoryObj } from "@storybook/react-vite";

import type { PaymentMethodType } from "@bsport/api-financial-services/types";

import PaymentMethodChip from "./payment-method-chip";

type PaymentMethodChipComponent = typeof PaymentMethodChip;

const metaComponentDescription = `
**PaymentMethodChip** is a business component that renders a \`Chip\` with a human-readable label and icon for a given payment method type.

### Business Context

Use it wherever you need to **display a payment method** in a consistent way:
- Balance transaction or payout tables (e.g. \`source_payment_method\` from Stripe).
- Payment method selection or summary (card, SEPA, BACS, TWINT, Bancontact, iDEAL, Apple Pay, Google Pay).

It maps API keys (e.g. \`card\`, \`sepa_debit\`) to display labels (Card, SEPA) and icons. Only **"Card"** is translated (via the \`financial-services\` namespace, key \`paymentMethod.card\`); other labels (SEPA, iDEAL, Apple Pay, etc.) are brand names or acronyms and stay fixed. Returns \`null\` if the \`type\` is not in the supported set.

### How to import?

\`\`\`tsx
import PaymentMethodChip from "@bsport/kaizen-business-components/financial-services/payment-method-chip";
import type { PaymentMethodType } from "@bsport/api-financial-services/types";
\`\`\`
`;

const metaSourceCode = `
import PaymentMethodChip from "@bsport/kaizen-business-components/financial-services/payment-method-chip";
import type { PaymentMethodType } from "@bsport/api-financial-services/types";

// In a table column or list
<PaymentMethodChip type="card" />

// With optional Chip overrides
<PaymentMethodChip
  type="sepa_debit"
  chipProps={{ size: "sm", color: "default" }}
/>
`;

const meta: Meta<PaymentMethodChipComponent> = {
  component: PaymentMethodChip,
  title: "Financial Services/PaymentMethodChip",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: metaComponentDescription,
      },
      source: {
        code: metaSourceCode,
      },
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: [
        "card",
        "sepa_debit",
        "bacs_debit",
        "twint",
        "bancontact",
        "ideal",
        "apple_pay",
        "google_pay",
      ] satisfies PaymentMethodType[],
    },
  },
  args: {
    type: "card",
  },
  tags: ["autodocs"],
};

export default meta;

// Default - Inherit configuration from the meta object.
// Goal: Manipulate the story.
export const Default: StoryObj<PaymentMethodChipComponent> = {};

// Documentation - Inherit configuration from the meta object.
// Goal: Add story description to dive into implementation details.
export const Documentation: StoryObj<PaymentMethodChipComponent> = {
  parameters: {
    docs: {
      description: {
        story: `
### Supported payment method types

| \`type\` | Display label | Icon |
|---------|----------------|------|
| \`card\` | Card (translated) | credit-card-02 |
| \`sepa_debit\` | SEPA | bank |
| \`bacs_debit\` | BACS | bank |
| \`twint\` | TWINT | bank |
| \`bancontact\` | Bancontact | bank |
| \`ideal\` | iDEAL | bank |
| \`apple_pay\` | Apple Pay | apple-logo |
| \`google_pay\` | Google Pay | google-logo |

---

### Required props

| Prop | Description |
|------|-------------|
| \`type\` | Payment method identifier; must be a known \`PaymentMethodType\`. If unknown, the component returns \`null\`. |

### Translation

The component uses the \`financial-services\` i18n namespace. Only the **Card** label is translated (\`paymentMethod.card\`). Other labels (SEPA, iDEAL, Apple Pay, etc.) are not translated. Host apps that use this component should provide the \`financial-services\` namespace with at least \`paymentMethod.card\` for the Card label.

### Optional props

| Prop | Description |
|------|-------------|
| \`chipProps\` | Props passed to the underlying \`Chip\` (e.g. \`size\`, \`color\`, \`className\`). Defaults: \`type="weak"\`, \`color="default"\`, \`size="lg"\`. |

---

### Typing

Use the \`PaymentMethodType\` from the API package when you want compile-time safety around payment method keys, for example in API response types or table rows:

\`\`\`ts
import type { PaymentMethodType } from "@bsport/api-financial-services/types";
import PaymentMethodChip from "@bsport/kaizen-business-components/financial-services/payment-method-chip";

type BalanceTransaction = {
  // Raw string from API:
  source_payment_method: PaymentMethodType;
};

type BalanceTransactionWithMethod = BalanceTransaction & {
  // Narrowed, validated type used in UI:
  paymentMethod: PaymentMethodType;
};

// In your code you can validate & narrow once,
// then safely pass it to PaymentMethodChip:
function renderPaymentMethod(method: PaymentMethodType) {
  if (!method) return null;
  return <PaymentMethodChip type={method} />;
}
\`\`\`

        `,
      },
    },
  },
};
