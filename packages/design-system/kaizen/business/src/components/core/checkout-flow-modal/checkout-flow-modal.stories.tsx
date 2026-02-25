import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { getFetch } from "@bsport/fetch";
import { Button } from "@bsport/kaizen-primitive-core";

import { CheckoutFlowModal } from "./checkout-flow-modal";

const MEMBER_ID = 29612631;
const fetch = getFetch();
const queryClient = new QueryClient();

const metaComponentDescription = `
**CheckoutFlowModal** is a business component that provides a full checkout flow in a modal: select member, add items (passes, packs, products, gift cards, subscriptions), apply promo codes, set footnote and billing group, then create an invoice.

### Business Context

This component is intended for use in workflows where **invoice creation** is needed from a single modal
(such as through the navigation bar, member profile, etc.)

### How to import?

\`\`\`tsx
import { CheckoutFlowModal } from "@bsport/kaizen-business-components/core/checkout-flow-modal";
\`\`\`
`;

const metaSourceCode = `
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getFetch } from "@bsport/fetch";
import { CheckoutFlowModal } from "@bsport/kaizen-business-components/core/checkout-flow-modal";

const fetch = getFetch();
const queryClient = new QueryClient();

<QueryClientProvider client={queryClient}>
  <CheckoutFlowModal
    companyId={2}
    fetch={fetch}
    isOpen={isOpen}
    onClose={() => setIsOpen(false)}
    onSubmit={(data, invoiceUuid) => {
      // handle created invoice
      setIsOpen(false);
    }}
    memberId={MEMBER_ID}
  />
</QueryClientProvider>
`;

const meta: Meta<typeof CheckoutFlowModal> = {
  component: CheckoutFlowModal,
  title: "Core/CheckoutFlowModal",
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
  tags: ["autodocs"],
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <QueryClientProvider client={queryClient}>
        <Button
          label="Open Checkout Flow Modal"
          size="md"
          intent="default"
          color="main"
          onClick={() => setIsOpen(true)}
        />
        <CheckoutFlowModal
          companyId={2}
          fetch={fetch}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSubmit={(data, invoiceUuid) => {
            window.console.log("Created invoice:", invoiceUuid, data);
            setIsOpen(false);
          }}
          memberId={MEMBER_ID}
        />
      </QueryClientProvider>
    );
  },
};

export default meta;
type Story = StoryObj<typeof CheckoutFlowModal>;

// Default - Inherit configuration from the meta object.
// Goal: Manipulate the story.
export const Default: Story = {};

// When memberId is not passed, the Member selector modal opens automatically when the checkout modal opens.
export const WithoutMemberId: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "When `memberId` is omitted, opening the checkout flow modal automatically opens the Member selector so the user can pick a member first.",
      },
    },
  },
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <QueryClientProvider client={queryClient}>
        <Button
          label="Open Checkout Flow Modal (no member)"
          size="md"
          intent="default"
          color="main"
          onClick={() => setIsOpen(true)}
        />
        <CheckoutFlowModal
          companyId={2}
          fetch={fetch}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSubmit={(data, invoiceUuid) => {
            window.console.log("Created invoice:", invoiceUuid, data);
            setIsOpen(false);
          }}
        />
      </QueryClientProvider>
    );
  },
};

// Documentation - Inherit configuration from the meta object.
// Goal: Add story description to dive into implementation details.
export const Documentation: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### Requirements

- @bsport/fetch
- @bsport/kaizen-primitive-core
- @tanstack/react-query (wrap your app or the modal in \`QueryClientProvider\`)

---

### Required props

| Prop | Description |
|------|-------------|
| \`companyId\` | Company ID used for invoice and buyable context |
| \`fetch\` | Fetch instance (e.g. from \`getFetch()\`) for API calls |
| \`isOpen\` | Controls modal visibility |

### Optional props

| Prop | Description |
|------|-------------|
| \`memberId\` | Pre-selected member ID when opening the modal |
| \`onClose\` | Called when the modal is closed (cancel or outside click) |
| \`onError\` | Called when an error occurs during submit or configuration |
| \`onSubmit\` | Called with \`(data: CheckoutFlowFormData, invoiceUuid: string)\` when the invoice is created successfully |
        `,
      },
    },
  },
};
