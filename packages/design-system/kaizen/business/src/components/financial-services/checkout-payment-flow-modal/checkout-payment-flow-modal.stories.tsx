import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

import type { CompanyTheme } from "@bsport/api-core";
import { getFetch } from "@bsport/fetch";
import { Button, toast } from "@bsport/kaizen-primitive-core";

import { CheckoutPaymentFlowModal } from "./checkout-payment-flow-modal";
import { CHECKOUT_PAYMENT_FLOW_MODE } from "./types";

const COMPANY_ID = 2;
const MEMBER_ID = 29612631;
const PAYMENT_INVOICE_ID = "74780524-2350-4acf-9eef-140e3c55f82a";
const PAYMENT_MEMBER_ID = 29617664;

const fetch = getFetch();
const queryClient = new QueryClient();

const storybookCompanyTheme = {
  stripe_pk_key: "pk_test_lFB5CxcyTCaQcS00MiE1ebEO", // gitleaks:allow
  stripe_id: "acct_1HXD8XGqCXxmgm1P",
} as CompanyTheme;

const startContext = {
  basket_start_trigger: "member_profile_page" as const,
  origin_url: typeof window !== "undefined" ? window.location.href : undefined,
};

const metaComponentDescription = `
**CheckoutPaymentFlowModal** is the unified shell for billing and payment: one \`Modal\`, one active step at a time.

### Business context

Orchestrates the existing checkout flow (invoice creation) and payment flow (confirm payment on an invoice) behind a single host-mounted portal. Intended for the navigation sidebar so checkout-only, payment-only, and checkout-then-payment entry points share one modal instance.

### Modes

| \`mode\` | Behavior |
|------|----------|
| \`checkout\` | Build invoice - \`onCheckoutComplete\` - host closes (navbar, checkout-only) |
| \`payment\` | Pay an existing invoice (\`invoiceId\` + \`memberId\` required) |
| \`full\` | Checkout - payment in place; \`onTransitionToPayment\` for URL/session sync |

### Required peerDependencies

The host app must provide these (see \`@bsport/kaizen-business-components\` \`peerDependencies\`):

| Package | Role |
|---------|------|
| \`react\`, \`react-dom\` | Component runtime |
| \`@tanstack/react-query\` | Invoice/member/payment queries |
| \`@bsport/fetch\` | Business API client (\`fetch\` prop) |
| \`@bsport/form\` | Checkout and payment forms |
| \`@bsport/i18n\` | \`core\` and \`financial-services\` namespaces |
| \`@bsport/kaizen-primitive-core\` | Modal, toast, primitives |
| \`@bsport/currency\` | Amount labels in payment footer |
| \`zod\` | Form validation (transitive via checkout/payment steps) |

Optional: \`companyTheme\` (\`@bsport/api-core\`) for Stripe card/SEPA in the payment step.

### How to import

\`\`\`tsx
import { CheckoutPaymentFlowModal } from "@bsport/kaizen-business-components/financial-services/checkout-payment-flow-modal";
\`\`\`

Host apps typically mount this once (e.g. in the navigation sidebar) and open it via \`openCheckoutFlow\`, \`openPaymentFlow\`, or a future \`openFullPaymentFlow\`.
`;

type CheckoutPaymentFlowModalComponent = typeof CheckoutPaymentFlowModal;

const FlowStoryLayout = ({
  buttonLabel,
  children,
}: {
  buttonLabel: string;
  children: (controls: { isOpen: boolean; close: () => void }) => ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <QueryClientProvider client={queryClient}>
      <Button
        label={buttonLabel}
        size="md"
        intent="default"
        color="main"
        onClick={() => setIsOpen(true)}
      />
      {children({ isOpen, close })}
    </QueryClientProvider>
  );
};

const sharedFlowProps = (isOpen: boolean, close: () => void) => ({
  companyId: COMPANY_ID,
  fetch,
  isOpen,
  companyTheme: storybookCompanyTheme,
  onClose: close,
  startContext,
  onTrack: () => {},
  onPaymentConfirm: (remainingAmountCts: number) => {
    if (remainingAmountCts <= 0) {
      toast({
        status: "positive",
        title: "Payment confirmed",
        icon: "check",
      });
      close();
    }
  },
});

const meta: Meta<CheckoutPaymentFlowModalComponent> = {
  component: CheckoutPaymentFlowModal,
  title: "Financial Services/CheckoutPaymentFlowModal",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: metaComponentDescription,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<CheckoutPaymentFlowModalComponent>;

/** Checkout then payment without closing the modal. */
export const FullFlow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`mode: "full"` - after invoice creation the shell switches to the payment step in place. Use `onTransitionToPayment` to sync URL (`pfOpen`, `invoiceId`, `memberId`) without remounting.',
      },
    },
  },
  render: () => (
    <FlowStoryLayout buttonLabel="Open full checkout - payment flow">
      {({ isOpen, close }) => (
        <CheckoutPaymentFlowModal
          {...sharedFlowProps(isOpen, close)}
          mode={CHECKOUT_PAYMENT_FLOW_MODE.FULL}
          memberId={MEMBER_ID}
          onTransitionToPayment={(nextInvoiceId) => {
            toast({
              status: "default",
              title: "Checkout complete - pay now",
              description: `Invoice ${nextInvoiceId}`,
              icon: "file-06",
            });
          }}
        />
      )}
    </FlowStoryLayout>
  ),
};

/** Same as checkout-only entry: create invoice, then close. */
export const CheckoutOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`mode: "checkout"` - after invoice creation the modal calls `onCheckoutComplete` and the host closes (navbar / bill member).',
      },
    },
  },
  render: () => (
    <FlowStoryLayout buttonLabel="Open checkout-only flow">
      {({ isOpen, close }) => (
        <CheckoutPaymentFlowModal
          {...sharedFlowProps(isOpen, close)}
          mode={CHECKOUT_PAYMENT_FLOW_MODE.CHECKOUT}
          memberId={MEMBER_ID}
          onCheckoutComplete={(_data, invoiceUuid) => {
            toast({
              status: "positive",
              title: "Invoice created",
              description: invoiceUuid,
              icon: "check",
            });
            close();
          }}
        />
      )}
    </FlowStoryLayout>
  ),
};

/** Pay an existing invoice (invoice detail, billing problems, etc.). */
export const PaymentOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`mode: "payment"` - opens directly on the payment step. Requires `invoiceId` and `memberId`.',
      },
    },
  },
  render: () => (
    <FlowStoryLayout buttonLabel="Open payment-only flow">
      {({ isOpen, close }) => (
        <CheckoutPaymentFlowModal
          {...sharedFlowProps(isOpen, close)}
          mode={CHECKOUT_PAYMENT_FLOW_MODE.PAYMENT}
          invoiceId={PAYMENT_INVOICE_ID}
          memberId={PAYMENT_MEMBER_ID}
        />
      )}
    </FlowStoryLayout>
  ),
};

export const Documentation: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### Required props

| Prop | Description |
|------|-------------|
| \`isOpen\` | Controls modal visibility. |
| \`mode\` | \`"checkout"\`, \`"payment"\`, or \`"full"\` |
| \`companyId\` | Company for checkout config and invoice creation. |
| \`fetch\` | Fetch instance for business APIs. |
| \`onClose\` | Called when the user dismisses the flow. |
| \`onTrack\` | Checkout analytics callback (required for checkout phase). |

### Mode-specific props

| Prop | When |
|------|------|
| \`memberId\` | Pre-selected member (checkout / full). |
| \`invoiceId\` | Required for \`mode: "payment"\`. |
| \`onCheckoutComplete\` | \`mode: "checkout"\` - host toast + close. |
| \`onTransitionToPayment\` | \`mode: "full"\` - URL/session sync, modal stays open. |
| \`onPaymentConfirm\` | After successful payment (all modes with payment step). |
| \`companyTheme\` | Stripe keys for card/SEPA methods in payment step. |

### Required peerDependencies

Same as the component docs: \`react\`, \`react-dom\`, \`@tanstack/react-query\`, \`@bsport/fetch\`, \`@bsport/form\`, \`@bsport/i18n\`, \`@bsport/kaizen-primitive-core\`, \`@bsport/currency\`, \`zod\`; optional \`companyTheme\` from \`@bsport/api-core\` for Stripe methods.

### vs standalone modals

\`CheckoutFlowModal\` and \`PaymentFlowModal\` remain thin wrappers for direct use. This shell is the target integration surface for the navigation sidebar (single portal).
        `,
      },
    },
  },
};
