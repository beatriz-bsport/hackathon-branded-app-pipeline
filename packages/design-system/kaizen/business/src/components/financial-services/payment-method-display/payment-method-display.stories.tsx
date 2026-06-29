import type { Meta, StoryObj } from "@storybook/react-vite";

import type { SavedPaymentMethod } from "@bsport/api-financial-services/payment-method";

import { PaymentMethodDisplay } from "./payment-method-display";

type PaymentMethodDisplayComponent = typeof PaymentMethodDisplay;

const metaComponentDescription = `
**PaymentMethodDisplay** is a read-only summary component for a member's current saved payment method.

### Business context

Use it wherever you need to **show which payment method is currently set** on a recurring purchase (e.g. a billing plan or subscription), without letting the user interact with it directly. The edit/change flow is the responsibility of the consuming application.

- When a \`paymentMethod\` is provided, renders \`PaymentMethodCard\` (logo + masked identifier + type chip + optional expiry).
- When no method is set, renders a localised empty-state message.

### How to import?

\`\`\`tsx
import { PaymentMethodDisplay } from "@bsport/kaizen-business-components/financial-services/payment-method-display";
import type { SavedPaymentMethod } from "@bsport/api-financial-services/payment-method";
\`\`\`
`;

const metaSourceCode = `
import { PaymentMethodDisplay } from "@bsport/kaizen-business-components/financial-services/payment-method-display";

// With a saved card
<PaymentMethodDisplay paymentMethod={savedPaymentMethod} />

// Empty state (no method set yet)
<PaymentMethodDisplay />
`;

const CARD_FIXTURE: SavedPaymentMethod = {
  id: "pm_card_visa",
  type: "card",
  payment_backend_identifier: 1001,
  is_default: true,
  billing_details: { name: "Jane Doe", email: "jane@example.com" },
  readable_identifier: "4242",
  additional_info: "12/28",
  brand: "visa",
  display_brand: "visa",
  is_cobranded_card: false,
};

const SEPA_FIXTURE: SavedPaymentMethod = {
  id: "pm_sepa_001",
  type: "sepa_debit",
  payment_backend_identifier: 1002,
  is_default: false,
  billing_details: { name: "Jane Doe", email: "jane@example.com" },
  readable_identifier: "3000",
  additional_info: "",
  brand: "sepa_debit",
  mandate_status: "accepted",
};

const meta: Meta<PaymentMethodDisplayComponent> = {
  component: PaymentMethodDisplay,
  title: "Financial Services/PaymentMethodDisplay",
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
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
};

export default meta;

export const Default: StoryObj<PaymentMethodDisplayComponent> = {
  name: "Card",
  args: {
    paymentMethod: CARD_FIXTURE,
  },
};

export const SepaDebit: StoryObj<PaymentMethodDisplayComponent> = {
  name: "SEPA Debit",
  args: {
    paymentMethod: SEPA_FIXTURE,
  },
};

export const Empty: StoryObj<PaymentMethodDisplayComponent> = {
  name: "Empty state",
  args: {},
};
