import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";

import type { CompanyTheme } from "@bsport/api-core";
import { Button } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";

import { PaymentFlowModal } from "./payment-flow-modal";

type PaymentFlowModalComponent = typeof PaymentFlowModal;

const metaComponentDescription = `
**PaymentFlowModal** is a business component used to confirm payment for an existing invoice.

### Business context

The flow combines:
- invoice/member fetch and remaining amount display,
- payment method selection (saved and "all methods"),
- method-specific form rendering (Stripe, terminal, manual, gift card),
- final confirmation with query invalidation side effects.

### Story setup notes

This story patches \`CompanyTheme\` to provide a Stripe publishable key so Stripe methods can render in Storybook.

### How to import?

\`\`\`tsx
import { PaymentFlowModal } from "@bsport/kaizen-business-components/financial-services/payment-flow-modal";
\`\`\`
`;

const metaSourceCode = `
import { useState } from "react";
import { Button } from "@bsport/kaizen-primitive-core";
import { fetch } from "#src/utils/fetch";
import { PaymentFlowModal } from "@bsport/kaizen-business-components/financial-services/payment-flow-modal";
import { dataAccessLayer } from "@bsport/sm-backbone";

function InvoicePaymentAction() {
  const [isOpen, setIsOpen] = useState(false);
  const companyTheme = dataAccessLayer.useCompanyTheme();
  return (
    <>
      <Button
        label="Open Payment Modal"
        intent="default"
        color="main"
        onClick={() => setIsOpen(true)}
      />
      <PaymentFlowModal
        isOpen={isOpen}
        invoiceId="74780524-2350-4acf-9eef-140e3c55f82a"
        memberId={29617664}
        fetch={fetch}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          // parent side effect (toast / refresh / analytics)
        }}
        companyTheme={companyTheme}
      />
    </>
  );
}
`;

const meta: Meta<PaymentFlowModalComponent> = {
  component: PaymentFlowModal,
  title: "Financial Services/PaymentFlowModal",
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
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);

    useEffect(() => setIsOpen(args.isOpen), [args.isOpen]);

    return (
      <>
        <Button
          intent="default"
          label="Open Payment Modal"
          color="main"
          size="md"
          onClick={() => setIsOpen(true)}
        />

        <PaymentFlowModal
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          companyTheme={
            {
              stripe_pk_key: "pk_test_lFB5CxcyTCaQcS00MiE1ebEO",
              stripe_id: "acct_1HXD8XGqCXxmgm1P",
            } as CompanyTheme
          }
        />
      </>
    );
  },
  args: {
    isOpen: false,
    invoiceId: "74780524-2350-4acf-9eef-140e3c55f82a",
    memberId: 29617664,
    fetch,
    onClose: () => undefined,
    onConfirm: () => undefined,
  },
  tags: ["autodocs"],
};

export default meta;

export const Default: StoryObj<PaymentFlowModalComponent> = {};

export const Documentation: StoryObj<PaymentFlowModalComponent> = {
  parameters: {
    docs: {
      description: {
        story: `
### Required props

| Prop | Description |
|------|-------------|
| \`isOpen\` | Controls modal visibility. |
| \`invoiceId\` | Invoice UUID to load and pay. |
| \`memberId\` | Member linked to the payment flow. |
| \`fetch\` | Fetch implementation used by business APIs. |
| \`onClose\` | Called when modal is dismissed. |

### Optional props

| Prop | Description |
|------|-------------|
| \`onConfirm\` | Called after a successful payment confirmation. |

---

### Recommended integration pattern

- Keep open/close state in the parent container.
- Pass real \`invoiceId\` + \`memberId\` from selected business context.
- Use \`onConfirm\` for post-success side effects (toast, tracking, container refresh).
- Let this modal own method-specific form state and confirmation logic.
        `,
      },
    },
  },
};
