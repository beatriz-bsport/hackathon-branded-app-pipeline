import type { Meta, StoryObj } from "@storybook/react-vite";

import { useCopyPaymentLinkButton } from "./use-copy-payment-link-button";

const metaComponentDescription = `
**useCopyPaymentLinkButton** is a Business Hook that returns a fully configured action button for copying a buyable payment link.

### Business Context

This hook is designed for buyable management workflows where backoffice users need to:

- Copy a payment link
- Share it manually with customers
- Trigger clipboard + toast feedback in a consistent way

Unlike a simple component export, this hook:

- Returns a fully configured Button element
- Exposes readable \`ButtonProps\` (kind, size, label, icon, etc.)
- Can be consumed by layout systems like \`useAdaptiveActions\`
- Encapsulates tooltip, toast, clipboard logic and translations

This ensures responsive layouts can inspect and adapt action buttons properly.

### How to import ?

\`\`\`tsx
import { useCopyPaymentLinkButton } from "@bsport/kaizen-business-components/buyables/use-copy-payment-link-button";
\`\`\`
`;

const metaSourceCode = `
import { useCopyPaymentLinkButton } from "@bsport/kaizen-business-components/buyables/use-copy-payment-link-button";

const PageHeader = () => {
  ...
  const copyPaymentLinkButton = useCopyPaymentLinkButton(paymentLink);
  
  const { endGroupActions } = DetailsLayout.useAdaptiveActions({
    endGroupActions: [copyPaymentLinkButton],
    ...
    });
  
  ...
}
`;

type UseCopyPaymentLinkButtonComponent = {
  paymentLink: string;
};

const meta: Meta<UseCopyPaymentLinkButtonComponent> = {
  title: "Buyables/useCopyPaymentLinkButton",
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
    paymentLink: {
      table: {
        type: { summary: "string" },
      },
      control: { type: "text" },
      description: "The full payment URL that will be copied",
    },
  },
  tags: ["autodocs"],
  args: {
    paymentLink: "https://app.bsport.io/payment/123",
  },
  render: ({ paymentLink }) => {
    const button = useCopyPaymentLinkButton(paymentLink);

    return <div>{button}</div>;
  },
};

export default meta;

// Default - Inherit configuration from the meta object
// Goal: Manipulate and see the story.
export const Default: StoryObj<UseCopyPaymentLinkButtonComponent> = {};

// Documentation - Inherit configuration from the meta object
// Goal: Add story description to dive into implementation details.
export const Documentation: StoryObj<UseCopyPaymentLinkButtonComponent> = {
  parameters: {
    docs: {
      description: {
        story: `
### Requirements

- @bsport/kaizen-primitive-core

---

### Why a Hook Instead of a Component?

This action must:

- Be readable by responsive layout systems (e.g. \`useAdaptiveActions\`)
- Expose its underlying \`ButtonProps\`
- Allow adaptive grouping (mobile vs desktop)
- Keep business logic encapsulated

Returning a configured element from a hook allows layout engines to:

- Inspect \`kind\`
- Inspect \`size\`
- Inspect \`label\`
- Adapt rendering accordingly

---

### Public API

\`\`\`ts
const action = useCopyPaymentLinkButton(paymentLink);
\`\`\`

| Parameter | Type | Description |
|-----------|------|------------|
| \`paymentLink\` | string | Absolute URL copied on click |

The hook returns a **React element** representing the action.

---

### Integration with Adaptive Layout

\`\`\`ts
const copyPaymentLinkButton = useCopyPaymentLinkButton(paymentLink);

const { endGroupActions } = DetailsLayout.useAdaptiveActions({
  endGroupActions: [copyPaymentLinkButton],
});
\`\`\`

The returned element:

- Consumes \`ButtonProps\`
- Can be grouped with other adaptive actions
- Works both inside and outside adaptive layouts

---

### Architectural Pattern

This follows the **Business Action Hook** pattern:

- Hook = business logic + configuration
- Internal component = UI contract (ButtonProps-based)
- Layout system = reads ButtonProps
- Consumer = just calls the hook

This prevents duplication and ensures consistent UX across all buyables.
        `,
      },
    },
  },
};
