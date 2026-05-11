import type { Meta, StoryObj } from "@storybook/react-vite";

import PaymentMethodLogo, {
  type PaymentMethodLogoProps,
} from "./payment-method-logo";

type PaymentMethodLogoComponent = typeof PaymentMethodLogo;

const metaComponentDescription = `
**PaymentMethodLogo** is a business component that renders a payment method logo in a fixed-size bordered container.

### Business Context

Use it wherever you need a **visual payment method badge**:
- payout or balance transaction rows;
- payment method summaries;
- compact method previews in cards or drawers.

The component maps payment method identifiers to SVG assets and keeps logos centered in all sizes (\`lg\`, \`md\`, \`sm\`), even when logo heights differ.

### How to import?

\`\`\`tsx
import PaymentMethodLogo from "@bsport/kaizen-business-components/financial-services/payment-method-logo";
\`\`\`
`;

const metaSourceCode = `
import PaymentMethodLogo from "@bsport/kaizen-business-components/financial-services/payment-method-logo";

<PaymentMethodLogo type="sepa_debit" size="lg" />
<PaymentMethodLogo type="visa" size="md" />
<PaymentMethodLogo type="twint" size="sm" />
`;

const paymentMethodOptions = [
  "visa",
  "mastercard",
  "bancontact",
  "google_pay",
  "ideal",
  "twint",
  "apple_pay",
  "paypal",
  "sepa_debit",
  "bacs_debit",
] satisfies PaymentMethodLogoProps["type"][];

const meta: Meta<PaymentMethodLogoComponent> = {
  component: PaymentMethodLogo,
  title: "Financial Services/PaymentMethodLogo",
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
      options: paymentMethodOptions,
    },
    size: {
      control: "select",
      options: ["lg", "md", "sm"] satisfies NonNullable<
        PaymentMethodLogoProps["size"]
      >[],
    },
  },
  args: {
    type: "visa",
    size: "lg",
  },
  tags: ["autodocs"],
};

export default meta;

export const Default: StoryObj<PaymentMethodLogoComponent> = {};

export const Documentation: StoryObj<PaymentMethodLogoComponent> = {
  parameters: {
    docs: {
      description: {
        story: `
### Supported payment method types

| \`type\` | Display |
|---------|---------|
| \`visa\` | Visa |
| \`mastercard\` | Mastercard |
| \`bancontact\` | Bancontact |
| \`google_pay\` | Google Pay |
| \`ideal\` | iDEAL |
| \`twint\` | TWINT |
| \`apple_pay\` | Apple Pay |
| \`paypal\` | PayPal |
| \`sepa_debit\` | SEPA |
| \`bacs_debit\` | BACS |

### Props

| Prop | Description |
|------|-------------|
| \`type\` | Payment method identifier used to select the corresponding logo asset. Unknown values return \`null\`. |
| \`size\` | Visual size variant: \`lg\`, \`md\`, \`sm\`. |
| \`className\` | Optional className applied to the outer container. |

### Integration notes

- Flows such as \`PaymentMethodSelector\` map an API saved payment method (card brand, SEPA, BACS, …) to a supported \`type\` before rendering this component.
- Callers should omit the logo when no asset matches (avoid showing the wrong brand).
        `,
      },
    },
  },
};

export const AllMethodsBySize: StoryObj<PaymentMethodLogoComponent> = {
  render: () => (
    <div className="flex flex-col gap-sm">
      {(["lg", "md", "sm"] as const).map((size) => (
        <div key={size} className="flex items-center gap-xs">
          {paymentMethodOptions.map((type) => (
            <PaymentMethodLogo
              key={`${size}-${type}`}
              type={type}
              size={size}
            />
          ))}
        </div>
      ))}
    </div>
  ),
};
