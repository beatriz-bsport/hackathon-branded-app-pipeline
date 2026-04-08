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

### Recommended public API

Open the flow through the URL helper API (recommended for app integration):

\`\`\`tsx
import { openCheckoutFlow } from "@bsport/kaizen-business-components/core/checkout-flow-modal";
\`\`\`

\`\`\`tsx
openCheckoutFlow({
  basketStartTrigger: "navbar",
  memberId: MEMBER_ID, // optional
});
\`\`\`

The modal component shown in this story is a low-level internal building block used by container components.
`;

const metaSourceCode = `
import { openCheckoutFlow } from "@bsport/kaizen-business-components/core/checkout-flow-modal";

openCheckoutFlow({
  basketStartTrigger: "member_profile_page",
  memberId: 123, // optional
});
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
          startContext={{
            basket_start_trigger: "member_profile_page",
            origin_url:
              typeof window !== "undefined" ? window.location.href : undefined,
          }}
          onTrack={(eventName, properties) => {
            window.console.log("[CheckoutFlow] track", eventName, properties);
          }}
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
          startContext={{
            basket_start_trigger: "navbar",
            origin_url:
              typeof window !== "undefined" ? window.location.href : undefined,
          }}
          onTrack={(eventName, properties) => {
            window.console.log("[CheckoutFlow] track", eventName, properties);
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

- Import from \`@bsport/kaizen-business-components/core/checkout-flow-modal\`
- Use \`openCheckoutFlow\` to open the flow

---

### Public API

| API | Description |
|-----|-------------|
| \`openCheckoutFlow(args)\` | Opens checkout flow by syncing query params and navigation event |

### Open arguments

| Arg | Description |
|-----|-------------|
| \`basketStartTrigger\` | \`"navbar" \\| "member_profile_page" \\| "offer_page"\` |
| \`memberId\` | Optional pre-selected member ID |
| \`pathname\` | Optional pathname override (defaults to current location) |
| \`search\` | Optional search override (defaults to current location) |
| \`navigate\` | Optional navigation callback (e.g. router push) |

The modal component in this story remains for internal development/testing and is not the recommended integration surface.
        `,
      },
    },
  },
};
