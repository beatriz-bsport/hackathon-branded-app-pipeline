import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import type { CompanyTheme } from "@bsport/api-core";
import { getFetch } from "@bsport/fetch";
import { Button, toast } from "@bsport/kaizen-primitive-core";

import { INVOICE_COMPLETION_INTENT } from "#src/components/core/checkout-flow-modal/constants";

import { CheckoutPaymentFlowModal } from "./checkout-payment-flow-modal";
import { CHECKOUT_PAYMENT_FLOW_MODE } from "./constants";

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

### Recommended public API

Open the flow through the URL helper (recommended for app integration):

\`\`\`tsx
import { openFullPaymentFlow } from "@bsport/kaizen-business-components/financial-services/checkout-payment-flow-modal";
\`\`\`

\`\`\`tsx
openFullPaymentFlow({
  basketStartTrigger: "navbar",
  memberId: 29612631, // optional
});
\`\`\`

Mount \`CheckoutPaymentFlowModal\` once in a host container (e.g. navigation sidebar) that reads URL params and drives \`mode\`. Checkout-only entry points use \`openCheckoutFlow\`; payment-only use \`openPaymentFlow\`.

The modal component shown in this story is a low-level building block for Storybook and internal development.
`;

const metaSourceCode = `
import { openFullPaymentFlow } from "@bsport/kaizen-business-components/financial-services/checkout-payment-flow-modal";

openFullPaymentFlow({
  basketStartTrigger: "member_profile_page",
  memberId: ${MEMBER_ID}, // optional
});
`;

type CheckoutPaymentFlowModalComponent = typeof CheckoutPaymentFlowModal;

const meta: Meta<CheckoutPaymentFlowModalComponent> = {
  component: CheckoutPaymentFlowModal,
  title: "Financial Services/CheckoutPaymentFlowModal",
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
    const close = () => setIsOpen(false);

    useEffect(() => setIsOpen(args.isOpen), [args.isOpen]);

    const sharedProps = {
      isOpen,
      companyId: args.companyId,
      fetch,
      companyTheme: storybookCompanyTheme,
      startContext,
      onClose: close,
      onTrack: () => {},
      onPaymentConfirm: (remainingAmountCts: number) => {
        if (remainingAmountCts <= 0) {
          close();
        }
      },
    };

    const modal =
      args.mode === CHECKOUT_PAYMENT_FLOW_MODE.CHECKOUT ? (
        <CheckoutPaymentFlowModal
          {...sharedProps}
          mode={CHECKOUT_PAYMENT_FLOW_MODE.CHECKOUT}
          memberId={args.memberId}
          invoiceId={args.invoiceId}
          onCheckoutComplete={(_data, invoiceUuid, intent) => {
            if (intent === INVOICE_COMPLETION_INTENT.PAY_NOW) {
              toast({
                status: "positive",
                title: "Invoice created",
                description: invoiceUuid,
                icon: "check",
              });
            }
            close();
          }}
        />
      ) : args.mode === CHECKOUT_PAYMENT_FLOW_MODE.PAYMENT ? (
        <CheckoutPaymentFlowModal
          {...sharedProps}
          mode={CHECKOUT_PAYMENT_FLOW_MODE.PAYMENT}
          memberId={args.memberId ?? 0}
          invoiceId={args.invoiceId ?? ""}
        />
      ) : (
        <CheckoutPaymentFlowModal
          {...sharedProps}
          mode={CHECKOUT_PAYMENT_FLOW_MODE.FULL}
          memberId={args.memberId}
          invoiceId={args.invoiceId}
          onTransitionToPayment={() => {}}
        />
      );

    return (
      <QueryClientProvider client={queryClient}>
        <Button
          label="Open Checkout Payment Flow Modal"
          size="md"
          intent="default"
          color="main"
          onClick={() => setIsOpen(true)}
        />
        {modal}
      </QueryClientProvider>
    );
  },
  args: {
    isOpen: false,
    companyId: COMPANY_ID,
    mode: CHECKOUT_PAYMENT_FLOW_MODE.FULL,
    memberId: MEMBER_ID,
    invoiceId: PAYMENT_INVOICE_ID,
  },
  argTypes: {
    mode: {
      control: "select",
      options: Object.values(CHECKOUT_PAYMENT_FLOW_MODE),
    },
    companyId: { control: "number" },
    memberId: { control: "number" },
    invoiceId: { control: "text" },
    fetch: { table: { disable: true } },
    onClose: { table: { disable: true } },
    onTrack: { table: { disable: true } },
    onPaymentConfirm: { table: { disable: true } },
    onCheckoutComplete: { table: { disable: true } },
    onTransitionToPayment: { table: { disable: true } },
    onError: { table: { disable: true } },
    companyTheme: { table: { disable: true } },
    startContext: { table: { disable: true } },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<CheckoutPaymentFlowModalComponent>;

export const Default: Story = {};

/** Checkout then payment without closing the modal. */
export const FullFlow: Story = {
  args: {
    mode: CHECKOUT_PAYMENT_FLOW_MODE.FULL,
    memberId: MEMBER_ID,
  },
  parameters: {
    docs: {
      description: {
        story:
          '`mode: "full"` - "Pay now" creates the invoice and switches to the payment step (no toast). "Pay later" creates the invoice, closes the modal, and shows a pending-payment toast.',
      },
    },
  },
};

/** Same as checkout-only entry: create invoice, then close. */
export const CheckoutOnly: Story = {
  args: {
    mode: CHECKOUT_PAYMENT_FLOW_MODE.CHECKOUT,
    memberId: MEMBER_ID,
  },
  parameters: {
    docs: {
      description: {
        story:
          '`mode: "checkout"` - after invoice creation the modal calls `onCheckoutComplete` and the host closes (navbar / bill member).',
      },
    },
  },
};

/** Pay an existing invoice (invoice detail, billing problems, etc.). */
export const PaymentOnly: Story = {
  args: {
    mode: CHECKOUT_PAYMENT_FLOW_MODE.PAYMENT,
    invoiceId: PAYMENT_INVOICE_ID,
    memberId: PAYMENT_MEMBER_ID,
  },
  parameters: {
    docs: {
      description: {
        story:
          '`mode: "payment"` - opens directly on the payment step. Requires `invoiceId` and `memberId`.',
      },
    },
  },
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
| \`onTrack\` | Analytics callback for checkout and payment events. |

### Mode-specific props

| Prop | When |
|------|------|
| \`memberId\` | Pre-selected member (checkout / full). |
| \`invoiceId\` | Required for \`mode: "payment"\`. |
| \`onCheckoutComplete\` | \`mode: "checkout"\` - host toast + close. |
| \`onTransitionToPayment\` | \`mode: "full"\` - URL/session sync, modal stays open. |
| \`onPaymentConfirm\` | After successful full payment (all modes with payment step). A "Payment completed" toast is shown automatically when the invoice is fully paid; use this for host side effects (close, refresh, analytics). |
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
